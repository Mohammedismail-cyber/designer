import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const MobileFullScreenDrawer = ({ logo, links, cta }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-900 text-white"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Full Screen Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  {logo}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Links */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {links.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-2xl font-medium text-gray-900 hover:text-gray-600 transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
                
                {/* CTA */}
                {cta && (
                  <div className="p-6 border-t border-gray-200">
                    <button className="w-full rounded-lg bg-gray-900 px-6 py-3 text-white transition-colors hover:bg-gray-800">
                      {cta}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
