import React from 'react';
import { Sliders, Trash2, Palette } from 'lucide-react';

const PRESET_PALETTES = [
  { name: 'Clean White', bg: '#ffffff', text: '#09090b', accent: '#a855f7' },
  { name: 'Ink Dark', bg: '#09090b', text: '#ffffff', accent: '#a855f7' },
  { name: 'Midnight Blue', bg: '#0f172a', text: '#ffffff', accent: '#3b82f6' },
  { name: 'Forest Green', bg: '#f0fdf4', text: '#064e3b', accent: '#10b981' },
  { name: 'Warm Orange', bg: '#fffbeb', text: '#1c0a00', accent: '#ff5500' },
  { name: 'Rose Blush', bg: '#fff1f2', text: '#4c0519', accent: '#f43f5e' },
  { name: 'Slate Cool', bg: '#f8fafc', text: '#0f172a', accent: '#6366f1' },
  { name: 'Pure Black', bg: '#000000', text: '#ffffff', accent: '#ffffff' },
];

export default function Inspector({ selectedComponent, onUpdateStyles, onDelete }) {
  if (!selectedComponent) {
    return (
      <div style={{ width: '260px', backgroundColor: '#ffffff', borderLeft: '1px solid #e4e4e7', padding: '2rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#a1a1aa', height: '100%', flexShrink: 0 }}>
        <Sliders size={28} style={{ marginBottom: '0.85rem', opacity: 0.3 }} />
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#09090b', display: 'block', marginBottom: '0.5rem' }}>Property Inspector</span>
        <p style={{ fontSize: '0.78rem', lineHeight: 1.5, color: '#71717a' }}>
          Select a section on the canvas to inspect and edit its colors, spacing, and theme.
        </p>
      </div>
    );
  }

  const { name, styles = {} } = selectedComponent;

  return (
    <div style={{ width: '260px', backgroundColor: '#ffffff', borderLeft: '1px solid #e4e4e7', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0 }}>
      {/* Header */}
      <div style={{ height: '40px', borderBottom: '1px solid #e4e4e7', padding: '0 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fafafa', flexShrink: 0 }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#09090b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </span>
        <button onClick={() => onDelete(selectedComponent.id)} className="btn-ghost" style={{ padding: '0.2rem', color: '#ef4444' }} title="Delete Section">
          <Trash2 size={13} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
        {/* Preset Palettes */}
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Palette size={11} /> Theme Presets
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
            {PRESET_PALETTES.map((pal) => (
              <button key={pal.name} onClick={() => onUpdateStyles(selectedComponent.id, { bgColor: pal.bg, textColor: pal.text, accentColor: pal.accent })}
                style={{ backgroundColor: pal.bg, border: `1.5px solid ${styles.bgColor === pal.bg ? '#a855f7' : '#e4e4e7'}`, borderRadius: '8px', padding: '0.45rem 0.55rem', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: pal.text, lineHeight: 1.2 }}>{pal.name}</div>
                <div style={{ display: 'flex', gap: '3px', marginTop: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: pal.accent }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: pal.text, opacity: 0.5 }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: pal.bg, border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Custom Colors</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Background', key: 'bgColor', default: '#ffffff' },
              { label: 'Text Color', key: 'textColor', default: '#09090b' },
              { label: 'Accent / CTA', key: 'accentColor', default: '#a855f7' },
            ].map(({ label, key, default: def }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.775rem', color: '#52525b' }}>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.65rem', color: '#a1a1aa', fontFamily: 'monospace' }}>{styles[key] || def}</span>
                  <input type="color" value={styles[key] || def} onChange={e => onUpdateStyles(selectedComponent.id, { [key]: e.target.value })} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e4e4e7', cursor: 'pointer', padding: '2px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Padding */}
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Section Padding</div>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {['2rem', '4rem', '6rem', '8rem'].map((pad) => (
              <button key={pad} onClick={() => onUpdateStyles(selectedComponent.id, { paddingY: pad })}
                style={{ flex: 1, backgroundColor: styles.paddingY === pad ? 'rgba(168,85,247,0.1)' : '#ffffff', color: styles.paddingY === pad ? '#9333ea' : '#52525b', border: `1px solid ${styles.paddingY === pad ? '#a855f7' : '#e4e4e7'}`, borderRadius: '6px', padding: '0.3rem 0', fontSize: '0.68rem', fontWeight: styles.paddingY === pad ? 700 : 400, cursor: 'pointer' }}>
                {pad}
              </button>
            ))}
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Section Corner Radius</div>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {['0px', '8px', '16px', '24px'].map((r) => (
              <button key={r} onClick={() => onUpdateStyles(selectedComponent.id, { borderRadius: r })}
                style={{ flex: 1, backgroundColor: styles.borderRadius === r ? 'rgba(168,85,247,0.1)' : '#ffffff', color: styles.borderRadius === r ? '#9333ea' : '#52525b', border: `1px solid ${styles.borderRadius === r ? '#a855f7' : '#e4e4e7'}`, borderRadius: '6px', padding: '0.3rem 0', fontSize: '0.68rem', fontWeight: styles.borderRadius === r ? 700 : 400, cursor: 'pointer' }}>
                {r === '0px' ? 'None' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Delete Section */}
        <button onClick={() => onDelete(selectedComponent.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%', padding: '0.6rem', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
          <Trash2 size={13} /> Delete Section
        </button>
      </div>
    </div>
  );
}
