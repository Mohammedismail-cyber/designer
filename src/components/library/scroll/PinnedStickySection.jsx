import React from 'react';
import { motion } from 'framer-motion';

export const PinnedStickySection = ({ pinnedContent, scrollingContent }) => {
  return (
    <section className="relative min-h-[200vh] w-full">
      <div className="sticky top-0 flex h-screen items-center justify-center bg-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl px-4"
        >
          {pinnedContent}
        </motion.div>
      </div>
      <div className="relative -mt-[50vh] bg-white py-20">
        <div className="max-w-4xl px-4">
          {scrollingContent}
        </div>
      </div>
    </section>
  );
};
