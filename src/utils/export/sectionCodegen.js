// Shared section → code helpers for all export stacks

export const ALL_SECTION_TYPES = [
  'navbar', 'symbol_hero', 'features', 'pricing', 'testimonials',
  'footer', 'stats', 'cta_banner', 'faq', 'team',
  'transition_dark_light', 'transition_light_dark', 'motion_reveal', 'motion_parallax',
];

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsxEsc(str) {
  return String(str ?? '').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

export function getSectionStyles(comp) {
  return {
    bg: comp.styles?.bgColor || '#ffffff',
    text: comp.styles?.textColor || '#09090b',
    accent: comp.styles?.accentColor || '#a855f7',
  };
}

export function compileSectionHtml(comp) {
  const { type, content = {} } = comp;
  const { bg, text, accent } = getSectionStyles(comp);

  switch (type) {
    case 'navbar': {
      const links = (content.links || []).map(l => `<a href="#" class="nav-link">${esc(l)}</a>`).join('');
      return `<nav class="section-nav" style="background:${bg};color:${text};border-bottom:1px solid rgba(0,0,0,0.06)">
  <span class="brand">${esc(content.brand || 'Brand')}</span>
  <div class="nav-links">${links}</div>
  <a href="#" class="btn-cta" style="background:${accent}">${esc(content.cta || 'Get Started')}</a>
</nav>`;
    }
    case 'symbol_hero':
    case 'hero':
      return `<section class="section-hero" style="background:${bg};color:${text}">
  ${content.announcement ? `<div class="eyebrow" style="border-color:${accent}33;color:${accent}">${esc(content.announcement)}</div>` : ''}
  <div class="hero-grid">
    <div>
      <h1>${esc(content.headline || content.title || 'Welcome')}</h1>
      <p class="subhead">${esc(content.subhead || content.description || '')}</p>
      <div class="hero-actions">
        <a href="#" class="btn-cta" style="background:${accent}">${esc(content.primaryBtn || 'Get Started')}</a>
        ${content.secondaryBtn ? `<a href="#" class="btn-ghost">${esc(content.secondaryBtn)}</a>` : ''}
      </div>
    </div>
    ${(content.stats || []).length ? `<div class="hero-stats">${content.stats.map(s => `<div><div class="stat-val">${esc(s.value)}</div><div class="stat-lbl">${esc(s.label)}</div></div>`).join('')}</div>` : ''}
  </div>
</section>`;
    case 'features': {
      const items = (content.items || []).map(item =>
        `<article class="feature-card"><h3>${esc(item.title)}</h3><p>${esc(item.desc)}</p></article>`
      ).join('');
      return `<section class="section-features" style="background:${bg};color:${text}">
  <header class="section-header"><h2>${esc(content.title || 'Features')}</h2><p>${esc(content.subtitle || '')}</p></header>
  <div class="feature-grid">${items}</div>
</section>`;
    }
    case 'pricing': {
      const plans = (content.plans || []).map(p => `<article class="plan-card${p.isPopular ? ' popular' : ''}" style="${p.isPopular ? `background:#09090b;color:#fff` : ''}">
  <h3>${esc(p.name)}</h3>
  <div class="plan-price">${esc(p.price)}<span>/${esc(p.period || 'mo')}</span></div>
  ${(p.features || []).map(f => `<p class="plan-feat">✓ ${esc(f)}</p>`).join('')}
  <a href="#" class="btn-cta" style="background:${p.isPopular ? accent : '#f4f4f5'};color:${p.isPopular ? '#fff' : text}">${esc(p.btnText || 'Choose')}</a>
</article>`).join('');
      return `<section class="section-pricing" style="background:${bg};color:${text}">
  <header class="section-header"><h2>${esc(content.title || 'Pricing')}</h2><p>${esc(content.subtitle || '')}</p></header>
  <div class="pricing-grid">${plans}</div>
</section>`;
    }
    case 'testimonials': {
      const quotes = (content.quotes || []).map(q => `<blockquote class="quote-card"><p>"${esc(q.text)}"</p><footer><strong>${esc(q.name)}</strong><span>${esc(q.role)}</span></footer></blockquote>`).join('');
      return `<section class="section-testimonials" style="background:${bg};color:${text}">
  <header class="section-header"><h2>${esc(content.title || 'Testimonials')}</h2><p>${esc(content.subtitle || '')}</p></header>
  <div class="quote-grid">${quotes}</div>
</section>`;
    }
    case 'stats': {
      const items = (content.items || []).map(item => `<div class="stat-item"><div class="stat-val">${esc(item.value)}</div><div class="stat-lbl">${esc(item.label)}</div>${item.desc ? `<div class="stat-desc">${esc(item.desc)}</div>` : ''}</div>`).join('');
      return `<section class="section-stats" style="background:${bg};color:${text}">
  ${content.title ? `<h2>${esc(content.title)}</h2>` : ''}
  <div class="stats-grid">${items}</div>
</section>`;
    }
    case 'cta_banner':
      return `<section class="section-cta" style="background:linear-gradient(135deg,#09090b,#1e0533);color:#fff">
  <h2>${esc(content.headline || 'Ready?')}</h2>
  <p>${esc(content.subhead || '')}</p>
  <div class="hero-actions">
    <a href="#" class="btn-cta" style="background:${accent}">${esc(content.primaryBtn || 'Get Started')}</a>
    ${content.secondaryBtn ? `<a href="#" class="btn-ghost light">${esc(content.secondaryBtn)}</a>` : ''}
  </div>
</section>`;
    case 'faq': {
      const items = (content.items || []).map(item => `<details class="faq-item"><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join('');
      return `<section class="section-faq" style="background:${bg};color:${text}">
  <h2>${esc(content.title || 'FAQ')}</h2>
  <div class="faq-list">${items}</div>
</section>`;
    }
    case 'team': {
      const members = (content.members || []).map(m => `<article class="team-card"><div class="avatar">${esc(m.name?.[0] || 'T')}</div><h3>${esc(m.name)}</h3><p class="role">${esc(m.role)}</p><p>${esc(m.bio)}</p></article>`).join('');
      return `<section class="section-team" style="background:${bg};color:${text}">
  <h2>${esc(content.title || 'Team')}</h2>
  <div class="team-grid">${members}</div>
</section>`;
    }
    case 'footer':
      return `<footer class="section-footer" style="background:${bg};color:${text}">
  <div><div class="brand">${esc(content.brand || 'Brand')}</div><p>${esc(content.tagline || '')}</p></div>
  <p class="copy">${esc(content.copyright || '© 2026')}</p>
</footer>`;
    case 'transition_dark_light':
      return `<div class="transition-band" style="height:${content.height || '120px'};background:linear-gradient(180deg,#09090b 0%,#fafafa 100%)" aria-hidden="true"></div>`;
    case 'transition_light_dark':
      return `<div class="transition-band" style="height:${content.height || '120px'};background:linear-gradient(180deg,#fafafa 0%,#09090b 100%)" aria-hidden="true"></div>`;
    case 'motion_reveal':
      return `<section class="motion-reveal" data-motion="fade-up" style="background:${bg};padding:4rem;text-align:center"><p>${esc(content.label || 'Scroll reveal section')}</p></section>`;
    case 'motion_parallax':
      return `<section class="motion-parallax" data-motion="parallax" style="background:${bg};min-height:${content.height || '320px'};display:flex;align-items:center;justify-content:center"><h2>${esc(content.headline || 'Parallax layer')}</h2></section>`;
    default:
      return `<section style="padding:3rem;background:${bg};color:${text}"><!-- ${esc(comp.name || type)} --></section>`;
  }
}

export function compileSectionReact(comp) {
  const { type, content = {} } = comp;
  const { bg, text, accent } = getSectionStyles(comp);
  const name = (comp.name || type).replace(/\W+/g, '');

  switch (type) {
    case 'navbar':
      return `function Section${name}() {
  return (
    <nav style={{ padding:'1.25rem 4rem', display:'flex', alignItems:'center', justifyContent:'space-between', background:'${bg}', color:'${text}', borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
      <span style={{ fontWeight:800, fontSize:'1.2rem' }}>${jsxEsc(content.brand || 'Brand')}</span>
      <div style={{ display:'flex', gap:'2rem' }}>${(content.links || []).map(l => `<a href="#" style={{ color:'inherit', textDecoration:'none' }}>${jsxEsc(l)}</a>`).join('')}</div>
      <a href="#" style={{ background:'${accent}', color:'#fff', padding:'0.5rem 1.25rem', borderRadius:8, textDecoration:'none', fontWeight:600 }}>${jsxEsc(content.cta || 'Get Started')}</a>
    </nav>
  );
}`;
    case 'symbol_hero':
    case 'hero':
      return `function Section${name}() {
  return (
    <section style={{ padding:'5rem 4rem', background:'${bg}', color:'${text}' }}>
      <h1 style={{ fontSize:'3.5rem', fontWeight:800, lineHeight:1.08, letterSpacing:'-0.03em', maxWidth:800 }}>${jsxEsc(content.headline || 'Welcome')}</h1>
      <p style={{ fontSize:'1.1rem', color:'#71717a', marginTop:'1.5rem', maxWidth:560, lineHeight:1.6 }}>${jsxEsc(content.subhead || '')}</p>
      <div style={{ display:'flex', gap:'1rem', marginTop:'2.5rem' }}>
        <a href="#" style={{ background:'${accent}', color:'#fff', padding:'0.85rem 2rem', borderRadius:10, textDecoration:'none', fontWeight:700 }}>${jsxEsc(content.primaryBtn || 'Get Started')}</a>
      </div>
    </section>
  );
}`;
    case 'transition_dark_light':
      return `function Section${name}() {
  return <div style={{ height:'${content.height || '120px'}', background:'linear-gradient(180deg,#09090b,#fafafa)' }} aria-hidden="true" />;
}`;
    case 'transition_light_dark':
      return `function Section${name}() {
  return <div style={{ height:'${content.height || '120px'}', background:'linear-gradient(180deg,#fafafa,#09090b)' }} aria-hidden="true" />;
}`;
    default:
      return `function Section${name}() {
  return <section style={{ padding:'4rem', background:'${bg}', color:'${text}' }}><h2>${jsxEsc(comp.name || type)}</h2></section>;
}`;
  }
}

export function compileSectionTailwind(comp, index) {
  const { type, content = {} } = comp;
  const accent = comp.styles?.accentColor || '#a855f7';
  const fn = `Section${index}`;

  switch (type) {
    case 'navbar':
      return `function ${fn}() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-5 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <span className="text-lg font-bold tracking-tight">${jsxEsc(content.brand || 'Brand')}</span>
      <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-600">${(content.links || []).map(l => `<a href="#" className="hover:text-zinc-950 transition-colors">${jsxEsc(l)}</a>`).join('')}</div>
      <a href="#" className="rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ background:'${accent}' }}>${jsxEsc(content.cta || 'Get Started')}</a>
    </nav>
  );
}`;
    case 'symbol_hero':
    case 'hero':
      return `function ${fn}() {
  return (
    <motion.section initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, ease:[0.16,1,0.3,1] }} className="px-6 md:px-16 py-20 md:py-28">
      <div className="max-w-6xl grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        <div>
          ${content.announcement ? `<span className="inline-block mb-6 text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full border" style={{ color:'${accent}', borderColor:'${accent}33' }}>${jsxEsc(content.announcement)}</span>` : ''}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">${jsxEsc(content.headline || 'Welcome')}</h1>
          <p className="mt-6 text-lg text-zinc-500 max-w-xl leading-relaxed">${jsxEsc(content.subhead || '')}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#" className="rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg" style={{ background:'${accent}' }}>${jsxEsc(content.primaryBtn || 'Get Started')}</a>
            ${content.secondaryBtn ? `<a href="#" className="rounded-full px-7 py-3 text-sm font-semibold border border-zinc-200">${jsxEsc(content.secondaryBtn)}</a>` : ''}
          </div>
        </div>
        ${(content.stats || []).length ? `<motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }} className="grid grid-cols-2 gap-6 p-8 rounded-3xl bg-zinc-50 border border-zinc-100">${content.stats.map(s => `<div><div className="text-3xl font-bold">${jsxEsc(s.value)}</div><div className="text-sm text-zinc-500 mt-1">${jsxEsc(s.label)}</div></div>`).join('')}</motion.div>` : ''}
      </div>
    </motion.section>
  );
}`;
    case 'features':
      return `function ${fn}() {
  const items = ${JSON.stringify(content.items || [])};
  return (
    <section className="px-6 md:px-16 py-20 bg-zinc-50">
      <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:'-80px' }} variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.08 }}}}>
        <motion.h2 variants={{ hidden:{ opacity:0, y:16 }, show:{ opacity:1, y:0 }}} className="text-3xl md:text-4xl font-bold text-center tracking-tight">${jsxEsc(content.title || 'Features')}</motion.h2>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {items.map((item,i) => (
            <motion.article key={i} variants={{ hidden:{ opacity:0, y:20 }, show:{ opacity:1, y:0 }}} className="p-7 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 transition-colors">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}`;
    case 'transition_dark_light':
      return `function ${fn}() {
  return <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} className="h-28 md:h-32 bg-gradient-to-b from-zinc-950 to-zinc-50" aria-hidden="true" />;
}`;
    case 'transition_light_dark':
      return `function ${fn}() {
  return <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} className="h-28 md:h-32 bg-gradient-to-b from-zinc-50 to-zinc-950" aria-hidden="true" />;
}`;
    case 'motion_reveal':
      return `function ${fn}() {
  return (
    <motion.section initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.6, ease:[0.16,1,0.3,1] }} className="px-6 py-16 text-center">
      <p className="text-zinc-500 text-sm uppercase tracking-widest">${jsxEsc(content.label || 'Reveal on scroll')}</p>
    </motion.section>
  );
}`;
    case 'motion_parallax':
      return `function ${fn}() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0,1], ['0%','-20%']);
  return (
    <section className="relative overflow-hidden min-h-[320px] flex items-center justify-center">
      <motion.div style={{ y }} className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-700 opacity-90" />
      <motion.h2 initial={{ opacity:0 }} whileInView={{ opacity:1 }} className="relative text-3xl font-bold text-white">${jsxEsc(content.headline || 'Parallax')}</motion.h2>
    </section>
  );
}`;
    default:
      return `function ${fn}() {
  return <section className="px-6 py-16"><h2 className="text-2xl font-bold">${jsxEsc(comp.name || type)}</h2></section>;
}`;
  }
}

