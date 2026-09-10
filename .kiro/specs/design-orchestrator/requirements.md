# Requirements Document

## Introduction

The Design Orchestrator is the AI brain of AuraStudio — a structured reasoning and generation layer that sits between the user's prompt and the canvas renderer. It replaces the current raw-prompt-to-LLM approach with a disciplined pipeline: classify the request, read existing canvas state, reason through design intent, and produce a precise JSON plan. The orchestrator enforces scope (never regenerates what the user didn't ask to change), enforces originality (no Lorem Ipsum, no default section stacks), and maintains design-system coherence across all generated sections.

The orchestrator integrates into the existing React + Vite frontend by replacing/wrapping `generateComponents()` in `src/utils/generator.js`. It works with both the Ollama LLM path and a structured fallback path. Its output is translated into the canvas component array format that `Canvas.jsx` already renders.

## Glossary

- **Orchestrator**: The Design Orchestrator module — the structured reasoning and generation system that processes all user prompts before canvas output.
- **Request_Classifier**: The sub-component of the Orchestrator responsible for categorising incoming prompts into one of the seven defined request types.
- **Canvas**: The existing React component (`Canvas.jsx`) that renders an ordered array of section objects onto the design viewport.
- **Section**: A single renderable unit on the Canvas, represented as `{ id, type, name, content: {...}, styles: { bgColor, textColor, accentColor } }`.
- **Section_Type**: One of the ten supported canvas section types: `navbar`, `symbol_hero`, `features`, `pricing`, `testimonials`, `footer`, `stats`, `cta_banner`, `faq`, `team`.
- **Orchestrator_Plan**: The structured JSON object the Orchestrator produces, containing `requestType`, `scope`, `intent`, `designSystem`, `pages`, `componentsToAuthor`, `assumptionsMade`, and `originalityCheck`.
- **Plan_Translator**: The sub-component that converts an `Orchestrator_Plan` into the flat section array that the Canvas renders.
- **Design_System**: The set of typography, color palette, spacing, motion, and grid decisions extracted from or initialized for the current canvas state.
- **Existing_Canvas_State**: The current array of sections already rendered on the Canvas at the time a prompt is submitted.
- **Incremental_Request**: Any request of type `add_page`, `add_section`, `edit_section`, `edit_component`, or `add_component` — requests that modify only part of the canvas.
- **Full_Build_Request**: A request of type `new_project` or `redesign` — requests that replace or create the entire canvas.
- **AgentPanel**: The existing right-panel React component (`AgentPanel.jsx`) where users type prompts and see generation status.
- **Ollama**: The local LLM runtime the tool connects to for AI-powered generation.
- **Template_Engine**: The existing keyword-matching fallback in `generator.js`, used when Ollama is unavailable.

---

## Requirements

### Requirement 1: Request Classification

**User Story:** As a designer using AuraStudio, I want the system to understand what I'm asking for before it acts, so that it never regenerates sections I didn't ask to change.

#### Acceptance Criteria

1. WHEN a prompt is submitted to the Orchestrator, THE Request_Classifier SHALL assign it exactly one of the following request types: `new_project`, `add_page`, `add_section`, `edit_section`, `edit_component`, `redesign`, or `add_component`.
2. WHEN a prompt contains language indicating full-page creation (e.g., "build", "create a", "design a", "make a … website/page/landing page") and the Existing_Canvas_State is empty, THE Request_Classifier SHALL classify the request as `new_project`.
3. WHEN a prompt contains language indicating full-page creation and the Existing_Canvas_State is non-empty, THE Request_Classifier SHALL classify the request as `redesign`.
4. WHEN a prompt contains additive language (e.g., "add", "include", "append", "insert") followed by a named Section_Type keyword, THE Request_Classifier SHALL classify the request as `add_section`, regardless of whether the prompt also contains full-page creation language.
5. WHEN a prompt contains editing language (e.g., "change", "update", "edit", "modify", "rewrite") AND explicitly references an existing section by type or position, THE Request_Classifier SHALL classify the request as `edit_section`. WHEN editing language is present but no specific section is referenced, THE Request_Classifier SHALL classify the request as `add_section` if the Existing_Canvas_State is non-empty.
6. WHEN a prompt references a specific component within a named section (e.g., "change the headline in the hero", "update the CTA button text in the navbar"), THE Request_Classifier SHALL classify the request as `edit_component`.
7. WHEN the Request_Classifier cannot confidently assign one of the six specific types, THE Request_Classifier SHALL default to `add_section` if the Existing_Canvas_State is non-empty, or `new_project` if the Existing_Canvas_State is empty.

