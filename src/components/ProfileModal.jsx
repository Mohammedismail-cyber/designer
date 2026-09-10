import React, { useState } from 'react';
import { X, User, Mail, Monitor, Moon, Sun, Wifi, CheckCircle, AlertCircle } from 'lucide-react';
import { getOllamaModels } from '../utils/generator';

export default function ProfileModal({ user, onClose, onSave, ollamaHost, onChangeOllamaHost, ollamaModels, onRefreshModels }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [theme, setTheme] = useState('light');
  const [hostInput, setHostInput] = useState(ollamaHost || 'http://localhost:11434');
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null); // 'ok' | 'fail'

  const handleSave = () => {
    onSave({ name, email });
    onChangeOllamaHost(hostInput);
    onClose();
  };

  const testConnection = async () => {
    setTesting(true);
    setConnectionStatus(null);
    try {
      const models = await getOllamaModels(hostInput);
      if (models.length > 0 || models !== null) {
        setConnectionStatus('ok');
        onRefreshModels(models);
      } else {
        setConnectionStatus('fail');
      }
    } catch {
      setConnectionStatus('fail');
    }
    setTesting(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '2rem'
    }}>
      <div style={{
        width: '100%', maxWidth: '460px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,0.12)'
      }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} color="var(--accent)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#09090b' }}>Profile & Settings</span>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem', borderRadius: '50%' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Profile info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account</h4>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{
                width: '3rem', height: '3rem', borderRadius: '50%',
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', fontWeight: 700, color: 'white', flexShrink: 0
              }}>
                {name ? name[0].toUpperCase() : 'O'}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <User size={13} color="#a1a1aa" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="input-field" style={{ width: '100%', paddingLeft: '2.1rem', height: '2.2rem', fontSize: '0.8rem' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <Mail size={13} color="#a1a1aa" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="input-field" style={{ width: '100%', paddingLeft: '2.1rem', height: '2.2rem', fontSize: '0.8rem' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Local Ollama config */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Wifi size={13} color="var(--accent)" />
              <h4 style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Local Ollama Connection</h4>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                value={hostInput}
                onChange={e => setHostInput(e.target.value)}
                placeholder="http://localhost:11434"
                className="input-field"
                style={{ flex: 1, height: '2.2rem', fontSize: '0.8rem' }}
              />
              <button onClick={testConnection} disabled={testing} className="btn-secondary" style={{ height: '2.2rem', padding: '0 0.75rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                {testing ? 'Testing...' : 'Test'}
              </button>
            </div>

            {connectionStatus === 'ok' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#10b981' }}>
                <CheckCircle size={13} />
                <span>Connected successfully. Models loaded.</span>
              </div>
            )}
            {connectionStatus === 'fail' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#ef4444' }}>
                <AlertCircle size={13} />
                <span>Could not connect. Make sure Ollama is running.</span>
              </div>
            )}

            {ollamaModels.length > 0 && (
              <div style={{ backgroundColor: '#fafafa', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.75rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Discovered Models ({ollamaModels.length})</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {ollamaModels.slice(0, 5).map(m => (
                    <div key={m.name} style={{ fontSize: '0.75rem', color: '#09090b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', flexShrink: 0 }}></span>
                      <span>{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Save button */}
          <button onClick={handleSave} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
