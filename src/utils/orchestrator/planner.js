// ──────────────────────────────────────────────────────────────────────────────
// PlanValidator — parses, validates, and recovers Orchestrator_Plan JSON
// ──────────────────────────────────────────────────────────────────────────────

const BANNED_STRINGS = ['lorem ipsum', 'your company name', 'example.com'];

const REQUIRED_TOP_LEVEL = ['requestType','scope','intent','designSystem','pages','componentsToAuthor','assumptionsMade','originalityCheck'];
const VALID_REQUEST_TYPES = new Set(['new_project','add_page','add_section','edit_section','edit_component','redesign','add_component']);

// ── Strip markdown fences and extract JSON ────────────────────────────────────
export function stripMarkdown(raw) {
  let s = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // Extract the outermost { } or [ ] block
  const objStart  = s.indexOf('{');
  const arrStart  = s.indexOf('[');

  let start = -1;
  if (objStart === -1 && arrStart === -1) return null;
  if (objStart === -1) start = arrStart;
  else if (arrStart === -1) start = objStart;
  else start = Math.min(objStart, arrStart);

  const isArray = s[start] === '[';
  let depth = 0;
  let end = -1;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (c === (isArray ? '[' : '{') || c === (isArray ? '{' : '[')) depth++;  // track nested too
    if (c === '[' || c === '{') depth++;
    if (c === ']' || c === '}') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }

  return end !== -1 ? s.slice(start, end + 1) : null;
}

// ── Structural validation ─────────────────────────────────────────────────────
export function structuralValidate(plan) {
  if (!plan || typeof plan !== 'object') return { valid: false, missingKeys: REQUIRED_TOP_LEVEL };

  const missingKeys = REQUIRED_TOP_LEVEL.filter(k => plan[k] === undefined || plan[k] === null);

  if (!VALID_REQUEST_TYPES.has(plan.requestType)) missingKeys.push('requestType(invalid)');
  if (!Array.isArray(plan.componentsToAuthor))    missingKeys.push('componentsToAuthor(not array)');
  if (!Array.isArray(plan.assumptionsMade))        missingKeys.push('assumptionsMade(not array)');
  if (!Array.isArray(plan.pages))                  missingKeys.push('pages(not array)');

  return { valid: missingKeys.length === 0, missingKeys };
}

// ── Safe default filler ────────────────────────────────────────────────────────
export function applyDefaults(partial, requestType, existingComps, designSystem) {
  const p = partial || {};
  const palette = designSystem?.colorPalette || {};

  return {
    requestType:    VALID_REQUEST_TYPES.has(p.requestType) ? p.requestType : requestType,
    scope: {
      inScope:             Array.isArray(p.scope?.inScope)             ? p.scope.inScope             : [],
      explicitlyUntouched: Array.isArray(p.scope?.explicitlyUntouched) ? p.scope.explicitlyUntouched : (existingComps || []).map(c => c.id),
    },
    intent: {
      userGoal:        p.intent?.userGoal        || (partial?.rawPrompt?.slice(0, 120) ?? 'Build a design'),
      businessContext: p.intent?.businessContext || designSystem?.industryHint || 'General purpose product',
      audience:        p.intent?.audience        || 'general audience',
    },
    designSystem: {
      isNew:         p.designSystem?.isNew         ?? designSystem?.isNew ?? true,
      typography:    p.designSystem?.typography    || { display: 'system-ui, sans-serif', body: 'system-ui, sans-serif' },
      colorPalette:  p.designSystem?.colorPalette  || { base: palette.base || '#ffffff', surface: palette.surface || '#fafafa', accent: palette.accent || '#a855f7', text: palette.text || '#09090b' },
      spacingScale:  p.designSystem?.spacingScale  || '4/8/16/24/32/48/64/96/128',
      motionLanguage:p.designSystem?.motionLanguage|| 'sophisticated entrance animations, scroll-triggered reveals, parallax effects, and interactive hover states',
      gridSystem:    p.designSystem?.gridSystem    || '12-col, 80px desktop margin / 24px mobile margin',
    },
    pages: Array.isArray(p.pages) && p.pages.length > 0
      ? p.pages.map(pg => ({
          pageId:   pg.pageId   || 'home',
          pageName: pg.pageName || 'Home',
          purpose:  pg.purpose  || '',
          sections: Array.isArray(pg.sections) ? pg.sections : [],
        }))
      : [{ pageId: 'home', pageName: 'Home', purpose: '', sections: [] }],
    componentsToAuthor: Array.isArray(p.componentsToAuthor) ? p.componentsToAuthor : [],
    assumptionsMade:    Array.isArray(p.assumptionsMade) ? p.assumptionsMade : ['Plan recovered from partial LLM response'],
    originalityCheck:   typeof p.originalityCheck === 'string' ? p.originalityCheck : 'Content derived from user prompt. Recovery applied.',
    // carry through styles sidecar if present
    componentsToAuthor_styles: Array.isArray(p.componentsToAuthor_styles) ? p.componentsToAuthor_styles : [],
  };
}

// ── Banned string scanner (warn only, does not block) ────────────────────────
export function scanForBannedStrings(plan) {
  if (!plan?.componentsToAuthor) return;
  for (const comp of plan.componentsToAuthor) {
    const text = JSON.stringify(comp.content || '').toLowerCase();
    for (const banned of BANNED_STRINGS) {
      if (text.includes(banned)) {
        console.warn(`[PlanValidator] Banned string "${banned}" found in component ${comp.componentId}`);
      }
    }
  }
}

// ── Main entry point ──────────────────────────────────────────────────────────
/**
 * Parses raw LLM response, validates structure, applies safe defaults if needed.
 * Throws if the plan is unrecoverable (empty componentsToAuthor after recovery
 * is NOT a throw — it signals the caller to use the template fallback instead).
 */
export function parseAndRecover(raw, requestType, existingComps, designSystem) {
  // 1. Strip markdown and extract JSON string
  const extracted = stripMarkdown(raw);
  if (!extracted) {
    throw new Error('No JSON found in LLM response');
  }

  // 2. Parse
  let parsed;
  try {
    parsed = JSON.parse(extracted);
  } catch (e) {
    throw new Error(`JSON parse failed: ${e.message}`);
  }

  // 3. If LLM returned a plain array of sections (old format), wrap it
  if (Array.isArray(parsed)) {
    parsed = {
      requestType,
      componentsToAuthor: parsed.map((s, i) => ({
        componentId:   s.id || `comp_${i}`,
        componentType: s.type,
        isNewComponent: true,
        content:       s.content || {},
        imageDirection: '',
        motion:        { entrance: '', hover: '', scroll: '' },
        mobileNotes:   '',
        _styles:       s.styles,
      })),
      assumptionsMade: ['LLM returned legacy array format; wrapped automatically'],
      originalityCheck: 'Content from LLM response.',
    };
  }

  // 4. Validate
  const { valid } = structuralValidate(parsed);

  // 5. Apply defaults if needed
  const plan = valid ? parsed : applyDefaults(parsed, requestType, existingComps, designSystem);

  // 6. Re-validate after defaults
  const { valid: validAfter, missingKeys } = structuralValidate(plan);
  if (!validAfter) {
    throw new Error(`Plan unrecoverable after applying defaults. Missing: ${missingKeys.join(', ')}`);
  }

  // 7. Warn on banned strings
  scanForBannedStrings(plan);

  return plan;
}
