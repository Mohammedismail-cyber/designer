# Design Document — Design Orchestrator

## Overview

The Design Orchestrator replaces the current raw-prompt-to-LLM approach in `src/utils/generator.js` with a structured reasoning and generation pipeline. It sits between the user's prompt (received from `AgentPanel.jsx`) and the canvas renderer (`Canvas.jsx`), classifying every request, enforcing scope, deriving an original design plan, and translating that plan into the flat section array the canvas already knows how to render.

No changes to `Canvas.jsx` or `App.jsx`'s rendering logic are required. The integration point is `generateComponents()` — the orchestrator wraps and replaces its internals while preserving the existing function signature.

---

## Architecture

### Module Boundaries

```
src/utils/
├── generator.js          ← existing file — entry point preserved, internals replaced
├── orchestrator/
│   ├── index.js          ← OrchestratorPipeline: main coordinator, exported
│   ├── classifier.js     ← RequestClassifier: classifies prompt → requestType
│   ├── reasoner.js       ← DesignReasoner: runs 7-step reasoning, builds system prompt
│   ├── planner.js        ← PlanValidator: validates + recovers Orchestrator_Plan JSON
│   └── translator.js     ← PlanTranslator: converts plan → canvas section array
```

`generator.js` remains the public API. `generateComponents()` becomes a thin wrapper that calls `OrchestratorPipeline.run()`. All existing exports (`setOllamaConfig`, `getOllamaModels`, `pickBestModel`, `getAISuggestions`, `createSectionPreset`, `loadPagePreset`, `buildSymbolSaaS`, `compileWorkspaceToCode`) are preserved unchanged.

### Data Flow

```
User prompt + existingComps
        │
        ▼
  RequestClassifier.classify()
        │  → requestType, intentContext
        ▼
  DesignReasoner.buildContext()
        │  → canvasState, designSystem, reasoningSteps[]
        ▼
  callOllamaOrchestrator()   ──fail/timeout──▶  TemplateEngineFallback
        │  → raw LLM response
        ▼
  PlanValidator.parseAndRecover()
        │  → Orchestrator_Plan (valid JSON)
        ▼
  PlanTranslator.translate()
        │  → Section[]  (merged with existingComps)
        ▼
  StatusObject + Section[]  returned to App.jsx
```

---

## Component Designs

### 1. RequestClassifier (`classifier.js`)

Stateless pure function. Takes `(prompt: string, existingComps: Section[])` and returns `{ requestType, intentContext }`.

**Classification priority order** (highest wins):

1. `edit_component` — editing language + in-section component reference (e.g. "headline in the hero", "CTA button in the navbar")
2. `add_section` / `add_component` — additive trigger word + Section_Type keyword (overrides full-build language)
3. `edit_section` — editing language + explicit section type or positional reference ("the hero", "the footer", "the first section")
4. `redesign` — full-build language + non-empty canvas
5. `new_project` — full-build language + empty canvas
6. `add_page` — "add a page", "new page", "/route" pattern
7. default → `add_section` (non-empty canvas) or `new_project` (empty canvas)

**Keyword sets** (compiled once as regex at module load):

```js
const FULL_BUILD = /\b(build|create|design|make|generate)\b.{0,40}\b(website|landing page|page|site|frontend|ui|interface)\b/i;
const ADDITIVE   = /^\s*(add|include|append|insert|give me|i need|show)\b/i;
const EDITING    = /\b(change|update|edit|modify|rewrite|replace|fix|adjust)\b/i;
const SECTION_TYPES_RE = /\b(navbar|navigation|hero|banner|features?|feature grid|pricing|testimonials?|footer|stats?|cta|call.to.action|faq|team)\b/i;
const IN_SECTION = /\b(headline|subhead|cta|button|logo|brand|title|description|copy|text)\b.{0,20}\b(in|of|inside|within)\b.{0,20}\b(hero|navbar|header|footer|pricing|features?)\b/i;
const NEW_PAGE   = /\b(add|create|new)\b.{0,20}\b(page|route)\b|(\/[a-z-]+)/i;
```

`intentContext` carries: `{ rawPrompt, brandHint, industryHint, audienceHint, targetSectionType, targetSectionId }`.

