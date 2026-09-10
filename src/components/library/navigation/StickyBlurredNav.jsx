import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

export const StickyBlurredNav = ({ logo, links, cta }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {logo}
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        
        {cta && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg bg-gray-900 px-6 py-2 text-white transition-colors hover:bg-gray-800"
          >
            {cta}
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
};
