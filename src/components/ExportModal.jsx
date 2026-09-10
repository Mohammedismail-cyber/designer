import React, { useState } from 'react';
import { X, Copy, Check, Download, Code, FileCode, Sparkles } from 'lucide-react';
import { compileToHtml, compileToReact, compileToTailwindMotion } from '../utils/generator';

const TABS = [
  { id: 'html', label: 'HTML & CSS', icon: Code, ext: 'aura-layout.html', desc: 'Self-contained semantic HTML' },
  { id: 'react', label: 'React', icon: FileCode, ext: 'AuraLayout.jsx', desc: 'React components with inline styles' },
  { id: 'tailwind', label: 'Tailwind + Motion', icon: Sparkles, ext: 'AuraLayout.motion.jsx', desc: 'React + Tailwind + Framer Motion' },
];

export default function ExportModal({ components, onClose }) {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    if (activeTab === 'html') return compileToHtml(components);
    if (activeTab === 'react') return compileToReact(components);
    return compileToTailwindMotion(components);
  };

  const exportedCode = getCode();
  const activeMeta = TABS.find(t => t.id === activeTab);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const code = getCode();
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeMeta?.ext || 'export.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-4xl flex flex-col max-h-[88vh] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Code size={18} className="text-violet-400" />
            <span className="text-base font-bold text-white">Export — 3 stacks</span>
          </div>
          <button onClick={onClose} className="btn-ghost rounded-full p-1"><X size={18} /></button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex flex-wrap gap-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={activeTab === id ? 'btn-primary' : 'btn-ghost'}
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem', height: 'auto' }}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={copyToClipboard} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
              {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={downloadFile} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
              <Download size={12} /> Download
            </button>
          </div>
        </div>

        <p className="px-6 py-2 text-xs text-zinc-500 border-b border-zinc-800">{activeMeta?.desc}</p>

        <div className="flex-1 p-6 bg-[#030303] overflow-y-auto font-mono text-[0.78rem] text-zinc-300 leading-relaxed whitespace-pre-wrap">
          <code>{exportedCode}</code>
        </div>
      </div>
    </div>
  );
}