Brand/industry/audience hints are extracted by scanning for proper nouns (capitalised words not in a stoplist), domain vocabulary (restaurant, SaaS, crypto, fitness, etc.), and audience signals (developers, customers, patients, etc.). These hints feed the DesignReasoner and the template fallback.

**Multi-type collision resolution:**
- If `edit_component` signals AND `add_section` signals both fire → `edit_component` wins.
- If `add_section` signals AND `full_build` signals both fire → `add_section` wins (Req 1.4).
- If `edit_section` signals fire but no section can be identified → downgrade to `add_section`.

---

### 2. DesignReasoner (`reasoner.js`)

Responsible for two things: (a) extracting the current design system from the canvas state, and (b) assembling the structured Ollama system prompt that encodes all seven reasoning steps plus the schema contract.

#### 2a. Canvas State Extraction

```js
function extractDesignSystem(existingComps) {
  if (!existingComps.length) return null;
  // Gather all style values, pick most frequent for each property
  const accentColors = existingComps.map(c => c.styles?.accentColor).filter(Boolean);
  const bgColors     = existingComps.map(c => c.styles?.bgColor).filter(Boolean);
  const textColors   = existingComps.map(c => c.styles?.textColor).filter(Boolean);
  return {
    accentColor: mode(accentColors) || '#a855f7',
    bgColor:     mode(bgColors)     || '#ffffff',
    textColor:   mode(textColors)   || '#09090b',
    existingSectionTypes: existingComps.map(c => c.type),
    existingSectionIds:   existingComps.map(c => c.id),
  };
}
```

#### 2b. System Prompt Construction

The system prompt is assembled from a template literal with five injected sections:

1. **Role declaration** — "You are the Design Orchestrator for AuraStudio. Output ONLY valid JSON. No markdown. No prose."
2. **Schema contract** — full Orchestrator_Plan shape pasted verbatim
3. **Supported Section_Types** — exhaustive list
4. **Reasoning pipeline instruction** — the seven steps described as JSON fields to populate in `assumptionsMade`
5. **Hard constraints** — no Lorem Ipsum, no "Your Company Name", scope rules, originality rules

The user-facing prompt sent to Ollama is:

```
REQUEST TYPE: {requestType}
EXISTING CANVAS: {existingSectionTypes.join(', ') || 'empty'}
DESIGN SYSTEM: accent={accentColor}, bg={bgColor}, text={textColor}
USER PROMPT: {rawPrompt}
```

This keeps the system prompt static (cacheable by Ollama) and only the user-facing context varies per call, which improves model consistency.

---

### 3. PlanValidator (`planner.js`)

Receives the raw LLM response string. Returns a validated `Orchestrator_Plan` or throws if unrecoverable.

**Parse sequence:**

```
raw string
  → strip markdown fences (```json ... ```, ``` ... ```)
  → extract first {...} or [{...}] match
  → JSON.parse()
  → if array: wrap as { requestType, componentsToAuthor: array, ... }
  → structuralValidate(plan)
  → if invalid: applyDefaults(plan, requestType, existingState)
  → structuralValidate(plan) again → if still invalid: throw
```

**Safe defaults per field:**

| Field | Safe default |
|---|---|
| `requestType` | value from classifier |
| `scope.inScope` | `[]` |
| `scope.explicitlyUntouched` | all existing section IDs |
| `intent.userGoal` | raw prompt (first 120 chars) |
| `intent.businessContext` | industry hint from classifier |
| `intent.audience` | `"general audience"` |
| `designSystem.isNew` | `existingComps.length === 0` |
| `designSystem.colorPalette` | extracted design system or defaults |
| `designSystem.typography` | `"system-ui, sans-serif"` |
| `designSystem.spacingScale` | `"4/8/16/24/32/48/64/96/128"` |
| `designSystem.motionLanguage` | `"subtle fade-in on entrance, 200ms ease-out"` |
| `designSystem.gridSystem` | `"12-col, 80px desktop margin"` |
| `pages` | `[{ pageId: "home", pageName: "Home", purpose: "", sections: [] }]` |
| `componentsToAuthor` | `[]` — triggers template fallback |
| `assumptionsMade` | `["Plan recovered from partial LLM response"]` |
| `originalityCheck` | `"Content derived from user prompt. Recovery applied."` |

