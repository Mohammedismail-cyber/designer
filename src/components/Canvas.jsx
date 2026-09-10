import React, { useState, useRef, useEffect } from 'react';
import { MousePointer, Hand, Maximize2 } from 'lucide-react';
// Import Standard Component Library components for true rendering
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

export default function Canvas({
  components = [],
  selectedId,
  setSelectedId,
  onUpdateComponentContent: _onUpdateComponentContent,
  onDeleteComponent,
  onMoveComponent,
  viewportMode = 'desktop'
}) {
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [activeTool, setActiveTool] = useState('select');
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const down = (e) => { if (e.code === 'Space' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) { e.preventDefault(); setIsSpacePressed(true); } };
    const up = (e) => { if (e.code === 'Space') setIsSpacePressed(false); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  const handleMouseDown = (e) => {
    if (activeTool === 'hand' || isSpacePressed || e.button === 1) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };
  const handleMouseMove = (e) => { if (isPanning) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setIsPanning(false);
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(z => Math.min(Math.max(0.2, z + (e.deltaY > 0 ? -0.05 : 0.05)), 2.0)); }
    else setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
  };

  const isHandActive = activeTool === 'hand' || isSpacePressed;

  const VIEWPORTS = {
    desktop: { width: '1280px', label: 'Desktop (1280px)', border: '1px solid #e4e4e7', borderRadius: '12px', showFrame: false },
    tablet: { width: '768px', label: 'Tablet (768px)', border: '12px solid #27272a', borderRadius: '20px', showFrame: true, frameType: 'tablet' },
    mobile: { width: '390px', label: 'Mobile (390px)', border: '14px solid #18181b', borderRadius: '48px', showFrame: true, frameType: 'mobile' }
  };
  const vp = VIEWPORTS[viewportMode];

  return (
    <div ref={containerRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onWheel={handleWheel} className="canvas-grid-bg" style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: isPanning ? 'grabbing' : isHandActive ? 'grab' : 'default', userSelect: isPanning ? 'none' : 'auto' }}>
      <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center top', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '60px 80px', minHeight: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Viewport label */}
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#71717a', marginBottom: '0.75rem', userSelect: 'none', letterSpacing: '0.03em' }}>
            {vp.label}
          </div>

          {/* Device outer shell */}
          <div style={{ position: 'relative' }}>
            {/* Mobile status bar notch */}
            {viewportMode === 'mobile' && (
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '120px', height: '30px', backgroundColor: '#18181b', borderRadius: '0 0 18px 18px', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27272a' }} />
                <div style={{ width: '50px', height: '6px', borderRadius: '3px', backgroundColor: '#27272a' }} />
              </div>
            )}
            {/* Tablet camera */}
            {viewportMode === 'tablet' && (
              <div style={{ position: 'absolute', top: '50%', left: '-28px', transform: 'translateY(-50%)', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3f3f46', zIndex: 20 }} />
            )}
            {/* Home indicator for mobile */}
            {viewportMode === 'mobile' && (
              <div style={{ position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)', width: '120px', height: '5px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.2)', zIndex: 20 }} />
            )}

            <div style={{
              width: vp.width,
              minHeight: viewportMode === 'desktop' ? '800px' : viewportMode === 'tablet' ? '1024px' : '844px',
              backgroundColor: '#ffffff',
              borderRadius: vp.borderRadius,
              border: vp.border,
              boxShadow: viewportMode === 'desktop'
                ? '0 25px 70px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.02)'
                : viewportMode === 'tablet'
                ? '0 40px 100px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)'
                : '0 50px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
              overflow: 'hidden',
              color: '#09090b',
              position: 'relative',
              transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}>
              {/* Status bar for mobile */}
              {viewportMode === 'mobile' && (
                <div style={{ height: '44px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', fontSize: '0.65rem', fontWeight: 700, color: '#09090b', flexShrink: 0 }}>
                  <span>9:41</span>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end' }}>
                      {[4,6,8,10].map((h,i) => <div key={i} style={{ width: '3px', height: `${h}px`, backgroundColor: '#09090b', borderRadius: '1px' }} />)}
                    </div>
                    <span>●</span>
                    <span>⬤⬤⬤</span>
                  </div>
                </div>
              )}

              {components.length === 0 ? (
                <div style={{ height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', padding: '2rem', textAlign: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '2rem', opacity: 0.3 }}>✦</div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#71717a' }}>Blank Canvas</p>
                  <p style={{ fontSize: '0.8rem', lineHeight: 1.5, maxWidth: '280px' }}>Add sections from the Assets panel on the left, or describe what you want to build in the AI Assistant.</p>
                </div>
              ) : (
                components.map((comp, idx) => (
                  <RenderSection key={comp.id} comp={comp} isSelected={selectedId === comp.id} onSelect={() => setSelectedId(comp.id)} onDelete={() => onDeleteComponent(comp.id)} onMoveUp={() => onMoveComponent(idx, -1)} onMoveDown={() => onMoveComponent(idx, 1)} viewportMode={viewportMode} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating toolbar */}
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '99px', padding: '0.3rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', zIndex: 100 }}>
        <button onClick={() => setActiveTool('select')} style={{ backgroundColor: activeTool === 'select' && !isSpacePressed ? 'rgba(168,85,247,0.12)' : 'transparent', border: 'none', borderRadius: '99px', padding: '0.35rem', color: activeTool === 'select' && !isSpacePressed ? '#a855f7' : '#71717a', cursor: 'pointer' }} title="Select (V)"><MousePointer size={14} /></button>
        <button onClick={() => setActiveTool('hand')} style={{ backgroundColor: isHandActive ? 'rgba(168,85,247,0.12)' : 'transparent', border: 'none', borderRadius: '99px', padding: '0.35rem', color: isHandActive ? '#a855f7' : '#71717a', cursor: 'pointer' }} title="Pan (Space)"><Hand size={14} /></button>
        <div style={{ width: '1px', height: '14px', backgroundColor: '#e4e4e7' }} />
        <select value={Math.round(zoom * 100)} onChange={e => setZoom(Number(e.target.value) / 100)} style={{ backgroundColor: '#fafafa', border: '1px solid #e4e4e7', color: '#09090b', fontSize: '0.72rem', fontWeight: 600, borderRadius: '6px', padding: '0.2rem 0.35rem', outline: 'none', cursor: 'pointer' }}>
          {[25,50,75,85,100,125,150,200].map(v => <option key={v} value={v}>{v}%</option>)}
        </select>
        <button onClick={() => { setZoom(0.85); setPan({ x: 0, y: 0 }); }} className="btn-ghost" title="Reset View"><Maximize2 size={13} /></button>
      </div>
    </div>
  );
}

function RenderSection({ comp, isSelected, onSelect, onDelete, onMoveUp, onMoveDown, viewportMode }) {
  const { type, content = {}, styles = {} } = comp;
  const isMobile = viewportMode === 'mobile';
  const isTablet = viewportMode === 'tablet';

  return (
    <div onClick={onSelect} style={{ position: 'relative', backgroundColor: styles.bgColor || '#ffffff', color: styles.textColor || '#09090b', outline: isSelected ? '2px solid #a855f7' : 'none', outlineOffset: '-2px', cursor: 'pointer', overflow: 'hidden' }}>
      {isSelected && (
        <div style={{ position: 'absolute', top: '-30px', right: '12px', backgroundColor: '#9333ea', color: '#fff', borderRadius: '6px 6px 0 0', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 50 }}>
          <span>{comp.name || comp.type}</span>
          <button onClick={e => { e.stopPropagation(); onMoveUp(); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.7rem', padding: '0' }}>▲</button>
          <button onClick={e => { e.stopPropagation(); onMoveDown(); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.7rem', padding: '0' }}>▼</button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.8rem', padding: '0' }}>✕</button>
        </div>
      )}

      {/* NAVBAR - Standard Component Library */}
      {type === 'sticky_blurred_nav' && (
        <StickyBlurredNav logo={<div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{content.brand || 'Brand'}</div>} links={(content.links || []).map(l => ({ label: l, href: '#' }))} cta={content.cta} />
      )}
      {type === 'mega_menu' && (
        <MegaMenu brand={content.brand} menuItems={content.menuItems} />
      )}
      {type === 'mobile_full_screen_drawer' && (
        <MobileFullScreenDrawer brand={content.brand} menuItems={content.menuItems} />
      )}
      {type === 'route_page_transition' && (
        <RoutePageTransition />
      )}

      {/* LEGACY NAVBAR */}
      {type === 'navbar' && (
        <div style={{ padding: isMobile ? '0.9rem 1.25rem' : '1.25rem 3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e7', backgroundColor: styles.bgColor || '#ffffff', flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? '0.75rem' : '0' }}>
          <div style={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 800 }}>{content.brand || 'Brand'}</div>
          {!isMobile && (
            <div style={{ display: 'flex', gap: isTablet ? '1.25rem' : '1.75rem', fontSize: '0.85rem', fontWeight: 500 }}>
              {(content.links || ['Home', 'Features', 'Pricing']).map((l, i) => <span key={i}>{l}</span>)}
            </div>
          )}
          <button className="btn-primary" style={{ padding: isMobile ? '0.4rem 0.9rem' : '0.45rem 1.1rem', fontSize: isMobile ? '0.75rem' : '0.8rem', background: styles.accentColor || '#a855f7' }}>{content.cta || 'Get Started'}</button>
        </div>
      )}

      {/* HERO - Standard Component Library */}
      {type === 'animated_gradient_hero' && (
        <AnimatedGradientHero title={content.title} subtitle={content.subtitle} ctaText={content.ctaText} gradientColors={content.gradientColors} />
      )}
      {type === 'image_background_hero' && (
        <ImageBackgroundHero title={content.title} subtitle={content.subtitle} ctaText={content.ctaText} imageSrc={content.imageSrc} />
      )}
      {type === 'globe_hero' && (
        <GlobeHero title={content.title} subtitle={content.subtitle} ctaText={content.ctaText} darkMode={content.darkMode} />
      )}
      {type === 'product_mockup_hero' && (
        <ProductMockupHero title={content.title} subtitle={content.subtitle} ctaText={content.ctaText} mockupImage={content.mockupImage} />
      )}
      {type === 'split_screen_hero' && (
        <SplitScreenHero title={content.title} subtitle={content.subtitle} ctaText={content.ctaText} visualPosition={content.visualPosition} />
      )}
      {type === 'video_background_hero' && (
        <VideoBackgroundHero title={content.title} subtitle={content.subtitle} ctaText={content.ctaText} videoSrc={content.videoSrc} />
      )}

      {/* LEGACY SYMBOL HERO */}
      {type === 'symbol_hero' && (
        <div style={{ padding: isMobile ? '2.5rem 1.5rem' : isTablet ? '3.5rem 2.5rem' : '5rem 4rem', backgroundColor: '#ffffff', color: '#09090b' }}>
          {content.announcement && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#fff5f0', border: '1px solid #ffccb8', borderRadius: '99px', padding: '0.3rem 0.85rem', fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#ff5500', fontWeight: 600, marginBottom: isMobile ? '1.5rem' : '2rem' }}>
              {content.announcement}
            </div>
          )}

          <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: 'column', gridTemplateColumns: isTablet ? '1fr' : '1.2fr 0.8fr', gap: isMobile ? '2rem' : '3rem', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '2rem' : isTablet ? '2.75rem' : '3.75rem', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: isMobile ? '1rem' : '1.5rem', fontFamily: 'var(--font-display)' }}>
                {content.headline || 'Build Modern Interfaces'}
              </h1>
              <p style={{ fontSize: isMobile ? '0.95rem' : '1.15rem', color: '#52525b', lineHeight: 1.6, marginBottom: isMobile ? '1.75rem' : '2.5rem', maxWidth: '540px' }}>
                {content.subhead}
              </p>
              <div style={{ display: 'flex', gap: isMobile ? '0.65rem' : '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ background: styles.accentColor || '#ff5500', padding: isMobile ? '0.7rem 1.25rem' : '0.85rem 1.75rem', fontSize: isMobile ? '0.85rem' : '0.95rem', borderRadius: '99px', boxShadow: '0 4px 14px rgba(255,85,0,0.3)' }}>
                  {content.primaryBtn || 'Get Started →'}
                </button>
                {!isMobile && <button className="btn-secondary" style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem', borderRadius: '99px' }}>{content.secondaryBtn || 'Learn More'}</button>}
              </div>
            </div>

            {!isMobile && (content.stats && content.stats.length > 0) && (
              <div style={{ backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '20px', padding: isTablet ? '1.75rem' : '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isTablet ? '1.5rem' : '2rem' }}>
                {content.stats.map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: isTablet ? '2rem' : '2.5rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.03em' }}>{s.value}</div>
                    <div style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 500, marginTop: '0.25rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTENT - Standard Component Library */}
      {type === 'bento_grid' && (
        <BentoGrid items={(content.items || []).map(i => ({ content: i.content, span: i.span }))} />
      )}
      {type === 'logo_marquee' && (
        <LogoMarquee logos={(content.logos || []).map(l => typeof l === 'string' ? <div key={l} style={{ fontSize: '1.5rem', fontWeight: 700 }}>{l}</div> : l)} />
      )}
      {type === 'testimonial_carousel' && (
        <TestimonialCarousel testimonials={(content.testimonials || []).map(t => ({ quote: t.text, name: t.name, role: t.role, avatar: null }))} />
      )}
      {type === 'case_study_grid' && (
        <CaseStudyGrid cases={(content.cases || []).map(c => ({ title: c.title, description: c.description, category: c.category, preview: c.preview || null }))} />
      )}
      {type === 'pricing_table' && (
        <PricingTable plans={content.plans} />
      )}
      {type === 'faq' && (
        <FAQAccordion items={(content.items || []).map(i => ({ question: i.question || i.title || '', answer: i.answer || i.desc || '' }))} />
      )}
      {type === 'team_grid' && (
        <TeamGrid members={(content.members || []).map(m => ({ name: m.name, role: m.role, image: m.image || null, socials: m.socials || [] }))} />
      )}

      {/* LEGACY FEATURES GRID */}
      {type === 'features' && (
        <div style={{ padding: isMobile ? '2.5rem 1.5rem' : isTablet ? '3.5rem 2.5rem' : styles.paddingY || '4rem 3.5rem', backgroundColor: styles.bgColor || '#fafafa' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>
            <h2 style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: 800, color: styles.textColor || '#09090b', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{content.title || 'Features'}</h2>
            <p style={{ fontSize: isMobile ? '0.85rem' : '1rem', color: '#71717a' }}>{content.subtitle || ''}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(260px, 1fr))', gap: isMobile ? '1rem' : '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
            {(content.items || []).map((item, idx) => (
              <div key={idx} style={{ padding: isMobile ? '1.5rem' : '1.75rem', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: 700, color: '#09090b', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', color: '#71717a', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRICING CARDS */}
      {type === 'pricing' && (
        <div style={{ padding: isMobile ? '2.5rem 1.5rem' : '4rem 3.5rem', backgroundColor: styles.bgColor || '#fafafa' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>
            <h2 style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: 800, color: '#09090b', marginBottom: '0.5rem' }}>{content.title || 'Pricing'}</h2>
            <p style={{ fontSize: isMobile ? '0.85rem' : '0.95rem', color: '#71717a' }}>{content.subtitle || ''}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: isMobile ? '1rem' : '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
            {(content.plans || []).map((plan, idx) => (
              <div key={idx} style={{ padding: isMobile ? '1.75rem' : '2.25rem', backgroundColor: plan.isPopular ? '#09090b' : '#ffffff', color: plan.isPopular ? '#ffffff' : '#09090b', border: '1px solid #e4e4e7', borderRadius: '20px', position: 'relative', boxShadow: plan.isPopular ? '0 20px 40px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{plan.name}</h3>
                <div style={{ fontSize: isMobile ? '2.25rem' : '2.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>{plan.price}</div>
                <div style={{ fontSize: '0.75rem', color: plan.isPopular ? '#a1a1aa' : '#71717a', marginBottom: isMobile ? '1.25rem' : '1.75rem' }}>{plan.period}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: isMobile ? '1.5rem' : '2rem', fontSize: isMobile ? '0.8rem' : '0.85rem' }}>
                  {(plan.features || []).map((f, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>✓</span> {f}</div>))}
                </div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: isMobile ? '0.65rem' : '0.75rem', fontSize: isMobile ? '0.8rem' : '0.85rem', background: plan.isPopular ? '#a855f7' : '#f4f4f5', color: plan.isPopular ? '#fff' : '#09090b', border: 'none' }}>{plan.btnText || 'Choose'}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCROLL - Standard Component Library */}
      {type === 'scroll_fill_device_mockup' && (
        <ScrollFillDeviceMockup screens={(content.screens || []).map(s => typeof s === 'string' ? <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>{s}</div> : s)} />
      )}
      {type === 'horizontal_scroll_gallery' && (
        <HorizontalScrollGallery items={(content.items || []).map(i => typeof i === 'string' ? <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>{i}</div> : i)} />
      )}
      {type === 'scroll_linked_theme_transition' && (
        <ScrollLinkedThemeTransition fromColor={content.fromColor} toColor={content.toColor} />
      )}
      {type === 'pinned_sticky_section' && (
        <PinnedStickySection pinnedContent={content.pinnedContent || <div style={{ fontSize: '2rem', fontWeight: 700 }}>Pinned Content</div>} scrollingContent={content.scrollingContent || <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Scrolling Content</div>} />
      )}
      {type === 'parallax_layered_images' && (
        <ParallaxLayeredImages layers={(content.images || []).map(i => typeof i === 'string' ? <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>{i}</div> : i)} />
      )}
      {type === 'split_text_scroll_reveal' && (
        <SplitTextScrollReveal text={content.text} />
      )}
      {type === 'scroll_triggered_counters' && (
        <ScrollTriggeredCounters stats={content.stats} />
      )}

      {/* FORMS - Standard Component Library */}
      {type === 'multi_step_form' && (
        <MultiStepForm steps={(content.steps || []).map(s => ({ component: typeof s === 'string' ? <div key={s} style={{ padding: '2rem', fontSize: '1.5rem', fontWeight: 700 }}>{s}</div> : s }))} />
      )}
      {type === 'floating_label_inputs' && (
        <FloatingLabelInputs fields={(content.fields || []).map(f => ({ name: f.name || 'field', label: f.label || 'Field', type: f.type || 'text' }))} />
      )}
      {type === 'inline_newsletter_signup' && (
        <InlineNewsletterSignup />
      )}

      {/* MEDIA - Standard Component Library */}
      {type === 'image_lightbox' && (
        <ImageLightbox images={(content.images || []).map(i => typeof i === 'string' ? { thumbnail: <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>{i}</div>, full: <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>{i}</div> } : i)} />
      )}
      {type === 'before_after_slider' && (
        <BeforeAfterSlider beforeImage={content.beforeImage || <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>Before</div>} afterImage={content.afterImage || <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>After</div>} />
      )}
      {type === 'autoplay_card_video' && (
        <AutoplayCardVideo videoSrc={content.videoSrc || ''} poster={content.poster} />
      )}

      {/* INTERACTION - Standard Component Library */}
      {type === 'standalone_interactive_globe' && (
        <StandaloneInteractiveGlobe darkMode={content.darkMode} markers={content.markers || []} width={content.width || 600} height={content.height || 600} />
      )}
      {type === '3d_object_viewer' && (
        <ThreeDObjectViewer>{content.children || <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>3D Object</div>}</ThreeDObjectViewer>
      )}
      {type === 'ambient_particle_background' && (
        <AmbientParticleBackground particleCount={content.particleCount || 50} />
      )}
      {type === 'cursor_spotlight' && (
        <CursorSpotlight>{content.children || <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>Content</div>}</CursorSpotlight>
      )}
      {type === 'magnetic_button' && (
        <MagneticButton>{content.children || <div style={{ padding: '1rem 2rem', fontSize: '1rem', fontWeight: 700 }}>Button</div>}</MagneticButton>
      )}
      {type === 'mouse_tilt_card' && (
        <MouseTiltCard>{content.children || <div style={{ padding: '2rem', fontSize: '1.5rem', fontWeight: 700 }}>Card Content</div>}</MouseTiltCard>
      )}
      {type === 'custom_cursor' && (
        <CustomCursor />
      )}

      {/* FOOTER - Standard Component Library */}
      {type === 'big_logotype_footer' && (
        <BigLogotypeFooter logo={content.logo} sitemap={(content.sitemap || []).map(s => ({ label: s.title, href: '#' }))} contactInfo={content.contactInfo || []} socialLinks={content.socialLinks || []} />
      )}
      {type === 'newsletter_footer' && (
        <NewsletterFooter logo={content.logo} sitemap={content.sitemap || []} socialLinks={content.socialLinks || []} />
      )}

      {/* LEGACY FOOTER */}
      {type === 'footer' && (
        <div style={{ padding: isMobile ? '2rem 1.5rem' : '3rem 3.5rem', backgroundColor: styles.bgColor || '#09090b', color: styles.textColor || '#ffffff', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '1rem' : '0' }}>
          <div>
            <div style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: 800, marginBottom: '0.35rem' }}>{content.brand || 'Brand'}</div>
            <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>{content.tagline || ''}</div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{content.copyright || '© 2026'}</div>
        </div>
      )}

      {/* TESTIMONIALS */}
      {type === 'testimonials' && (
        <div style={{ padding: isMobile ? '2.5rem 1.5rem' : '5rem 3.5rem', backgroundColor: styles.bgColor || '#ffffff', color: styles.textColor || '#09090b' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>
            <h2 style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{content.title || 'What People Say'}</h2>
            <p style={{ fontSize: '1rem', color: '#71717a' }}>{content.subtitle || ''}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '1.25rem', maxWidth: '1100px', margin: '0 auto' }}>
            {(content.quotes || []).map((q, i) => (
              <div key={i} style={{ padding: '1.75rem', backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '2px' }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: '#f59e0b', fontSize: '0.85rem' }}>★</span>)}</div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: '#374151', fontStyle: 'italic' }}>"{q.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>{q.name?.[0] || 'U'}</div>
                  <div><div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{q.name}</div><div style={{ fontSize: '0.75rem', color: '#71717a' }}>{q.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STATS */}
      {type === 'stats' && (
        <div style={{ padding: isMobile ? '2.5rem 1.5rem' : '5rem 3.5rem', backgroundColor: styles.bgColor || '#09090b', color: styles.textColor || '#ffffff' }}>
          {content.title && <h2 style={{ textAlign: 'center', fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: 800, marginBottom: isMobile ? '2.5rem' : '3.5rem', letterSpacing: '-0.02em' }}>{content.title}</h2>}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : `repeat(${Math.min((content.items||[]).length,4)},1fr)`, gap: '2rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            {(content.items || []).map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: isMobile ? '2.25rem' : '3rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(135deg,#a855f7,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{item.value}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.35rem' }}>{item.label}</div>
                {item.desc && <div style={{ fontSize: '0.8rem', color: '#71717a', marginTop: '0.25rem' }}>{item.desc}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA BANNER */}
      {type === 'cta_banner' && (
        <div style={{ padding: isMobile ? '3rem 1.5rem' : '5rem 3.5rem', background: 'linear-gradient(135deg, #09090b 0%, #1e0533 100%)', color: '#ffffff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.75rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em', position: 'relative' }}>{content.headline || 'Ready to Build Something Great?'}</h2>
          <p style={{ fontSize: isMobile ? '1rem' : '1.15rem', color: '#a1a1aa', marginBottom: '2.5rem', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>{content.subhead || ''}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <button className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', borderRadius: '12px', boxShadow: '0 8px 24px rgba(168,85,247,0.4)' }}>{content.primaryBtn || 'Get Started'}</button>
            {content.secondaryBtn && <button className="btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', borderRadius: '12px', backgroundColor: 'transparent', color: '#ffffff', borderColor: '#3f3f46' }}>{content.secondaryBtn}</button>}
          </div>
        </div>
      )}

      {/* FAQ */}
      {type === 'faq' && (
        <div style={{ padding: isMobile ? '2.5rem 1.5rem' : '5rem 3.5rem', backgroundColor: styles.bgColor || '#fafafa', color: styles.textColor || '#09090b' }}>
          <h2 style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: 800, textAlign: 'center', marginBottom: isMobile ? '2.5rem' : '3.5rem', letterSpacing: '-0.02em' }}>{content.title || 'FAQ'}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '720px', margin: '0 auto' }}>
            {(content.items || []).map((item, i) => (
              <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '14px', padding: '1.5rem' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.65rem', color: '#09090b' }}>{item.question}</div>
                <div style={{ fontSize: '0.875rem', color: '#71717a', lineHeight: 1.65 }}>{item.answer}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEAM */}
      {type === 'team' && (
        <div style={{ padding: isMobile ? '2.5rem 1.5rem' : '5rem 3.5rem', backgroundColor: styles.bgColor || '#ffffff', color: styles.textColor || '#09090b' }}>
          <h2 style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: 800, textAlign: 'center', marginBottom: isMobile ? '2.5rem' : '3.5rem', letterSpacing: '-0.02em' }}>{content.title || 'Our Team'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            {(content.members || []).map((m, i) => (
              <div key={i} style={{ padding: '2rem', backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '18px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `linear-gradient(135deg, hsl(${i * 60 + 260}, 70%, 60%), hsl(${i * 60 + 300}, 70%, 50%))`, margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{m.name?.[0] || 'T'}</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.25rem' }}>{m.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 600, marginBottom: '0.75rem' }}>{m.role}</div>
                <div style={{ fontSize: '0.825rem', color: '#71717a', lineHeight: 1.55 }}>{m.bio}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MOTION — Dark → Light transition */}
      {type === 'transition_dark_light' && (
        <div style={{ height: content.height || '128px', background: 'linear-gradient(180deg, #09090b 0%, #fafafa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)' }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: '#71717a', textTransform: 'uppercase', backgroundColor: 'rgba(255,255,255,0.8)', padding: '0.35rem 0.75rem', borderRadius: '99px' }}>Dark → Light</span>
        </div>
      )}

      {/* MOTION — Light → Dark transition */}
      {type === 'transition_light_dark' && (
        <div style={{ height: content.height || '128px', background: 'linear-gradient(180deg, #fafafa 0%, #09090b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: '#71717a', textTransform: 'uppercase', backgroundColor: 'rgba(0,0,0,0.06)', padding: '0.35rem 0.75rem', borderRadius: '99px' }}>Light → Dark</span>
        </div>
      )}

      {/* MOTION — Scroll reveal */}
      {type === 'motion_reveal' && (
        <div style={{ padding: isMobile ? '2.5rem 1.5rem' : '4rem 3.5rem', backgroundColor: styles.bgColor || '#fafafa', textAlign: 'center', borderTop: '1px dashed rgba(168,85,247,0.3)', borderBottom: '1px dashed rgba(168,85,247,0.3)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 700, color: '#a855f7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#a855f7', animation: 'pulse 1.5s infinite' }} /> Scroll Reveal
          </div>
          <p style={{ fontSize: isMobile ? '0.9rem' : '1rem', color: '#71717a' }}>{content.label || 'Content fades up on scroll'}</p>
        </div>
      )}

      {/* MOTION — Parallax */}
      {type === 'motion_parallax' && (
        <div style={{ minHeight: content.height || '320px', background: `linear-gradient(135deg, ${styles.bgColor || '#18181b'} 0%, #27272a 50%, ${styles.accentColor || '#a855f7'}33 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: '-20%', background: 'radial-gradient(circle at 30% 40%, rgba(168,85,247,0.15), transparent 50%)', transform: 'translateY(-10%)' }} />
          <div style={{ position: 'relative', textAlign: 'center', color: styles.textColor || '#fafafa' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.6, marginBottom: '0.5rem' }}>PARALLAX LAYER</div>
            <h3 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{content.headline || 'Depth on scroll'}</h3>
          </div>
        </div>
      )}

      {/* GENERIC FALLBACK for unknown types */}
      {!['navbar','sticky_blurred_nav','mega_menu','mobile_full_screen_drawer','route_page_transition','symbol_hero','video_background_hero','image_background_hero','animated_gradient_hero','globe_hero','product_mockup_hero','split_screen_hero','features','bento_grid','logo_marquee','testimonials','testimonial_carousel','case_study_grid','pricing','pricing_table','footer','big_logotype_footer','newsletter_footer','stats','cta_banner','faq','faq_accordion','team','team_grid','scroll_fill_device_mockup','horizontal_scroll_gallery','scroll_linked_theme_transition','pinned_sticky_section','parallax_layered_images','split_text_scroll_reveal','scroll_triggered_counters','standalone_interactive_globe','3d_object_viewer','ambient_particle_background','cursor_spotlight','magnetic_button','mouse_tilt_card','custom_cursor','multi_step_form','floating_label_inputs','inline_newsletter_signup','image_lightbox','before_after_slider','autoplay_card_video','transition_dark_light','transition_light_dark','motion_reveal','motion_parallax'].includes(type) && (
        <div style={{ padding: isMobile ? '2rem 1.5rem' : '3.5rem', backgroundColor: styles.bgColor || '#fafafa', color: styles.textColor || '#09090b', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <span style={{ fontSize: '1.25rem' }}>✦</span>
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#09090b', marginBottom: '0.35rem' }}>{comp.name || type}</div>
          <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Switch to Preview mode to see this section rendered.</p>
        </div>
      )}
    </div>
  );
}
