# STANDARD COMPONENT & EFFECTS LIBRARY

This is the finite menu of components the system builds from. Giving the model a named, bounded list — instead of "invent whatever" — is what actually fixes vague or generic output: a local model asked to "design a hero" guesses; a local model asked to pick from 6 named hero patterns and justify the pick performs far more reliably.

**Orchestrator:** when building a plan, select components from this list by name whenever one fits. Only invent something outside this list when the request genuinely needs it, and say so explicitly in `componentsToAuthor`.
**Generator:** build using the package for each component type below. Don't substitute a heavier or lighter tool than the one listed without a reason.

---

## 1. Hero Patterns
- **Video Background Hero** — full-bleed autoplay/muted/looped video, gradient scrim for text legibility.
- **Image Background Hero (Parallax)** — background image moves slower than foreground content on scroll.
- **Animated Gradient / Mesh Hero** — slow-moving abstract gradient, used sparingly and specifically, never as a generic purple-blue default.
- **Globe Hero** — rotating interactive globe, common on "global network / infrastructure / logistics" positioning.
- **Product Mockup Hero** — a floating dashboard, app screen, or device frame overlaid on the hero, often with mouse-tilt.
- **Split-Screen Hero** — headline on one side, visual/mockup on the other, asymmetric rather than centered.

## 2. Scroll-Driven Sequences
- **Scroll-Fill Device Mockup** — a phone or browser frame stays pinned in the viewport while its inner content changes as the user scrolls, so scrolling "fills up" the device with successive screens. The single most requested Framer-style effect.
- **Horizontal Scroll Gallery** — vertical scroll input drives horizontal movement of a row of cards/images.
- **Scroll-Linked Theme Transition** — background color (or whole page theme) interpolates continuously as the user scrolls, e.g. white → black across a section.
- **Pinned Sticky Section** — a section locks in place while adjacent content scrolls past or swaps inside it.
- **Parallax Layered Images** — multiple image layers move at different speeds to create depth.
- **Split-Text Scroll Reveal** — headline text splits into words/characters and animates in as it enters the viewport.
- **Scroll-Triggered Counters** — numbers/stats count up once they enter the viewport.

## 3. 3D & Cursor-Aware Interaction
- **Standalone Interactive Globe** — draggable/auto-rotating, used outside the hero too (e.g. a "trusted worldwide" section).
- **3D Object Viewer** — a product or shape the user can rotate by dragging.
- **Ambient Particle Background** — subtle floating particles or shapes behind content.
- **Cursor Spotlight / Blob** — a soft light or shape that follows the cursor, usually behind cards to add depth on hover.
- **Magnetic Button** — a button that subtly pulls toward the cursor as it approaches.
- **Mouse-Tilt Card** — a mockup or card that tilts in 3D based on cursor position, mimicking depth.
- **Custom Cursor** — replaces the default cursor with a shape/label that changes contextually over interactive elements.

## 4. Navigation
- **Sticky Blurred Nav** — background blurs and the bar shrinks slightly once the user scrolls past the hero.
- **Mega Menu** — dropdown with grouped links and preview imagery, not just a plain list.
- **Mobile Full-Screen Drawer** — a real designed mobile menu (not a shrunk desktop nav), typically slide-in or full-screen overlay.
- **Route/Page Transition** — an animated exit/enter between pages instead of an instant hard cut.

## 5. Content Sections
- **Bento Grid** — asymmetric grid of differently-sized cards, each highlighting one feature/stat/testimonial.
- **Logo Marquee** — infinite horizontally-scrolling strip of client/partner logos.
- **Testimonial Carousel** — swipeable/auto-advancing quote cards.
- **Case Study Grid with Hover-Preview** — project cards that play a short video or reveal detail on hover.
- **Pricing Table with Billing Toggle** — monthly/yearly switch that animates price changes.
- **FAQ Accordion** — expand/collapse question list with animated height.
- **Team Grid** — photo grid with hover reveal of name/role/socials.

## 6. Footer
- **Big Logotype Footer** — an oversized wordmark or logo (often scaled to near-full section width), paired with a sitemap, contact CTA, and social links underneath. This is the effect the reference designs use — treat the scale and confidence of the logotype as the signature move, not a specific font choice to copy.
- **Newsletter Footer** — footer built around an email capture as the primary action.

## 7. Forms & Inputs
- **Multi-Step Form** — animated progress between steps rather than one long form.
- **Floating-Label Inputs** — label animates up out of the field on focus/fill, with clear error/success states.
- **Inline Newsletter Signup** — single email field embedded in content sections, not just the footer.

## 8. Media
- **Image Lightbox/Gallery** — click to expand, swipe/arrow to navigate.
- **Before/After Slider** — drag handle reveals one image over another.
- **Autoplay Card Video** — short muted video loop inside a card, common in portfolio/case-study grids.

---

## Required Packages

Install these once in the project; the generator should import from them rather than hand-rolling equivalents.

```bash
npm install framer-motion gsap lenis embla-carousel-react
npm install react-intersection-observer react-countup
npm install cobe
npm install recharts lucide-react
npm install clsx tailwind-merge
```

- **framer-motion** — general animation, entrance/exit, `useScroll`/`useTransform` for scroll-linked effects, `AnimatePresence` for page transitions, drag values for tilt/magnetic effects.
- **gsap** (with `ScrollTrigger`, `SplitText`, `ScrollSmoother`) — pinned sections, scroll-fill device mockups, horizontal scroll, split-text reveals. GSAP and every plugin have been 100% free, including commercial use, since Webflow's acquisition in 2025 — no license key or paywall to work around.
- **lenis** — smooth-scroll physics; this is a large part of why Framer-style sites feel different from a default site even before any animation runs.
- **cobe** — the lightweight canvas globe used for the Globe Hero / Standalone Globe. Reach for `@react-three/fiber` + `@react-three/drei` + `three` only if a request needs a full 3D scene beyond a globe (e.g. a rotating product render).
- **embla-carousel-react** — testimonial carousels, logo marquees (paired with CSS animation for the infinite-scroll case).
- **react-intersection-observer** — lightweight viewport-entry detection for reveals that don't need GSAP's full scroll-scrubbing.
- **react-countup** — scroll-triggered number counters.
- **recharts** — realistic-looking charts inside dashboard/product mockups.
- **lucide-react** — the one consistent icon set (already assumed by the design generator prompt).
- **clsx / tailwind-merge** — conditional and merged Tailwind class handling, needed once components have many variants/states.
