import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ScrollFillDeviceMockup = ({ screens }) => {
  const { scrollYProgress } = useScroll();
  
  return (
    <section className="relative h-screen w-full overflow-hidden bg-gray-900">
      <div className="sticky top-0 flex h-screen items-center justify-center">
        {/* Device Frame */}
        <div className="relative h-[600px] w-[300px] rounded-3xl border-4 border-gray-700 bg-black md:h-[700px] md:w-[350px]">
          {/* Screen Content */}
          <div className="h-full w-full overflow-hidden">
            {screens.map((screen, index) => {
              const start = index / screens.length;
              const end = (index + 1) / screens.length;
              const opacity = useTransform(scrollYProgress, [start, end], [1, 0]);
              const y = useTransform(scrollYProgress, [start, end], [0, -100]);
              
              return (
                <motion.div
                  key={index}
                  style={{ opacity, y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {screen}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
