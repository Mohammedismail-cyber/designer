import React, { useRef } from 'react';
import createGlobe from 'cobe';

export const StandaloneInteractiveGlobe = ({ 
  darkMode = false,
  markers = [],
  width = 600,
  height = 600 
}) => {
  const canvasRef = useRef(null);

  React.useEffect(() => {
    let phi = 0;
    let theta = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: window.devicePixelRatio,
      width: width * 2,
      height: height * 2,
      phi: phi,
      theta: theta,
      dark: darkMode ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: darkMode ? [0.3, 0.3, 0.3] : [1, 1, 1],
      markerColor: [251 / 255, 100 / 255, 21 / 255],
      glowColor: darkMode ? [0.3, 0.3, 0.3] : [1, 1, 1],
      markers: markers,
      onRender: (state) => {
        state.phi = phi;
        state.theta = theta;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, [darkMode, markers, width, height]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="rounded-full"
      />
    </div>
  );
};
