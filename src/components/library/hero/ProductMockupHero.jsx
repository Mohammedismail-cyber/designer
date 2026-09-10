import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export const ProductMockupHero = ({ 
  title, 
  subtitle, 
  ctaText, 
  onCtaClick,
  mockupImage 
}) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <div className="flex flex-col justify-center text-left">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            >
              {title}
            </motion.h1>
            
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-6 text-lg text-gray-300 md:text-xl"
              >
                {subtitle}
              </motion.p>
            )}
            
            {ctaText && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                onClick={onCtaClick}
                className="mt-8 w-fit rounded-lg bg-white px-8 py-3 font-semibold text-black transition-colors hover:bg-gray-100"
              >
                {ctaText}
              </motion.button>
            )}
          </div>
          
          {/* Product Mockup with Tilt */}
          <motion.div
            ref={ref}
            style={{ rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              <img
                src={mockupImage}
                alt="Product mockup"
                className="h-auto max-h-[500px] w-full rounded-lg shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
