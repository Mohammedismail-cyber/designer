// ──────────────────────────────────────────────────────────────────────────────
// DesignReasoner — extracts canvas design system & builds Ollama prompts
// ──────────────────────────────────────────────────────────────────────────────

const SUPPORTED_SECTION_TYPES = [
  // Navigation
  'navbar', 'sticky_blurred_nav', 'mega_menu', 'mobile_full_screen_drawer', 'route_page_transition',
  // Hero Patterns
  'symbol_hero', 'video_background_hero', 'image_background_hero', 'animated_gradient_hero', 'globe_hero', 'product_mockup_hero', 'split_screen_hero',
  // Scroll-Driven Sequences
  'scroll_fill_device_mockup', 'horizontal_scroll_gallery', 'scroll_linked_theme_transition', 'pinned_sticky_section', 'parallax_layered_images', 'split_text_scroll_reveal', 'scroll_triggered_counters',
  // 3D & Cursor-Aware Interaction
  'standalone_interactive_globe', '3d_object_viewer', 'ambient_particle_background', 'cursor_spotlight', 'magnetic_button', 'mouse_tilt_card', 'custom_cursor',
  // Content Sections
  'features', 'bento_grid', 'logo_marquee', 'testimonials', 'case_study_grid', 'pricing', 'pricing_table', 'faq', 'team',
  // Footer
  'footer', 'big_logotype_footer', 'newsletter_footer',
  // Forms & Inputs
  'multi_step_form', 'floating_label_inputs', 'inline_newsletter_signup',
  // Media
  'image_lightbox', 'before_after_slider', 'autoplay_card_video',
  // Legacy types for backward compatibility
  'stats', 'cta_banner', 'transition_dark_light', 'transition_light_dark', 'motion_reveal', 'motion_parallax',
];

// ── Colour palette hints per industry ────────────────────────────────────────
const INDUSTRY_PALETTES = {
  restaurant:  { base: '#fffbf5', surface: '#f5ede0', accent: '#c84b31', text: '#1a0a00' },
  fitness:     { base: '#0a0a0a', surface: '#1a1a1a', accent: '#22c55e', text: '#f4f4f5' },
  ecommerce:   { base: '#ffffff', surface: '#f8fafc', accent: '#0ea5e9', text: '#09090b' },
  agency:      { base: '#ffffff', surface: '#f9f9f9', accent: '#ff5500', text: '#09090b' },
  crypto:      { base: '#0d0d1a', surface: '#14142a', accent: '#a855f7', text: '#e4e4f0' },
  realestate:  { base: '#fafaf8', surface: '#f0ede8', accent: '#1a1a1a', text: '#1a1a1a' },
  portfolio:   { base: '#ffffff', surface: '#fafafa', accent: '#9333ea', text: '#09090b' },
  saas:        { base: '#ffffff', surface: '#f4f4f5', accent: '#a855f7', text: '#09090b' },
  legal:       { base: '#fafaf8', surface: '#f0ede8', accent: '#1a3a5c', text: '#0f1923' },
  healthcare:  { base: '#f0f9ff', surface: '#e0f2fe', accent: '#0369a1', text: '#082f49' },
  education:   { base: '#fffbeb', surface: '#fef3c7', accent: '#d97706', text: '#1c1917' },
  default:     { base: '#ffffff', surface: '#fafafa', accent: '#a855f7', text: '#09090b' },
};

// ── Statistical mode helper ────────────────────────────────────────────────────
function mode(arr) {
  if (!arr.length) return null;
  const freq = {};
  let max = 0, result = arr[0];
  for (const v of arr) {
    freq[v] = (freq[v] || 0) + 1;
    if (freq[v] > max) { max = freq[v]; result = v; }
  }
  return result;
}

/**
 * Extracts the current design system from existing canvas sections.
 * Returns null for empty canvas (signals new project).
 */
function extractDesignSystem(existingComps) {
  if (!existingComps || existingComps.length === 0) return null;

  const accents = existingComps.map(c => c.styles?.accentColor).filter(Boolean);
  const bgs     = existingComps.map(c => c.styles?.bgColor).filter(Boolean);
  const texts   = existingComps.map(c => c.styles?.textColor).filter(Boolean);

  return {
    accentColor: mode(accents) || '#a855f7',
    bgColor:     mode(bgs)     || '#ffffff',
    textColor:   mode(texts)   || '#09090b',
    existingSectionTypes: existingComps.map(c => c.type),
    existingSectionIds:   existingComps.map(c => c.id),
  };
}

/**
 * Builds context for the pipeline coordinator.
 * Returns { designSystem, canvasStateSummary }
 */
