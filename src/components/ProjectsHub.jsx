import React, { useState } from 'react';
import { Plus, Search, Grid, Archive, ExternalLink, Heart, Layout, LogOut, Settings, RotateCcw, Trash2 } from 'lucide-react';
import SettingsModal from './SettingsModal';
import AuraLogo from './AuraLogo';

// ── TEMPLATE MARKETPLACE DATA ────────────────────────────────────────────────
const TEMPLATES_MARKETPLACE = [
  {
    id: 'symbol',
    name: 'Symbol SaaS',
    tag: 'SaaS',
    author: 'Symbol Studio',
    price: '$129',
    likes: '2.4K',
    description: 'All-in-one SaaS template with metrics grid, orange primary buttons, and clean cards.',
    renderPreview: () => (
      <div style={{ height: '170px', backgroundColor: '#ffffff', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', justifyContent: 'center', borderBottom: '1px solid #e4e4e7' }}>
        <div style={{ width: '60px', height: '6px', backgroundColor: '#ff5500', borderRadius: '4px' }} />
        <div style={{ width: '90%', height: '16px', backgroundColor: '#09090b', borderRadius: '4px' }} />
        <div style={{ width: '65%', height: '8px', backgroundColor: '#71717a', borderRadius: '4px' }} />
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
          <div style={{ width: '80px', height: '22px', backgroundColor: '#ff5500', borderRadius: '99px' }} />
          <div style={{ width: '80px', height: '22px', backgroundColor: '#f4f4f5', borderRadius: '99px' }} />
        </div>
      </div>
    )
  },
  {
    id: 'cubo',
    name: 'CUBO Creative',
    tag: 'Minimalist',
    author: 'CUBO Studio',
    price: 'Free',
    likes: '1.8K',
    description: 'Ultra-bold typography agency template with dark floating pill navigation bar.',
    renderPreview: () => (
      <div style={{ height: '170px', backgroundColor: '#e8e8e8', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid #d4d4d8' }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: '#71717a', fontWeight: 700 }}>DREAM TEMPLATE</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#09090b', letterSpacing: '-0.05em' }}>CUBO</div>
        <div style={{ width: '120px', height: '18px', backgroundColor: '#27272a', borderRadius: '6px', marginTop: '0.2rem' }} />
      </div>
    )
  },
  {
    id: 'the1',
    name: 'THE1 Sustainable',
    tag: 'Editorial',
    author: 'THE1 Architecture',
    price: '$149',
    likes: '1.5K',
    description: 'Sustainable architecture editorial layout with vibrant color-blocked grid.',
    renderPreview: () => (
      <div style={{ height: '170px', backgroundColor: '#d8d8d8', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', justifyContent: 'center', borderBottom: '1px solid #c4c4c4' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#09090b' }}>THE1</div>
        <div style={{ width: '75%', height: '14px', backgroundColor: '#09090b', borderRadius: '3px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem', marginTop: '0.25rem' }}>
          <div style={{ height: '35px', backgroundColor: '#00875a', borderRadius: '4px' }} />
          <div style={{ height: '35px', backgroundColor: '#f472b6', borderRadius: '4px' }} />
          <div style={{ height: '35px', backgroundColor: '#eab308', borderRadius: '4px' }} />
          <div style={{ height: '35px', backgroundColor: '#ef4444', borderRadius: '4px' }} />
        </div>
      </div>
    )
  },
  {
    id: 'nitro',
    name: 'Nitro Dark Agency',
    tag: 'Dark High-Tech',
    author: 'Nitro Lab',
    price: 'Free',
    likes: '2.1K',
    description: 'High-end dark interactive experience agency with vibrant orange accent strip.',
    renderPreview: () => (
      <div style={{ height: '170px', backgroundColor: '#09090b', color: '#ffffff', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', justifyContent: 'center', borderBottom: '1px solid #27272a' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#a1a1aa' }}>nitro</div>
        <div style={{ width: '85%', height: '14px', backgroundColor: '#ffffff', borderRadius: '3px' }} />
        <div style={{ width: '100%', height: '24px', backgroundColor: '#ff5500', borderRadius: '4px', marginTop: '0.35rem' }} />
      </div>
    )
  },
  {
    id: 'curated',
    name: 'Curated Goods',
    tag: 'E-Commerce',
    author: 'Design Market',
    price: 'Free',
    likes: '950',
    description: 'Clean e-commerce product showcase layout with category chips and rounded cards.',
    renderPreview: () => (
      <div style={{ height: '170px', backgroundColor: '#f0f0f0', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', borderBottom: '1px solid #e4e4e7' }}>
        <div style={{ width: '60%', height: '12px', backgroundColor: '#09090b', borderRadius: '3px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginTop: '0.35rem' }}>
          <div style={{ height: '45px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '6px' }} />
          <div style={{ height: '45px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '6px' }} />
          <div style={{ height: '45px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '6px' }} />
        </div>
      </div>
    )
  },
  {
    id: 'glass',
    name: 'Glass Dark',
    tag: 'Desktop SaaS',
    author: 'Glass Studio',
    price: 'Free',
    likes: '2.8K',
    description: 'Dark glassmorphic SaaS inspired by premium desktop app builders — blue accent, FAQ, theme transitions.',
    renderPreview: () => (
      <div style={{ height: '170px', backgroundColor: '#09090b', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', justifyContent: 'center', borderBottom: '1px solid #27272a' }}>
        <div style={{ width: '50px', height: '5px', backgroundColor: '#3b82f6', borderRadius: '3px' }} />
        <div style={{ width: '88%', height: '14px', backgroundColor: '#fafafa', borderRadius: '3px', opacity: 0.95 }} />
        <div style={{ width: '60%', height: '8px', backgroundColor: '#52525b', borderRadius: '3px' }} />
        <div style={{ width: '90px', height: '22px', backgroundColor: '#3b82f6', borderRadius: '99px', marginTop: '0.25rem' }} />
      </div>
    )
  },
  {
    id: 'heila',
    name: 'Heila Health',
    tag: 'Healthcare',
    author: 'Heila',
    price: 'Free',
    likes: '1.9K',
    description: 'Editorial healthcare platform with end-to-end care flow, clinical stats, and warm typography.',
    renderPreview: () => (
      <div style={{ height: '170px', backgroundColor: '#f5f5f4', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', justifyContent: 'center', borderBottom: '1px solid #e4e4e7' }}>
        <div style={{ width: '40px', height: '5px', backgroundColor: '#0d9488', borderRadius: '3px' }} />
        <div style={{ width: '75%', height: '14px', backgroundColor: '#09090b', borderRadius: '3px' }} />
        <div style={{ width: '55%', height: '8px', backgroundColor: '#a1a1aa', borderRadius: '3px' }} />
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
          <div style={{ width: '70px', height: '22px', backgroundColor: '#0d9488', borderRadius: '99px' }} />
          <div style={{ width: '65px', height: '22px', backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '99px' }} />
        </div>
      </div>
    )
  },
  {
    id: 'saas-dark',
    name: 'Apex Dark SaaS',
    tag: 'SaaS / Dark',
    author: 'AuraStudio',
    price: 'Free',
    likes: '3.1K',
    description: 'Premium dark-mode SaaS landing page with glow accents, stats, and modern pricing.',
    renderPreview: () => (
      <div style={{ height: '170px', backgroundColor: '#09090b', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', justifyContent: 'center', borderBottom: '1px solid #27272a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: 'linear-gradient(135deg,#a855f7,#6366f1)' }} />
          <div style={{ width: '60px', height: '6px', backgroundColor: '#27272a', borderRadius: '3px' }} />
        </div>
        <div style={{ width: '90%', height: '14px', backgroundColor: '#ffffff', borderRadius: '3px', opacity: 0.9 }} />
        <div style={{ width: '70%', height: '8px', backgroundColor: '#52525b', borderRadius: '3px' }} />
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
          <div style={{ width: '90px', height: '22px', background: 'linear-gradient(135deg,#a855f7,#6366f1)', borderRadius: '8px' }} />
          <div style={{ width: '70px', height: '22px', backgroundColor: '#27272a', borderRadius: '8px' }} />
        </div>
      </div>
    )
  },
  {
    id: 'portfolio',
    name: 'Minimal Portfolio',
    tag: 'Portfolio',
    author: 'AuraStudio',
    price: 'Free',
    likes: '2.0K',
    description: 'Clean, minimal portfolio for designers and developers with case studies grid.',
    renderPreview: () => (
      <div style={{ height: '170px', backgroundColor: '#fafafa', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', borderBottom: '1px solid #e4e4e7' }}>
        <div style={{ fontSize: '0.6rem', color: '#a855f7', fontWeight: 700, letterSpacing: '0.1em' }}>PORTFOLIO</div>
        <div style={{ width: '80%', height: '14px', backgroundColor: '#09090b', borderRadius: '3px' }} />
        <div style={{ width: '55%', height: '8px', backgroundColor: '#71717a', borderRadius: '3px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.3rem', marginTop: '0.35rem' }}>
          {['#a855f7','#6366f1','#09090b'].map((c,i) => <div key={i} style={{ height: '32px', backgroundColor: c, borderRadius: '6px', opacity: 0.8 }} />)}
        </div>
      </div>
    )
  }
];

export default function ProjectsHub({ projects = [], onOpenProject, onNewProject, onDeleteProject, onRestoreProject, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'templates' | 'archive'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const activeProjects = projects.filter(p => !p.deleted);
  const deletedProjects = projects.filter(p => p.deleted);

  const filteredProjects = activeProjects.filter(p =>
    (p.name || 'Untitled').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#fafafa', color: '#09090b', fontFamily: 'var(--font-sans)' }}>

      {/* ── LEFT NAVIGATION SIDEBAR ────────────────────────────────────────── */}
      <div style={{
        width: '250px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e4e4e7',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem 1rem'
      }}>
        <div>
          {/* Brand Header */}
          <div style={{ marginBottom: '1.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('all')}>
            <AuraLogo size={28} />
          </div>

          {/* User Workspace Info */}
          <div style={{
            backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '8px',
            padding: '0.6rem 0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem'
          }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '6px',
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 800, color: 'white'
            }}>
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name ? `${user.name.split(' ')[0]}'s Workspace` : 'Personal Studio'}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#a855f7', fontWeight: 600 }}>PRO STUDIO</div>
            </div>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search size={14} color="#a1a1aa" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search projects…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', backgroundColor: '#ffffff', border: '1px solid #e4e4e7',
                borderRadius: '8px', padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                fontSize: '0.8rem', outline: 'none'
              }}
            />
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%',
                padding: '0.55rem 0.75rem', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === 'all' ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                color: activeTab === 'all' ? '#9333ea' : '#71717a',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <Grid size={16} /> All Projects ({activeProjects.length})
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%',
                padding: '0.55rem 0.75rem', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === 'templates' ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                color: activeTab === 'templates' ? '#9333ea' : '#71717a',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <Layout size={16} /> Template Store
            </button>

            <button
              onClick={() => setActiveTab('archive')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%',
                padding: '0.55rem 0.75rem', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === 'archive' ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                color: activeTab === 'archive' ? '#9333ea' : '#71717a',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <Archive size={16} /> Archive ({deletedProjects.length})
            </button>
          </nav>
        </div>

        {/* User Footer Settings & Logout */}
        <div style={{ borderTop: '1px solid #e4e4e7', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => setShowSettingsModal(true)} className="btn-ghost" style={{ gap: '0.5rem', fontSize: '0.8rem' }}>
            <Settings size={15} /> Settings
          </button>
          <button onClick={onLogout} className="btn-ghost" style={{ color: '#ef4444' }} title="Log out">
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: '2.5rem 3.5rem', overflowY: 'auto' }}>

        {/* Top Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em' }}>
              {activeTab === 'all' && 'Your Projects'}
              {activeTab === 'templates' && 'AuraDesign Template Store'}
              {activeTab === 'archive' && 'Archived Projects'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#71717a', marginTop: '0.2rem' }}>
              {activeTab === 'all' && 'Manage your frontend designs or start a new project'}
              {activeTab === 'templates' && 'Explore curated responsive design templates'}
              {activeTab === 'archive' && 'Deleted projects ready for restoration'}
            </p>
          </div>

          <button
            onClick={() => onNewProject(null)} // NULL = BLANK CANVAS FOR NEW PROJECT
            className="btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}
          >
            <Plus size={16} /> New Project (Blank)
          </button>
        </div>

        {/* TAB 1: ALL PROJECTS GRID */}
        {activeTab === 'all' && (
          <div>
            {filteredProjects.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '5rem 2rem', backgroundColor: '#ffffff',
                border: '2px dashed #e4e4e7', borderRadius: '16px'
              }}>
                <Layout size={40} color="#a1a1aa" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#09090b', marginBottom: '0.5rem' }}>No projects created yet</h3>
                <p style={{ fontSize: '0.85rem', color: '#71717a', marginBottom: '1.5rem' }}>Start with a blank canvas or select a template from the store.</p>
                <button onClick={() => onNewProject(null)} className="btn-primary">
                  <Plus size={16} /> Create Blank Canvas Project
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {filteredProjects.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => onOpenProject(proj)}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e4e4e7',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{
                      height: '160px', backgroundColor: '#fafafa',
                      backgroundImage: 'radial-gradient(#e4e4e7 1.5px, transparent 1.5px)', backgroundSize: '16px 16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{ fontSize: '2.5rem' }}>{proj.emoji || '🎨'}</div>
                    </div>
                    <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#09090b', marginBottom: '0.2rem' }}>{proj.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#71717a' }}>Last edited {proj.lastEdited || 'Just now'}</p>
                      </div>

                      {/* Archive Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteProject(proj.id, false); }}
                        className="btn-ghost"
                        title="Archive Project"
                        style={{ color: '#71717a' }}
                      >
                        <Archive size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ARCHIVED PROJECTS */}
        {activeTab === 'archive' && (
          <div>
            {deletedProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#a1a1aa' }}>
                No archived projects.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {deletedProjects.map(proj => (
                  <div key={proj.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#09090b' }}>{proj.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#71717a' }}>Archived</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => onRestoreProject(proj.id)} className="btn-secondary" title="Restore">
                        <RotateCcw size={14} />
                      </button>
                      <button onClick={() => onDeleteProject(proj.id, true)} className="btn-ghost" style={{ color: '#ef4444' }} title="Delete Permanently">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TEMPLATES MARKETPLACE GRID */}
        {activeTab === 'templates' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {TEMPLATES_MARKETPLACE.map(tmpl => (
              <div
                key={tmpl.id}
                style={{
                  backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '14px',
                  overflow: 'hidden', transition: 'all 0.2s ease', boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ position: 'relative' }}>
                  {tmpl.renderPreview()}
                  <div style={{
                    position: 'absolute', top: '0.75rem', right: '0.75rem',
                    backgroundColor: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(4px)',
                    color: '#ffffff', fontSize: '0.7rem', fontWeight: 700,
                    padding: '0.25rem 0.65rem', borderRadius: '99px'
                  }}>
                    {tmpl.price}
                  </div>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#09090b' }}>{tmpl.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Heart size={13} fill="#ef4444" /> {tmpl.likes}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#71717a', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                    {tmpl.description}
                  </p>
                  <button
                    onClick={() => onNewProject({ name: tmpl.name, page: tmpl.id })}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Use Template <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal user={user} onClose={() => setShowSettingsModal(false)} onLogout={onLogout} />
      )}
    </div>
  );
}
