import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send as _Send, Wand2, Zap, AlertCircle, CheckCircle, Wifi, RefreshCw, ChevronRight } from 'lucide-react';
import { getOllamaModels, pickBestModel, getAISuggestions, setOllamaConfig } from '../utils/generator';

// ── RequestTypeBadge ──────────────────────────────────────────────────────────
function RequestTypeBadge({ requestType }) {
  if (!requestType) return null;
  const label = {
    new_project:    'New Project',
    redesign:       'Redesign',
    add_section:    'Add Section',
    add_component:  'Add Component',
    add_page:       'Add Page',
    edit_section:   'Edit Section',
    edit_component: 'Edit Component',
  }[requestType] || requestType;

  const color =
    requestType === 'new_project' || requestType === 'redesign'
      ? { bg: 'rgba(168,85,247,0.12)', text: '#7e22ce', border: 'rgba(168,85,247,0.3)' }
      : requestType.startsWith('add')
      ? { bg: 'rgba(16,185,129,0.1)', text: '#065f46', border: 'rgba(16,185,129,0.25)' }
      : { bg: 'rgba(245,158,11,0.1)', text: '#92400e', border: 'rgba(245,158,11,0.25)' };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.15rem 0.55rem', borderRadius: '99px', backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}`, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em' }}>
      {label}
    </span>
  );
}

