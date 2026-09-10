// ──────────────────────────────────────────────────────────────────────────────
// OrchestratorPipeline — coordinates classification, reasoning, LLM, and translation
// ──────────────────────────────────────────────────────────────────────────────

import { classify }                             from './classifier.js';
import { buildContext, buildSystemPrompt, buildUserPrompt } from './reasoner.js';
import { parseAndRecover }                      from './planner.js';
import { translate }                            from './translator.js';

// These are injected by generator.js at runtime to avoid circular imports
let _callOllama      = null;
let _templateFallback = null;
let _ollamaModel     = () => null;  // getter

export function injectDependencies({ callOllama, templateFallback, getModel }) {
  _callOllama       = callOllama;
  _templateFallback = templateFallback;
  _ollamaModel      = getModel;
}

// ── Request type formatter for display ───────────────────────────────────────
function formatType(rt) {
  const map = {
    new_project:    'New Project',
    redesign:       'Redesign',
    add_section:    'Add Section',
    add_component:  'Add Component',
    add_page:       'Add Page',
    edit_section:   'Edit Section',
    edit_component: 'Edit Component',
  };
  return map[rt] || rt;
}

/**
 * Main pipeline entry point.
 *
 * @param {string}   prompt        — raw user prompt
 * @param {Array}    existingComps — current canvas sections
 * @param {Function} onStepUpdate  — callback(stepLabel: string)
 * @returns {{ sections: Array, status: Object }}
 */
export async function run(prompt, existingComps = [], onStepUpdate) {
  const notify = (msg) => { if (typeof onStepUpdate === 'function') onStepUpdate(msg); };

  // ── Step 1: Classify ────────────────────────────────────────────────────────
  notify('Classifying request…');
  let requestType, intentContext;
  try {
    ({ requestType, intentContext } = classify(prompt, existingComps));
  } catch (err) {
    console.warn('[Orchestrator] Classification failed, using defaults:', err.message);
    requestType = existingComps.length > 0 ? 'add_section' : 'new_project';
    intentContext = { rawPrompt: prompt, brandHint: '', industryHint: '', audienceHint: '', keyPhrases: [], targetSectionType: null, targetSectionId: null };
  }
  // Attach raw prompt to context for downstream use
  intentContext.rawPrompt = prompt;

  notify(`Detected: ${formatType(requestType)}`);

  // ── Step 2: Build context ───────────────────────────────────────────────────
  notify('Reading canvas state…');
  const { designSystem, canvasStateSummary } = buildContext(existingComps, intentContext);

  // ── Step 3: Attempt LLM path ────────────────────────────────────────────────
  let plan = null;
  let generationPath = 'llm';

  if (_ollamaModel() && _callOllama) {
    try {
      notify('Parsing intent…');
      const systemPrompt = buildSystemPrompt(requestType, designSystem);
      const userPrompt   = buildUserPrompt(requestType, intentContext, canvasStateSummary);

      notify('Mapping components…');
      const raw = await _callOllama(userPrompt, systemPrompt, null, 90000);

      plan = parseAndRecover(raw, requestType, existingComps, designSystem);

      if (!plan || !Array.isArray(plan.componentsToAuthor) || plan.componentsToAuthor.length === 0) {
        console.warn('[Orchestrator] LLM returned empty componentsToAuthor — falling back');
        plan = null;
      }
    } catch (err) {
      console.warn('[Orchestrator] LLM path failed:', err.message);
      plan = null;
    }
  }

  // ── Step 4: Template fallback ───────────────────────────────────────────────
  if (!plan) {
    notify('Using template engine…');
    generationPath = 'fallback';

    if (!_templateFallback) {
      console.error('[Orchestrator] No template fallback injected');
      return { sections: existingComps, status: { success: false, requestType, generationPath, sectionsGenerated: 0 } };
    }

    try {
      const sections = _templateFallback(prompt, existingComps, requestType, intentContext);
      const added = sections.length - (
        requestType === 'new_project' || requestType === 'redesign'
          ? 0 : existingComps.length
      );
      return {
        sections,
        status: { success: true, requestType, generationPath, sectionsGenerated: Math.max(0, added) },
      };
    } catch (err) {
      console.error('[Orchestrator] Template fallback failed:', err.message);
      return {
        sections: existingComps,
        status: { success: false, requestType, generationPath, sectionsGenerated: 0 },
      };
    }
  }

  // ── Step 5: Translate plan → sections ──────────────────────────────────────
  notify('Building sections…');
  const { sections, skipped, success, failureReason } = translate(plan, existingComps, intentContext);

  if (!success) {
    console.warn('[Orchestrator] Translation merge failed:', failureReason);
  }

  const sectionsGenerated = plan.componentsToAuthor.length - skipped;

  return {
    sections,
    status: { success, requestType, generationPath, sectionsGenerated },
  };
}
