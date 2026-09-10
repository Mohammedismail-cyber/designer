import React from 'react';
import { motion } from 'framer-motion';

const float = {
  animate: { y: [0, -6, 0], x: [0, 4, 0] },
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
};

export function IconSpark({ size = 28, className = '', color = '#7c3aed' }) {
  return (
    <motion.svg {...float} className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gSpark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <g stroke="url(#gSpark)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.8 3.6L17 8l-3.2 1.4L12 13l-1.8-3.6L7 8l3.2-1.4L12 3z" fill="url(#gSpark)" stroke="none" opacity="0.95" />
        <path d="M12 1v2M12 21v2M4 12H2M22 12h-2M5 5L3.5 3.5M20.5 20.5L19 19M5 19L3.5 20.5M20.5 3.5L19 5" />
      </g>
    </motion.svg>
  );
}

export function IconGlobe({ size = 28, className = '', color = '#6366f1' }) {
  return (
    <motion.svg {...float} className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M6 6c4 6 8 6 12 0" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

export function IconDownload({ size = 28, className = '', color = '#16a34a' }) {
  return (
    <motion.svg whileHover={{ scale: 1.06 }} className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="14" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M8 12l4 4 4-4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 4v8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </motion.svg>
  );
}

export function IconCode({ size = 28, className = '', color = '#0ea5e9' }) {
  return (
    <motion.svg whileHover={{ rotate: [0, -6, 6, 0] }} className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 18l6-6-6-6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 6L2 12l6 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

export function IconFrame({ size = 28, className = '', color = '#a855f7' }) {
  return (
    <motion.svg whileHover={{ scale: 1.05 }} className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke={color} strokeWidth="1.6" />
      <rect x="7" y="9" width="10" height="6" rx="1" fill={color} opacity="0.08" />
    </motion.svg>
  );
}

export function IconZap({ size = 28, className = '', color = '#f59e0b' }) {
  return (
    <motion.svg whileHover={{ y: -4 }} className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14h7l-1 8L21 10h-7l-1-8z" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill={color} opacity="0.95" />
    </motion.svg>
  );
}

export default {
  IconSpark,
  IconGlobe,
  IconDownload,
  IconCode,
  IconFrame,
  IconZap
};
