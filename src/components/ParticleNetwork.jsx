import React, { useEffect, useRef, useCallback, useState } from 'react';

// Complete Particle Network Component (MyZScore.ai style)
const ParticleNetwork = ({ 
  mousePosition, 
  particleCount = 120,
  maxDistance = 150,
  mouseRadius = 100,
  enableMouse = true,
  particleSpeed = 0.5,
  nodeSize = { min: 1, max: 3 },
  colors = {
    particles: ['rgba(0, 212, 255, 0.8)', 'rgba(0, 255, 136, 0.6)', 'rgba(168, 85, 247, 0.7)'],
    connections: 'rgba(0, 212, 255, 0.15)',
    mouseConnections: 'rgba(0, 212, 255, 0.4)'
  },
  className = '',
  style = {}
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles
  const initializeParticles = useCallback((width, height) => {
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * particleSpeed,
      vy: (Math.random() - 0.5) * particleSpeed,
      radius: Math.random() * (nodeSize.max - nodeSize.min) + nodeSize.min,
      opacity: Math.random() * 0.5 + 0.3,
      color: colors.particles[Math.floor(Math.random() * colors.particles.length)],
      originalVx: (Math.random() - 0.5) * particleSpeed,
      originalVy: (Math.random() - 0.5) * particleSpeed,
      // Add pulsing effect
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
      // Connection tracking
      connections: [],
      mouseDistance: Infinity,
      // Trail effect
      trail: [],
      maxTrailLength: 5,
    }));
  }, [particleCount, particleSpeed, nodeSize, colors.particles]);

  // Update canvas size
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    setDimensions({ width: rect.width, height: rect.height });
    
    if (particlesRef.current.length === 0) {
      initializeParticles(rect.width, rect.height);
    }
  }, [initializeParticles]);

  // Mouse position update
  useEffect(() => {
    if (mousePosition && enableMouse) {
      mouseRef.current = mousePosition;
    }
  }, [mousePosition, enableMouse]);

  // Canvas resize handler
  useEffect(() => {
    const handleResize = () => {
      updateCanvasSize();
    };

    updateCanvasSize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateCanvasSize]);

  // Calculate distance between two points
  const getDistance = useCallback((x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }, []);

  // Update particle physics
  const updateParticles = useCallback((width, height) => {
    const mouse = mouseRef.current;
    
    particlesRef.current.forEach(particle => {
      // Update trail
      particle.trail.unshift({ x: particle.x, y: particle.y });
      if (particle.trail.length > particle.maxTrailLength) {
        particle.trail.pop();
      }

      // Mouse interaction
      if (enableMouse && mouse) {
        const mouseDistance = getDistance(particle.x, particle.y, mouse.x, mouse.y);
        particle.mouseDistance = mouseDistance;

        if (mouseDistance < mouseRadius) {
          // Repulsion effect
          const force = (mouseRadius - mouseDistance) / mouseRadius;
          const angle = Math.atan2(particle.y - mouse.y, particle.x - mouse.x);
          
          particle.vx += Math.cos(angle) * force * 0.5;
          particle.vy += Math.sin(angle) * force * 0.5;
          
          // Increase opacity when near mouse
          particle.opacity = Math.min(1, 0.8 + force * 0.2);
        } else {
          // Return to original velocity gradually
          particle.vx += (particle.originalVx - particle.vx) * 0.05;
          particle.vy += (particle.originalVy - particle.vy) * 0.05;
          particle.opacity += (0.5 - particle.opacity) * 0.02;
        }
      }

      // Apply velocity with some damping
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Apply slight damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Boundary collision with bounce
      if (particle.x <= particle.radius || particle.x >= width - particle.radius) {
        particle.vx *= -0.8;
        particle.x = Math.max(particle.radius, Math.min(width - particle.radius, particle.x));
      }
      
      if (particle.y <= particle.radius || particle.y >= height - particle.radius) {
        particle.vy *= -0.8;
        particle.y = Math.max(particle.radius, Math.min(height - particle.radius, particle.y));
      }

      // Update pulsing effect
      particle.pulsePhase += particle.pulseSpeed;
      
      // Clear previous connections
      particle.connections = [];
    });

    // Calculate connections between particles
    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const particleA = particlesRef.current[i];
        const particleB = particlesRef.current[j];
        
        const distance = getDistance(particleA.x, particleA.y, particleB.x, particleB.y);
        
        if (distance < maxDistance) {
          const connection = {
            particle: particleB,
            distance: distance,
            opacity: (1 - distance / maxDistance) * 0.4
          };
          
          particleA.connections.push(connection);
        }
      }
    }
  }, [enableMouse, mouseRadius, maxDistance, getDistance]);

  // Render particles and connections
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = dimensions;
    
    if (width === 0 || height === 0) return;

    // Clear canvas with slight trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);

    const mouse = mouseRef.current;

    // Draw connections first (behind particles)
    particlesRef.current.forEach(particle => {
      // Draw connections between particles
      particle.connections.forEach(connection => {
        ctx.strokeStyle = colors.connections;
        ctx.lineWidth = 1;
        ctx.globalAlpha = connection.opacity;
        
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(connection.particle.x, connection.particle.y);
        ctx.stroke();
      });

      // Draw mouse connections
      if (enableMouse && mouse && particle.mouseDistance < mouseRadius) {
        const mouseOpacity = (1 - particle.mouseDistance / mouseRadius) * 0.6;
        ctx.strokeStyle = colors.mouseConnections;
        ctx.lineWidth = 2;
        ctx.globalAlpha = mouseOpacity;
        
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    });

    // Draw particle trails
    particlesRef.current.forEach(particle => {
      if (particle.trail.length > 1) {
        for (let i = 1; i < particle.trail.length; i++) {
          const trailOpacity = (1 - i / particle.trail.length) * particle.opacity * 0.3;
          ctx.strokeStyle = particle.color.replace(/[\d\.]+\)$/g, `${trailOpacity})`);
          ctx.lineWidth = particle.radius * (1 - i / particle.trail.length);
          ctx.globalAlpha = 1;
          
          ctx.beginPath();
          ctx.moveTo(particle.trail[i - 1].x, particle.trail[i - 1].y);
          ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          ctx.stroke();
        }
      }
    });

    // Draw particles
    particlesRef.current.forEach(particle => {
      const pulseScale = 1 + Math.sin(particle.pulsePhase) * 0.1;
      const radius = particle.radius * pulseScale;
      
      // Main particle
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner glow
      ctx.globalAlpha = particle.opacity * 0.5;
      ctx.fillStyle = particle.color.replace(/[\d\.]+\)$/g, '0.3)');
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Outer glow for particles near mouse
      if (enableMouse && mouse && particle.mouseDistance < mouseRadius) {
        const glowIntensity = (1 - particle.mouseDistance / mouseRadius) * 0.8;
        ctx.globalAlpha = glowIntensity;
        ctx.fillStyle = colors.mouseConnections;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw mouse cursor effect
    if (enableMouse && mouse) {
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = colors.mouseConnections;
      
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouseRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Mouse center dot
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = colors.mouseConnections;
      
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }, [dimensions, colors, enableMouse, mouseRadius]);

  // Animation loop
  const animate = useCallback(() => {
    const { width, height } = dimensions;
    
    if (width > 0 && height > 0) {
      updateParticles(width, height);
      render();
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [dimensions, updateParticles, render]);

  // Start/stop animation
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        ...style
      }}
    />
  );
};

export default ParticleNetwork;