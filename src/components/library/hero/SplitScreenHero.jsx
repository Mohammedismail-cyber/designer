import React from 'react';
import { motion } from 'framer-motion';

export const SplitScreenHero = ({ 
  title, 
  subtitle, 
  ctaText, 
  onCtaClick,
  visualContent,
  visualPosition = 'right' 
}) => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      <div className="flex h-full w-full">
        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: visualPosition === 'right' ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={`flex w-1/2 flex-col justify-center px-8 md:px-16 lg:px-24 ${
            visualPosition === 'right' ? 'items-start text-left' : 'items-end text-right'
          }`}
        >
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
            {title}
          </h1>
          
          {subtitle && (
            <p className="mt-6 text-lg text-gray-600 md:text-xl">
              {subtitle}
            </p>
          )}
          
          {ctaText && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              onClick={onCtaClick}
              className="mt-8 rounded-lg bg-gray-900 px-8 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
            >
              {ctaText}
            </motion.button>
          )}
        </motion.div>
        
        {/* Visual Side */}
        <motion.div
          initial={{ opacity: 0, x: visualPosition === 'right' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex w-1/2 items-center justify-center bg-gray-100"
        >
          <div className="h-full w-full">
            {visualContent}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
