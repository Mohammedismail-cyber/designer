import React, { useState } from 'react';
import { Search, Plus, ChevronRight, Layers, Box, FileText, Globe, Layout, Type, Frame, Sparkles, Sliders, Code, BarChart2, Zap, Users, HelpCircle, SunMoon, ArrowDownUp, Eye, Move } from 'lucide-react';
import { createSectionPreset, createMotionPreset } from '../utils/generator';

const ASSET_BLOCKS = [
  { type: 'navbar',      name: 'Navigation Bar',  desc: 'Sticky header with logo, links & CTA', icon: Globe },
  { type: 'hero',        name: 'Hero Section',     desc: 'Bold headline, subhead & CTA buttons', icon: Layout },
  { type: 'features',   name: 'Features Grid',    desc: 'Editorial feature cards — not icon grids', icon: Box },
  { type: 'stats',       name: 'Stats Row',        desc: 'Key metrics & social proof numbers', icon: BarChart2 },
  { type: 'testimonials',name: 'Testimonials',     desc: 'Customer quotes & ratings', icon: Type },
  { type: 'pricing',     name: 'Pricing Cards',    desc: '3-tier pricing plan comparison', icon: Frame },
  { type: 'cta_banner',  name: 'CTA Banner',       desc: 'Full-width conversion banner', icon: Zap },
  { type: 'team',        name: 'Team Section',     desc: 'Team members with bios', icon: Users },
  { type: 'faq',         name: 'FAQ Accordion',    desc: 'Collapsible Q&A section', icon: HelpCircle },
  { type: 'footer',      name: 'Footer Bar',       desc: 'Links, brand & copyright', icon: FileText },
];

const MOTION_BLOCKS = [
  { type: 'transition_dark_light', name: 'Dark → Light', desc: 'Scroll theme shift from black to white', icon: SunMoon },
  { type: 'transition_light_dark', name: 'Light → Dark', desc: 'Scroll theme shift from white to black', icon: ArrowDownUp },
  { type: 'motion_reveal', name: 'Scroll Reveal', desc: 'Fade-up entrance on scroll', icon: Eye },
  { type: 'motion_parallax', name: 'Parallax Layer', desc: 'Depth parallax background section', icon: Move },
];

export default function Sidebar({ activePage, onSelectPage, components = [], onAddSection, projectPages = [], onSetProjectPages }) {
  const [activeTab, setActiveTab] = useState('assets');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddPage = () => {
    const pageName = prompt('Enter new page route name (e.g. /contact):');
    if (!pageName) return;
    const route = pageName.startsWith('/') ? pageName : `/${pageName}`;
    onSetProjectPages(prev => prev.includes(route) ? prev : [...prev, route]);
  };

  const filteredBlocks = ASSET_BLOCKS.filter(b =>
    !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMotion = MOTION_BLOCKS.filter(b =>
    !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TABS = [
    { key: 'assets', label: 'Assets' },
    { key: 'motion', label: 'Motion' },
    { key: 'pages', label: 'Pages' },
    { key: 'layers', label: 'Layers' },
  ];

  const renderBlock = (block, onClick) => (
    <div key={block.type} onClick={onClick}
      style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '0.7rem 0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.backgroundColor = 'rgba(168,85,247,0.025)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '7px', backgroundColor: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <block.icon size={14} color="#a855f7" />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#09090b', lineHeight: 1.2 }}>{block.name}</div>
          <div style={{ fontSize: '0.65rem', color: '#71717a', marginTop: '0.1rem' }}>{block.desc}</div>
        </div>
      </div>
      <Plus size={14} color="#d4d4d8" />
    </div>
  );

  return (
    <div style={{ width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #e4e4e7', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0, color: '#09090b' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #e4e4e7', backgroundColor: '#fafafa' }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{ flex: 1, padding: '0.6rem 0', fontSize: '0.65rem', fontWeight: activeTab === key ? 700 : 500, color: activeTab === key ? '#9333ea' : '#71717a', backgroundColor: activeTab === key ? '#ffffff' : 'transparent', border: 'none', borderBottom: activeTab === key ? '2px solid #a855f7' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
            {label}
          </button>
        ))}
      </div>

      {(activeTab === 'assets' || activeTab === 'motion') && (
        <div style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid #f4f4f5' }}>
          <div style={{ position: 'relative' }}>
            <Search size={12} color="#a1a1aa" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search blocks…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '0.4rem 0.65rem 0.4rem 2rem', fontSize: '0.75rem', outline: 'none' }} />
          </div>
        </div>
      )}

      {activeTab === 'assets' && (
        <div style={{ flex: 1, padding: '0.65rem 0.85rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>SECTIONS</div>
          {filteredBlocks.map(block => renderBlock(block, () => onAddSection(createSectionPreset(block.type))))}
        </div>
      )}

      {activeTab === 'motion' && (
        <div style={{ flex: 1, padding: '0.65rem 0.85rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#a855f7', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>MOTION & TRANSITIONS</div>
          <p style={{ fontSize: '0.65rem', color: '#71717a', lineHeight: 1.45, marginBottom: '0.35rem' }}>Framer Motion primitives — also promptable via AI</p>
          {filteredMotion.map(block => renderBlock(block, () => onAddSection(createMotionPreset(block.type))))}
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#fafafa', borderRadius: '10px', border: '1px solid #e4e4e7' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '0.35rem' }}>INSTALLED</div>
            {[{ name: 'Tailwind CSS', icon: Code }, { name: 'Framer Motion', icon: Sliders }].map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: '#52525b', marginBottom: '0.25rem' }}>
                <p.icon size={12} color="#16a34a" /> {p.name} <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: '#16a34a', fontWeight: 700 }}>ACTIVE</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pages' && (
        <div style={{ flex: 1, padding: '0.85rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.06em' }}>PROJECT PAGES ({projectPages.length})</span>
            <button onClick={handleAddPage} className="btn-ghost" style={{ padding: '0.15rem', color: '#9333ea' }} title="Add Page"><Plus size={14} /></button>
          </div>
          {projectPages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#a1a1aa', fontSize: '0.8rem' }}>
              <FileText size={24} style={{ marginBottom: '0.5rem', opacity: 0.3 }} />
              <p>No pages yet. Click + to add your first page.</p>
            </div>
          ) : (
            projectPages.map(page => (
              <div key={page} onClick={() => onSelectPage(page.toLowerCase())}
                style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: activePage === page.toLowerCase() ? '#9333ea' : '#09090b', backgroundColor: activePage === page.toLowerCase() ? 'rgba(168,85,247,0.1)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '0.25rem', fontWeight: activePage === page.toLowerCase() ? 700 : 500 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={13} color={activePage === page.toLowerCase() ? '#a855f7' : '#a1a1aa'} /> {page}
                </div>
                <ChevronRight size={13} color="#d4d4d8" />
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'layers' && (
        <div style={{ flex: 1, padding: '0.85rem', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>CANVAS LAYERS ({components.length})</div>
          {components.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#a1a1aa', fontSize: '0.8rem' }}>
              <Layers size={22} style={{ marginBottom: '0.5rem', opacity: 0.3 }} />
              <p>No layers. Add blocks from Assets or Motion.</p>
            </div>
          ) : (
            components.map((c, i) => (
              <div key={c.id} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', color: '#09090b', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <Layers size={13} color={c.type?.startsWith('motion') || c.type?.startsWith('transition') ? '#6366f1' : '#a855f7'} />
                <span style={{ opacity: 0.5, fontSize: '0.65rem' }}>{i + 1}.</span>
                {c.name || c.type}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