**Structural validation checks:**
- `requestType` is one of the seven valid values
- `scope`, `intent`, `designSystem` are objects with required keys
- `pages` is an array; each page has `pageId`, `pageName`, `sections[]`
- `componentsToAuthor` is an array; each descriptor has `componentId`, `componentType`, `isNewComponent`, `content`
- No content field contains the banned strings

If `componentsToAuthor` is empty after recovery, the validator signals the caller to use the template fallback rather than render nothing.

---

### 4. PlanTranslator (`translator.js`)

Converts the validated `Orchestrator_Plan` into a `Section[]` that the canvas renders, then merges it with `existingComps` according to the request type.

#### Section assembly

For each descriptor in `componentsToAuthor`:

```js
function descriptorToSection(descriptor, designSystem, index) {
  const ts = Date.now();
  const id = `${descriptor.componentType}_${ts}_${index}`;

  if (!SUPPORTED_TYPES.has(descriptor.componentType)) {
    console.warn(`[PlanTranslator] Unsupported type skipped: ${descriptor.componentType}`);
    return null;
  }

  return {
    id,
    type: descriptor.componentType,
    name: toHumanName(descriptor.componentType),
    content: descriptor.content || {},
    styles: {
      bgColor:     designSystem.colorPalette?.base    || '#ffffff',
      textColor:   designSystem.colorPalette?.text    || '#09090b',
      accentColor: designSystem.colorPalette?.accent  || '#a855f7',
    }
  };
}
```

Sections with `null` results (unsupported type) are filtered out.

#### Merge strategy by request type

| requestType | Merge behaviour |
|---|---|
| `new_project` / `redesign` | Return new sections only, replacing existingComps entirely |
| `add_section` / `add_component` | Append new sections to end of existingComps |
| `edit_section` | Find first section whose `type` matches `targetSectionType` (from classifier); replace it in-place |
| `edit_component` | Find target section; deep-merge only the `content` fields specified in the descriptor |
| `add_page` | Append (same as add_section for current single-page canvas model) |

**Out-of-scope guard:** Before returning, the translator checks each new section against `scope.inScope`. Any section whose `componentType` is not represented in `scope.inScope` is discarded and a `console.warn` is emitted.

**Missing target guard (edit flows):** If `edit_section` or `edit_component` cannot find a matching section ID or type in existingComps, the translator skips the edit, sets `success: false` in the status object, and returns existingComps unchanged.

---

### 5. OrchestratorPipeline (`index.js`)

The coordinator that wires the four sub-modules together and returns `{ sections, status }` to the caller.

```js
export async function run(prompt, existingComps = [], onStepUpdate) {
  // Step 1: Classify
  onStepUpdate?.('Classifying request…');
  const { requestType, intentContext } = RequestClassifier.classify(prompt, existingComps);
  onStepUpdate?.(`Detected: ${formatType(requestType)}`);

  // Step 2: Build context
  onStepUpdate?.('Reading canvas state…');
  const { designSystem, canvasStateSummary } = DesignReasoner.buildContext(existingComps, intentContext);

  // Step 3: Attempt LLM path
  let plan = null;
  let generationPath = 'llm';

  if (_ollamaModel) {
    onStepUpdate?.('Parsing intent…');
    try {
      const systemPrompt = DesignReasoner.buildSystemPrompt(requestType, designSystem);
      const userPrompt   = DesignReasoner.buildUserPrompt(requestType, intentContext, canvasStateSummary);
      onStepUpdate?.('Mapping components…');
      const raw = await callOllama(userPrompt, systemPrompt, null, 90000);
      plan = PlanValidator.parseAndRecover(raw, requestType, existingComps, designSystem);
    } catch (err) {
      console.warn('[Orchestrator] LLM path failed:', err.message);
      plan = null;
    }
  }

  // Step 4: Fallback if needed
  if (!plan || plan.componentsToAuthor.length === 0) {
    onStepUpdate?.('Using template engine…');
    generationPath = 'fallback';
    const sections = generateFromTemplate(prompt, existingComps, requestType, intentContext);
    const count = sections.length - (requestType === 'new_project' || requestType === 'redesign' ? 0 : existingComps.length);
    return {
      sections,
      status: { success: true, requestType, generationPath, sectionsGenerated: Math.max(0, count) }
    };
  }

  // Step 5: Translate plan → sections
  onStepUpdate?.('Building sections…');
  const { sections, skipped } = PlanTranslator.translate(plan, existingComps);
  const success = skipped === 0 || sections.length > existingComps.length || requestType === 'redesign';

  return {
    sections,
    status: {
      success,
      requestType,
      generationPath,
      sectionsGenerated: plan.componentsToAuthor.length - skipped
    }
  };
}
```

