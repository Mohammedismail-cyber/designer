// Redesigned modern landing page
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuraLogo from './AuraLogo';
import { IconSpark, IconGlobe, IconDownload, IconCode, IconFrame, IconZap } from './AnimatedIcons';

const templates = [
  { name: 'Glass', tag: 'Dark SaaS', accent: '#6366f1', bg: '#0f172a' },
  { name: 'Heila', tag: 'Healthcare', accent: '#14b8a6', bg: '#f0fdf4' },
  { name: 'ARIA', tag: 'Deep Tech', accent: '#ef4444', bg: '#0f172a' },
  { name: 'Goldsand', tag: 'Fintech', accent: '#eab308', bg: '#ffffff' },
  { name: 'Apex', tag: 'Agentic AI', accent: '#22c55e', bg: '#0f172a' },
];

const features = [
  { Icon: IconSpark, title: 'AI Design Orchestrator', desc: 'Structured multi-step reasoning to translate prompts into production-ready sections.' },
  { Icon: IconGlobe, title: '35+ Components', desc: 'Curated components: heroes, carousels, 3D viewers and motion primitives.' },
  { Icon: IconDownload, title: 'Triple Export Stack', desc: 'HTML/CSS, React, or React + Tailwind + Motion — production-ready.' },
  { Icon: IconFrame, title: 'Boutique Templates', desc: 'Hand-crafted starting points inspired by award-winning work.' },
];

