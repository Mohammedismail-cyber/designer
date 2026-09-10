import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const CaseStudyGrid = ({ cases }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cases.map((caseItem, index) => (
        <motion.div
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="relative group overflow-hidden rounded-2xl bg-gray-100 cursor-pointer"
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="aspect-video overflow-hidden">
            {caseItem.preview}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center"
          >
            <div className="text-white text-center p-6">
              <h3 className="text-xl font-bold mb-2">{caseItem.title}</h3>
              <p className="text-gray-200">{caseItem.description}</p>
            </div>
          </motion.div>
          
          <div className="p-6">
            <h3 className="font-semibold text-gray-900">{caseItem.title}</h3>
            <p className="text-sm text-gray-500 mt-2">{caseItem.category}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
