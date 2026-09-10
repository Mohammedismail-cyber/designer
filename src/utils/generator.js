// ──────────────────────────────────────────────────────────────────────────────
// AuraDesign — AI Generator + Ollama LLM Integration
// ──────────────────────────────────────────────────────────────────────────────

import { run as orchestratorRun, injectDependencies } from './orchestrator/index.js';
import { compileWorkspaceToCode, compileToHtml, compileToReact, compileToTailwindMotion } from './export/index.js';
import {
  loadPagePreset,
  createSectionPreset,
  createMotionPreset,
  buildSymbolSaaS,
  buildCuboCreative,
  buildThe1Sustainable,
  buildNitroAgency,
  buildCuratedProducts,
  buildGlassDark,
  buildHeilaHealth,
  buildAriaTech,
  buildGoldsandFinance,
  buildHandheldSaaS,
  buildApexDarkSaaS,
  buildMinimalPortfolio,
} from './templates/presets.js';

export { compileWorkspaceToCode, compileToHtml, compileToReact, compileToTailwindMotion };
export {
  loadPagePreset,
  createSectionPreset,
  createMotionPreset,
  buildSymbolSaaS,
  buildCuboCreative,
  buildThe1Sustainable,
  buildNitroAgency,
  buildCuratedProducts,
  buildGlassDark,
  buildHeilaHealth,
  buildAriaTech,
  buildGoldsandFinance,
  buildHandheldSaaS,
  buildApexDarkSaaS,
  buildMinimalPortfolio,
};

let _ollamaHost = 'http://localhost:11434';
let _ollamaModel = null;

export function setOllamaConfig(host, model) {
  _ollamaHost = host || 'http://localhost:11434';
  _ollamaModel = model || null;
}

