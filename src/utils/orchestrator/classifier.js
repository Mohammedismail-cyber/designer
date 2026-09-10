// ──────────────────────────────────────────────────────────────────────────────
// RequestClassifier — classifies user prompts into one of seven request types
// Priority: edit_component > add_section > edit_section > redesign > new_project > add_page > default
// ──────────────────────────────────────────────────────────────────────────────

// ── Regex constants (compiled once at module load) ────────────────────────────
const FULL_BUILD = /\b(build|create|design|make|generate)\b[\s\S]{0,60}\b(website|landing[\s-]?page|page|site|frontend|ui|interface|app)\b/i;
const ADDITIVE   = /^\s*(add|include|append|insert|give me|i need|show me|put)\b/i;
const EDITING    = /\b(change|update|edit|modify|rewrite|replace|fix|adjust|rename|set|make)\b/i;
const IN_SECTION = /\b(headline|subhead|sub-?head|cta|button|logo|brand|title|description|copy|text|label|link|tagline)\b[\s\S]{0,30}\b(in|of|inside|within|on)\b[\s\S]{0,30}\b(hero|navbar|nav(?:igation)?|header|footer|pricing|features?|testimonials?|stats?|faq|team|banner)\b/i;
const SECTION_KEYWORD = /\b(navbar|nav(?:igation)?|header|hero|banner|features?|feature[\s-]?grid|pricing|testimonials?|footer|stats?|statistics|cta|call[\s-]?to[\s-]?action|faq|team|bento|transition|parallax|scroll[\s-]?reveal|dark[\s-]?to[\s-]?light|light[\s-]?to[\s-]?dark|black[\s-]?to[\s-]?white|white[\s-]?to[\s-]?black|motion|video[\s-]?hero|gradient[\s-]?hero|globe[\s-]?hero|product[\s-]?mockup|split[\s-]?screen|logo[\s-]?marquee|case[\s-]?study|scroll[\s-]?fill|horizontal[\s-]?scroll|pinned[\s-]?section|parallax[\s-]?layered|split[\s-]?text|scroll[\s-]?counters|interactive[\s-]?globe|3d[\s-]?viewer|particle[\s-]?background|cursor[\s-]?spotlight|magnetic[\s-]?button|mouse[\s-]?tilt|custom[\s-]?cursor|big[\s-]?logotype|newsletter[\s-]?footer|multi[\s-]?step|floating[\s-]?label|inline[\s-]?signup|lightbox|before[\s-]?after|autoplay[\s-]?video)\b/i;
const NEW_PAGE   = /\b(add|create|new)\b[\s\S]{0,20}\b(page|route)\b|(\/[a-z][a-z0-9-]*)/i;
const REDESIGN   = /\b(redesign|rebuild|redo|redo|overhaul|start over|start fresh|replace everything|rebuild)\b/i;

