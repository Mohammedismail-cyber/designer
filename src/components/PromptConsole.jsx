import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function PromptConsole({ onPromptSubmit }) {
  const [prompt, setPrompt] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isCompiling) return;

    setIsCompiling(true);
    setTimeout(() => {
      onPromptSubmit(prompt);
      setPrompt('');
      setIsCompiling(false);
    }, 900); // Quick compile response time
  };

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      background: '#ffffff',
      padding: '1.25rem 2rem',
      display: 'flex',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <form onSubmit={handleSend} style={{
        display: 'flex',
        width: '100%',
        maxWidth: '680px',
        gap: '0.5rem',
        position: 'relative',
        alignItems: 'center'
      }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isCompiling}
          placeholder="Prompt Aura to customize page layout colors, features, and content..."
          className="input-field"
          style={{
            flex: 1,
            height: '2.8rem',
            paddingRight: '3.5rem',
            borderRadius: '99px',
            fontSize: '0.85rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
        />
        <button
          type="submit"
          disabled={isCompiling || !prompt.trim()}
          className="btn-primary"
          style={{
            position: 'absolute',
            right: '4px',
            width: '2.3rem',
            height: '2.3rem',
            minWidth: '2.3rem',
            borderRadius: '50%',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: prompt.trim() ? 'var(--accent)' : '#e4e4e7',
            cursor: prompt.trim() ? 'pointer' : 'default'
          }}
        >
          {isCompiling ? (
            <div style={{ width: '0.9rem', height: '0.9rem', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          ) : (
            <ArrowUp size={16} color={prompt.trim() ? 'white' : '#71717a'} />
          )}
        </button>
      </form>
    </div>
  );
}
