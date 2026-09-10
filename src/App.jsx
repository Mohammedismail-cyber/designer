import React, { useState, useRef, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import ProjectsHub from './components/ProjectsHub';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import AgentPanel from './components/AgentPanel';
import Inspector from './components/Inspector';
import SettingsModal from './components/SettingsModal';
import PreviewModal from './components/PreviewModal';
import ExportModal from './components/ExportModal';
import AuraLogo from './components/AuraLogo';
import { generateComponents, loadPagePreset, createSectionPreset } from './utils/generator';
import { Smartphone, Tablet, Monitor, Eye, Settings, ArrowLeft, Code, Sliders } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [components, setComponents] = useState([]);
  const [history, setHistory] = useState([]);
  const [_future, setFuture] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [projectPages, setProjectPages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewportMode, setViewportMode] = useState('desktop');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [promptHistory, setPromptHistory] = useState([]);
  const [rightPanel, setRightPanel] = useState('ai'); // 'ai' | 'inspector'

  const activeProjectRef = useRef(activeProject);
  activeProjectRef.current = activeProject;
  const projectsRef = useRef(projects);
  projectsRef.current = projects;
  const userRef = useRef(user);
  userRef.current = user;
  const componentsRef = useRef(components);
  componentsRef.current = components;

  const handleHomeClick = () => setView(user ? 'hub' : 'landing');

  const handleLogin = (userData) => {
    setUser(userData);
    const saved = JSON.parse(localStorage.getItem(`aura_projects_${userData.email}`) || '[]');
    setProjects(saved);
    setView('hub');
  };

  const handleLogout = () => {
    setUser(null); setProjects([]); setActiveProject(null); setComponents([]); setView('landing');
  };

  const saveProjects = useCallback((updated) => {
    setProjects(updated);
    if (userRef.current) localStorage.setItem(`aura_projects_${userRef.current.email}`, JSON.stringify(updated));
  }, []);

  const handleNewProject = (template = null) => {
    const initialComps = template ? loadPagePreset(template.page) : [];
    const newProject = {
      id: `proj_${Date.now()}`,
      name: template ? template.name : 'Untitled Project',
      emoji: template ? '✨' : '🎨',
      lastEdited: 'Just now',
      components: initialComps,
      pages: template ? ['/home'] : [],
      deleted: false
    };
    saveProjects([newProject, ...projectsRef.current]);
    handleOpenProject(newProject);
  };

  const handleOpenProject = (project) => {
    setActiveProject(project);
    setComponents(project.components || []);
    setProjectPages(project.pages || []);
    setHistory([]); setFuture([]); setSelectedId(null);
    setActivePage('home'); setView('editor');
  };

  const handleDeleteProject = (id, permanent = false) => {
    const updated = projectsRef.current.map(p => {
      if (p.id !== id) return p;
      if (permanent) return null;
      return { ...p, deleted: true };
    }).filter(Boolean);
    saveProjects(updated);
  };

  const handleRestoreProject = (id) => {
    saveProjects(projectsRef.current.map(p => p.id === id ? { ...p, deleted: false } : p));
  };

  const persistComponents = useCallback((comps) => {
    setComponents(comps);
    const curr = activeProjectRef.current;
    if (curr) saveProjects(projectsRef.current.map(p => p.id === curr.id ? { ...p, components: comps, lastEdited: 'Just now' } : p));
  }, [saveProjects]);

  const persistPages = useCallback((pages) => {
    setProjectPages(pages);
    const curr = activeProjectRef.current;
    if (curr) saveProjects(projectsRef.current.map(p => p.id === curr.id ? { ...p, pages } : p));
  }, [saveProjects]);

  const pushHistory = useCallback((prev) => { setHistory(h => [...h.slice(-19), prev]); setFuture([]); }, []);

  const handleSelectPage = (pageKey) => {
    pushHistory(components);
    const preset = loadPagePreset(pageKey);
    persistComponents(preset);
    setActivePage(pageKey); setSelectedId(null);
  };

  const handleDeleteComponent = useCallback((id) => {
    pushHistory(componentsRef.current);
    persistComponents(componentsRef.current.filter(c => c.id !== id));
    setSelectedId(null);
  }, [pushHistory, persistComponents]);

  const handleMoveComponent = useCallback((index, direction) => {
    const newComps = [...componentsRef.current];
    const target = index + direction;
    if (target < 0 || target >= newComps.length) return;
    pushHistory(componentsRef.current);
    [newComps[index], newComps[target]] = [newComps[target], newComps[index]];
    persistComponents(newComps);
  }, [pushHistory, persistComponents]);

  const handleUpdateContent = useCallback((id, content) => {
    pushHistory(componentsRef.current);
    persistComponents(componentsRef.current.map(c => c.id === id ? { ...c, content: { ...c.content, ...content } } : c));
  }, [pushHistory, persistComponents]);

  const handleUpdateStyles = useCallback((id, styles) => {
    pushHistory(componentsRef.current);
    persistComponents(componentsRef.current.map(c => c.id === id ? { ...c, styles: { ...c.styles, ...styles } } : c));
  }, [pushHistory, persistComponents]);

  const handleAddSection = useCallback((sectionParam) => {
    pushHistory(componentsRef.current);
    const comp = typeof sectionParam === 'object' && sectionParam !== null ? sectionParam : createSectionPreset(sectionParam);
    persistComponents([...componentsRef.current, comp]);
  }, [pushHistory, persistComponents]);

  const handleGenerate = useCallback(async (promptText, onStepUpdate) => {
    if (!promptText.trim() || isGenerating) return;
    setIsGenerating(true);
    setPromptHistory(h => [promptText, ...h]);
    const snapshot = componentsRef.current;
    try {
      pushHistory(snapshot);
      const result = await generateComponents(promptText, componentsRef.current, onStepUpdate);
      // generateComponents returns Section[] — persist it
      persistComponents(result);
      setSelectedId(null);
      // Return a minimal status so AgentPanel can display it
      return { success: true, requestType: 'unknown', generationPath: 'unknown', sectionsGenerated: result.length };
    } catch (err) {
      console.error('Generation error:', err);
      // Restore pre-generation state
      persistComponents(snapshot);
      return { success: false, requestType: 'unknown', generationPath: 'error', sectionsGenerated: 0 };
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, pushHistory, persistComponents]);

  const selectedComponent = components.find(c => c.id === selectedId);

  // ── RENDER ────────────────────────────────────────────────────────────────
  if (view === 'landing') return <LandingPage onGetStarted={() => setView(user ? 'hub' : 'auth')} onSignIn={() => setView('auth')} />;
  if (view === 'auth') return <Auth onLogin={handleLogin} />;
  if (view === 'hub') return (
    <ProjectsHub
      projects={projects}
      onOpenProject={handleOpenProject}
      onNewProject={handleNewProject}
      onDeleteProject={handleDeleteProject}
      onRestoreProject={handleRestoreProject}
      user={user}
      onLogout={handleLogout}
    />
  );

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', backgroundColor: '#fafafa', color: '#09090b', fontFamily: 'var(--font-sans)' }}>

      {/* TOP HEADER */}
      <header style={{ height: '3.25rem', backgroundColor: '#ffffff', borderBottom: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', flexShrink: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ cursor: 'pointer' }} onClick={handleHomeClick}><AuraLogo size={22} /></div>
          <button onClick={() => setView('hub')} className="btn-secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.72rem', gap: '0.3rem' }}>
            <ArrowLeft size={13} /> Projects
          </button>
        </div>

        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#09090b', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {activeProject?.name || 'Untitled Project'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Viewport switcher */}
          <div style={{ display: 'flex', backgroundColor: '#f4f4f5', borderRadius: '8px', padding: '0.18rem' }}>
            {[{ key: 'desktop', icon: Monitor }, { key: 'tablet', icon: Tablet }, { key: 'mobile', icon: Smartphone }].map(({ key, icon: Icon }) => (
              <button key={key} onClick={() => setViewportMode(key)} title={key} style={{ padding: '0.28rem 0.55rem', border: 'none', borderRadius: '6px', backgroundColor: viewportMode === key ? '#ffffff' : 'transparent', color: viewportMode === key ? '#9333ea' : '#71717a', cursor: 'pointer', boxShadow: viewportMode === key ? '0 1px 3px rgba(0,0,0,0.06)' : 'none', display: 'flex', alignItems: 'center' }}>
                <Icon size={14} />
              </button>
            ))}
          </div>

          <button onClick={() => setShowPreviewModal(true)} className="btn-secondary" style={{ gap: '0.3rem', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
            <Eye size={13} /> Preview
          </button>
          <button onClick={() => setShowExportModal(true)} className="btn-primary" style={{ gap: '0.3rem', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
            <Code size={13} /> Export
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="btn-ghost" title="Settings"><Settings size={15} /></button>
        </div>
      </header>

      {/* WORKSPACE BODY */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar
          activePage={activePage}
          onSelectPage={handleSelectPage}
          components={components}
          onAddSection={handleAddSection}
          projectPages={projectPages}
          onSetProjectPages={persistPages}
        />

        <Canvas
          components={components}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onUpdateComponentContent={handleUpdateContent}
          onDeleteComponent={handleDeleteComponent}
          onMoveComponent={handleMoveComponent}
          viewportMode={viewportMode}
        />

        {/* Right panel: AI or Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Panel toggle */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e4e4e7', backgroundColor: '#fafafa', flexShrink: 0 }}>
            <button onClick={() => setRightPanel('ai')} style={{ flex: 1, padding: '0.6rem 0', fontSize: '0.75rem', fontWeight: rightPanel === 'ai' ? 700 : 500, color: rightPanel === 'ai' ? '#9333ea' : '#71717a', backgroundColor: rightPanel === 'ai' ? '#ffffff' : 'transparent', border: 'none', borderBottom: rightPanel === 'ai' ? '2px solid #a855f7' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <Sliders size={13} /> AI Assistant
            </button>
            <button onClick={() => setRightPanel('inspector')} style={{ flex: 1, padding: '0.6rem 0', fontSize: '0.75rem', fontWeight: rightPanel === 'inspector' ? 700 : 500, color: rightPanel === 'inspector' ? '#9333ea' : '#71717a', backgroundColor: rightPanel === 'inspector' ? '#ffffff' : 'transparent', border: 'none', borderBottom: rightPanel === 'inspector' ? '2px solid #a855f7' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <Sliders size={13} /> Inspector
            </button>
          </div>

          {rightPanel === 'ai' && (
            <AgentPanel
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              promptHistory={promptHistory}
              components={components}
            />
          )}
          {rightPanel === 'inspector' && (
            <Inspector
              selectedComponent={selectedComponent}
              onUpdateStyles={handleUpdateStyles}
              onDelete={handleDeleteComponent}
            />
          )}
        </div>
      </div>

      {showPreviewModal && <PreviewModal components={components} onClose={() => setShowPreviewModal(false)} />}
      {showExportModal && <ExportModal components={components} onClose={() => setShowExportModal(false)} />}
      {showSettingsModal && <SettingsModal user={user} onClose={() => setShowSettingsModal(false)} onLogout={handleLogout} />}
    </div>
  );
}
