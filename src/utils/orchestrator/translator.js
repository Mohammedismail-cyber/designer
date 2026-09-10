// ──────────────────────────────────────────────────────────────────────────────
// PlanTranslator — converts Orchestrator_Plan → Section[] for Canvas.jsx
// ──────────────────────────────────────────────────────────────────────────────

export const SUPPORTED_TYPES = new Set([
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
]);

// Human-readable names for section types
const TYPE_NAMES = {
  // Navigation
  navbar: 'Header Navbar',
  sticky_blurred_nav: 'Sticky Blurred Nav',
  mega_menu: 'Mega Menu',
  mobile_full_screen_drawer: 'Mobile Full-Screen Drawer',
  route_page_transition: 'Route Page Transition',
  // Hero Patterns
  symbol_hero: 'Hero Section',
  video_background_hero: 'Video Background Hero',
  image_background_hero: 'Image Background Hero (Parallax)',
  animated_gradient_hero: 'Animated Gradient Hero',
  globe_hero: 'Globe Hero',
  product_mockup_hero: 'Product Mockup Hero',
  split_screen_hero: 'Split-Screen Hero',
  // Scroll-Driven Sequences
  scroll_fill_device_mockup: 'Scroll-Fill Device Mockup',
  horizontal_scroll_gallery: 'Horizontal Scroll Gallery',
  scroll_linked_theme_transition: 'Scroll-Linked Theme Transition',
  pinned_sticky_section: 'Pinned Sticky Section',
  parallax_layered_images: 'Parallax Layered Images',
  split_text_scroll_reveal: 'Split-Text Scroll Reveal',
  scroll_triggered_counters: 'Scroll-Triggered Counters',
  // 3D & Cursor-Aware Interaction
  standalone_interactive_globe: 'Standalone Interactive Globe',
  '3d_object_viewer': '3D Object Viewer',
  ambient_particle_background: 'Ambient Particle Background',
  cursor_spotlight: 'Cursor Spotlight',
  magnetic_button: 'Magnetic Button',
  mouse_tilt_card: 'Mouse-Tilt Card',
  custom_cursor: 'Custom Cursor',
  // Content Sections
  features: 'Features Grid',
  bento_grid: 'Bento Grid',
  logo_marquee: 'Logo Marquee',
  testimonials: 'Testimonials',
  case_study_grid: 'Case Study Grid',
  pricing: 'Pricing Plans',
  pricing_table: 'Pricing Table',
  faq: 'FAQ Section',
  team: 'Team Section',
  // Footer
  footer: 'Footer',
  big_logotype_footer: 'Big Logotype Footer',
  newsletter_footer: 'Newsletter Footer',
  // Forms & Inputs
  multi_step_form: 'Multi-Step Form',
  floating_label_inputs: 'Floating-Label Inputs',
  inline_newsletter_signup: 'Inline Newsletter Signup',
  // Media
  image_lightbox: 'Image Lightbox',
  before_after_slider: 'Before/After Slider',
  autoplay_card_video: 'Autoplay Card Video',
  // Legacy types for backward compatibility
  stats: 'Key Stats',
  cta_banner: 'CTA Banner',
  transition_dark_light: 'Dark → Light Transition',
  transition_light_dark: 'Light → Dark Transition',
  motion_reveal: 'Scroll Reveal',
  motion_parallax: 'Parallax Layer',
};

/**
 * Converts a component descriptor from the plan into a canvas Section object.
 * Returns null if the componentType is not supported.
 */
function descriptorToSection(descriptor, designSystem, stylesMap, index) {
  const type = descriptor.componentType;

  if (!SUPPORTED_TYPES.has(type)) {
    console.warn(`[PlanTranslator] Unsupported type skipped: "${type}" (componentId: ${descriptor.componentId})`);
    return null;
  }

  const ts = Date.now();
  const id = `${type}_${ts}_${index}`;

  // Styles: prefer sidecar styles map, then design system
  const styleEntry = stylesMap?.[descriptor.componentId];
  const palette    = designSystem?.colorPalette || {};

  const styles = {
    bgColor:     styleEntry?.bgColor     || palette.base    || '#ffffff',
    textColor:   styleEntry?.textColor   || palette.text    || '#09090b',
    accentColor: styleEntry?.accentColor || palette.accent  || '#a855f7',
  };

  // If section is meant to be dark (stats, footer, cta_banner) and no explicit override, apply sensible defaults
  if (!styleEntry) {
    if (type === 'stats' || type === 'footer' || type === 'cta_banner') {
      styles.bgColor   = palette.base === '#ffffff' ? '#09090b' : palette.base;
      styles.textColor = '#ffffff';
    }
    if (type === 'features') {
      styles.bgColor = palette.surface || '#fafafa';
    }
  }

  return {
    id,
    type,
    name:    TYPE_NAMES[type] || type,
    content: descriptor.content || {},
    styles,
  };
}