---

### Requirement 2: Scope Enforcement

**User Story:** As a designer, I want incremental requests to only affect the sections I asked about, so that my existing design is never accidentally overwritten.

#### Acceptance Criteria

1. WHEN the classified request type is `add_section` or `add_component`, THE Orchestrator SHALL produce a plan whose `scope.inScope` contains only the newly requested section(s), and `scope.explicitlyUntouched` lists all existing section IDs.
2. WHEN the classified request type is `edit_section` or `edit_component`, THE Orchestrator SHALL produce a plan that modifies only the targeted section(s) identified by the prompt, leaving all other sections unchanged.
3. WHEN the classified request type is `new_project` or `redesign`, THE Orchestrator SHALL produce a plan covering the full canvas, replacing all existing sections.
4. THE Plan_Translator SHALL apply only the sections listed in `scope.inScope` when merging Orchestrator output into the Existing_Canvas_State for Incremental_Requests. IF the Plan_Translator fails to apply one or more in-scope sections, THE Plan_Translator SHALL continue processing the remaining in-scope sections and report partial application in the status object.
5. IF the Orchestrator produces sections outside `scope.inScope` for an Incremental_Request, THEN THE Plan_Translator SHALL discard those out-of-scope sections and log a warning.

---

### Requirement 3: Structured Reasoning Pipeline

**User Story:** As a designer, I want the AI to think through my request systematically before generating anything, so that the output is coherent and well-considered rather than randomly assembled.

#### Acceptance Criteria

1. WHEN processing any prompt, THE Orchestrator SHALL execute the following reasoning steps in order before producing an Orchestrator_Plan: (1) parse intent, (2) read Existing_Canvas_State, (3) define scope, (4) information architecture, (5) component mapping, (6) content strategy, (7) visual and motion direction.
2. WHEN executing step 1 (parse intent), THE Orchestrator SHALL extract: the user's primary goal, the implied business context (industry/brand), and the target audience.
3. WHEN executing step 2 (read Existing_Canvas_State), THE Orchestrator SHALL identify the current Design_System by reading the `styles` fields of all existing sections.
4. WHEN executing step 4 (information architecture), THE Orchestrator SHALL determine the logical narrative order of sections rather than defaulting to a fixed template sequence.
5. WHEN executing step 6 (content strategy), THE Orchestrator SHALL derive all copy from the business context extracted in step 1, producing content that is specific to the user's request rather than generic placeholder text.
6. THE Orchestrator SHALL include the output of the reasoning steps completed so far in the `assumptionsMade` field of the Orchestrator_Plan. WHERE a step has not yet completed, THE Orchestrator SHALL include a partial record of that step's output rather than omitting the step entirely.

---

### Requirement 4: Originality Enforcement

**User Story:** As a designer, I want every generated design to be derived from my specific prompt, so that I never receive generic placeholder content or a cookie-cutter default layout.

#### Acceptance Criteria

1. THE Orchestrator SHALL never produce content containing the strings "Lorem Ipsum", "Your Company Name", "placeholder", or "example.com" in any Section's `content` fields.
2. WHEN generating a `new_project` or `redesign`, THE Orchestrator SHALL NOT produce sections in the fixed default order (navbar → symbol_hero → features → stats → pricing → testimonials → cta_banner → footer) unless the information architecture reasoning step explicitly justifies that order as the best narrative fit for the specific request. THE Orchestrator SHALL document the justification for any section order it uses in the `assumptionsMade` field.
3. THE Orchestrator SHALL populate the `originalityCheck` field of the Orchestrator_Plan with a brief statement confirming that all copy was derived from the user's specific prompt and business context.
4. WHEN generating headlines, subheadlines, feature descriptions, testimonials, or pricing plan names, THE Orchestrator SHALL use vocabulary, tone, and terminology appropriate to the industry and audience identified in the intent-parsing step.
5. IF the Ollama model is unavailable and the Template_Engine is used as fallback, THEN THE Template_Engine SHALL apply the brand name, industry terminology, and key phrases extracted from the user's prompt together when populating section content. All three elements SHALL be applied; if any element cannot be extracted, THE Template_Engine SHALL use the closest reasonable inference from the prompt.