---

### 6. Template Engine Upgrade (`generator.js` — existing fallback)

The existing `generateFromTemplate()` is modified to accept two new parameters: `requestType` and `intentContext`. Key changes:

- **Scope enforcement in fallback**: If `requestType` is `add_section`, only one section matching `intentContext.targetSectionType` is returned (no full rebuild).
- **Brand/industry injection**: `intentContext.brandHint`, `intentContext.industryHint`, `intentContext.keyPhrases` replace the hardcoded brand names in section content.
- **Section order derived from requestType**: The fallback still uses industry-detected section lists but will not always default to the fixed order unless warranted.

---

### 7. AgentPanel Integration (`AgentPanel.jsx`)

`onGenerate` in App.jsx currently passes only `(promptText, onChunk)` to `generateComponents`. This needs to be extended to receive the step-update callback and status object.

**Changes to `App.jsx` `handleGenerate`:**

```js
const handleGenerate = useCallback(async (promptText, onStepUpdate) => {
  if (!promptText.trim() || isGenerating) return;
  setIsGenerating(true);
  setPromptHistory(h => [promptText, ...h]);
  try {
    pushHistory(componentsRef.current);
    const { sections, status } = await generateComponents(
      promptText, componentsRef.current, onStepUpdate
    );
    persistComponents(sections);
    setSelectedId(null);
    return status;  // returned to AgentPanel
  } catch (err) {
    console.error('Generation error:', err);
    return { success: false, requestType: 'unknown', generationPath: 'error', sectionsGenerated: 0 };
  } finally {
    setIsGenerating(false);
  }
}, [isGenerating, pushHistory, persistComponents]);
```

**Changes to `AgentPanel.jsx`:**

The `handleSubmit` function is updated to:
1. Pass a `onStepUpdate` callback to `onGenerate` that updates a `currentStep` state string displayed in the message thread.
2. Consume the returned `status` object to show the post-generation summary message.
3. Render a `RequestTypeBadge` component above the input while generation is in progress.

New state added to AgentPanel:
```js
const [currentStep, setCurrentStep] = useState('');
const [lastStatus, setLastStatus] = useState(null);
```

**`RequestTypeBadge`** — inline component, renders a small pill with the classified request type. Colors:
- `new_project` / `redesign` → purple background
- `add_section` / `add_component` / `add_page` → green background
- `edit_section` / `edit_component` → amber background

---

## Data Models

### Orchestrator_Plan (full schema)

```ts
interface OrchestratorPlan {
  requestType: 'new_project' | 'add_page' | 'add_section' | 'edit_section' | 'edit_component' | 'redesign' | 'add_component';
  scope: {
    inScope: string[];              // componentType strings of sections in scope
    explicitlyUntouched: string[];  // section IDs from existing canvas
  };
  intent: {
    userGoal: string;
    businessContext: string;
    audience: string;
  };
  designSystem: {
    isNew: boolean;
    typography: { display: string; body: string };
    colorPalette: { base: string; surface: string; accent: string; text: string };
    spacingScale: string;
    motionLanguage: string;
    gridSystem: string;
  };
  pages: Array<{
    pageId: string;
    pageName: string;
    purpose: string;
    sections: Array<{
      sectionId: string;
      name: string;
      purpose: string;
      components: ComponentDescriptor[];
    }>;
  }>;
  componentsToAuthor: ComponentDescriptor[];
  assumptionsMade: string[];
  originalityCheck: string;
}

interface ComponentDescriptor {
  componentId: string;
  componentType: SectionType;
  isNewComponent: boolean;
  content: Record<string, unknown>;
  imageDirection: string;
  motion: { entrance: string; hover: string; scroll: string };
  mobileNotes: string;
}

type SectionType = 'navbar' | 'symbol_hero' | 'features' | 'pricing' | 'testimonials' | 'footer' | 'stats' | 'cta_banner' | 'faq' | 'team';
```

### Section (canvas format — unchanged)

