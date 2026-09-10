import React, { useState } from 'react';
import { X, Smartphone, Tablet, Monitor } from 'lucide-react';
// Import Standard Component Library components for true preview rendering
import {
  // Navigation
  StickyBlurredNav, MegaMenu, MobileFullScreenDrawer, RoutePageTransition,
  // Hero Patterns
  VideoBackgroundHero, ImageBackgroundHero, AnimatedGradientHero, GlobeHero, ProductMockupHero, SplitScreenHero,
  // Scroll-Driven Sequences
  ScrollFillDeviceMockup, HorizontalScrollGallery, ScrollLinkedThemeTransition, PinnedStickySection, ParallaxLayeredImages, SplitTextScrollReveal, ScrollTriggeredCounters,
  // 3D & Cursor-Aware Interaction
  StandaloneInteractiveGlobe, ThreeDObjectViewer, AmbientParticleBackground, CursorSpotlight, MagneticButton, MouseTiltCard, CustomCursor,
  // Content Sections
  BentoGrid, LogoMarquee, TestimonialCarousel, CaseStudyGrid, PricingTable, FAQAccordion, TeamGrid,
  // Footer
  BigLogotypeFooter, NewsletterFooter,
  // Forms & Inputs
  MultiStepForm, FloatingLabelInputs, InlineNewsletterSignup,
  // Media
  ImageLightbox, BeforeAfterSlider, AutoplayCardVideo,
} from './library/index.js';

