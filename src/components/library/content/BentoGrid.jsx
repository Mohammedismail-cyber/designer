import React from 'react';
import { motion } from 'framer-motion';

export const BentoGrid = ({ items, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`rounded-2xl bg-white p-6 shadow-lg border border-gray-100 ${
            item.span ? item.span : 'md:col-span-1'
          }`}
        >
          {item.content}
        </motion.div>
      ))}
    </div>
  );
};