/**
 * Builds a Map<componentId, styles> from the plan's sidecar styles array.
 */
function buildStylesMap(plan) {
  const map = {};
  for (const entry of (plan.componentsToAuthor_styles || [])) {
    if (entry.componentId) map[entry.componentId] = entry;
  }
  return map;
}

/**
 * Merges new sections into existingComps according to requestType.
 * Returns { sections, success, failureReason }
 */
function mergeIntoCanvas(newSections, existingComps, requestType, intentContext) {
  switch (requestType) {
    case 'new_project':
    case 'redesign':
      return { sections: newSections, success: true };

    case 'add_section':
    case 'add_component':
    case 'add_page':
      return { sections: [...existingComps, ...newSections], success: true };

    case 'edit_section': {
      const targetType = intentContext?.targetSectionType;
      const targetId   = intentContext?.targetSectionId;
      const idx = existingComps.findIndex(c =>
        (targetId && c.id === targetId) ||
        (targetType && c.type === targetType)
      );
      if (idx === -1) {
        return {
          sections: existingComps,
          success: false,
          failureReason: `edit_section: no section matching type="${targetType}" or id="${targetId}" found in canvas`,
        };
      }
      const updated = [...existingComps];
      updated[idx] = { ...updated[idx], ...newSections[0], id: updated[idx].id };
      return { sections: updated, success: true };
    }

    case 'edit_component': {
      const targetType = intentContext?.targetSectionType;
      const targetId   = intentContext?.targetSectionId;
      const idx = existingComps.findIndex(c =>
        (targetId && c.id === targetId) ||
        (targetType && c.type === targetType)
      );
      if (idx === -1) {
        return {
          sections: existingComps,
          success: false,
          failureReason: `edit_component: no section matching type="${targetType}" or id="${targetId}" found in canvas`,
        };
      }
      const patchContent = newSections[0]?.content || {};
      const updated = [...existingComps];
      updated[idx] = {
        ...updated[idx],
        content: { ...updated[idx].content, ...patchContent },
      };
      return { sections: updated, success: true };
    }

    default:
      return { sections: [...existingComps, ...newSections], success: true };
  }
}

/**
 * Main entry point.
 * Converts the plan's componentsToAuthor into Section[] and merges with existingComps.
 * Returns { sections, skipped, success, failureReason }
 */
export function translate(plan, existingComps, intentContext) {
  const stylesMap = buildStylesMap(plan);
  const designSystem = plan.designSystem || {};

  // Build new sections from descriptors
  const newSections = [];
  let skipped = 0;

  for (let i = 0; i < plan.componentsToAuthor.length; i++) {
    const descriptor = plan.componentsToAuthor[i];
    if (!descriptor || !descriptor.componentType) {
      console.warn(`[PlanTranslator] Descriptor at index ${i} has no componentType — skipped`);
      skipped++;
      continue;
    }
    const section = descriptorToSection(descriptor, designSystem, stylesMap, i);
    if (section) {
      newSections.push(section);
    } else {
      skipped++;
    }
  }

  // Out-of-scope guard: discard sections whose type is not listed in scope.inScope
  // (only enforced for incremental requests where inScope is populated)
  const inScope = plan.scope?.inScope || [];
  const filteredSections = (inScope.length > 0 && plan.requestType !== 'new_project' && plan.requestType !== 'redesign')
    ? newSections.filter(s => {
        const ok = inScope.includes(s.type);
        if (!ok) {
          console.warn(`[PlanTranslator] Out-of-scope section discarded: ${s.type}`);
          skipped++;
        }
        return ok;
      })
    : newSections;

  const { sections, success, failureReason } = mergeIntoCanvas(
    filteredSections, existingComps, plan.requestType, intentContext
  );

  return { sections, skipped, success, failureReason };
}
