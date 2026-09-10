# Implementation Plan: Design Orchestrator

## Overview

Integrate the Design Orchestrator pipeline into AuraStudio by creating four new sub-modules under `src/utils/orchestrator/`, updating `generator.js` to delegate to them, and updating `AgentPanel.jsx` and `App.jsx` to surface classification and status feedback. No changes to `Canvas.jsx` are required.

## Tasks

- [x] 1. Create RequestClassifier module (`src/utils/orchestrator/classifier.js`)
  - [x] 1.1 Create the file `src/utils/orchestrator/classifier.js`
  - [x] 1.2 Define regex constants at module load: `FULL_BUILD`, `ADDITIVE`, `EDITING`, `SECTION_TYPES_RE`, `IN_SECTION`, `NEW_PAGE`
  - [x] 1.3 Define Section_Type keyword normalisation map (e.g. `navigation` → `navbar`, `banner` → `symbol_hero`)
  - [x] 1.4 Implement `classify(prompt, existingComps)` with priority-ordered match logic: edit_component → add_section → edit_section → redesign → new_project → add_page → default
  - [x] 1.5 Implement `extractIntentContext(prompt)` to pull brand hint, industry hint, audience hint, key phrases, target section type, and target section ID from the prompt
  - [x] 1.6 Export `{ classify }` as a named export

- [x] 2. Create DesignReasoner module (`src/utils/orchestrator/reasoner.js`)
  - [x] 2.1 Create the file `src/utils/orchestrator/reasoner.js`
  - [x] 2.2 Implement `extractDesignSystem(existingComps)` that reads `styles` from all sections, picks the modal value for each color property, and returns `{ accentColor, bgColor, textColor, existingSectionTypes, existingSectionIds }`
  - [x] 2.3 Implement `buildContext(existingComps, intentContext)` returning `{ designSystem, canvasStateSummary }`
  - [x] 2.4 Implement `buildSystemPrompt(requestType, designSystem)` assembling the static structured system prompt: role declaration, full Orchestrator_Plan schema, Section_Type list, 7-step pipeline instructions, and hard constraints
  - [x] 2.5 Implement `buildUserPrompt(requestType, intentContext, canvasStateSummary)` assembling the short variable user context string
  - [x] 2.6 Export `{ buildContext, buildSystemPrompt, buildUserPrompt }` as named exports

- [x] 3. Create PlanValidator module (`src/utils/orchestrator/planner.js`)
  - [x] 3.1 Create the file `src/utils/orchestrator/planner.js`
  - [x] 3.2 Implement `stripMarkdown(raw)` that removes code fences and extracts the first `{...}` or `[...]` block
  - [x] 3.3 Implement `structuralValidate(plan)` checking all required top-level keys and types; return `{ valid, missingKeys }`
  - [x] 3.4 Implement `applyDefaults(partial, requestType, existingComps, designSystem)` filling each missing/null field with its safe default per the design doc table
  - [x] 3.5 Implement `scanForBannedStrings(plan)` scanning all `content` fields for banned strings case-insensitively; log a warning for any found
  - [x] 3.6 Implement `parseAndRecover(raw, requestType, existingComps, designSystem)` orchestrating: strip → parse → validate → applyDefaults → validate → throw on second failure
  - [x] 3.7 Export `{ parseAndRecover }` as a named export

- [x] 4. Create PlanTranslator module (`src/utils/orchestrator/translator.js`)
  - [x] 4.1 Create the file `src/utils/orchestrator/translator.js`
  - [x] 4.2 Define `SUPPORTED_TYPES` as a `Set` of the ten valid Section_Type strings
  - [x] 4.3 Implement `descriptorToSection(descriptor, designSystem, index)` mapping componentType → type, generating ID as `{type}_{ts}_{index}`, applying design system colors to `styles`
  - [x] 4.4 Implement `mergeIntoCanvas(newSections, existingComps, requestType, targetSectionType)` with the four merge strategies from the design doc
  - [x] 4.5 Implement `translate(plan, existingComps)` building new sections, applying the out-of-scope guard, calling mergeIntoCanvas, returning `{ sections, skipped }`
  - [x] 4.6 Export `{ translate }` as a named export

