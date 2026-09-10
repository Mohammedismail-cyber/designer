import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const MegaMenu = ({ logo, menuItems, cta }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <nav className="relative bg-white border-b border-gray-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center">
          {logo}
        </div>
        
        <div className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setActiveMenu(index)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                {item.label}
              </button>
              
              <AnimatePresence>
                {activeMenu === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-2 w-[600px] bg-white rounded-lg shadow-xl border border-gray-100 p-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      {item.submenu.map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          href={subItem.href}
                          className="group flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            {subItem.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-gray-700">
                              {subItem.label}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {subItem.description}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        {cta && (
          <button className="rounded-lg bg-gray-900 px-6 py-2 text-white transition-colors hover:bg-gray-800">
            {cta}
          </button>
        )}
      </div>
    </nav>
  );
};