---

### Requirement 5: Orchestrator Plan Schema

**User Story:** As a developer integrating the orchestrator, I want the Orchestrator to always produce a well-formed JSON plan that the Plan Translator can reliably consume, so that downstream rendering never breaks due to malformed output.

#### Acceptance Criteria

1. THE Orchestrator SHALL produce an Orchestrator_Plan that is a valid JSON object conforming to the following top-level structure:
   - `requestType` (string, one of the seven classified types)
   - `scope` (object: `{ inScope: string[], explicitlyUntouched: string[] }`)
   - `intent` (object: `{ userGoal: string, businessContext: string, audience: string }`)
   - `designSystem` (object: `{ isNew: boolean, typography: string, colorPalette: object, spacingScale: string, motionLanguage: string, gridSystem: string }`)
   - `pages` (array of page objects)
   - `componentsToAuthor` (array of component descriptor objects)
   - `assumptionsMade` (array of strings)
   - `originalityCheck` (string)
2. WHEN `pages` contains page objects, each page object SHALL contain a `sections` array, and each section object SHALL contain a `components` array.
3. WHEN `componentsToAuthor` contains component descriptor objects, each descriptor SHALL include: `componentId` (string), `componentType` (string, a valid Section_Type), `isNewComponent` (boolean), `content` (object), `imageDirection` (string), `motion` (string), and `mobileNotes` (string).
4. IF the Ollama model returns a response that cannot be parsed into a valid Orchestrator_Plan — whether due to a JSON syntax error or a structural validation failure (valid JSON that does not conform to the expected schema) — THEN THE Orchestrator SHALL attempt to extract a partial plan from the response and fill missing fields with safe defaults before passing it to the Plan_Translator. Recovery SHALL be considered successful if the result is valid JSON conforming to the schema, regardless of how many fields required safe defaults.
5. IF the Orchestrator Plan cannot be recovered after a parse failure, THEN THE Orchestrator SHALL fall back to the Template_Engine and log the failure reason.

---

### Requirement 6: Plan Translation to Canvas Format

**User Story:** As a developer, I want the Plan Translator to reliably convert the Orchestrator's JSON plan into the section array format the Canvas already renders, so that the orchestrator integrates with zero changes to Canvas.jsx.

#### Acceptance Criteria

1. THE Plan_Translator SHALL convert each component descriptor in `componentsToAuthor` into a Section object of the shape `{ id, type, name, content: {...}, styles: { bgColor, textColor, accentColor } }`.
2. WHEN translating a component descriptor, THE Plan_Translator SHALL map `componentType` to the Section's `type` field, preserving only Section_Types that Canvas.jsx supports.
3. WHEN a component descriptor contains a `componentType` that is not a supported Section_Type, THE Plan_Translator SHALL skip that component and continue processing remaining descriptors. WHERE the logging mechanism is unavailable, THE Plan_Translator SHALL fail silently for that component.
4. WHEN translating for a Full_Build_Request, THE Plan_Translator SHALL return a new section array replacing the entire Existing_Canvas_State.
5. WHEN translating for an Incremental_Request, THE Plan_Translator SHALL merge the new sections into the Existing_Canvas_State: `add_section` appends, `edit_section` replaces the matched section in-place, and `edit_component` updates only the targeted `content` fields of the matched section.
6. THE Plan_Translator SHALL generate unique, stable section IDs using the pattern `{componentType}_{timestamp}_{index}`.

---

### Requirement 7: Design System Coherence

**User Story:** As a designer, I want new sections to inherit the visual language of my existing canvas, so that incremental additions never clash with what's already there.

#### Acceptance Criteria