```ts
interface Section {
  id: string;       // e.g. "features_1720000000000_2"
  type: SectionType;
  name: string;
  content: Record<string, unknown>;
  styles: {
    bgColor: string;
    textColor: string;
    accentColor: string;
  };
}
```

### GenerationStatus

```ts
interface GenerationStatus {
  success: boolean;
  requestType: string;
  generationPath: 'llm' | 'fallback';
  sectionsGenerated: number;
}
```

---

## Key Implementation Decisions

### Why `componentsToAuthor` is the canonical list, not `pages[].sections[].components`

The `pages` hierarchy in the plan is for reasoning documentation. The translator reads only `componentsToAuthor` for section generation. This keeps the translation logic flat and predictable, and allows the LLM to populate the `pages` hierarchy for its own reasoning without the translator needing to recurse into it.

### Why classification is purely heuristic, not sent to the LLM

Sending the classification to the LLM would add one round-trip latency (~5–15s on local Ollama) before any real work starts. The heuristic classifier runs synchronously in <1ms and handles the large majority of real-world prompts correctly. Classification errors are recoverable: the plan validator can infer the correct type from the LLM's output if the classifier was wrong.

### Why the system prompt is static and only the user prompt varies

Ollama (KV cache aware models like llama3, mistral) can cache the system prompt prefix. Keeping it static means the model only processes the variable user context on repeated calls, reducing latency significantly for iterative editing workflows.

### Why the canvas format (`Section[]`) is not changed

Zero changes to `Canvas.jsx` means no risk of regression in rendering. The translator is the adapter layer. If new section types need to be added in the future, only `Canvas.jsx` and the `SUPPORTED_TYPES` set in the translator need updating — the orchestrator pipeline is agnostic to rendering.

---

## File Change Summary

| File | Change type | Description |
|---|---|---|
| `src/utils/generator.js` | Modified | `generateComponents()` delegates to OrchestratorPipeline; template fallback accepts requestType + intentContext |
| `src/utils/orchestrator/index.js` | New | OrchestratorPipeline coordinator |
| `src/utils/orchestrator/classifier.js` | New | RequestClassifier with regex-based heuristics |
| `src/utils/orchestrator/reasoner.js` | New | DesignReasoner: canvas state extraction + system/user prompt builders |
| `src/utils/orchestrator/planner.js` | New | PlanValidator: JSON parse, structural validation, safe-default recovery |
| `src/utils/orchestrator/translator.js` | New | PlanTranslator: Orchestrator_Plan → Section[] with merge strategy |
| `src/components/AgentPanel.jsx` | Modified | `onStepUpdate` callback, `RequestTypeBadge`, status display, step streaming |
| `src/App.jsx` | Modified | `handleGenerate` passes step callback, receives and ignores status (AgentPanel owns display) |

---

## Components and Interfaces

### Public API surface

```ts
// src/utils/generator.js (unchanged external signature)
export async function generateComponents(
  prompt: string,
  existingComps: Section[],
  onStepUpdate?: (step: string) => void
): Promise<Section[]>

// src/utils/orchestrator/index.js
export async function run(
  prompt: string,
  existingComps: Section[],
  onStepUpdate?: (step: string) => void
): Promise<{ sections: Section[]; status: GenerationStatus }>

// src/utils/orchestrator/classifier.js
export function classify(
  prompt: string,
  existingComps: Section[]
): { requestType: RequestType; intentContext: IntentContext }

// src/utils/orchestrator/reasoner.js
export function buildContext(
  existingComps: Section[],
  intentContext: IntentContext
): { designSystem: DesignSystemExtract; canvasStateSummary: string }

export function buildSystemPrompt(
  requestType: RequestType,
  designSystem: DesignSystemExtract
): string

export function buildUserPrompt(
  requestType: RequestType,
  intentContext: IntentContext,
  canvasStateSummary: string
): string

// src/utils/orchestrator/planner.js
export function parseAndRecover(
  raw: string,
  requestType: RequestType,
  existingComps: Section[],
  designSystem: DesignSystemExtract
): OrchestratorPlan  // throws if unrecoverable

// src/utils/orchestrator/translator.js
export function translate(
  plan: OrchestratorPlan,
  existingComps: Section[]
): { sections: Section[]; skipped: number }
```

### Internal types (not exported)