export default function AgentPanel({ onGenerate, isGenerating, _promptHistory = [], components = [] }) {
  const [prompt, setPrompt] = useState('');
  const [ollamaStatus, setOllamaStatus] = useState('idle');
  const [availableModels, setAvailableModels] = useState([]);
  const [_selectedModel, setSelectedModel] = useState('');
  const [ollamaHost, setOllamaHost] = useState('http://localhost:11434');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [aiMessages, setAiMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState('');
  const [lastStatus, setLastStatus] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => { checkOllama(); }, []);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, streamingText]);

  useEffect(() => {
    if (ollamaStatus === 'connected' && components !== undefined) {
      loadSuggestions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [components.length, ollamaStatus]);

  const checkOllama = async (host = ollamaHost) => {
    setOllamaStatus('checking');
    const models = await getOllamaModels(host);
    if (models.length > 0) {
      setAvailableModels(models);
      const best = pickBestModel(models);
      setSelectedModel(best || models[0]?.name || '');
      setOllamaConfig(host, best || models[0]?.name);
      setOllamaStatus('connected');
    } else {
      setOllamaStatus('disconnected');
    }
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    setOllamaConfig(ollamaHost, model);
  };

  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    setSuggestions([]);
    try {
      const s = await getAISuggestions(components, null);
      setSuggestions(s);
    } catch { setSuggestions([]); }
    setLoadingSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const text = prompt.trim();
    if (!text || isGenerating) return;
    setPrompt('');
    setCurrentStep('');
    setLastStatus(null);
    setAiMessages(m => [...m, { role: 'user', text }]);

    // Insert a streaming assistant message placeholder
    setAiMessages(m => [...m, { role: 'assistant', text: '', isStreaming: true, requestType: null }]);

    let status = null;
    try {
      // onGenerate now receives a step-update callback and returns status
      status = await onGenerate(text, (step) => {
        setCurrentStep(step);
        // Update the streaming placeholder with the current step label
        setAiMessages(m => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last?.isStreaming) {
            last.stepLabel = step;
            // Extract requestType from "Detected: X" steps
            if (step.startsWith('Detected:')) {
              last.detectedType = step.replace('Detected:', '').trim();
            }
          }
          return copy;
        });
      });
    } catch (err) {
      status = { success: false, requestType: 'unknown', generationPath: 'error', sectionsGenerated: 0 };
    }

    setLastStatus(status);
    setCurrentStep('');

    // Finalise the streaming placeholder with result
    setAiMessages(m => {
      const copy = [...m];
      const last = copy[copy.length - 1];
      if (!last?.isStreaming) return copy;
      last.isStreaming = false;

      if (!status || !status.success) {
        last.text = status?.generationPath === 'error'
          ? 'Generation failed. The canvas was not modified.'
          : `Generation failed — canvas unchanged.`;
        last.isError = true;
      } else if (status.generationPath === 'fallback') {
        last.text = `✓ ${status.sectionsGenerated} section${status.sectionsGenerated !== 1 ? 's' : ''} built via template engine.`;
        last.isFallback = true;
        last.requestType = status.requestType;
      } else {
        last.text = `✓ ${status.sectionsGenerated} section${status.sectionsGenerated !== 1 ? 's' : ''} generated via AI.`;
        last.requestType = status.requestType;
      }
      return copy;
    });

    setTimeout(loadSuggestions, 500);
  };

  const handleSuggestionClick = (s) => {
    setPrompt(s.prompt);
  };

  const statusColor = ollamaStatus === 'connected' ? '#10b981' : ollamaStatus === 'disconnected' ? '#ef4444' : '#f59e0b';
  const statusLabel = ollamaStatus === 'connected' ? `${availableModels.length} model${availableModels.length !== 1 ? 's' : ''}` : ollamaStatus === 'checking' ? 'Checking…' : 'Offline';

  return (
    <div style={{ width: '300px', backgroundColor: '#ffffff', borderLeft: '1px solid #e4e4e7', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0 }}>
      {/* Header */}
      <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #e4e4e7', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={15} color="#a855f7" />
          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#09090b' }}>AI Assistant</span>
        </div>
        {/* Ollama Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: statusColor, boxShadow: ollamaStatus === 'connected' ? `0 0 6px ${statusColor}` : 'none' }} />
          <span style={{ fontSize: '0.7rem', color: statusColor, fontWeight: 600 }}>{statusLabel}</span>
          <button onClick={() => checkOllama()} title="Refresh connection" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.1rem', display: 'flex', alignItems: 'center' }}>
            <RefreshCw size={11} color="#a1a1aa" />
          </button>
        </div>
      </div>

      {/* Ollama Connection Panel */}
      {ollamaStatus !== 'connected' && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: ollamaStatus === 'disconnected' ? '#fef2f2' : '#fffbeb', borderBottom: '1px solid #e4e4e7', flexShrink: 0 }}>
          {ollamaStatus === 'disconnected' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <AlertCircle size={13} color="#ef4444" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ef4444' }}>Ollama not detected</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#71717a', lineHeight: 1.4, marginBottom: '0.6rem' }}>
                Install <strong>Ollama</strong> and run a model to enable AI building. Template-based generation still works.
              </p>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  value={ollamaHost}
                  onChange={e => setOllamaHost(e.target.value)}
                  placeholder="http://localhost:11434"
                  style={{ flex: 1, fontSize: '0.7rem', padding: '0.3rem 0.5rem', border: '1px solid #e4e4e7', borderRadius: '6px', outline: 'none' }}
                />
                <button onClick={() => checkOllama(ollamaHost)} className="btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}>Connect</button>
              </div>
            </div>
          )}
          {ollamaStatus === 'checking' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#f59e0b' }}>
              <div style={{ width: 10, height: 10, border: '2px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Connecting to Ollama…
            </div>
          )}
        </div>
      )}

      {/* Connected status bar - no model name shown to user */}
      {ollamaStatus === 'connected' && (
        <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #e4e4e7', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <CheckCircle size={12} color="#10b981" />
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#065f46', flex: 1 }}>AI engine connected — ready to build</span>
          <Wifi size={11} color="#10b981" />
        </div>
      )}

      {/* Conversation Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {aiMessages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: '#a1a1aa' }}>
            <Wand2 size={24} style={{ marginBottom: '0.6rem', opacity: 0.4 }} />
            <p style={{ fontSize: '0.78rem', lineHeight: 1.5, fontStyle: 'italic' }}>
              {ollamaStatus === 'connected'
                ? 'AI ready — describe what you want to build and it will generate it section by section.'
                : 'Describe what you want to build. Try: "Create a modern SaaS landing page" or "Build a dark agency portfolio"'}
            </p>
          </div>
        )}

        {aiMessages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {/* Request type badge shown on assistant messages */}
            {msg.role === 'assistant' && (msg.requestType || msg.detectedType) && (
              <div style={{ marginBottom: '0.25rem', marginLeft: '0.1rem' }}>
                <RequestTypeBadge requestType={
                  msg.requestType
                    ? msg.requestType
                    : msg.detectedType?.toLowerCase().replace(/\s+/g, '_')
                } />
              </div>
            )}
            <div style={{
              maxWidth: '90%',
              padding: '0.55rem 0.75rem',
              borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
              backgroundColor: msg.role === 'user' ? 'rgba(168,85,247,0.1)' : msg.isError ? '#fef2f2' : msg.isFallback ? '#fffbeb' : '#fafafa',
              border: `1px solid ${msg.role === 'user' ? 'rgba(168,85,247,0.25)' : msg.isError ? '#fecaca' : msg.isFallback ? '#fde68a' : '#e4e4e7'}`,
              fontSize: '0.775rem',
              color: msg.role === 'user' ? '#7e22ce' : msg.isError ? '#ef4444' : msg.isFallback ? '#92400e' : '#09090b',
              lineHeight: 1.45
            }}>
              {msg.isStreaming ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#a855f7', animation: 'pulse 1s infinite', flexShrink: 0 }} />
                    <span style={{ color: '#71717a', fontStyle: 'italic', fontSize: '0.75rem' }}>
                      {msg.stepLabel || 'Building…'}
                    </span>
                  </div>
                  {msg.detectedType && (
                    <div style={{ marginTop: '0.1rem' }}>
                      <RequestTypeBadge requestType={msg.detectedType.toLowerCase().replace(/\s+/g, '_')} />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div>{msg.text}</div>
                  {msg.isFallback && (
                    <div style={{ marginTop: '0.4rem', fontSize: '0.68rem', color: '#a16207', fontStyle: 'italic' }}>
                      Connect Ollama for AI-powered generation.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div style={{ padding: '0.6rem 1rem', borderTop: '1px solid #e4e4e7', flexShrink: 0 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#a1a1aa', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>SUGGESTIONS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => handleSuggestionClick(s)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.6rem', backgroundColor: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(168,85,247,0.12)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(168,85,247,0.06)'}
              >
                <ChevronRight size={11} color="#a855f7" />
                <span style={{ fontSize: '0.72rem', color: '#7e22ce', fontWeight: 500 }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {loadingSuggestions && (
        <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
          <div style={{ width: 8, height: 8, border: '2px solid #a855f7', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>Loading AI suggestions…</span>
        </div>
      )}

      {/* Prompt Input */}
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e4e4e7', flexShrink: 0 }}>
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder={ollamaStatus === 'connected' ? 'Describe what to build… AI will create it section by section' : 'Describe what to build… e.g. "Create a SaaS landing page with pricing"'}
            rows={3}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: '0.8rem', color: '#09090b', fontFamily: 'var(--font-sans)', lineHeight: 1.45 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.3rem', borderTop: '1px solid #e4e4e7' }}>
            <span style={{ fontSize: '0.65rem', color: '#a1a1aa' }}>↵ Enter to send</span>
            <button type="submit" disabled={!prompt.trim() || isGenerating} className="btn-primary" style={{ padding: '0.3rem 0.7rem', borderRadius: '8px', gap: '0.3rem', fontSize: '0.72rem' }}>
              {isGenerating ? (
                <><div style={{ width: 8, height: 8, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Building…</>
              ) : (
                <><Zap size={11} /> Generate</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