export const HTML_STYLES = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;color:#09090b}
.section-nav{padding:1.25rem 4rem;display:flex;align-items:center;justify-content:space-between}
.section-nav .nav-links{display:flex;gap:2rem}
.section-nav .nav-link{color:inherit;text-decoration:none;font-size:.9rem;font-weight:500}
.btn-cta{display:inline-flex;padding:.65rem 1.4rem;border-radius:99px;color:#fff;text-decoration:none;font-weight:600;font-size:.875rem}
.btn-ghost{display:inline-flex;padding:.65rem 1.4rem;border-radius:99px;border:1px solid #e4e4e7;color:inherit;text-decoration:none;font-weight:600}
.section-hero{padding:5rem 4rem}
.section-hero .eyebrow{display:inline-flex;padding:.35rem .85rem;border-radius:99px;border:1px solid;font-size:.75rem;font-weight:600;margin-bottom:1.5rem}
.section-hero h1{font-size:clamp(2.5rem,5vw,3.75rem);font-weight:800;line-height:1.08;letter-spacing:-.03em;max-width:800px}
.section-hero .subhead{margin-top:1.25rem;font-size:1.1rem;color:#71717a;max-width:560px;line-height:1.6}
.section-hero .hero-actions{display:flex;gap:1rem;margin-top:2.5rem;flex-wrap:wrap}
.hero-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:3rem;align-items:center}
.hero-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;padding:2rem;background:#fafafa;border:1px solid #e4e4e7;border-radius:20px}
.stat-val{font-size:2.25rem;font-weight:800;letter-spacing:-.03em}
.stat-lbl{font-size:.85rem;color:#71717a;margin-top:.25rem}
.section-header{text-align:center;margin-bottom:3rem}
.section-header h2{font-size:2.25rem;font-weight:800;letter-spacing:-.02em}
.section-header p{color:#71717a;margin-top:.5rem}
.section-features,.section-pricing,.section-testimonials,.section-faq,.section-team{padding:5rem 4rem}
.feature-grid,.quote-grid,.pricing-grid,.team-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.25rem;max-width:1100px;margin:0 auto}
.feature-card,.quote-card,.plan-card,.team-card{padding:1.75rem;border:1px solid #e4e4e7;border-radius:18px;background:#fff}
.section-stats{padding:5rem 4rem;text-align:center}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:2rem;max-width:900px;margin:0 auto}
.section-cta{padding:5rem 4rem;text-align:center}
.section-cta h2{font-size:2.5rem;font-weight:800;margin-bottom:1rem}
.section-cta p{color:#a1a1aa;margin-bottom:2rem;max-width:560px;margin-inline:auto}
.section-footer{padding:3rem 4rem;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #27272a}
.faq-list{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:.75rem}
.faq-item{padding:1.25rem;border:1px solid #e4e4e7;border-radius:14px;background:#fff}
.faq-item summary{font-weight:700;cursor:pointer}
.faq-item p{margin-top:.65rem;color:#71717a;line-height:1.6;font-size:.875rem}
@media(max-width:768px){.section-nav,.section-hero,.section-features{padding-inline:1.5rem}.hero-grid{grid-template-columns:1fr}.section-nav .nav-links{display:none}}
`;