```ts
type RequestType = 'new_project' | 'add_page' | 'add_section' | 'edit_section' | 'edit_component' | 'redesign' | 'add_component';

interface IntentContext {
  rawPrompt: string;
  brandHint: string;
  industryHint: string;
  audienceHint: string;
  keyPhrases: string[];
  targetSectionType: string | null;
  targetSectionId: string | null;
}

interface DesignSystemExtract {
  accentColor: string;
  bgColor: string;
  textColor: string;
  existingSectionTypes: string[];
  existingSectionIds: string[];
}

interface GenerationStatus {
  success: boolean;
  requestType: string;
  generationPath: 'llm' | 'fallback';
  sectionsGenerated: number;
}
```

---

## Error Handling

| Error scenario | Handler | User-visible outcome |
|---|---|---|
| Ollama fetch timeout (>90s) | Pipeline catches, falls back to template engine | AgentPanel shows template engine notice |
| Ollama network error / non-200 | Same as timeout | Same |
| LLM returns non-JSON | `stripMarkdown` + regex extraction; if still invalid → `applyDefaults` | Canvas gets template-generated sections |
| LLM JSON structurally invalid | `applyDefaults` fills gaps; if schema still fails after defaults → template fallback | Canvas gets template-generated sections |
| `componentsToAuthor` empty after recovery | Pipeline falls through to template fallback | Canvas gets template-generated sections |
| Unsupported `componentType` in descriptor | `translate()` skips that descriptor, logs warning | Section omitted silently; rest of plan renders |
| `edit_section` target not found in canvas | `mergeIntoCanvas` returns existingComps, sets `success: false` | AgentPanel shows error message; canvas unchanged |
| `edit_component` target not found | Same as above | Same |
| Banned string in generated content | `scanForBannedStrings` logs a warning but does not block rendering | Developer console warning; section still renders |
| `generateComponents` throws unexpectedly | `App.jsx` catch block restores pre-generation canvas state via history | AgentPanel shows generic error; canvas unchanged |

---

## Testing Strategy

All testing is manual (no test framework configured in this project). The integration smoke tests in Task 9 of the tasks file cover the critical paths.

**LLM path testing approach:** Requires Ollama running locally with at least one supported model. Test prompts are designed to exercise each classifier branch, verified by checking the AgentPanel "Detected:" badge and the resulting canvas sections.

**Template fallback testing approach:** Disconnect Ollama (or set `_ollamaModel = null` in generator.js temporarily) and verify the fallback produces scope-correct output with brand-specific content for each request type.

**Regression check:** After every task completion, verify the existing canvas UI renders correctly for all ten section types across desktop/tablet/mobile viewports. The `Canvas.jsx` rendering path is unchanged so regressions here indicate an unintended change in the section data shape.

**JSON schema compliance check:** During development, `parseAndRecover` can be tested in isolation by calling it directly from the browser console with sample LLM response strings, both well-formed and deliberately broken.

---

## Correctness Properties

These invariants must hold after every generation call, regardless of code path:

### Property 1: Scope invariant
For any Incremental_Request, the section IDs in `existingComps` that are listed in `scope.explicitlyUntouched` must appear in the returned `sections` array with their `content` and `styles` fields unchanged.
**Validates: Requirements 2.1, 2.2, 2.4**

### Property 2: No blank canvas regression
If `existingComps` is non-empty and the request type is not `new_project` or `redesign`, the returned `sections` array length must be ≥ `existingComps.length`.
**Validates: Requirements 2.4, 9.2**

### Property 3: Type safety
Every section in the returned array must have a `type` value that is a member of `SUPPORTED_TYPES`. No unknown types reach `Canvas.jsx`.
**Validates: Requirements 6.2, 6.3**

### Property 4: ID uniqueness
No two sections in the returned array share the same `id` value.
**Validates: Requirements 6.6**

### Property 5: Content safety
No section's `content` fields contain the banned strings ("Lorem Ipsum", "Your Company Name", "placeholder", "example.com") in the final output delivered to the canvas.
**Validates: Requirements 4.1, 4.5**

### Property 6: Status always returned
`generateComponents()` must never throw to its caller. It must always return a `Section[]`. All errors are caught internally and resolved through fallback paths.
**Validates: Requirements 9.1, 9.4, 9.5**
