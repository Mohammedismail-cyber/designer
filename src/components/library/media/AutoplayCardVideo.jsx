import React from 'react';

export const AutoplayCardVideo = ({ videoSrc, poster, className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        className="w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
};