1. WHEN processing an Incremental_Request, THE Orchestrator SHALL extract the `accentColor`, `bgColor`, and `textColor` from the Existing_Canvas_State and include them in the `designSystem.colorPalette` field of the Orchestrator_Plan.
2. WHEN generating new sections for an Incremental_Request, THE Plan_Translator SHALL apply the extracted `designSystem.colorPalette` values as the default `styles` for new sections, unless the user's prompt explicitly requests a different color scheme.
3. WHEN `designSystem.isNew` is true (Full_Build_Request with empty canvas), THE Orchestrator SHALL derive the color palette from the industry and brand context identified in the intent-parsing step.
4. THE Orchestrator SHALL include a `designSystem.typography` value that is consistent across all sections in the plan, defaulting to the font stack already in use in the Existing_Canvas_State when processing Incremental_Requests.

---

### Requirement 8: Ollama Integration

**User Story:** As a developer, I want the Orchestrator to drive Ollama through a structured system prompt rather than a raw user prompt, so that the LLM output is reliably machine-parseable JSON rather than free-form text.

#### Acceptance Criteria

1. WHEN the Orchestrator sends a request to the Ollama API, THE Orchestrator SHALL use a structured system prompt that instructs the model to output only a valid Orchestrator_Plan JSON object with no markdown fences, no prose explanation, and no text outside the JSON object.
2. THE Orchestrator's system prompt SHALL include the full Orchestrator_Plan schema, the list of supported Section_Types, the seven-step reasoning pipeline, and the originality and scope enforcement rules.
3. WHEN the Ollama model returns a response, THE Orchestrator SHALL strip any markdown code fences and extract the first complete JSON object from the response before attempting to parse it.
4. WHEN the Orchestrator constructs the Ollama request body, THE Orchestrator SHALL include the Existing_Canvas_State summary (section types and styles currently on the canvas) as part of the user-facing prompt context.
5. THE Orchestrator SHALL set a 90-second timeout on Ollama API calls to prevent indefinite blocking of the UI.

---

### Requirement 9: Fallback and Error Resilience

**User Story:** As a designer, I want the tool to always produce something useful even when the AI fails, so that I'm never left with a broken or empty canvas.

#### Acceptance Criteria

1. WHEN the Ollama API call fails or times out, THE Orchestrator SHALL fall back to the Template_Engine and communicate to AgentPanel that template-based generation is being used.
2. WHEN the Template_Engine is used as fallback for an Incremental_Request, THE Template_Engine SHALL honour the classified request type and apply scope enforcement — it SHALL NOT regenerate sections outside `scope.inScope`.
3. WHEN the Orchestrator falls back to the Template_Engine, THE Orchestrator SHALL still execute the intent-parsing step to extract brand name and industry context, applying those values to the Template_Engine's content fields.
4. IF the Plan_Translator encounters a section with a missing or null `type` field, THEN THE Plan_Translator SHALL skip that section and log a warning rather than throwing an error.
5. THE Orchestrator SHALL emit a structured status object to the caller containing: `success` (boolean), `requestType` (string), `generationPath` ('llm' | 'fallback'), and `sectionsGenerated` (number).

---

### Requirement 10: AgentPanel Integration

**User Story:** As a designer, I want the AI Assistant panel to reflect the orchestrator's understanding of my request in real time, so that I can see what the system thinks I'm asking for and correct it if needed.

#### Acceptance Criteria

1. WHEN the Orchestrator classifies a request, THE AgentPanel SHALL display the classified `requestType` as a visible label before generation begins (e.g., "Detected: Add Section").
2. WHEN generation completes successfully via the LLM path, THE AgentPanel SHALL display the number of sections generated and the `generationPath` value ('AI').
3. WHEN generation completes via the Template_Engine fallback, THE AgentPanel SHALL display a notice indicating template-based generation was used and prompt the user to connect Ollama for AI-powered output. WHERE the user's Ollama connection is already active, THE AgentPanel SHALL still display this prompt to indicate that the LLM path was not used for this request.
4. WHEN the Orchestrator is processing a request, THE AgentPanel SHALL display the current reasoning step (e.g., "Parsing intent…", "Mapping components…") as a streaming status indicator.
5. IF the Orchestrator returns an error status, THEN THE AgentPanel SHALL display a human-readable error message and preserve the Existing_Canvas_State without modification.
