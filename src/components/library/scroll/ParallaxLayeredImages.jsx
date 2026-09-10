import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ParallaxLayeredImages = ({ layers }) => {
  const { scrollY } = useScroll();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {layers.map((layer, index) => {
        const y = useTransform(scrollY, [0, 500], [0, (index + 1) * 50]);
        
        return (
          <motion.div
            key={index}
            style={{ y }}
            className="absolute inset-0"
          >
            {layer}
          </motion.div>
        );
      })}
    </section>
  );
};
