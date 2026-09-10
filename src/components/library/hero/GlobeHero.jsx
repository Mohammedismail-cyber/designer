import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import createGlobe from 'cobe';

export const GlobeHero = ({ 
  title, 
  subtitle, 
  ctaText, 
  onCtaClick,
  darkMode = false 
}) => {
  const canvasRef = useRef(null);

  React.useEffect(() => {
    let phi = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: window.devicePixelRatio,
      width: 800 * 2,
      height: 800 * 2,
      phi: 0,
      theta: 0,
      dark: darkMode ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: darkMode ? [0.3, 0.3, 0.3] : [1, 1, 1],
      markerColor: [251 / 255, 100 / 255, 21 / 255],
      glowColor: darkMode ? [0.3, 0.3, 0.3] : [1, 1, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.0060], size: 0.03 },
        { location: [51.5074, -0.1278], size: 0.03 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, [darkMode]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Globe Canvas */}
      <div className="absolute inset-0 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="h-[800px] w-[800px]"
          style={{ width: '800px', height: '800px' }}
        />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-4xl font-bold text-white md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-gray-300 md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
        
        {ctaText && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={onCtaClick}
            className="mt-8 rounded-lg bg-white px-8 py-3 font-semibold text-black transition-colors hover:bg-gray-100"
          >
            {ctaText}
          </motion.button>
        )}
      </div>
    </section>
  );
};