export function buildContext(existingComps, intentContext) {
  const extracted = extractDesignSystem(existingComps);

  // Determine palette: extracted from canvas, or industry-derived for new projects
  const industryPalette = INDUSTRY_PALETTES[intentContext.industryHint] || INDUSTRY_PALETTES.default;

  const designSystem = extracted
    ? {
        isNew: false,
        accentColor: extracted.accentColor,
        bgColor:     extracted.bgColor,
        textColor:   extracted.textColor,
        existingSectionTypes: extracted.existingSectionTypes,
        existingSectionIds:   extracted.existingSectionIds,
        colorPalette: {
          base:    extracted.bgColor,
          surface: extracted.bgColor === '#ffffff' ? '#fafafa' : extracted.bgColor,
          accent:  extracted.accentColor,
          text:    extracted.textColor,
        },
        typography: 'system-ui, -apple-system, sans-serif',
        spacingScale: '4/8/16/24/32/48/64/96/128',
        motionLanguage: 'sophisticated entrance animations, scroll-triggered reveals, parallax effects, and interactive hover states. Use Framer Motion for smooth transitions.',
        gridSystem: '12-col, 80px desktop margin / 24px mobile margin',
      }
    : {
        isNew: true,
        accentColor: industryPalette.accent,
        bgColor:     industryPalette.base,
        textColor:   industryPalette.text,
        existingSectionTypes: [],
        existingSectionIds:   [],
        colorPalette: industryPalette,
        typography: 'system-ui, -apple-system, sans-serif',
        spacingScale: '4/8/16/24/32/48/64/96/128',
        motionLanguage: 'sophisticated entrance animations, scroll-triggered reveals, parallax effects, and interactive hover states. Use Framer Motion for smooth transitions.',
        gridSystem: '12-col, 80px desktop margin / 24px mobile margin',
      };

  const canvasStateSummary = extracted
    ? `Existing sections: ${extracted.existingSectionTypes.join(', ')}. Accent: ${extracted.accentColor}, BG: ${extracted.bgColor}, Text: ${extracted.textColor}.`
    : 'Canvas is empty — build from scratch.';

  return { designSystem, canvasStateSummary };
}

/**
 * Builds the static Ollama system prompt encoding the full orchestrator contract.
 */