- [x] 5. Create OrchestratorPipeline coordinator (`src/utils/orchestrator/index.js`)
  - [x] 5.1 Create the file `src/utils/orchestrator/index.js`
  - [x] 5.2 Implement `run(prompt, existingComps, onStepUpdate)` wiring all sub-modules in sequence: classify → buildContext → LLM call (90s timeout) → parseAndRecover → translate
  - [x] 5.3 Wire `onStepUpdate` calls at each stage with the step labels defined in the design doc
  - [x] 5.4 Implement the template engine fallback branch triggered by LLM failure, timeout, or empty `componentsToAuthor`
  - [x] 5.5 Return `{ sections, status }` in all code paths
  - [x] 5.6 Export `{ run }` as a named export

- [x] 6. Update generator.js to delegate to the pipeline
  - [x] 6.1 Import `{ run }` from `./orchestrator/index.js`
  - [x] 6.2 Replace the body of `generateComponents()` with a call to `run()`, returning `sections` from the result
  - [x] 6.3 Update `generateFromTemplate()` to accept `requestType` and `intentContext` parameters and apply scope enforcement (single-section output for `add_section` requests)
  - [x] 6.4 Replace hardcoded brand names in `generateFromTemplate()` content with values from `intentContext.brandHint`, `intentContext.industryHint`, and `intentContext.keyPhrases`
  - [x] 6.5 Verify all existing exports remain unchanged and the file compiles without errors

- [x] 7. Update AgentPanel.jsx
  - [x] 7.1 Add `currentStep` (string) and `lastStatus` (object) state variables
  - [x] 7.2 Update `handleSubmit` to pass `setCurrentStep` as the step-update callback to `onGenerate` and store the returned status in `lastStatus`
  - [x] 7.3 Create `RequestTypeBadge` inline component rendering a colour-coded pill (purple for new/redesign, green for add, amber for edit)
  - [x] 7.4 Render `RequestTypeBadge` in the message thread once classification fires, before generation output appears
  - [x] 7.5 Update the post-generation assistant message to include section count and generation path
  - [x] 7.6 Render `currentStep` as an italic muted streaming indicator while `isGenerating` is true; clear on completion
  - [x] 7.7 When `lastStatus.success === false`, display a human-readable error message

- [x] 8. Update App.jsx handleGenerate
  - [x] 8.1 Rename the `onChunk` callback parameter to `onStepUpdate` in `handleGenerate`
  - [x] 8.2 Pass `onStepUpdate` as the third argument to `generateComponents()`
  - [x] 8.3 Destructure `{ sections, status }` from the return value; pass `status` back to the caller
  - [x] 8.4 On generation error, restore the canvas to the pre-generation snapshot using the history entry pushed before generation

- [x] 9. Integration smoke tests
  - [x] 9.1 Blank canvas + full-build prompt generates a non-default section order with real copy
  - [x] 9.2 Non-empty canvas + "add a pricing section" appends only one section; AgentPanel shows "Detected: Add Section"
  - [x] 9.3 "Change the headline in the hero" updates only the hero's content.headline; AgentPanel shows "Detected: Edit Component"
  - [x] 9.4 Ollama disconnected + any prompt triggers template fallback with AgentPanel notice
  - [x] 9.5 No uncaught console errors or React key warnings across all flows

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": [1, 2, 3, 4] },
    { "wave": 2, "tasks": [5] },
    { "wave": 3, "tasks": [6] },
    { "wave": 4, "tasks": [7, 8] },
    { "wave": 5, "tasks": [9] }
  ]
}
```

Tasks 1–4 can be built in parallel. Task 5 requires 1–4. Tasks 6, 7, 8 require 5. Task 9 requires 6, 7, 8.

## Notes

- `Canvas.jsx` requires zero changes. All integration is through `generateComponents()` in `generator.js`.
- The `onChunk` parameter in the current `AgentPanel.jsx` `handleSubmit` is used only to update a streaming text state that is currently discarded. Replacing it with `onStepUpdate` is a non-breaking change.
- Keep `callOllama()` in `generator.js` — the pipeline imports and calls it directly rather than duplicating the fetch logic.
- The `SUPPORTED_TYPES` set in `translator.js` is the single source of truth for what the Canvas can render. Any future section type additions require only updating this set and `Canvas.jsx`.