// ── Section type normalisation map ────────────────────────────────────────────
const SECTION_TYPE_MAP = {
  // Navigation
  'navigation': 'navbar', 'nav': 'navbar', 'header': 'navbar', 'sticky nav': 'sticky_blurred_nav', 'mega menu': 'mega_menu', 'mobile menu': 'mobile_full_screen_drawer',
  
  // Hero Patterns
  'banner': 'symbol_hero', 'hero': 'symbol_hero', 'video hero': 'video_background_hero', 'video background hero': 'video_background_hero', 'image hero': 'image_background_hero', 'parallax hero': 'image_background_hero', 'gradient hero': 'animated_gradient_hero', 'mesh hero': 'animated_gradient_hero', 'globe hero': 'globe_hero', 'product mockup hero': 'product_mockup_hero', 'split screen hero': 'split_screen_hero',
  
  // Content Sections
  'feature grid': 'features', 'features': 'features', 'feature': 'features', 'bento': 'bento_grid', 'bento grid': 'bento_grid', 'logo marquee': 'logo_marquee', 'logo strip': 'logo_marquee', 'testimonials': 'testimonials', 'testimonial': 'testimonials', 'reviews': 'testimonials', 'review': 'testimonials', 'case study grid': 'case_study_grid', 'case studies': 'case_study_grid', 'portfolio grid': 'case_study_grid', 'pricing': 'pricing', 'pricing table': 'pricing_table', 'faq': 'faq', 'questions': 'faq', 'team': 'team', 'team section': 'team', 'about team': 'team',
  
  // Scroll-Driven Sequences
  'scroll fill device': 'scroll_fill_device_mockup', 'device mockup': 'scroll_fill_device_mockup', 'horizontal scroll gallery': 'horizontal_scroll_gallery', 'scroll gallery': 'horizontal_scroll_gallery', 'theme transition': 'scroll_linked_theme_transition', 'scroll linked theme': 'scroll_linked_theme_transition', 'pinned section': 'pinned_sticky_section', 'sticky section': 'pinned_sticky_section', 'parallax layered': 'parallax_layered_images', 'parallax images': 'parallax_layered_images', 'split text reveal': 'split_text_scroll_reveal', 'text reveal': 'split_text_scroll_reveal', 'scroll counters': 'scroll_triggered_counters', 'counters': 'scroll_triggered_counters',
  
  // 3D & Cursor-Aware Interaction
  'interactive globe': 'standalone_interactive_globe', 'globe': 'standalone_interactive_globe', '3d object viewer': '3d_object_viewer', '3d viewer': '3d_object_viewer', 'particle background': 'ambient_particle_background', 'particles': 'ambient_particle_background', 'cursor spotlight': 'cursor_spotlight', 'spotlight': 'cursor_spotlight', 'magnetic button': 'magnetic_button', 'mouse tilt card': 'mouse_tilt_card', 'tilt card': 'mouse_tilt_card', 'custom cursor': 'custom_cursor',
  
  // Footer
  'footer': 'footer', 'big logotype footer': 'big_logotype_footer', 'newsletter footer': 'newsletter_footer',
  
  // Forms & Inputs
  'multi step form': 'multi_step_form', 'step form': 'multi_step_form', 'floating label inputs': 'floating_label_inputs', 'floating labels': 'floating_label_inputs', 'newsletter signup': 'inline_newsletter_signup', 'inline signup': 'inline_newsletter_signup',
  
  // Media
  'image lightbox': 'image_lightbox', 'lightbox': 'image_lightbox', 'gallery': 'image_lightbox', 'before after slider': 'before_after_slider', 'comparison slider': 'before_after_slider', 'autoplay video card': 'autoplay_card_video', 'video card': 'autoplay_card_video',
  
  // Legacy types for backward compatibility
  'stats': 'stats', 'statistics': 'stats', 'metrics': 'stats', 'numbers': 'stats',
  'cta': 'cta_banner', 'call to action': 'cta_banner', 'call-to-action': 'cta_banner',
  'dark to light': 'transition_dark_light', 'black to white': 'transition_dark_light', 'theme transition': 'transition_dark_light', 'transition': 'transition_dark_light',
  'light to dark': 'transition_light_dark', 'white to black': 'transition_light_dark',
  'parallax': 'motion_parallax', 'parallax layer': 'motion_parallax',
  'scroll reveal': 'motion_reveal', 'fade up': 'motion_reveal', 'motion reveal': 'motion_reveal',
};

// ── Industry keyword sets ─────────────────────────────────────────────────────
const INDUSTRY_MAP = [
  { re: /\b(restaurant|cafe|bistro|food|dining|menu|chef|cuisine|culinary|baking|bakery)\b/i,  industry: 'restaurant' },
  { re: /\b(fitness|gym|workout|training|trainer|yoga|sport|health|wellness|crossfit)\b/i,     industry: 'fitness' },
  { re: /\b(shop|store|ecommerce|e-commerce|product|fashion|apparel|clothing|retail)\b/i,      industry: 'ecommerce' },
  { re: /\b(agency|studio|creative|branding|marketing|advertising|design[\s-]firm)\b/i,        industry: 'agency' },
  { re: /\b(crypto|web3|blockchain|nft|token|defi|dao|protocol|on-?chain)\b/i,                 industry: 'crypto' },
  { re: /\b(real[\s-]estate|property|properties|homes|villa|apartment|realty|realtor)\b/i,     industry: 'realestate' },
  { re: /\b(portfolio|resume|cv|personal site|freelance|my work|my projects)\b/i,              industry: 'portfolio' },
  { re: /\b(saas|software|platform|dashboard|tool|app|startup|product)\b/i,                   industry: 'saas' },
  { re: /\b(legal|law|lawyer|attorney|firm|counsel)\b/i,                                       industry: 'legal' },
  { re: /\b(healthcare|medical|clinic|doctor|hospital|patient|health)\b/i,                    industry: 'healthcare' },
  { re: /\b(education|school|course|learning|tutoring|edtech|academy)\b/i,                    industry: 'education' },
];