export function buildSystemPrompt(requestType, designSystem) {
  const palette = designSystem.colorPalette;

  return `You are the Design Orchestrator for AuraStudio, an AI-powered frontend design tool that produces high-end, boutique-quality websites.

OUTPUT RULES (non-negotiable):
- Output ONLY valid JSON. No markdown fences. No prose. No text outside the JSON object.
- Never use: "Lorem Ipsum", "Your Company Name", "placeholder", "example.com".
- All copy must be specific to the user's industry, brand, and audience.
- PREFER Standard Component Library types (sticky_blurred_nav, animated_gradient_hero, globe_hero, bento_grid, testimonial_carousel, pricing_table, scroll_linked_theme_transition, etc.) over legacy types.
- Design for sophistication: use asymmetric layouts, sophisticated typography, and premium spacing.
- Include motion and interaction components where appropriate (scroll reveals, parallax, hover effects).

SUPPORTED SECTION TYPES (use only these):
${SUPPORTED_SECTION_TYPES.join(', ')}

SECTION CONTENT SCHEMAS:
navbar: { brand, links[], cta }
sticky_blurred_nav: { brand, links[], cta }
mega_menu: { brand, menuItems[{label,submenu[{label,description,icon,href}]}], cta }
mobile_full_screen_drawer: { brand, links[], cta }
route_page_transition: {}
symbol_hero: { announcement, headline, subhead, primaryBtn, secondaryBtn, stats[{value,label}] }
video_background_hero: { videoSrc, title, subtitle, ctaText, overlayOpacity }
image_background_hero: { imageSrc, title, subtitle, ctaText }
animated_gradient_hero: { title, subtitle, ctaText, gradientColors[] }
globe_hero: { title, subtitle, ctaText, darkMode }
product_mockup_hero: { title, subtitle, ctaText, mockupImage }
split_screen_hero: { title, subtitle, ctaText, visualContent, visualPosition }
scroll_fill_device_mockup: { screens[] }
horizontal_scroll_gallery: { items[] }
scroll_linked_theme_transition: { fromColor, toColor }
pinned_sticky_section: { pinnedContent, scrollingContent }
parallax_layered_images: { layers[] }
split_text_scroll_reveal: { text }
scroll_triggered_counters: { stats[{value,suffix,prefix,label}] }
standalone_interactive_globe: { darkMode, markers[], width, height }
3d_object_viewer: {}
ambient_particle_background: { particleCount }
cursor_spotlight: {}
magnetic_button: {}
mouse_tilt_card: {}
custom_cursor: {}
features: { title, subtitle, items[{title,desc}] }
bento_grid: { items[{content,span}] }
logo_marquee: { logos[] }
testimonials: { title, subtitle, quotes[{name,role,text,avatar}] }
case_study_grid: { cases[{title,description,category,preview}] }
pricing: { title, subtitle, plans[{name,price,period,features[],btnText,isPopular}] }
pricing_table: { plans[{name,description,monthlyPrice,yearlyPrice,features[],popular}] }
faq: { title, items[{question,answer}] }
team: { title, members[{name,role,image,socials[{icon,href}]}] }
footer: { brand, tagline, copyright }
big_logotype_footer: { logo, sitemap[], contactInfo[], socialLinks[] }
newsletter_footer: { logo, sitemap[{title,links[]}], socialLinks[] }
stats: { title, items[{value,label,desc}] }
cta_banner: { headline, subhead, primaryBtn, secondaryBtn }
multi_step_form: { steps[{component}] }
floating_label_inputs: { fields[{name,label,type}] }
inline_newsletter_signup: { placeholder, buttonText }
image_lightbox: { images[{thumbnail,full}] }
before_after_slider: { beforeImage, afterImage, beforeLabel, afterLabel }
autoplay_card_video: { videoSrc, poster }
transition_dark_light: {}
transition_light_dark: {}
motion_reveal: {}
motion_parallax: {}

CURRENT DESIGN SYSTEM:
${JSON.stringify({ accent: palette?.accent, base: palette?.base, text: palette?.text }, null, 2)}

REQUEST TYPE: ${requestType}
SCOPE RULES:
${requestType === 'new_project' || requestType === 'redesign'
  ? '- Build a complete layout. Section order must be derived from the user\'s business context, not a default template.'
  : requestType === 'add_section' || requestType === 'add_component'
  ? '- Generate ONLY the requested section(s). Do not include sections already on the canvas.'
  : requestType === 'edit_section'
  ? '- Regenerate ONLY the targeted section with improved content. Leave all other sections untouched.'
  : requestType === 'edit_component'
  ? '- Update ONLY the specific content field(s) mentioned. Leave the rest of the section content unchanged.'
  : '- Scope output to only what was requested.'}

ORIGINALITY RULES:
- Derive section ordering from the narrative logic of the user\'s specific request.
- Use industry vocabulary, realistic brand names, specific numbers, and relevant copy.
- The originalityCheck field must confirm copy was derived from the user\'s prompt.

OUTPUT SCHEMA:
{
  "requestType": "${requestType}",
  "scope": { "inScope": ["section type strings"], "explicitlyUntouched": ["existing section IDs"] },
  "intent": { "userGoal": "string", "businessContext": "string", "audience": "string" },
  "designSystem": {
    "isNew": ${designSystem.isNew},
    "typography": { "display": "string", "body": "string" },
    "colorPalette": { "base": "hex", "surface": "hex", "accent": "hex", "text": "hex" },
    "spacingScale": "string",
    "motionLanguage": "string",
    "gridSystem": "string"
  },
  "pages": [{ "pageId": "home", "pageName": "Home", "purpose": "string", "sections": [] }],
  "componentsToAuthor": [
    {
      "componentId": "string",
      "componentType": "one of the supported types above",
      "isNewComponent": true,
      "content": { /* schema-correct content for the type */ },
      "imageDirection": "specific art direction (not 'stock photo')",
      "motion": { "entrance": "string", "hover": "string", "scroll": "string" },
      "mobileNotes": "specific responsive behaviour (not just 'stacks')"
    }
  ],
  "componentsToAuthor_styles": [
    { "componentId": "string", "bgColor": "hex", "textColor": "hex", "accentColor": "hex" }
  ],
  "assumptionsMade": ["string"],
  "originalityCheck": "string"
}`;
}

/**
 * Builds the short variable user prompt that changes per request.
 */
export function buildUserPrompt(requestType, intentContext, canvasStateSummary) {
  const { rawPrompt, brandHint, industryHint, audienceHint, keyPhrases } = intentContext;

  const context = [
    `REQUEST TYPE: ${requestType}`,
    `CANVAS STATE: ${canvasStateSummary}`,
    brandHint    ? `BRAND: ${brandHint}` : '',
    industryHint ? `INDUSTRY: ${industryHint}` : '',
    audienceHint ? `AUDIENCE: ${audienceHint}` : '',
    keyPhrases?.length ? `KEY THEMES: ${keyPhrases.join(', ')}` : '',
    `USER PROMPT: ${rawPrompt}`,
  ].filter(Boolean).join('\n');

  return context;
}