export default function PreviewModal({ components = [], onClose }) {
  const [device, setDevice] = useState('desktop');

  const DEVICES = {
    desktop: { label: 'Desktop', width: '100%', maxWidth: '100%', frameStyles: {}, outerBg: '#1a1a2e' },
    tablet: {
      label: 'Tablet (768px)',
      width: '768px', maxWidth: '768px',
      frameStyles: { border: '12px solid #27272a', borderRadius: '22px', boxShadow: '0 50px 120px rgba(0,0,0,0.6)' },
      outerBg: '#0f0f1a'
    },
    mobile: {
      label: 'Mobile (390px)',
      width: '390px', maxWidth: '390px',
      frameStyles: { border: '14px solid #18181b', borderRadius: '50px', boxShadow: '0 60px 150px rgba(0,0,0,0.7)' },
      outerBg: '#0a0a12'
    }
  };
  const d = DEVICES[device];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, display: 'flex', flexDirection: 'column', backgroundColor: d.outerBg, transition: 'background-color 0.3s' }}>
      {/* Top bar */}
      <div style={{ height: '3.25rem', backgroundColor: '#09090b', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', flexShrink: 0 }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Live Preview</span>

        <div style={{ display: 'flex', backgroundColor: '#1a1a1a', borderRadius: '10px', padding: '0.2rem' }}>
          {[
            { key: 'mobile', icon: Smartphone, label: 'Mobile' },
            { key: 'tablet', icon: Tablet, label: 'Tablet' },
            { key: 'desktop', icon: Monitor, label: 'Desktop' }
          ].map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setDevice(key)} style={{ padding: '0.4rem 0.85rem', border: 'none', borderRadius: '8px', backgroundColor: device === key ? '#ffffff' : 'transparent', color: device === key ? '#09090b' : '#71717a', cursor: 'pointer', fontWeight: device === key ? 700 : 500, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.15s' }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <button onClick={onClose} className="btn-ghost" style={{ color: '#71717a' }}><X size={18} /></button>
      </div>

      {/* Preview area */}
      <div style={{ flex: 1, display: 'flex', alignItems: device === 'desktop' ? 'stretch' : 'center', justifyContent: 'center', padding: device === 'desktop' ? 0 : '2.5rem', overflowY: 'auto' }}>
        <div style={{ width: d.width, maxWidth: d.maxWidth, ...(device !== 'desktop' ? d.frameStyles : {}), position: 'relative', overflow: 'hidden', backgroundColor: '#ffffff', ...(device === 'desktop' ? { height: '100%' } : { maxHeight: '90vh', overflowY: 'auto' }) }}>

          {/* Mobile notch */}
          {device === 'mobile' && (
            <div style={{ position: 'sticky', top: 0, zIndex: 10, height: '44px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', fontSize: '0.65rem', fontWeight: 700, color: '#09090b', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <span>9:41</span>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100px', height: '22px', backgroundColor: '#18181b', borderRadius: '0 0 14px 14px' }} />
              <span style={{ opacity: 0.7 }}>●●●</span>
            </div>
          )}

          {/* Content */}
          {components.map(comp => (
            <PreviewSection key={comp.id} comp={comp} device={device} />
          ))}

          {components.length === 0 && (
            <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
              <p>Your canvas is empty.<br />Add sections to preview them here.</p>
            </div>
          )}

          {/* Mobile home indicator */}
          {device === 'mobile' && (
            <div style={{ position: 'sticky', bottom: 0, height: '34px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '130px', height: '5px', backgroundColor: '#18181b', borderRadius: '3px', opacity: 0.2 }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewSection({ comp, device }) {
  const { type, content = {}, styles = {} } = comp;
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  const bg = styles.bgColor || '#ffffff';
  const color = styles.textColor || '#09090b';
  const accent = styles.accentColor || '#a855f7';

  // Render Standard Component Library components for new types
  const componentMap = {
    // Navigation
    sticky_blurred_nav: StickyBlurredNav,
    mega_menu: MegaMenu,
    mobile_full_screen_drawer: MobileFullScreenDrawer,
    route_page_transition: RoutePageTransition,
    // Hero Patterns
    video_background_hero: VideoBackgroundHero,
    image_background_hero: ImageBackgroundHero,
    animated_gradient_hero: AnimatedGradientHero,
    globe_hero: GlobeHero,
    product_mockup_hero: ProductMockupHero,
    split_screen_hero: SplitScreenHero,
    // Scroll-Driven Sequences
    scroll_fill_device_mockup: ScrollFillDeviceMockup,
    horizontal_scroll_gallery: HorizontalScrollGallery,
    scroll_linked_theme_transition: ScrollLinkedThemeTransition,
    pinned_sticky_section: PinnedStickySection,
    parallax_layered_images: ParallaxLayeredImages,
    split_text_scroll_reveal: SplitTextScrollReveal,
    scroll_triggered_counters: ScrollTriggeredCounters,
    // 3D & Cursor-Aware Interaction
    standalone_interactive_globe: StandaloneInteractiveGlobe,
    '3d_object_viewer': ThreeDObjectViewer,
    ambient_particle_background: AmbientParticleBackground,
    cursor_spotlight: CursorSpotlight,
    magnetic_button: MagneticButton,
    mouse_tilt_card: MouseTiltCard,
    custom_cursor: CustomCursor,
    // Content Sections
    bento_grid: BentoGrid,
    logo_marquee: LogoMarquee,
    case_study_grid: CaseStudyGrid,
    pricing_table: PricingTable,
    faq: FAQAccordion,
    team: TeamGrid,
    // Footer
    big_logotype_footer: BigLogotypeFooter,
    newsletter_footer: NewsletterFooter,
    // Forms & Inputs
    multi_step_form: MultiStepForm,
    floating_label_inputs: FloatingLabelInputs,
    inline_newsletter_signup: InlineNewsletterSignup,
    // Media
    image_lightbox: ImageLightbox,
    before_after_slider: BeforeAfterSlider,
    autoplay_card_video: AutoplayCardVideo,
  };

  const Component = componentMap[type];
  if (Component) {
    return <Component {...content} />;
  }

  // Legacy component rendering (for backward compatibility)
  if (type === 'navbar') {
    return (
      <div style={{ padding: isMobile ? '0.9rem 1.25rem' : '1.25rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e7', backgroundColor: bg, color }}>
        <div style={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 800 }}>{content.brand || 'Brand'}</div>
        {!isMobile && <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>{(content.links || []).map((l, i) => <span key={i}>{l}</span>)}</div>}
        <button style={{ background: accent, color: '#fff', border: 'none', borderRadius: '8px', padding: isMobile ? '0.4rem 0.9rem' : '0.5rem 1.1rem', fontSize: isMobile ? '0.75rem' : '0.8rem', fontWeight: 600, cursor: 'pointer' }}>{content.cta || 'Get Started'}</button>
      </div>
    );
  }

  if (type === 'symbol_hero' || type === 'hero') {
    return (
      <div style={{ padding: isMobile ? '2.5rem 1.5rem' : isTablet ? '4rem 3rem' : '5rem 4rem', backgroundColor: bg, color }}>
        {content.announcement && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#fff5f0', border: '1px solid #ffccb8', borderRadius: '99px', padding: '0.3rem 0.85rem', fontSize: '0.8rem', color: '#ff5500', fontWeight: 600, marginBottom: '2rem' }}>{content.announcement}</div>}
        <h1 style={{ fontSize: isMobile ? '2rem' : isTablet ? '2.75rem' : '3.5rem', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '1.25rem', maxWidth: '800px' }}>{content.headline || content.title || 'Welcome'}</h1>
        <p style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', color: '#52525b', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '600px' }}>{content.subhead || content.description || ''}</p>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button style={{ background: accent, color: '#fff', border: 'none', borderRadius: '99px', padding: isMobile ? '0.75rem 1.5rem' : '0.85rem 2rem', fontSize: isMobile ? '0.9rem' : '1rem', fontWeight: 700, cursor: 'pointer' }}>{content.primaryBtn || 'Get Started'}</button>
          {!isMobile && content.secondaryBtn && <button style={{ background: 'transparent', color, border: `1px solid #e4e4e7`, borderRadius: '99px', padding: '0.85rem 1.75rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>{content.secondaryBtn}</button>}
        </div>
        {!isMobile && content.stats && content.stats.length > 0 && (
          <div style={{ display: 'flex', gap: '3rem', marginTop: '3.5rem' }}>
            {content.stats.map((s, i) => <div key={i}><div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{s.value}</div><div style={{ fontSize: '0.85rem', color: '#71717a', marginTop: '0.25rem' }}>{s.label}</div></div>)}
          </div>
        )}
      </div>
    );
  }

  if (type === 'features') {
    return (
      <div style={{ padding: isMobile ? '2.5rem 1.5rem' : '5rem 3.5rem', backgroundColor: bg, color }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>
          <h2 style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{content.title || 'Features'}</h2>
          <p style={{ fontSize: '1rem', color: '#71717a' }}>{content.subtitle || ''}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.25rem', maxWidth: '1100px', margin: '0 auto' }}>
          {(content.items || []).map((item, idx) => (
            <div key={idx} style={{ padding: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '14px' }}>
              <h3 style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', color: '#71717a', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'pricing') {
    return (
      <div style={{ padding: isMobile ? '2.5rem 1.5rem' : '5rem 3.5rem', backgroundColor: bg }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>
          <h2 style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: 800, color, marginBottom: '0.5rem' }}>{content.title || 'Pricing'}</h2>
          <p style={{ fontSize: '1rem', color: '#71717a' }}>{content.subtitle || ''}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '1.25rem', maxWidth: '1000px', margin: '0 auto' }}>
          {(content.plans || []).map((plan, idx) => (
            <div key={idx} style={{ padding: isMobile ? '1.75rem' : '2.25rem', backgroundColor: plan.isPopular ? '#09090b' : '#ffffff', color: plan.isPopular ? '#fff' : '#09090b', border: '1px solid #e4e4e7', borderRadius: '20px', boxShadow: plan.isPopular ? '0 20px 40px rgba(0,0,0,0.25)' : 'none' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{plan.name}</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>{plan.price}</div>
              <div style={{ fontSize: '0.75rem', color: plan.isPopular ? '#a1a1aa' : '#71717a', marginBottom: '1.5rem' }}>{plan.period}</div>
              {(plan.features || []).map((f, i) => <div key={i} style={{ fontSize: '0.85rem', marginBottom: '0.4rem', display: 'flex', gap: '0.4rem' }}><span>✓</span>{f}</div>)}
              <button style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', borderRadius: '10px', border: 'none', background: plan.isPopular ? accent : '#f4f4f5', color: plan.isPopular ? '#fff' : '#09090b', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>{plan.btnText || 'Choose'}</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'testimonials') {
    return <TestimonialCarousel {...content} />;
  }

  if (type === 'footer') {
    return (
      <div style={{ padding: isMobile ? '2rem 1.5rem' : '3rem 3.5rem', backgroundColor: bg, color, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '1rem' : '0' }}>
        <div>
          <div style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 800, marginBottom: '0.35rem' }}>{content.brand || 'Brand'}</div>
          <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>{content.tagline || ''}</div>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{content.copyright || '© 2026'}</div>
      </div>
    );
  }

  if (type === 'transition_dark_light') {
    return <div style={{ height: content.height || '128px', background: 'linear-gradient(180deg, #09090b 0%, #fafafa 100%)' }} aria-hidden="true" />;
  }
  if (type === 'transition_light_dark') {
    return <div style={{ height: content.height || '128px', background: 'linear-gradient(180deg, #fafafa 0%, #09090b 100%)' }} aria-hidden="true" />;
  }
  if (type === 'motion_reveal') {
    return (
      <div style={{ padding: isMobile ? '2.5rem 1.5rem' : '4rem 3.5rem', backgroundColor: bg, textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: accent, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Scroll reveal</p>
        <p style={{ color: '#71717a' }}>{content.label || 'Content fades up on scroll'}</p>
      </div>
    );
  }
  if (type === 'motion_parallax') {
    return (
      <div style={{ minHeight: content.height || '320px', background: `linear-gradient(135deg, ${bg}, #27272a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color || '#fafafa' }}>
        <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 800 }}>{content.headline || 'Parallax layer'}</h2>
      </div>
    );
  }

  // Generic fallback
  return (
    <div style={{ padding: isMobile ? '2rem 1.5rem' : '3rem', backgroundColor: bg, color, textAlign: 'center' }}>
      <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>{comp.name || type}</div>
    </div>
  );
}