// ── Audience signals ──────────────────────────────────────────────────────────
const AUDIENCE_MAP = [
  { re: /\b(developer|engineer|programmer|technical|dev)\b/i,  audience: 'developers' },
  { re: /\b(customer|consumer|shopper|buyer|client)\b/i,       audience: 'customers' },
  { re: /\b(business|enterprise|b2b|company|corporate)\b/i,    audience: 'businesses' },
  { re: /\b(student|learner|beginner)\b/i,                     audience: 'students' },
  { re: /\b(freelancer|independent|solo)\b/i,                  audience: 'freelancers' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function normaliseSectionType(raw) {
  if (!raw) return null;
  const key = raw.toLowerCase().trim();
  if (SECTION_TYPE_MAP[key]) return SECTION_TYPE_MAP[key];
  // partial match
  for (const [k, v] of Object.entries(SECTION_TYPE_MAP)) {
    if (key.includes(k)) return v;
  }
  return null;
}

function extractTargetSectionType(prompt) {
  const m = prompt.match(SECTION_KEYWORD);
  if (!m) return null;
  return normaliseSectionType(m[0]) || normaliseSectionType(m[1]);
}

function extractTargetSectionId(prompt, existingComps) {
  // Look for explicit positional references ("the hero", "the footer", "first section")
  const lp = prompt.toLowerCase();
  for (const comp of existingComps) {
    const typeNames = [comp.type, comp.name?.toLowerCase()].filter(Boolean);
    if (typeNames.some(t => lp.includes(t))) return comp.id;
  }
  return null;
}

/**
 * Extracts intent signals from the prompt text.
 * Returns { brandHint, industryHint, audienceHint, keyPhrases, targetSectionType, targetSectionId }
 */
export function extractIntentContext(prompt, existingComps = []) {
  // Brand hint: capitalised words that are not common stopwords
  const stopwords = new Set(['the','a','an','for','of','in','on','to','and','or','is','are','was','were','i','my','our','we','you','your','it','this','that','with','by','as','at','be','do','not','from','build','create','design','make','add','include','landing','page','website','section']);
  const brandCandidates = (prompt.match(/\b[A-Z][a-zA-Z0-9]{1,20}\b/g) || [])
    .filter(w => !stopwords.has(w.toLowerCase()));
  const brandHint = brandCandidates[0] || '';

  // Industry
  let industryHint = '';
  for (const { re, industry } of INDUSTRY_MAP) {
    if (re.test(prompt)) { industryHint = industry; break; }
  }

  // Audience
  let audienceHint = '';
  for (const { re, audience } of AUDIENCE_MAP) {
    if (re.test(prompt)) { audienceHint = audience; break; }
  }

  // Key phrases: meaningful noun phrases (rough extraction)
  const keyPhrases = (prompt.match(/\b[a-z][a-z\s]{2,24}\b/gi) || [])
    .map(s => s.trim())
    .filter(s => s.split(' ').length >= 2 && !s.match(/^(the |a |an |for |in |on |to |and |or |is |are )/i))
    .slice(0, 5);

  const targetSectionType = extractTargetSectionType(prompt);
  const targetSectionId   = extractTargetSectionId(prompt, existingComps);

  return { brandHint, industryHint, audienceHint, keyPhrases, targetSectionType, targetSectionId };
}

/**
 * Classifies the prompt into exactly one requestType.
 * Returns { requestType, intentContext }
 */
export function classify(prompt, existingComps = []) {
  const intentContext = extractIntentContext(prompt, existingComps);
  const hasCanvas = existingComps.length > 0;

  // 1. edit_component — editing language + specific in-section component reference
  if (EDITING.test(prompt) && IN_SECTION.test(prompt)) {
    return { requestType: 'edit_component', intentContext };
  }

  // 2. add_section / add_component — additive language takes priority over full-build
  if (ADDITIVE.test(prompt) && SECTION_KEYWORD.test(prompt)) {
    return { requestType: 'add_section', intentContext };
  }

  // 3. edit_section — editing language + identifiable section reference
  if (EDITING.test(prompt) && SECTION_KEYWORD.test(prompt) && hasCanvas) {
    return { requestType: 'edit_section', intentContext };
  }

  // 4. redesign — explicit redesign trigger
  if (REDESIGN.test(prompt) && hasCanvas) {
    return { requestType: 'redesign', intentContext };
  }

  // 5. new_project / redesign — full-build language
  if (FULL_BUILD.test(prompt)) {
    return { requestType: hasCanvas ? 'redesign' : 'new_project', intentContext };
  }

  // 6. add_page — page/route creation language
  if (NEW_PAGE.test(prompt)) {
    return { requestType: 'add_page', intentContext };
  }

  // 7. Default
  return { requestType: hasCanvas ? 'add_section' : 'new_project', intentContext };
}
