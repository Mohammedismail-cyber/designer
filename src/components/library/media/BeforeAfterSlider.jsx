import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export const BeforeAfterSlider = ({ beforeImage, afterImage, beforeLabel = 'Before', afterLabel = 'After' }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleSliderMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleSliderMove}
      className="relative w-full aspect-video overflow-hidden rounded-lg cursor-ew-resize select-none"
    >
      {/* After Image (Background) */}
      <div className="absolute inset-0">
        {afterImage}
      </div>

      {/* Before Image (Foreground with clip) */}
      <motion.div
        className="absolute inset-0"
        style={{ width: `${sliderPosition}%` }}
      >
        {beforeImage}
      </motion.div>

      {/* Slider Handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%` }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </motion.div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
        {afterLabel}
      </div>
    </div>
  );
};
