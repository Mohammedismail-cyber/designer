import { compileSectionHtml, compileSectionReact, compileSectionTailwind, HTML_STYLES } from './sectionCodegen.js';

export function compileToHtml(components) {
  if (!components?.length) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AuraStudio Export</title>
</head>
<body><!-- Empty canvas --></body>
</html>`;
  }

  const sections = components.map(compileSectionHtml).join('\n\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AuraStudio Export</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>${HTML_STYLES}</style>
</head>
<body>
${sections}
</body>
</html>`;
}

export function compileToReact(components) {
  if (!components?.length) {
    return `import React from 'react';

export default function AuraLayout() {
  return <div style={{ minHeight: '100vh', background: '#fafafa' }} />;
}`;
  }

  const fns = components.map((c, i) => compileSectionReact(c, i));
  const calls = components.map((c, i) => `      <Section${(c.name || c.type).replace(/\W+/g, '') || i} />`).join('\n');

  return `import React from 'react';

${fns.join('\n\n')}

export default function AuraLayout() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
${calls}
    </div>
  );
}`;
}

export function compileToTailwindMotion(components) {
  if (!components?.length) {
    return `import { motion } from 'framer-motion';

export default function AuraLayout() {
  return <div className="min-h-screen bg-zinc-50" />;
}`;
  }

  const needsScroll = components.some(c => c.type === 'motion_parallax');
  const fns = components.map((c, i) => compileSectionTailwind(c, i));
  const calls = components.map((_, i) => `      <Section${i} />`).join('\n');

  return `// Typography: Geist-style sans (Inter) + editorial restraint
// Stack: React + Tailwind CSS + Framer Motion
import { motion${needsScroll ? ', useScroll, useTransform' : ''} } from 'framer-motion';

${fns.join('\n\n')}

export default function AuraLayout() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 antialiased">
${calls}
    </div>
  );
}

/* tailwind.config.js snippet:
export default {
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: { accent: '#a855f7' },
    },
  },
};
*/
`;
}

/** @deprecated use compileToHtml */
export function compileWorkspaceToCode(components) {
  return compileToHtml(components);
}

export { compileToHtml as compileHtml, compileToReact as compileReact, compileToTailwindMotion as compileTailwindMotion };
