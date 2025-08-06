import React, { useRef, useEffect } from 'react';

// Animated wavy threads background (SVG, pure dark, React Bits style)
const WavyThreadsBackground = () => {
  const pathRef1 = useRef(null);
  const pathRef2 = useRef(null);
  const pathRef3 = useRef(null);
  const animationRef = useRef();

  useEffect(() => {
    let t = 0;
    const animate = () => {
      t += 0.015;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const amplitude = 22;
      const baseY1 = height * 0.4;
      const baseY2 = height * 0.55;
      const baseY3 = height * 0.7;
      const points = 8;
      // Helper to generate a smooth path
      const makePath = (baseY, phase, amp=amplitude, color='#fff', opacity=0.11) => {
        let d = `M 0 ${baseY}`;
        for (let i = 1; i <= points; i++) {
          const x = (width / points) * i;
          const y = baseY + Math.sin(t * 1.2 + i + phase) * amp;
          d += ` L ${x} ${y}`;
        }
        return d;
      };
      if (pathRef1.current) pathRef1.current.setAttribute('d', makePath(baseY1, 0, amplitude, '#fff', 0.13));
      if (pathRef2.current) pathRef2.current.setAttribute('d', makePath(baseY2, 1.8, amplitude * 0.7, '#fff', 0.09));
      if (pathRef3.current) pathRef3.current.setAttribute('d', makePath(baseY3, 3.2, amplitude * 1.2, '#fff', 0.07));
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', display: 'block', background: '#0a0a12' }}
    >
      <path ref={pathRef1} stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.13" />
      <path ref={pathRef2} stroke="#fff" strokeWidth="2" fill="none" opacity="0.09" />
      <path ref={pathRef3} stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.07" />
    </svg>
  );
};

export default WavyThreadsBackground;
