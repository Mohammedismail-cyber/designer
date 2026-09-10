import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const HorizontalScrollGallery = ({ items }) => {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  return (
    <section className="relative h-[300vh] w-full overflow-hidden bg-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8 px-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-[60vh] w-[80vw] md:w-[40vw] rounded-2xl bg-gray-100"
            >
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
