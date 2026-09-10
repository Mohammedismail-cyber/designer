import React from 'react';

export const LogoMarquee = ({ logos }) => {
  return (
    <div className="relative overflow-hidden bg-gray-50 py-12">
      <div className="flex animate-marquee">
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          >
            {logo}
          </div>
        ))}
      </div>
    </div>
  );
};