export default function LandingPage({ onGetStarted, onSignIn }) {
  const [activeTemplate, setActiveTemplate] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTemplate((s) => (s + 1) % templates.length), 3500);
    return () => clearInterval(t);
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-surface">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-100">
        <div className="container-custom max-w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onGetStarted} aria-label="Home" className="flex items-center gap-3">
              <AuraLogo size={36} />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted hover:text-gray-900">Features</button>
            <button onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted hover:text-gray-900">Templates</button>
            <button onClick={() => document.getElementById('export')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted hover:text-gray-900">Export</button>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onSignIn} className="text-sm text-muted hover:text-gray-900">Sign in</button>
            <button onClick={onGetStarted} className="btn-cta">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <header className="pt-28 hero-bleed">
        <div className="container-custom max-w-full px-6 py-16">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

            {/* Hero left */}
            <motion.div initial="hidden" animate="enter" variants={heroVariants} transition={{ duration: 0.5 }} className="max-w-2xl">
              <div className="inline-flex items-center gap-3 bg-white card-elevated px-4 py-2 rounded-full mb-6">
                <IconSpark size={18} />
                <span className="text-sm font-semibold text-muted">AI-Driven Design Engine</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 h-hero mb-6">
                Build <span className="gradient-animated">stunning interfaces</span> faster
              </h1>

              <p className="text-lg text-muted mb-8 leading-relaxed">
                Create export-ready landing pages with motion, layout systems, and a component library — crafted for teams who value design and performance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button onClick={onGetStarted} className="btn-cta">Start Building</button>
                <button onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })} className="btn-outline">View Templates</button>
              </div>

              <div className="flex gap-6 text-sm text-muted items-center">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> No credit card</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Unlimited projects</div>
              </div>
            </motion.div>

            {/* Hero right - mockup + floating cards */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <AnimatePresence>
                  <motion.div key={activeTemplate} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="rounded-2xl overflow-hidden" style={{ background: templates[activeTemplate].bg }}>
                    <div style={{ minHeight: 420 }} className="p-8 flex flex-col justify-between text-white">
                      <div className="flex items-center justify-between">
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: templates[activeTemplate].accent }} />
                        <div className="text-sm bg-white/10 px-3 py-1 rounded-lg">{templates[activeTemplate].name}</div>
                      </div>

                      <div className="space-y-4">
                        <div className="w-3/4 h-9 rounded-lg bg-white/20" />
                        <div className="w-1/2 h-4 rounded bg-white/10" />
                        <div style={{ width: 140, height: 44, borderRadius: 12, background: templates[activeTemplate].accent }} />
                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-6">
                        <div className="h-20 rounded-lg bg-white/8" />
                        <div className="h-20 rounded-lg bg-white/8" />
                        <div className="h-20 rounded-lg bg-white/8" />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <motion.div initial={{ x: -20, y: -10 }} animate={{ x: -6, y: -6 }} transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror' }} className="absolute -left-6 -top-6 card-elevated w-48">
                  <div className="flex items-center gap-3"><IconGlobe size={20} /><div><div className="text-sm font-semibold">35+ components</div><div className="text-xs text-muted">Standard library</div></div></div>
                </motion.div>

                <motion.div initial={{ x: 20, y: 10 }} animate={{ x: 6, y: 6 }} transition={{ duration: 3.5, repeat: Infinity, repeatType: 'mirror' }} className="absolute -right-6 -bottom-6 card-elevated w-44">
                  <div className="flex items-center gap-3"><IconDownload size={20} /><div><div className="text-sm font-semibold">3 export stacks</div><div className="text-xs text-muted">HTML • React • Tailwind</div></div></div>
                </motion.div>

              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['35+', 'Components'], ['3', 'Exports'], ['5+', 'Templates'], ['7', 'Motion']].map(([v, t]) => (
            <div key={t} className="card-elevated">
              <div className="text-3xl font-extrabold mb-1">{v}</div>
              <div className="text-sm text-muted">{t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Everything you need</h2>
          <p className="text-muted max-w-2xl mx-auto">A complete design system built for modern teams who refuse to compromise on quality.</p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-6 items-start card-elevated">
              <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center">
                <f.Icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Boutique templates</h2>
          <p className="text-muted max-w-2xl mx-auto">Premium starting points inspired by award-winning designs.</p>
        </div>

        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t, i) => (
            <motion.button key={t.name} onClick={onGetStarted} whileHover={{ scale: 1.03 }} className="rounded-2xl overflow-hidden transition-shadow border card-elevated text-left">
              <div style={{ height: 168, background: t.bg }} className="p-6 relative">
                <div style={{ width: 64, height: 64, borderRadius: 12, background: t.accent, opacity: 0.18 }} />
              </div>
              <div className="p-6">
                <div className="font-semibold text-lg">{t.name}</div>
                <div className="text-sm text-muted">{t.tag}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Export */}
      <section id="export" className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Export to any stack</h2>
            <p className="text-muted mb-6">Pick the output your team actually uses — from static HTML to motion-rich React code with Tailwind and Framer Motion.</p>
            <button onClick={onGetStarted} className="btn-cta text-black">Try export</button>
          </div>

          <div className="grid gap-4">
            <div className="flex gap-4 items-start card-elevated bg-gray-800">
              <div className="w-12 h-12 rounded-lg bg-indigo-600/10 flex items-center justify-center"><IconCode /></div>
              <div><div className="font-semibold">HTML & CSS</div><div className="text-sm text-muted">Self-contained semantic document.</div></div>
            </div>
            <div className="flex gap-4 items-start card-elevated bg-gray-800">
              <div className="w-12 h-12 rounded-lg bg-indigo-600/10 flex items-center justify-center"><IconFrame /></div>
              <div><div className="font-semibold">React</div><div className="text-sm text-muted">Component-based layout for modern apps.</div></div>
            </div>
            <div className="flex gap-4 items-start card-elevated bg-gray-800">
              <div className="w-12 h-12 rounded-lg bg-indigo-600/10 flex items-center justify-center"><IconZap /></div>
              <div><div className="font-semibold">Tailwind + Motion</div><div className="text-sm text-muted">Utilities + animations baked in.</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to build something great?</h2>
          <p className="text-muted mb-6">Join thousands of teams shipping interfaces that don't look like everyone else's.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={onGetStarted} className="btn-cta">Start building</button>
            <button onClick={onSignIn} className="btn-outline">Sign in</button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <AuraLogo size={40} textStyle={{ color: '#fff' }} />
            <p className="text-muted mt-4">Prompt-to-design studio with a curated component library, motion primitives, and export-first workflows.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Product</h4>
            <div className="flex flex-col gap-2 text-muted"><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</button><button onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}>Templates</button></div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <div className="flex flex-col gap-2 text-muted"><span>About</span><span>Contact</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
