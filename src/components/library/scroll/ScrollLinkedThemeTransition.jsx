import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ScrollLinkedThemeTransition = ({ 
  children, 
  fromColor = '#ffffff', 
  toColor = '#000000' 
}) => {
  const { scrollYProgress } = useScroll();
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    [fromColor, toColor]
  );
  const textColor = useTransform(
    scrollYProgress,
    [0, 1],
    ['#000000', '#ffffff']
  );

  return (
    <motion.section
      style={{ backgroundColor, color: textColor }}
      className="relative min-h-screen w-full"
    >
      {children}
    </motion.section>
  );
};
