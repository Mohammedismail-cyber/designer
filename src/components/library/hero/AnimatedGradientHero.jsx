import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedGradientHero = ({ 
  title, 
  subtitle, 
  ctaText, 
  onCtaClick,
  gradientColors = ['#667eea', '#764ba2', '#f093fb'] 
}) => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
        }}
        style={{
          background: `linear-gradient(-45deg, ${gradientColors.join(', ')})`,
          backgroundSize: '400% 400%',
        }}
      />
      
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
            className="mt-6 max-w-2xl text-lg text-white/90 md:text-xl"
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
            className="mt-8 rounded-lg bg-white px-8 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-100"
          >
            {ctaText}
          </motion.button>
        )}
      </div>
    </section>
  );
};
