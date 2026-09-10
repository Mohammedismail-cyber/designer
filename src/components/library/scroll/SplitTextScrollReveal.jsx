import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const SplitTextScrollReveal = ({ text, className = '' }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const words = text.split(' ');

  return (
    <motion.h2
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.h2>
  );
};
