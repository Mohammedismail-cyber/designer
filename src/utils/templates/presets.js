// Premium page templates — inspired by boutique agency references (Glass, Heila, ARIA, Goldsand, Handheld)

const ts = () => Date.now();

export function buildGlassDark() {
  const t = ts();
  return [
    { id: `nav_${t}`, type: 'sticky_blurred_nav', name: 'Glass Nav', content: { brand: 'Glass', links: ['Features', 'Community', 'Download', 'Pricing'], cta: 'Join Waitlist' }, styles: { bgColor: 'rgba(9,9,11,0.8)', textColor: '#fafafa', accentColor: '#3b82f6' } },
    { id: `hero_${t+1}`, type: 'animated_gradient_hero', name: 'Glass Hero', content: { title: 'Desktop apps, reimagined by you.', subtitle: 'Generate, code, and publish desktop apps — beautifully designed in minutes.', ctaText: 'Join Waitlist', gradientColors: ['#3b82f6', '#8b5cf6', '#ec4899'] }, styles: { bgColor: '#09090b', textColor: '#fafafa', accentColor: '#3b82f6' } },
    { id: `feat_${t+2}`, type: 'bento_grid', name: 'Glass Features', content: { items: [{ content: 'Design first. Start with a beautiful design system tuned to your brand.', span: 'md:col-span-2' }, { content: 'Code next. Production-ready React exported with one click.', span: '' }, { content: 'Ship faster. Deploy to Mac, Windows, and Linux in seconds.', span: 'md:col-span-2' }] }, styles: { bgColor: '#0c0c0e', textColor: '#fafafa', accentColor: '#3b82f6' } },
    { id: `trans_${t+3}`, type: 'scroll_linked_theme_transition', name: 'Dark → Light', content: { fromColor: '#09090b', toColor: '#fafafa' }, styles: { bgColor: '#09090b', textColor: '#fafafa' } },
    { id: `faq_${t+4}`, type: 'faq', name: 'FAQ', content: { title: 'FAQ', items: [{ question: 'Do I need to know how to code?', answer: 'No. Describe your app in plain language — Glass handles design and code generation.' }, { question: 'How is Glass different from other builders?', answer: 'Glass focuses on native desktop apps with glassmorphic UI and production React export.' }] }, styles: { bgColor: '#fafafa', textColor: '#09090b' } },
    { id: `cta_${t+5}`, type: 'cta_banner', name: 'Final CTA', content: { headline: 'What will you build?', subhead: 'Join the waitlist and be first to access the beta.', primaryBtn: 'Join Waitlist', secondaryBtn: 'See examples' }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#3b82f6' } },
    { id: `foot_${t+6}`, type: 'big_logotype_footer', name: 'Footer', content: { logo: 'Glass', sitemap: [{ title: 'Product', links: ['Features', 'Download', 'Pricing'] }, { title: 'Company', links: ['About', 'Blog', 'Careers'] }], contactInfo: ['hello@glass.app'], socialLinks: [] }, styles: { bgColor: '#09090b', textColor: '#fafafa', accentColor: '#3b82f6' } },
  ];
}

export function buildHeilaHealth() {
  const t = ts();
  return [
    { id: `nav_${t}`, type: 'sticky_blurred_nav', name: 'Heila Nav', content: { brand: 'Heila', links: ['Care', 'Clinicians', 'About'], cta: 'Sign in' }, styles: { bgColor: 'rgba(255,255,255,0.9)', textColor: '#09090b', accentColor: '#0d9488' } },
    { id: `hero_${t+1}`, type: 'image_background_hero', name: 'Heila Hero', content: { imageSrc: '', title: 'How are you feeling?', subtitle: 'Run a check, find care. AI-guided intake connects you to real clinicians in minutes.', ctaText: 'Check-in with Heila' }, styles: { bgColor: '#f5f5f4', textColor: '#09090b', accentColor: '#0d9488' } },
    { id: `feat_${t+2}`, type: 'bento_grid', name: 'Care Steps', content: { items: [{ content: '1 — Check-in with Heila. AI-guided intake that understands symptoms in context.', span: 'md:col-span-2' }, { content: '2 — Talk to a clinician. Licensed providers review your case within hours.', span: '' }, { content: '3 — Get treatment. Prescriptions, referrals, and follow-up — all in one place.', span: 'md:col-span-2' }] }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#0d9488' } },
    { id: `stats_${t+3}`, type: 'scroll_triggered_counters', name: 'Outcomes', content: { stats: [{ value: 97, suffix: '%', prefix: '', label: 'Patient satisfaction' }, { value: 2, suffix: 'hr', prefix: '<', label: 'Avg. response' }, { value: 50, suffix: '+', prefix: '', label: 'Specialties' }] }, styles: { bgColor: '#18181b', textColor: '#fafafa', accentColor: '#0d9488' } },
    { id: `test_${t+4}`, type: 'testimonial_carousel', name: 'Stories', content: { title: 'Guided by doctors', subtitle: 'Real outcomes from real patients', testimonials: [{ name: 'Dr. Elena Ruiz', role: 'Internal Medicine', text: 'Heila surfaces the right context before I ever open the chart. It saves me 15 minutes per visit.' }, { name: 'James K.', role: 'Patient', text: 'I went from symptom search to prescription in under four hours. That never happened with my old provider.' }] }, styles: { bgColor: '#fafafa', textColor: '#09090b' } },
    { id: `foot_${t+5}`, type: 'newsletter_footer', name: 'Footer', content: { logo: 'Heila', sitemap: [{ title: 'Care', links: ['Check-in', 'Clinicians', 'About'] }], socialLinks: [] }, styles: { bgColor: '#f5f5f4', textColor: '#09090b', accentColor: '#0d9488' } },
  ];
}

export function buildAriaTech() {
  const t = ts();
  return [
    { id: `nav_${t}`, type: 'sticky_blurred_nav', name: 'ARIA Nav', content: { brand: 'ARIA', links: ['Product', 'Company', 'Ecosystem', 'Blog'], cta: 'Get started' }, styles: { bgColor: 'rgba(9,9,11,0.9)', textColor: '#fafafa', accentColor: '#dc2626' } },
    { id: `hero_${t+1}`, type: 'globe_hero', name: 'ARIA Hero', content: { title: 'Networks that think.', subtitle: 'Intelligence at every layer — from switch to agent. Abstract complexity into actionable signal.', ctaText: 'Explore the network', darkMode: true }, styles: { bgColor: '#09090b', textColor: '#fafafa', accentColor: '#dc2626' } },
    { id: `feat_${t+2}`, type: 'bento_grid', name: 'Layers', content: { items: [{ content: 'Analyze internally. Deep packet inspection without leaving your infrastructure.', span: 'md:col-span-2' }, { content: 'First-class agents. LLM-native routing that understands intent, not just IP.', span: '' }, { content: 'Abstract intelligence. Complex topology rendered as simple, actionable dashboards.', span: 'md:col-span-2' }] }, styles: { bgColor: '#0c0c0e', textColor: '#fafafa', accentColor: '#dc2626' } },
    { id: `trans_${t+3}`, type: 'scroll_linked_theme_transition', name: 'Dark → Light', content: { fromColor: '#09090b', toColor: '#fafafa' }, styles: { bgColor: '#09090b', textColor: '#fafafa' } },
    { id: `stats_${t+4}`, type: 'scroll_triggered_counters', name: 'ROI', content: { stats: [{ value: 10000, suffix: '×', prefix: '', label: 'Efficiency gain' }, { value: 70, suffix: '%', prefix: '-', label: 'Token waste' }, { value: 2.3, suffix: '%', prefix: '+', label: 'Uptime improvement' }] }, styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: '#dc2626' } },
    { id: `cta_${t+5}`, type: 'cta_banner', name: 'Contact', content: { headline: 'Get in touch →', subhead: 'See how ARIA transforms your network economics.', primaryBtn: 'Book a demo', secondaryBtn: 'View docs' }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#dc2626' } },
    { id: `foot_${t+6}`, type: 'big_logotype_footer', name: 'Footer', content: { logo: 'ARIA', sitemap: [{ title: 'Product', links: ['Network', 'Agents', 'Security'] }, { title: 'Company', links: ['About', 'Careers', 'Contact'] }], contactInfo: [], socialLinks: [] }, styles: { bgColor: '#e7e5e4', textColor: '#09090b', accentColor: '#dc2626' } },
  ];
}

export function buildGoldsandFinance() {
  const t = ts();
  return [
    { id: `nav_${t}`, type: 'sticky_blurred_nav', name: 'Goldsand Nav', content: { brand: 'Goldsand', links: ['Product', 'Ethics', 'FAQ'], cta: 'Get started' }, styles: { bgColor: 'rgba(255,255,255,0.95)', textColor: '#09090b', accentColor: '#ca8a04' } },
    { id: `hero_${t+1}`, type: 'split_screen_hero', name: 'Goldsand Hero', content: { title: 'Earn up to 7.0% on your cash reserves.', subtitle: 'Values-aligned savings. Your deposits never fund weapons or fossil fuels.', ctaText: 'Get started', visualPosition: 'right' }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#16a34a' } },
    { id: `feat_${t+2}`, type: 'bento_grid', name: 'Why Goldsand', content: { items: [{ content: 'No hidden fees. What you see is what you earn. Period.', span: '' }, { content: 'Values screening. Every investment vetted against your ethical criteria.', span: 'md:col-span-2' }, { content: 'Global access. Save and earn from anywhere, in any currency.', span: '' }, { content: 'Real humans. Support from people who understand finance — not bots.', span: 'md:col-span-2' }] }, styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: '#ca8a04' } },
    { id: `pricing_${t+3}`, type: 'pricing_table', name: 'Plans', content: { plans: [{ name: 'Personal', description: 'For individuals', monthlyPrice: 0, yearlyPrice: 0, features: ['Up to $10K deposits', 'Standard yield', 'Mobile app'], popular: false }, { name: 'Plus', description: 'Best for savers', monthlyPrice: 9, yearlyPrice: 108, features: ['Unlimited deposits', '7.0% yield tier', 'Priority support', 'Ethics dashboard'], popular: true }, { name: 'Business', description: 'For teams', monthlyPrice: 0, yearlyPrice: 0, features: ['Treasury management', 'Multi-user access', 'Dedicated advisor'], popular: false }] }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#16a34a' } },
    { id: `foot_${t+4}`, type: 'newsletter_footer', name: 'Footer', content: { logo: 'Goldsand', sitemap: [{ title: 'Product', links: ['Savings', 'Ethics', 'FAQ'] }, { title: 'Company', links: ['About', 'Careers', 'Contact'] }], socialLinks: [] }, styles: { bgColor: '#09090b', textColor: '#fafafa', accentColor: '#ca8a04' } },
  ];
}

export function buildHandheldSaaS() {
  const t = ts();
  return [
    { id: `nav_${t}`, type: 'sticky_blurred_nav', name: 'Handheld Nav', content: { brand: 'Handheld', links: ['Product', 'Customers', 'Pricing'], cta: 'Get started' }, styles: { bgColor: 'rgba(255,255,255,0.95)', textColor: '#09090b', accentColor: '#09090b' } },
    { id: `hero_${t+1}`, type: 'product_mockup_hero', name: 'Handheld Hero', content: { title: 'A dedicated guide for every buyer.', subtitle: 'Help leads self-serve with AI chat tailored to your product — 24/7, multilingual, on-brand.', ctaText: 'Get started', mockupImage: '' }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#09090b' } },
    { id: `motion_${t+2}`, type: 'split_text_scroll_reveal', name: 'Scroll Reveal', content: { text: 'See Handheld in action' }, styles: { bgColor: '#fafafa', textColor: '#09090b' } },
    { id: `feat_${t+3}`, type: 'bento_grid', name: 'Capabilities', content: { items: [{ content: 'AI chat that converts. Buyers get answers instantly — without waiting for sales.', span: 'md:col-span-2' }, { content: 'Multilingual by default. Serve global prospects in their language from day one.', span: '' }, { content: 'Tailored to your program. Train on your docs, pricing, and positioning.', span: 'md:col-span-2' }] }, styles: { bgColor: '#ffffff', textColor: '#09090b' } },
    { id: `test_${t+4}`, type: 'testimonial_carousel', name: 'Proof', content: { title: 'Trusted by category leaders', subtitle: '', testimonials: [{ name: 'Maya Ortiz', role: 'Marketing Manager, Revolut', text: 'Handheld handles 60% of inbound questions before a human ever gets involved. Our team focuses on closing, not explaining.' }] }, styles: { bgColor: '#fafafa', textColor: '#09090b' } },
    { id: `foot_${t+5}`, type: 'big_logotype_footer', name: 'Footer', content: { logo: 'Handheld', sitemap: [{ title: 'Product', links: ['Features', 'Pricing', 'Docs'] }, { title: 'Company', links: ['About', 'Blog', 'Careers'] }], contactInfo: [], socialLinks: [] }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#09090b' } },
  ];
}

export function buildApexDarkSaaS() {
  const t = ts();
  return [
    { id: `nav_${t}`, type: 'sticky_blurred_nav', name: 'Apex Nav', content: { brand: 'Apex', links: ['Platform', 'Integrations', 'Pricing', 'Docs'], cta: 'Start for free' }, styles: { bgColor: 'rgba(9,9,11,0.9)', textColor: '#fafafa', accentColor: '#a855f7' } },
    { id: `hero_${t+1}`, type: 'video_background_hero', name: 'Apex Hero', content: { title: 'The framework to build your own agentic builder.', subtitle: 'One platform for your whole knowledge base — connect Slack, Salesforce, HubSpot, and ship agents in days.', ctaText: 'Start building', videoSrc: '' }, styles: { bgColor: '#09090b', textColor: '#fafafa', accentColor: '#84cc16' } },
    { id: `feat_${t+2}`, type: 'bento_grid', name: 'Platform', content: { items: [{ content: 'Slack & Teams. Deploy agents where your team already works.', span: '' }, { content: 'Salesforce & HubSpot. CRM-aware responses with full context.', span: 'md:col-span-2' }, { content: 'Custom knowledge. Ingest docs, wikis, and databases in minutes.', span: '' }, { content: 'Enterprise security. SOC2, SSO, and audit logs out of the box.', span: 'md:col-span-2' }] }, styles: { bgColor: '#0c0c0e', textColor: '#fafafa', accentColor: '#84cc16' } },
    { id: `trans_${t+3}`, type: 'scroll_linked_theme_transition', name: 'Theme shift', content: { fromColor: '#09090b', toColor: '#fafafa' }, styles: { bgColor: '#09090b', textColor: '#fafafa' } },
    { id: `pricing_${t+4}`, type: 'pricing_table', name: 'Pricing', content: { plans: [{ name: 'Starter', description: 'For individuals', monthlyPrice: 0, yearlyPrice: 0, features: ['1 agent', '5K queries/mo', 'Community support'], popular: false }, { name: 'Pro', description: 'For teams', monthlyPrice: 99, yearlyPrice: 1188, features: ['Unlimited agents', '100K queries/mo', 'Priority support', 'Analytics'], popular: true }, { name: 'Enterprise', description: 'For organizations', monthlyPrice: 0, yearlyPrice: 0, features: ['Dedicated infra', 'Custom SLA', 'SSO / SAML'], popular: false }] }, styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: '#a855f7' } },
    { id: `foot_${t+5}`, type: 'big_logotype_footer', name: 'Footer', content: { logo: 'Apex', sitemap: [{ title: 'Platform', links: ['Integrations', 'Pricing', 'Docs'] }, { title: 'Company', links: ['About', 'Blog', 'Careers'] }], contactInfo: [], socialLinks: [] }, styles: { bgColor: '#09090b', textColor: '#fafafa', accentColor: '#84cc16' } },
  ];
}

export function buildMinimalPortfolio() {
  const t = ts();
  return [
    { id: `nav_${t}`, type: 'navbar', name: 'Portfolio Nav', content: { brand: 'Alex Morgan', links: ['Work', 'About', 'Writing', 'Contact'], cta: 'Hire me' }, styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: '#09090b' } },
    { id: `hero_${t+1}`, type: 'symbol_hero', name: 'Portfolio Hero', content: { announcement: '● Available for Q3 2026', headline: 'Senior product designer crafting interfaces people remember.', subhead: '8 years shipping design systems, SaaS products, and brand identities for teams at Stripe, Linear, and independent studios.', primaryBtn: 'View selected work →', secondaryBtn: 'Download CV', stats: [{ value: '120+', label: 'Projects' }, { value: '8yrs', label: 'Experience' }] }, styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: '#9333ea' } },
    { id: `feat_${t+2}`, type: 'features', name: 'Selected Work', content: { title: 'Case studies', subtitle: 'Recent projects across product, brand, and systems', items: [{ title: 'Linear — Design system', desc: 'Component library and documentation for a team of 40.' }, { title: 'Stripe — Dashboard redesign', desc: 'Information architecture for complex financial data.' }, { title: 'Independent — AuraStudio', desc: 'AI-powered design tool from concept to launch.' }] }, styles: { bgColor: '#ffffff', textColor: '#09090b' } },
    { id: `test_${t+3}`, type: 'testimonials', name: 'References', content: { title: 'What collaborators say', subtitle: '', quotes: [{ name: 'David Park', role: 'Design Director, Adobe', text: 'Alex delivers work that feels inevitable — as if the product was always meant to look that way.' }] }, styles: { bgColor: '#fafafa', textColor: '#09090b' } },
    { id: `cta_${t+4}`, type: 'cta_banner', name: 'Contact', content: { headline: 'Let\'s build something together.', subhead: 'Currently accepting select projects for Q3 2026.', primaryBtn: 'Get in touch', secondaryBtn: 'View LinkedIn' }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#9333ea' } },
    { id: `foot_${t+5}`, type: 'footer', name: 'Footer', content: { brand: 'Alex Morgan', tagline: 'Product design & frontend architecture.', copyright: '© 2026 Alex Morgan' }, styles: { bgColor: '#09090b', textColor: '#fafafa' } },
  ];
}

// Improved Symbol SaaS (reference: Clay / Symbol quality bar)
export function buildSymbolSaaS() {
  const t = ts();
  return [
    { id: `nav_${t}`, type: 'navbar', name: 'Symbol Header', content: { brand: 'Symbol', links: ['Product', 'Customers', 'Pricing', 'Docs'], cta: 'Start free trial' }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#ff5500' } },
    { id: `hero_${t+1}`, type: 'symbol_hero', name: 'Symbol Hero', content: { announcement: '● Now with AI-powered workflows', headline: 'Build systems to grow revenue.', subhead: 'The all-in-one GTM platform — enrich leads, orchestrate outreach, and close deals from one workspace.', primaryBtn: 'Get started free →', secondaryBtn: 'Watch demo', stats: [{ value: '350K+', label: 'Revenue teams' }, { value: '4.9★', label: 'G2 rating' }] }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#ff5500' } },
    { id: `feat_${t+2}`, type: 'features', name: 'Platform', content: { title: 'Everything GTM engineers need', subtitle: 'Data enrichment, AI drafting, and multi-channel orchestration', items: [{ title: '200+ data sources', desc: 'Waterfall enrichment from LinkedIn, Clearbit, and custom APIs.' }, { title: 'AI that writes like you', desc: 'Train on your best emails — generate drafts in your voice.' }, { title: 'Multi-channel sequences', desc: 'Email, LinkedIn, and phone — coordinated from one table.' }, { title: 'Real-time analytics', desc: 'Pipeline attribution from first touch to closed-won.' }] }, styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: '#ff5500' } },
    { id: `stats_${t+3}`, type: 'stats', name: 'Impact', content: { title: '', items: [{ value: '3.2×', label: 'Reply rate lift' }, { value: '47%', label: 'Less manual research' }, { value: '12min', label: 'Avg. setup time' }] }, styles: { bgColor: '#18181b', textColor: '#fafafa', accentColor: '#ff5500' } },
    { id: `pricing_${t+4}`, type: 'pricing', name: 'Pricing', content: { title: 'Simple, transparent pricing', subtitle: 'Start free. Scale as your pipeline grows.', plans: [{ name: 'Starter', price: '$29', period: 'per month', features: ['500 enrichments/mo', 'Email sequences', 'Core integrations'], btnText: 'Start free', isPopular: false }, { name: 'Pro', price: '$99', period: 'per month', features: ['Unlimited enrichments', 'AI drafting', 'Priority support', 'Custom workflows'], btnText: 'Start Pro trial', isPopular: true }, { name: 'Enterprise', price: 'Custom', period: '', features: ['Dedicated CSM', 'Custom SLA', 'SSO', 'Audit logs'], btnText: 'Contact sales', isPopular: false }] }, styles: { bgColor: '#ffffff', textColor: '#09090b' } },
    { id: `foot_${t+5}`, type: 'footer', name: 'Footer', content: { brand: 'Symbol', tagline: 'Build systems to grow revenue.', copyright: '© 2026 Symbol Inc.' }, styles: { bgColor: '#09090b', textColor: '#ffffff' } },
  ];
}

export function buildCuboCreative() {
  const t = ts();
  return [
    { id: `hero_${t}`, type: 'symbol_hero', name: 'CUBO Hero', content: { announcement: '● FRAMER DESIGN — CREATIVE TEMPLATE 2026', headline: 'CUBO', subhead: 'Looking for your next dream template? Ultra-bold typography for agencies that refuse to blend in.', primaryBtn: 'View works →', secondaryBtn: 'Contact', stats: [] }, styles: { bgColor: '#e8e8e8', textColor: '#09090b', accentColor: '#09090b' } },
    { id: `feat_${t+1}`, type: 'features', name: 'Services', content: { title: 'What we do', subtitle: 'Brand, web, and motion — end to end', items: [{ title: 'Brand identity', desc: 'Logos, systems, and guidelines that scale.' }, { title: 'Web design', desc: 'High-converting sites with editorial restraint.' }, { title: 'Motion & 3D', desc: 'Cinematic brand films and interactive experiences.' }] }, styles: { bgColor: '#ffffff', textColor: '#09090b' } },
    { id: `foot_${t+2}`, type: 'footer', name: 'Footer', content: { brand: 'CUBO', tagline: 'Creative template studio.', copyright: '© 2026 CUBO Studio' }, styles: { bgColor: '#09090b', textColor: '#fafafa' } },
  ];
}

export function buildThe1Sustainable() {
  const t = ts();
  return [
    { id: `hero_${t}`, type: 'symbol_hero', name: 'THE1 Hero', content: { announcement: '● Sustainable architecture', headline: 'Spaces designed for how we actually live.', subhead: 'THE1 creates residential environments that balance ecological responsibility with editorial beauty.', primaryBtn: 'Explore projects →', secondaryBtn: 'About THE1', stats: [{ value: '24', label: 'Completed projects' }, { value: 'LEED', label: 'Gold certified' }] }, styles: { bgColor: '#d8d8d8', textColor: '#09090b', accentColor: '#00875a' } },
    { id: `feat_${t+1}`, type: 'features', name: 'Projects', content: { title: 'Selected residences', subtitle: 'Color, light, and material as narrative', items: [{ title: 'Green Loft', desc: 'Biophilic design in a converted industrial space.' }, { title: 'Pink Studio', desc: 'Soft geometry and natural light in 85sqm.' }, { title: 'Yellow Suite', desc: 'Warm minimalism with reclaimed timber throughout.' }, { title: 'Red Penthouse', desc: 'Bold material palette overlooking the city.' }] }, styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: '#00875a' } },
    { id: `foot_${t+2}`, type: 'footer', name: 'Footer', content: { brand: 'THE1', tagline: 'Sustainable architecture editorial.', copyright: '© 2026 THE1 Architecture' }, styles: { bgColor: '#d8d8d8', textColor: '#09090b' } },
  ];
}

export function buildNitroAgency() {
  const t = ts();
  return [
    { id: `hero_${t}`, type: 'symbol_hero', name: 'Nitro Hero', content: { announcement: '● Now accepting Q3 clients', headline: 'A design partner focused on crisp, catchy interactive experiences.', subhead: "Hey, I'm Nick — I help ambitious teams ship interfaces that convert and brands that stick.", primaryBtn: 'Start a project →', secondaryBtn: 'View work', stats: [{ value: '40+', label: 'Clients shipped' }, { value: '6yrs', label: 'Independent' }] }, styles: { bgColor: '#09090b', textColor: '#fafafa', accentColor: '#ff5500' } },
    { id: `feat_${t+1}`, type: 'features', name: 'Services', content: { title: 'What I do best', subtitle: '', items: [{ title: 'Product design', desc: 'SaaS dashboards, mobile apps, and design systems.' }, { title: 'Brand & web', desc: 'Identity, landing pages, and marketing sites.' }, { title: 'Motion design', desc: 'Micro-interactions and scroll-driven storytelling.' }] }, styles: { bgColor: '#0c0c0e', textColor: '#fafafa', accentColor: '#ff5500' } },
    { id: `cta_${t+2}`, type: 'cta_banner', name: 'CTA', content: { headline: 'Ready to stand out?', subhead: 'Limited slots for Q3 2026.', primaryBtn: 'Book a call', secondaryBtn: 'Email me' }, styles: { bgColor: '#ff5500', textColor: '#ffffff', accentColor: '#09090b' } },
    { id: `foot_${t+3}`, type: 'footer', name: 'Footer', content: { brand: 'nitro', tagline: 'Interactive design partner.', copyright: '© 2026 Nitro Lab' }, styles: { bgColor: '#09090b', textColor: '#fafafa' } },
  ];
}

export function buildCuratedProducts() {
  const t = ts();
  return [
    { id: `hero_${t}`, type: 'symbol_hero', name: 'Curated Hero', content: { announcement: '● Updated every Sunday', headline: 'Discover well-designed, carefully curated products.', subhead: 'Subscribe and join 4,500+ readers for weekly emails featuring timeless, design-led products.', primaryBtn: 'Subscribe free →', secondaryBtn: 'Browse archive', stats: [{ value: '4.5K+', label: 'Subscribers' }, { value: '200+', label: 'Products featured' }] }, styles: { bgColor: '#f0f0f0', textColor: '#09090b', accentColor: '#09090b' } },
    { id: `feat_${t+1}`, type: 'features', name: 'Featured', content: { title: 'This week\'s picks', subtitle: 'Studio Display · Stealth Backpack · Aeron Chair', items: [{ title: 'Studio Display', desc: 'Apple — $1,599 · Tech' }, { title: '151 Stealth Backpack', desc: 'Grams28 — $889 · Carry' }, { title: 'Aeron Chair', desc: 'Herman Miller — $1,930 · Workspace' }] }, styles: { bgColor: '#ffffff', textColor: '#09090b' } },
    { id: `foot_${t+2}`, type: 'footer', name: 'Footer', content: { brand: 'Curated', tagline: 'Design-led products, weekly.', copyright: '© 2026 Curated Goods' }, styles: { bgColor: '#f0f0f0', textColor: '#09090b' } },
  ];
}

export const TEMPLATE_REGISTRY = {
  symbol: buildSymbolSaaS,
  saas: buildSymbolSaaS,
  glass: buildGlassDark,
  'saas-dark': buildApexDarkSaaS,
  apex: buildApexDarkSaaS,
  heila: buildHeilaHealth,
  aria: buildAriaTech,
  goldsand: buildGoldsandFinance,
  handheld: buildHandheldSaaS,
  portfolio: buildMinimalPortfolio,
  cubo: buildCuboCreative,
  creative: buildCuboCreative,
  the1: buildThe1Sustainable,
  editorial: buildThe1Sustainable,
  nitro: buildNitroAgency,
  agency: buildNitroAgency,
  curated: buildCuratedProducts,
  products: buildCuratedProducts,
};

export function loadPagePreset(pageKey) {
  const builder = TEMPLATE_REGISTRY[pageKey];
  return builder ? builder() : [];
}

export function createMotionPreset(type) {
  const t = ts();
  const presets = {
    transition_dark_light: { id: `tdl_${t}`, type: 'transition_dark_light', name: 'Dark → Light Transition', content: { height: '128px', label: 'Scroll-triggered theme shift from dark to light' }, styles: { bgColor: '#09090b' } },
    transition_light_dark: { id: `tld_${t}`, type: 'transition_light_dark', name: 'Light → Dark Transition', content: { height: '128px', label: 'Scroll-triggered theme shift from light to dark' }, styles: { bgColor: '#fafafa' } },
    motion_reveal: { id: `rev_${t}`, type: 'motion_reveal', name: 'Scroll Reveal', content: { label: 'Content reveals on scroll' }, styles: { bgColor: '#fafafa', textColor: '#09090b' } },
    motion_parallax: { id: `par_${t}`, type: 'motion_parallax', name: 'Parallax Layer', content: { headline: 'Parallax depth layer', height: '360px' }, styles: { bgColor: '#18181b', textColor: '#fafafa', accentColor: '#a855f7' } },
    // New scroll-driven sequences
    scroll_linked_theme_transition: { id: `slt_${t}`, type: 'scroll_linked_theme_transition', name: 'Scroll-Linked Theme Transition', content: { fromColor: '#ffffff', toColor: '#09090b' }, styles: { bgColor: '#ffffff', textColor: '#09090b' } },
    parallax_layered_images: { id: `pli_${t}`, type: 'parallax_layered_images', name: 'Parallax Layered Images', content: { layers: [] }, styles: { bgColor: '#fafafa', textColor: '#09090b' } },
    split_text_scroll_reveal: { id: `str_${t}`, type: 'split_text_scroll_reveal', name: 'Split-Text Scroll Reveal', content: { text: 'Text that reveals on scroll' }, styles: { bgColor: '#ffffff', textColor: '#09090b' } },
  };
  return presets[type] || presets.transition_dark_light;
}

export function createSectionPreset(type) {
  const t = ts();
  const presets = {
    hero: { id: `hero_${t}`, type: 'symbol_hero', name: 'Hero Section', content: { announcement: '● Crafted with AuraStudio', headline: 'Interfaces worth remembering.', subhead: 'Design, prototype, and export production-ready frontends — without starting from a template.', primaryBtn: 'Start building →', secondaryBtn: 'See examples', stats: [{ value: '50K+', label: 'Designers' }, { value: '3', label: 'Export stacks' }] }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    features: { id: `features_${t}`, type: 'features', name: 'Features Grid', content: { title: 'Built for craft, not templates', subtitle: 'Every block is designed to feel bespoke — asymmetry, typography, and motion included.', items: [{ title: 'Editorial layouts', desc: 'Offset grids and intentional whitespace — not centered three-column defaults.' }, { title: 'Motion primitives', desc: 'Add dark-to-light transitions, scroll reveals, and parallax in one click.' }, { title: 'Triple export', desc: 'Ship as HTML/CSS, React, or React + Tailwind + Framer Motion.' }, { title: 'AI orchestration', desc: 'Describe changes in plain language — the orchestrator handles scope and structure.' }] }, styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: '#a855f7' } },
    testimonials: { id: `testimonials_${t}`, type: 'testimonials', name: 'Testimonials', content: { title: 'Trusted by teams who care about craft', subtitle: 'From indie builders to design-led startups', quotes: [{ name: 'Sarah Jenkins', role: 'Lead Product Designer, Stripe', text: 'AuraStudio is the first tool where exported code actually matches what I designed. The Tailwind + Motion stack is production-ready.' }, { name: 'David Park', role: 'Indie Hacker', text: 'I shipped a landing page in an afternoon that looked like it cost five figures. The templates are genuinely good — not generic SaaS slop.' }, { name: 'Mia Chen', role: 'Frontend Engineer, Linear', text: 'Three export stacks means I pick the right output for every project. The motion blocks alone saved me hours.' }] }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    pricing: { id: `pricing_${t}`, type: 'pricing', name: 'Pricing Cards', content: { title: 'Simple, transparent pricing', subtitle: 'Start free. Upgrade when you need more.', plans: [{ name: 'Free', price: '$0', period: 'forever', features: ['3 projects', 'All templates', 'HTML export'], btnText: 'Start free', isPopular: false }, { name: 'Pro', price: '$49', period: 'per month', features: ['Unlimited projects', 'AI generation', 'All 3 export stacks', 'Motion blocks'], btnText: 'Start Pro', isPopular: true }, { name: 'Team', price: '$149', period: 'per month', features: ['Everything in Pro', 'Shared workspace', 'Priority support', 'Custom templates'], btnText: 'Contact us', isPopular: false }] }, styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: '#a855f7' } },
    navbar: { id: `navbar_${t}`, type: 'navbar', name: 'Header Navbar', content: { brand: 'AuraStudio', links: ['Features', 'Templates', 'Pricing'], cta: 'Get Started' }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    footer: { id: `footer_${t}`, type: 'footer', name: 'Footer Bar', content: { brand: 'AuraStudio', tagline: 'The design system for frontend craft.', copyright: '© 2026 AuraStudio. All rights reserved.' }, styles: { bgColor: '#09090b', textColor: '#ffffff' } },
    stats: { id: `stats_${t}`, type: 'stats', name: 'Stats Section', content: { title: 'By the numbers', items: [{ value: '50K+', label: 'Designers', desc: 'Building with AuraStudio' }, { value: '2M+', label: 'Sections created', desc: 'Across all projects' }, { value: '3', label: 'Export stacks', desc: 'HTML, React, Tailwind+Motion' }, { value: '4.9★', label: 'Rating', desc: 'From 2,000+ reviews' }] }, styles: { bgColor: '#18181b', textColor: '#fafafa', accentColor: '#a855f7' } },
    cta_banner: { id: `cta_${t}`, type: 'cta_banner', name: 'CTA Banner', content: { headline: 'Ready to build something worth showing?', subhead: 'Start with a premium template or a blank canvas. Export in the stack your team actually uses.', primaryBtn: 'Open Studio Free', secondaryBtn: 'Browse templates' }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#a855f7' } },
    faq: { id: `faq_${t}`, type: 'faq', name: 'FAQ Section', content: { title: 'Frequently asked questions', items: [{ question: 'What export formats are supported?', answer: 'Three stacks: semantic HTML/CSS, React with inline styles, and React + Tailwind CSS + Framer Motion with motion primitives baked in.' }, { question: 'Can I add scroll transitions?', answer: 'Yes. Add Dark→Light or Light→Dark transition blocks from the Motion tab, or ask the AI to "add a black to white transition".' }, { question: 'Are templates actually good?', answer: 'Every template is inspired by boutique agency work — Glass, Heila, ARIA, Goldsand, and more. Not generic SaaS defaults.' }] }, styles: { bgColor: '#fafafa', textColor: '#09090b' } },
    team: { id: `team_${t}`, type: 'team', name: 'Team Section', content: { title: 'The team', members: [{ name: 'Alex Morgan', role: 'CEO & Co-Founder', bio: 'Former design lead at Figma. Obsessed with export quality.' }, { name: 'Sarah Chen', role: 'CTO', bio: 'Built the orchestrator pipeline and triple-stack export engine.' }, { name: 'Marcus Lee', role: 'Head of Design', bio: 'Curates every template against Awwwards-level craft standards.' }] }, styles: { bgColor: '#ffffff', textColor: '#09090b' } },
    // New Standard Component Library types
    sticky_blurred_nav: { id: `sbn_${t}`, type: 'sticky_blurred_nav', name: 'Sticky Blurred Nav', content: { brand: 'AuraStudio', links: ['Features', 'Templates', 'Pricing'], cta: 'Get Started' }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    mega_menu: { id: `mm_${t}`, type: 'mega_menu', name: 'Mega Menu', content: { brand: 'AuraStudio', menuItems: [{ label: 'Product', submenu: [{ label: 'Features', description: 'Design tools', href: '#' }, { label: 'Templates', description: 'Premium designs', href: '#' }] }], cta: 'Get Started' }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    video_background_hero: { id: `vbh_${t}`, type: 'video_background_hero', name: 'Video Background Hero', content: { videoSrc: '', title: 'Interfaces worth remembering.', subtitle: 'Design, prototype, and export production-ready frontends.', ctaText: 'Get Started', overlayOpacity: 0.5 }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#a855f7' } },
    image_background_hero: { id: `ibh_${t}`, type: 'image_background_hero', name: 'Image Background Hero', content: { imageSrc: '', title: 'Interfaces worth remembering.', subtitle: 'Design, prototype, and export production-ready frontends.', ctaText: 'Get Started' }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#a855f7' } },
    animated_gradient_hero: { id: `agh_${t}`, type: 'animated_gradient_hero', name: 'Animated Gradient Hero', content: { title: 'Interfaces worth remembering.', subtitle: 'Design, prototype, and export production-ready frontends.', ctaText: 'Get Started', gradientColors: ['#667eea', '#764ba2', '#f093fb'] }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#a855f7' } },
    globe_hero: { id: `gh_${t}`, type: 'globe_hero', name: 'Globe Hero', content: { title: 'Global Design Platform', subtitle: 'Build interfaces that reach every corner of the world.', ctaText: 'Get Started', darkMode: true }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#a855f7' } },
    product_mockup_hero: { id: `pmh_${t}`, type: 'product_mockup_hero', name: 'Product Mockup Hero', content: { title: 'See it in action', subtitle: 'A floating dashboard that responds to your cursor.', ctaText: 'Try Demo', mockupImage: '' }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#a855f7' } },
    split_screen_hero: { id: `ssh_${t}`, type: 'split_screen_hero', name: 'Split-Screen Hero', content: { title: 'Design meets code', subtitle: 'Where creativity meets production-ready output.', ctaText: 'Start Building', visualPosition: 'right' }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    bento_grid: { id: `bg_${t}`, type: 'bento_grid', name: 'Bento Grid', content: { items: [{ content: '', span: 'md:col-span-2' }, { content: '', span: '' }] }, styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: '#a855f7' } },
    logo_marquee: { id: `lm_${t}`, type: 'logo_marquee', name: 'Logo Marquee', content: { logos: [] }, styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: '#a855f7' } },
    case_study_grid: { id: `csg_${t}`, type: 'case_study_grid', name: 'Case Study Grid', content: { cases: [{ title: 'Project Alpha', description: 'SaaS redesign', category: 'Product', preview: '' }] }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    pricing_table: { id: `pt_${t}`, type: 'pricing_table', name: 'Pricing Table', content: { plans: [{ name: 'Starter', description: 'For individuals', monthlyPrice: 0, yearlyPrice: 0, features: ['Basic features'], popular: false }] }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    big_logotype_footer: { id: `blf_${t}`, type: 'big_logotype_footer', name: 'Big Logotype Footer', content: { logo: 'AuraStudio', sitemap: [], contactInfo: [], socialLinks: [] }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#a855f7' } },
    newsletter_footer: { id: `nf_${t}`, type: 'newsletter_footer', name: 'Newsletter Footer', content: { logo: 'AuraStudio', sitemap: [{ title: 'Product', links: [] }], socialLinks: [] }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#a855f7' } },
    scroll_fill_device_mockup: { id: `sfdm_${t}`, type: 'scroll_fill_device_mockup', name: 'Scroll-Fill Device Mockup', content: { screens: [] }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#a855f7' } },
    horizontal_scroll_gallery: { id: `hsg_${t}`, type: 'horizontal_scroll_gallery', name: 'Horizontal Scroll Gallery', content: { items: [] }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    pinned_sticky_section: { id: `pss_${t}`, type: 'pinned_sticky_section', name: 'Pinned Sticky Section', content: { pinnedContent: '', scrollingContent: '' }, styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: '#a855f7' } },
    scroll_triggered_counters: { id: `stc_${t}`, type: 'scroll_triggered_counters', name: 'Scroll-Triggered Counters', content: { stats: [{ value: 100, suffix: '+', prefix: '', label: 'Projects' }] }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    standalone_interactive_globe: { id: `sig_${t}`, type: 'standalone_interactive_globe', name: 'Standalone Interactive Globe', content: { darkMode: true, markers: [], width: 600, height: 600 }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#a855f7' } },
    '3d_object_viewer': { id: `3dov_${t}`, type: '3d_object_viewer', name: '3D Object Viewer', content: {}, styles: { bgColor: '#fafafa', textColor: '#09090b', accentColor: '#a855f7' } },
    ambient_particle_background: { id: `apb_${t}`, type: 'ambient_particle_background', name: 'Ambient Particle Background', content: { particleCount: 50 }, styles: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#a855f7' } },
    cursor_spotlight: { id: `cs_${t}`, type: 'cursor_spotlight', name: 'Cursor Spotlight', content: {}, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    magnetic_button: { id: `mb_${t}`, type: 'magnetic_button', name: 'Magnetic Button', content: {}, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    mouse_tilt_card: { id: `mtc_${t}`, type: 'mouse_tilt_card', name: 'Mouse-Tilt Card', content: {}, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    custom_cursor: { id: `cc_${t}`, type: 'custom_cursor', name: 'Custom Cursor', content: {}, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    multi_step_form: { id: `msf_${t}`, type: 'multi_step_form', name: 'Multi-Step Form', content: { steps: [] }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    floating_label_inputs: { id: `fli_${t}`, type: 'floating_label_inputs', name: 'Floating-Label Inputs', content: { fields: [{ name: 'email', label: 'Email', type: 'email' }] }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    inline_newsletter_signup: { id: `ins_${t}`, type: 'inline_newsletter_signup', name: 'Inline Newsletter Signup', content: { placeholder: 'Enter your email', buttonText: 'Subscribe' }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    image_lightbox: { id: `il_${t}`, type: 'image_lightbox', name: 'Image Lightbox', content: { images: [] }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    before_after_slider: { id: `bas_${t}`, type: 'before_after_slider', name: 'Before/After Slider', content: { beforeImage: '', afterImage: '', beforeLabel: 'Before', afterLabel: 'After' }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
    autoplay_card_video: { id: `acv_${t}`, type: 'autoplay_card_video', name: 'Autoplay Card Video', content: { videoSrc: '', poster: '' }, styles: { bgColor: '#ffffff', textColor: '#09090b', accentColor: '#a855f7' } },
  };
  return presets[type] || presets.hero;
}
