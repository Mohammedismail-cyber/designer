import React from 'react';

export default function AuraLogo({ size = 28, showText = true, textStyle = {} }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', userSelect: 'none' }}>
      {/* Custom Geometric Logo Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="auraGrad1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a855f7" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="auraGrad2" x1="36" y1="0" x2="0" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c084fc" />
            <stop offset="1" stopColor="#9333ea" />
          </linearGradient>
        </defs>
        
        {/* Outer Rounded Frame */}
        <rect width="36" height="36" rx="10" fill="url(#auraGrad1)" />
        
        {/* Abstract Inner Geometric "A" & Ring Design */}
        <path
          d="M18 7L27 24H21.5L18 16.5L14.5 24H9L18 7Z"
          fill="white"
          fillOpacity="0.95"
        />
        <circle cx="18" cy="22" r="2.5" fill="white" />
        <path
          d="M12 28C14 29.3 16 30 18 30C20 30 22 29.3 24 28"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
      </svg>

      {/* Brand Name Text */}
      {showText && (
        <span style={{
          fontSize: size * 0.55,
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em',
          color: '#09090b',
          lineHeight: 1,
          ...textStyle
        }}>
          AURA<span style={{ color: '#a855f7' }}>STUDIO</span>
        </span>
      )}
    </div>
  );
}
