import React, { useRef, useEffect } from 'react';

export default function Globe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Configuration
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const radius = Math.min(width, height) * 0.38;
    const center = { x: width / 2, y: height / 2 };

    // Generation of globe particles
    const particleCount = 240;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.acos(1 - (2 * i) / particleCount);
      const phi = Math.sqrt(particleCount * Math.PI) * theta;

      particles.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
        baseSize: Math.random() * 1.2 + 0.6,
        color: i % 8 === 0 ? '#a855f7' : '#a1a1aa', // Subtle gray points and purple nodes
      });
    }

    // Creating some glowing orbital paths/connections
    const connections = [];
    for (let i = 0; i < 20; i++) {
      const p1Idx = Math.floor(Math.random() * particleCount);
      let p2Idx = Math.floor(Math.random() * particleCount);
      while (p1Idx === p2Idx) {
        p2Idx = Math.floor(Math.random() * particleCount);
      }
      connections.push({ p1: p1Idx, p2: p2Idx });
    }

    let angleX = 0.002;
    let angleY = 0.004;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      angleY += deltaX * 0.002;
      angleX += deltaY * 0.002;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const rotateX = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        ...point,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos
      };
    };

    const rotateY = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        ...point,
        x: point.x * cos + point.z * sin,
        z: -point.x * sin + point.z * cos
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (!isDragging) {
        angleY += 0.001;
        angleX += 0.0003;
      }

      const projected = particles.map((p) => {
        let rotated = rotateY(p, angleY);
        rotated = rotateX(rotated, angleX);

        const distance = 400;
        const scale = distance / (distance - rotated.z);
        return {
          ...p,
          projX: rotated.x * scale + center.x,
          projY: rotated.y * scale + center.y,
          projZ: rotated.z,
          scale,
        };
      });

      projected.sort((a, b) => a.projZ - b.projZ);

      // Draw connection lines
      ctx.lineWidth = 0.5;
      connections.forEach((conn) => {
        const p1 = projected.find((p, idx) => idx === conn.p1);
        const p2 = projected.find((p, idx) => idx === conn.p2);

        if (p1 && p2) {
          const minZ = Math.min(p1.projZ, p2.projZ);
          const opacity = Math.max(0, (minZ + radius) / (2 * radius)) * 0.12;
          
          if (opacity > 0) {
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
            ctx.stroke();
          }
        }
      });

      // Draw particle points
      projected.forEach((p) => {
        const opacity = Math.max(0.12, (p.projZ + radius) / (2 * radius));
        const size = p.baseSize * p.scale;

        ctx.beginPath();
        ctx.arc(p.projX, p.projY, Math.max(0.1, size), 0, 2 * Math.PI);
        
        if (p.color === '#a855f7') {
          ctx.fillStyle = `rgba(168, 85, 247, ${opacity * 0.9})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
        } else {
          ctx.fillStyle = `rgba(113, 113, 122, ${opacity * 0.4})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Soft glow backing
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(center.x, center.y, radius * 0.6, center.x, center.y, radius * 1.2);
      gradient.addColorStop(0, 'rgba(168, 85, 247, 0.02)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.arc(center.x, center.y, radius * 1.2, 0, 2 * Math.PI);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.resetTransform();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      center.x = width / 2;
      center.y = height / 2;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', cursor: 'grab', display: 'block' }}
      />
    </div>
  );
}