export async function getOllamaModels(host = 'http://localhost:11434') {
  try {
    const res = await fetch(`${host}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    return data.models || [];
  } catch {
    return [];
  }
}

const MODEL_PRIORITY = [
  'llama3.1:8b','llama3.2:3b','llama3.2:1b','hermes3:8b',
  'qwen2.5:7b','qwen2.5:3b','mistral:7b','phi3:mini',
  'deepseek-coder:latest','gemma2:9b','gemma2:2b'
];

export function pickBestModel(models) {
  if (!models || models.length === 0) return null;
  const names = models.map(m => m.name);
  for (const preferred of MODEL_PRIORITY) {
    if (names.includes(preferred)) return preferred;
  }
  return models[0]?.name || null;
}

// ── OLLAMA LLM CALL ──────────────────────────────────────────────────────────
async function callOllama(prompt, systemPrompt, onChunk, timeoutMs = 90000) {
  const model = _ollamaModel;
  if (!model) throw new Error('No Ollama model configured');
  const url = `${_ollamaHost}/api/generate`;
  const body = JSON.stringify({ model, prompt: `${systemPrompt}\n\nUser: ${prompt}`, stream: true });
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        if (obj.response) { full += obj.response; if (onChunk) onChunk(obj.response, full); }
      } catch { /* skip */ }
    }
  }
  return full;
}

// Inject dependencies into the orchestrator pipeline (done after callOllama is defined)
// Note: generateFromTemplate is defined further below — injection is deferred to first call
injectDependencies({
  callOllama,
  templateFallback: (p, e, rt, ic) => generateFromTemplate(p, e, rt, ic),
  getModel: () => _ollamaModel,
});

// ── AI SUGGESTIONS ENGINE ────────────────────────────────────────────────────
export async function getAISuggestions(existingComponents, onChunk) {
  const sectionTypes = existingComponents.map(c => c.name || c.type).join(', ');
  const systemPrompt = `You are a UI/UX design assistant for a visual frontend design tool called AuraStudio. 
Give 3 short, actionable suggestions for what sections to add next to the user's design.
Format as a JSON array: [{"label": "short title", "prompt": "add a ... section"}]
Be concise. Only JSON, no explanation.`;
  const userPrompt = sectionTypes
    ? `Current sections: ${sectionTypes}. What should I add next?`
    : `Starting fresh. What sections should I add to build a great landing page?`;

  try {
    let raw = await callOllama(userPrompt, systemPrompt, onChunk);
    raw = raw.trim();
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return getFallbackSuggestions(existingComponents);
  } catch {
    return getFallbackSuggestions(existingComponents);
  }
}

function getFallbackSuggestions(existingComponents) {
  const types = existingComponents.map(c => c.type);
  const suggestions = [];
  if (!types.includes('sticky_blurred_nav') && !types.includes('navbar')) suggestions.push({ label: 'Add Navigation', prompt: 'Add a sticky blurred navigation bar with logo and CTA button' });
  if (!types.includes('animated_gradient_hero') && !types.includes('globe_hero') && !types.includes('product_mockup_hero') && !types.includes('symbol_hero') && !types.includes('hero')) suggestions.push({ label: 'Add Hero Section', prompt: 'Add a sophisticated hero section with animated gradient or globe effect' });
  if (!types.includes('bento_grid') && !types.includes('features')) suggestions.push({ label: 'Add Features Grid', prompt: 'Add a bento grid showcasing key benefits with asymmetric layout' });
  if (!types.includes('pricing_table') && !types.includes('pricing')) suggestions.push({ label: 'Add Pricing Plans', prompt: 'Add a premium pricing table with billing toggle' });
  if (!types.includes('testimonial_carousel') && !types.includes('testimonials')) suggestions.push({ label: 'Add Testimonials', prompt: 'Add a testimonial carousel with smooth animations' });
  if (!types.includes('big_logotype_footer') && !types.includes('newsletter_footer') && !types.includes('footer')) suggestions.push({ label: 'Add Footer', prompt: 'Add a premium footer with big logotype or newsletter signup' });
  if (!types.includes('scroll_linked_theme_transition') && !types.includes('transition_dark_light')) suggestions.push({ label: 'Add Theme Transition', prompt: 'Add a scroll-linked dark to white theme transition' });
  if (!types.includes('scroll_triggered_counters')) suggestions.push({ label: 'Add Animated Stats', prompt: 'Add scroll-triggered counters for impressive statistics' });
  return suggestions.slice(0, 3);
}

// ── MAIN AI GENERATE FUNCTION ────────────────────────────────────────────────
export async function generateComponents(prompt, existingComps = [], onStepUpdate) {
  try {
    const { sections } = await orchestratorRun(prompt, existingComps, onStepUpdate);
    return sections;
  } catch (err) {
    console.error('[generateComponents] Orchestrator threw unexpectedly:', err.message);
    // Last-resort fallback — never leave caller with an error
    return generateFromTemplate(prompt, existingComps, 'add_section', {});
  }
}

// ── TEMPLATE FALLBACK ENGINE ─────────────────────────────────────────────────
function generateFromTemplate(prompt, existingComps, requestType, intentContext) {
  const p = prompt.toLowerCase();
  const ts = Date.now();
  const existingTypes = (existingComps || []).map(c => c.type);
  const brandFromContext    = intentContext?.brandHint || '';
  const industryFromContext = intentContext?.industryHint || '';
  const targetSectionType   = intentContext?.targetSectionType || null;

  // ── Scope enforcement: single-section for incremental add requests ──────────
  if (requestType === 'add_section' || requestType === 'add_component') {
    const wantedType =
      targetSectionType ||
      (/navbar|navigation|header/i.test(p)   ? 'navbar'       :
       /sticky.*nav/i.test(p)                 ? 'sticky_blurred_nav' :
       /mega.*menu/i.test(p)                  ? 'mega_menu' :
       /mobile.*menu/i.test(p)                ? 'mobile_full_screen_drawer' :
       /hero|banner|headline/i.test(p)        ? 'symbol_hero'   :
       /video.*hero/i.test(p)                 ? 'video_background_hero' :
       /image.*hero|parallax.*hero/i.test(p)  ? 'image_background_hero' :
       /gradient.*hero|mesh.*hero/i.test(p)   ? 'animated_gradient_hero' :
       /globe.*hero/i.test(p)                 ? 'globe_hero' :
       /product.*mockup|mockup.*hero/i.test(p) ? 'product_mockup_hero' :
       /split.*screen.*hero/i.test(p)         ? 'split_screen_hero' :
       /feature|benefit|grid/i.test(p)        ? 'features'     :
       /bento/i.test(p)                       ? 'bento_grid'   :
       /logo.*marquee|logo.*strip/i.test(p)   ? 'logo_marquee' :
       /testimonial|review|quote/i.test(p)    ? 'testimonials' :
       /case.*study|portfolio/i.test(p)      ? 'case_study_grid' :
       /pric/i.test(p)                         ? 'pricing'      :
       /pricing.*table/i.test(p)              ? 'pricing_table' :
       /faq|question|answer/i.test(p)          ? 'faq'          :
       /team|member|staff/i.test(p)            ? 'team'         :
       /footer/i.test(p)                       ? 'footer'       :
       /big.*logotype/i.test(p)               ? 'big_logotype_footer' :
       /newsletter.*footer/i.test(p)          ? 'newsletter_footer' :
       /stat|number|metric/i.test(p)           ? 'stats'        :
       /cta|call.to.action|convert/i.test(p)  ? 'cta_banner'   :
       /scroll.*fill|device.*mockup/i.test(p) ? 'scroll_fill_device_mockup' :
       /horizontal.*scroll|scroll.*gallery/i.test(p) ? 'horizontal_scroll_gallery' :
       /theme.*transition|scroll.*linked/i.test(p) ? 'scroll_linked_theme_transition' :
       /pinned.*section|sticky.*section/i.test(p) ? 'pinned_sticky_section' :
       /parallax.*layered|parallax.*images/i.test(p) ? 'parallax_layered_images' :
       /split.*text|text.*reveal/i.test(p)     ? 'split_text_scroll_reveal' :
       /scroll.*counter|counter/i.test(p)      ? 'scroll_triggered_counters' :
       /interactive.*globe|standalone.*globe/i.test(p) ? 'standalone_interactive_globe' :
       /3d.*viewer/i.test(p)                  ? '3d_object_viewer' :
       /particle.*background/i.test(p)        ? 'ambient_particle_background' :
       /cursor.*spotlight|spotlight/i.test(p)  ? 'cursor_spotlight' :
       /magnetic.*button/i.test(p)             ? 'magnetic_button' :
       /mouse.*tilt|tilt.*card/i.test(p)      ? 'mouse_tilt_card' :
       /custom.*cursor/i.test(p)               ? 'custom_cursor' :
       /multi.*step|step.*form/i.test(p)       ? 'multi_step_form' :
       /floating.*label/i.test(p)              ? 'floating_label_inputs' :
       /inline.*signup|newsletter.*signup/i.test(p) ? 'inline_newsletter_signup' :
       /lightbox|gallery/i.test(p)             ? 'image_lightbox' :
       /before.*after|comparison/i.test(p)     ? 'before_after_slider' :
       /autoplay.*video|video.*card/i.test(p)  ? 'autoplay_card_video' :
       /transition|black to white|dark to light/i.test(p) ? 'transition_dark_light' :
       /white to black|light to dark/i.test(p) ? 'transition_light_dark' :
       /parallax/i.test(p)                     ? 'motion_parallax' :
       /reveal|fade.?up|scroll anim/i.test(p)  ? 'motion_reveal' : null);
    if (wantedType) {
      const motionTypes = ['transition_dark_light', 'transition_light_dark', 'motion_reveal', 'motion_parallax', 'scroll_linked_theme_transition', 'parallax_layered_images', 'split_text_scroll_reveal'];
      const preset = motionTypes.includes(wantedType) ? createMotionPreset(wantedType) : createSectionPreset(wantedType);
      if (brandFromContext && preset.content && (preset.type === 'navbar' || preset.type === 'footer' || preset.type === 'sticky_blurred_nav' || preset.type === 'mega_menu' || preset.type === 'mobile_full_screen_drawer')) {
        preset.content.brand = brandFromContext;
      }
      return [...existingComps, preset];
    }
  }

  // ── edit_section / edit_component: patch targeted section ──────────────────
  if ((requestType === 'edit_section' || requestType === 'edit_component') && targetSectionType && existingComps.length > 0) {
    const idx = existingComps.findIndex(c => c.type === targetSectionType);
    if (idx !== -1) {
      const fresh = createSectionPreset(targetSectionType);
      if (brandFromContext && fresh.content) fresh.content.brand = brandFromContext;
      const updated = [...existingComps];
      updated[idx] = { ...updated[idx], content: fresh.content };
      return updated;
    }
  }

  // ── Full build / redesign ──────────────────────────────────────────────────
  const isRestaurant = industryFromContext === 'restaurant' || /food|restaurant|cafe|baking|dining|bistro|menu/.test(p);
  const isFitness    = industryFromContext === 'fitness'    || /gym|fitness|workout|health|trainer|sport|yoga/.test(p);
  const isEcommerce  = industryFromContext === 'ecommerce'  || /store|shop|product|e-commerce|fashion|apparel|ecommerce/.test(p);
  const isAgency     = industryFromContext === 'agency'     || /agency|studio|creative|design partner|branding|marketing/.test(p);
  const isCrypto     = industryFromContext === 'crypto'     || /crypto|web3|blockchain|nft|token|defi/.test(p);
  const isRealEstate = industryFromContext === 'realestate' || /real estate|property|house|villa|apartment|homes/.test(p);
  const isPortfolio  = industryFromContext === 'portfolio'  || /portfolio|developer|resume|personal|freelance/.test(p);

  let primaryBtnBg = '#a855f7', brandName = brandFromContext || 'AuraStudio';
  let topicTitle = 'Design High-End Frontends Locally';
  let topicDesc = 'Build responsive, pixel-perfect frontend layouts with dynamic layout controls.';
  let navLinks = ['Features', 'Solutions', 'Pricing', 'About'];
  let ctaLabel = 'Get Started Free';
  let features = [
    { title: 'Lightning Fast', desc: 'Optimized 60fps rendering performance across all devices.' },
    { title: 'Responsive Design', desc: 'Flawless layouts across desktop, tablet, and mobile.' },
    { title: 'Production Code', desc: 'Clean, semantic export ready to deploy instantly.' },
    { title: 'AI-Powered', desc: 'Describe what you want, AI builds it for you.' }
  ];

  if (isRestaurant) {
    primaryBtnBg = '#c84b31'; if (!brandFromContext) brandName = 'Gourmet Bistro';
    topicTitle = 'Artisanal Dining & Culinary Experiences'; topicDesc = 'Savor handcrafted dishes made with farm-to-table organic ingredients.';
    navLinks = ['Menu', 'About', 'Reservation', 'Location']; ctaLabel = 'Book a Table';
    features = [{ title: 'Farm-to-Table', desc: 'Sourced daily from local organic farms.' }, { title: 'Master Chefs', desc: 'Award-winning culinary directors.' }, { title: 'Private Dining', desc: 'Exclusive spaces for celebrations.' }, { title: 'Online Booking', desc: 'Reserve your table in seconds.' }];
  } else if (isFitness) {
    primaryBtnBg = '#22c55e'; if (!brandFromContext) brandName = 'Apex Performance';
    topicTitle = 'Transform Your Body & Mind Today'; topicDesc = 'Personalized training programs with expert coaching.';
    navLinks = ['Programs', 'Trainers', 'Pricing', 'Community']; ctaLabel = 'Start Free Trial';
    features = [{ title: 'Expert Trainers', desc: 'Certified coaches for every fitness level.' }, { title: 'Custom Programs', desc: 'Personalized plans built around your goals.' }, { title: 'Live Classes', desc: '200+ live & on-demand sessions weekly.' }, { title: 'Progress Tracking', desc: 'Visual dashboards for your fitness journey.' }];
  } else if (isEcommerce) {
    primaryBtnBg = '#0ea5e9'; if (!brandFromContext) brandName = 'Curated Goods';
    topicTitle = 'Timeless Products Curated For Modern Living'; topicDesc = 'Discover premium design-led products.';
    navLinks = ['Shop', 'Collections', 'About', 'FAQ']; ctaLabel = 'Shop Now';
    features = [{ title: 'Curated Selection', desc: 'Only the best design-led products.' }, { title: 'Free Shipping', desc: 'On all orders over $100 worldwide.' }, { title: 'Easy Returns', desc: '30-day hassle-free return policy.' }, { title: 'Secure Checkout', desc: 'Bank-level encryption on all orders.' }];
  } else if (isAgency) {
    primaryBtnBg = '#ff5500'; if (!brandFromContext) brandName = 'Nitro Creative';
    topicTitle = 'A Design Partner Focused On Crisp Experiences'; topicDesc = 'We craft high-converting brand identities and digital products.';
    navLinks = ['Work', 'Services', 'About', 'Contact']; ctaLabel = 'Start a Project';
    features = [{ title: 'Brand Identity', desc: 'Logos, systems, and full brand guidelines.' }, { title: 'Web Design', desc: 'High-converting websites and landing pages.' }, { title: 'Motion & 3D', desc: 'Cinematic brand films and 3D visuals.' }, { title: 'Strategy', desc: 'Research-backed positioning and messaging.' }];
  } else if (isCrypto) {
    primaryBtnBg = '#a855f7'; if (!brandFromContext) brandName = 'Nexus Web3';
    topicTitle = 'Decentralized Intelligence & Token Infrastructure'; topicDesc = 'Secure, scalable Web3 protocols.';
    navLinks = ['Protocol', 'Ecosystem', 'Docs', 'Governance']; ctaLabel = 'Launch App';
    features = [{ title: 'Zero-Knowledge Proofs', desc: 'Privacy-first protocol architecture.' }, { title: 'Cross-Chain Bridge', desc: 'Seamless multi-chain asset transfers.' }, { title: 'DAO Governance', desc: 'Community-driven protocol decisions.' }, { title: 'Audited Contracts', desc: 'Security-first smart contract design.' }];
  } else if (isRealEstate) {
    primaryBtnBg = '#1a3a5c'; if (!brandFromContext) brandName = 'Revalis Homes';
    topicTitle = 'Prime Architectural Residences'; topicDesc = 'Curated luxury properties in prime locations.';
    navLinks = ['Listings', 'Services', 'About', 'Contact']; ctaLabel = 'View Listings';
    features = [{ title: 'Prime Locations', desc: 'Handpicked properties in top neighborhoods.' }, { title: 'Virtual Tours', desc: 'Immersive 3D property walk-throughs.' }, { title: 'Expert Agents', desc: 'Dedicated advisors for every purchase.' }, { title: 'Instant Valuation', desc: 'AI-powered property value estimates.' }];
  } else if (isPortfolio) {
    primaryBtnBg = '#9333ea'; if (!brandFromContext) brandName = 'Alex Morgan';
    topicTitle = 'Senior Product Designer & Frontend Architect'; topicDesc = 'Crafting clean, accessible web applications and modern design systems.';
    navLinks = ['Work', 'About', 'Writing', 'Contact']; ctaLabel = 'View My Work';
    features = [{ title: 'Product Design', desc: 'End-to-end UX for SaaS products.' }, { title: 'Frontend Dev', desc: 'React, TypeScript, and modern CSS.' }, { title: 'Design Systems', desc: 'Scalable component libraries.' }, { title: 'Consulting', desc: 'Strategy for design teams.' }];
  }

  // Extract a clean topic name from the prompt for headlines
  const cleanTopic = prompt
    .replace(/\b(create|build|generate|make|add|design|a|an|the|for|me|please|with|and|or|landing page|website|page|site|frontend|ui|interface|layout)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const topicHeadline = cleanTopic.length > 4
    ? cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1)
    : topicTitle;

  const allSections = [
    !existingTypes.includes('navbar') && { id: `nav_${ts}`, type: 'navbar', name: 'Header Navbar',
      content: { brand: brandName, links: navLinks, cta: ctaLabel },
      styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: primaryBtnBg } },

    !existingTypes.includes('symbol_hero') && { id: `hero_${ts+1}`, type: 'symbol_hero', name: 'Hero Section',
      content: {
        announcement: isRestaurant ? '● Reservations Now Open Online' : isEcommerce ? '● Free Shipping on All Orders Over $100' : isAgency ? '● Now Accepting New Clients for Q3 2026' : '● Trusted by 50,000+ users worldwide',
        headline: topicHeadline,
        subhead: topicDesc,
        primaryBtn: ctaLabel + ' →',
        secondaryBtn: isPortfolio ? 'See My Work' : isAgency ? 'View Our Work' : 'Learn More',
        stats: [
          { value: isRestaurant ? '4.9★' : isEcommerce ? '50K+' : isFitness ? '12K+' : isPortfolio ? '8+yrs' : '99.9%', label: isRestaurant ? 'Customer Rating' : isEcommerce ? 'Happy Customers' : isFitness ? 'Active Members' : isPortfolio ? 'Experience' : 'Uptime SLA' },
          { value: isRestaurant ? '100%' : isEcommerce ? '24h' : isFitness ? '98%' : isPortfolio ? '120+' : '350K+', label: isRestaurant ? 'Organic Ingredients' : isEcommerce ? 'Express Dispatch' : isFitness ? 'Satisfaction Rate' : isPortfolio ? 'Projects Shipped' : 'Active Users' }
        ]
      },
      styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: primaryBtnBg } },

    !existingTypes.includes('features') && { id: `features_${ts+2}`, type: 'features', name: 'Features Grid',
      content: {
        title: isRestaurant ? 'Why Guests Love Us' : isEcommerce ? 'Crafted Without Compromise' : isFitness ? 'Why Choose Apex' : isAgency ? 'What We Do Best' : isCrypto ? 'Protocol Advantages' : isRealEstate ? 'Our Services' : isPortfolio ? 'My Skills' : 'Why Teams Choose Us',
        subtitle: 'Designed to deliver an exceptional experience from first click to final result',
        items: features
      },
      styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: primaryBtnBg } },

    { id: `stats_${ts+3}`, type: 'stats', name: 'Key Stats',
      content: {
        title: '',
        items: isRestaurant
          ? [{ value: '4.9★', label: 'Average Review', desc: 'Across all platforms' }, { value: '8yrs', label: 'In Business', desc: 'Established 2018' }, { value: '50K+', label: 'Guests Served', desc: 'And counting' }, { value: '100%', label: 'Fresh Daily', desc: 'Farm-to-table' }]
          : isEcommerce
          ? [{ value: '50K+', label: 'Customers', desc: 'Worldwide' }, { value: '4.8★', label: 'Rating', desc: '2,000+ reviews' }, { value: '24h', label: 'Dispatch', desc: 'Express delivery' }, { value: '30d', label: 'Returns', desc: 'Hassle-free' }]
          : [{ value: '350K+', label: 'Users', desc: 'Active this month' }, { value: '99.9%', label: 'Uptime', desc: 'Guaranteed SLA' }, { value: '4.9★', label: 'Rating', desc: 'App Store & Play' }, { value: '<50ms', label: 'Response', desc: 'Global CDN' }]
      },
      styles: { bgColor: '#09090b', textColor: '#ffffff' } },

    { id: `pricing_${ts+4}`, type: 'pricing', name: 'Pricing Plans',
      content: {
        title: isRestaurant ? 'Tasting Menus' : 'Simple, Transparent Pricing',
        subtitle: 'No hidden fees. Upgrade or cancel anytime.',
        plans: [
          { name: isRestaurant ? 'Lunch Menu' : 'Starter', price: isRestaurant ? '$45' : '$29', period: isRestaurant ? '/person' : '/month', features: isRestaurant ? ['2-course meal', 'Non-alcoholic drinks', 'Standard seating'] : ['Core features', 'Up to 3 projects', 'Email support'], btnText: 'Get Started', isPopular: false },
          { name: isRestaurant ? 'Dinner Experience' : 'Pro', price: isRestaurant ? '$95' : '$99', period: isRestaurant ? '/person' : '/month', features: isRestaurant ? ['5-course tasting menu', 'Wine pairing', 'Priority seating', 'Chef greeting'] : ['Everything in Starter', 'Unlimited projects', 'Priority support', 'Advanced analytics'], btnText: isRestaurant ? 'Book Experience' : 'Start Pro Trial', isPopular: true },
          { name: isRestaurant ? 'Private Event' : 'Enterprise', price: isRestaurant ? '$150' : '$299', period: isRestaurant ? '/person' : '/month', features: isRestaurant ? ['Private room', 'Custom menu', 'Dedicated sommelier', 'Event photography'] : ['Everything in Pro', 'Dedicated manager', 'Custom SLA', 'White-label option'], btnText: isRestaurant ? 'Inquire' : 'Contact Sales', isPopular: false }
        ]
      },
      styles: { bgColor: '#ffffff', textColor: '#09090b' } },

    { id: `testimonials_${ts+5}`, type: 'testimonials', name: 'Testimonials',
      content: {
        title: 'What Our Customers Say',
        subtitle: 'Trusted by thousands of satisfied users',
        quotes: [
          { name: 'Sarah Chen', role: isRestaurant ? 'Food Critic, The Times' : isEcommerce ? 'Regular Customer' : isFitness ? 'Member since 2024' : 'CEO at TechCorp', text: isRestaurant ? 'An absolutely unforgettable dining experience. The attention to detail in every dish is extraordinary.' : isEcommerce ? 'Quality is exceptional. Every product is exactly as described, and shipping was lightning fast.' : isFitness ? 'Lost 20 pounds in 3 months. The trainers are incredibly knowledgeable and motivating.' : 'This transformed how our team works. The results speak for themselves.' },
          { name: 'Marcus Johnson', role: isPortfolio ? 'Design Director at Adobe' : 'Product Manager', text: isPortfolio ? 'One of the most talented designers I\'ve worked with. Delivers pixel-perfect work on time, every time.' : 'Exceptional service and product. Highly recommend to anyone looking for quality and reliability.' },
          { name: 'Priya Patel', role: isRestaurant ? 'Event Organizer' : 'Startup Founder', text: isRestaurant ? 'Hosted our company dinner here. The staff went above and beyond to make it special.' : 'Exactly what we needed. Saves us hours every week and the support team is incredibly responsive.' }
        ]
      },
      styles: { bgColor: '#fafafa', textColor: '#09090b' } },

    { id: `cta_${ts+6}`, type: 'cta_banner', name: 'CTA Banner',
      content: {
        headline: isRestaurant ? 'Reserve Your Table Tonight' : isEcommerce ? 'Shop Our Latest Collection' : isFitness ? 'Start Your Free Trial Today' : isPortfolio ? 'Let\'s Work Together' : isAgency ? 'Ready to Start a Project?' : 'Ready to Get Started?',
        subhead: isRestaurant ? 'Limited tables available. Book now to secure your spot.' : isPortfolio ? 'I\'m currently accepting new projects. Let\'s build something great together.' : 'Join thousands of satisfied customers. No credit card required.',
        primaryBtn: ctaLabel,
        secondaryBtn: isPortfolio ? 'Download CV' : 'Learn More'
      },
      styles: { bgColor: '#09090b', textColor: '#ffffff' } },

    { id: `footer_${ts+7}`, type: 'footer', name: 'Footer',
      content: { brand: brandName, tagline: `${brandName} — ${topicDesc.split('.')[0]}.`, copyright: `© 2026 ${brandName}. All rights reserved.` },
      styles: { bgColor: '#09090b', textColor: '#ffffff' } }
  ];

  // If canvas already has sections, append only new ones; otherwise return full page
  const newSections = allSections.filter(Boolean);
  if (requestType === 'redesign') return newSections;
  if (existingTypes.length > 0) return [...existingComps, ...newSections];
  return newSections;
}

