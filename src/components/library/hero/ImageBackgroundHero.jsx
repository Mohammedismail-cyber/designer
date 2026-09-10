import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ImageBackgroundHero = ({ 
  imageSrc, 
  title, 
  subtitle, 
  ctaText, 
  onCtaClick 
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 h-[120%] w-full"
      >
        <img
          src={imageSrc}
          alt=""
          className="h-full w-full object-cover"
        />
      </motion.div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
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
            className="mt-6 max-w-2xl text-lg text-gray-200 md:text-xl"
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
