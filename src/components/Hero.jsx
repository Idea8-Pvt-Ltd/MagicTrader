import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  Play,
  TrendingUp,
  Zap,
  Target,
  Users,
  Award,
  ChevronDown,
  Bitcoin,
  DollarSign,
  BarChart3,
  Activity
} from 'lucide-react';

import { TrendingDown } from 'lucide-react';


// Complete Particle Network Component
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
  const initializeParticles = React.useCallback((width, height) => {
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
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
      connections: [],
      mouseDistance: Infinity,
      trail: [],
      maxTrailLength: 5,
    }));
  }, [particleCount, particleSpeed, nodeSize, colors.particles]);

  // Update canvas size
  const updateCanvasSize = React.useCallback(() => {
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
  const getDistance = React.useCallback((x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }, []);

  // Update particle physics
  const updateParticles = React.useCallback((width, height) => {
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
          const force = (mouseRadius - mouseDistance) / mouseRadius;
          const angle = Math.atan2(particle.y - mouse.y, particle.x - mouse.x);
          
          particle.vx += Math.cos(angle) * force * 0.5;
          particle.vy += Math.sin(angle) * force * 0.5;
          particle.opacity = Math.min(1, 0.8 + force * 0.2);
        } else {
          particle.vx += (particle.originalVx - particle.vx) * 0.05;
          particle.vy += (particle.originalVy - particle.vy) * 0.05;
          particle.opacity += (0.5 - particle.opacity) * 0.02;
        }
      }

      particle.x += particle.vx;
      particle.y += particle.vy;
      
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      if (particle.x <= particle.radius || particle.x >= width - particle.radius) {
        particle.vx *= -0.8;
        particle.x = Math.max(particle.radius, Math.min(width - particle.radius, particle.x));
      }
      
      if (particle.y <= particle.radius || particle.y >= height - particle.radius) {
        particle.vy *= -0.8;
        particle.y = Math.max(particle.radius, Math.min(height - particle.radius, particle.y));
      }

      particle.pulsePhase += particle.pulseSpeed;
      particle.connections = [];
    });

    // Calculate connections
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

  // Render function
  const render = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = dimensions;
    
    if (width === 0 || height === 0) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);

    const mouse = mouseRef.current;

    // Draw connections
    particlesRef.current.forEach(particle => {
      particle.connections.forEach(connection => {
        ctx.strokeStyle = colors.connections;
        ctx.lineWidth = 1;
        ctx.globalAlpha = connection.opacity;
        
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(connection.particle.x, connection.particle.y);
        ctx.stroke();
      });

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

    // Draw particles
    particlesRef.current.forEach(particle => {
      const pulseScale = 1 + Math.sin(particle.pulsePhase) * 0.1;
      const radius = particle.radius * pulseScale;
      
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      if (enableMouse && mouse && particle.mouseDistance < mouseRadius) {
        const glowIntensity = (1 - particle.mouseDistance / mouseRadius) * 0.8;
        ctx.globalAlpha = glowIntensity;
        ctx.fillStyle = colors.mouseConnections;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
  }, [dimensions, colors, enableMouse, mouseRadius]);

  // Animation loop
  const animate = React.useCallback(() => {
    const { width, height } = dimensions;
    
    if (width > 0 && height > 0) {
      updateParticles(width, height);
      render();
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [dimensions, updateParticles, render]);

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

// Trading Chart Components for 3D Elements
const CandlestickChart = ({ width = 120, height = 60, color = "green" }) => {
  const candlesticks = [
    { open: 30, close: 38, high: 42, low: 27, bullish: true },
    { open: 38, close: 32, high: 40, low: 30, bullish: false },
    { open: 32, close: 42, high: 46, low: 30, bullish: true },
    { open: 42, close: 38, high: 45, low: 35, bullish: false },
    { open: 38, close: 48, high: 52, low: 36, bullish: true },
    { open: 48, close: 44, high: 51, low: 40, bullish: false },
    { open: 44, close: 52, high: 56, low: 42, bullish: true },
  ];

  return (
    <svg width={width} height={height} viewBox="0 0 100 80" className="opacity-75">
      {candlesticks.map((candle, i) => (
        <g key={i}>
          {/* Wick */}
          <line
            x1={i * 14 + 8}
            y1={80 - candle.high}
            x2={i * 14 + 8}
            y2={80 - candle.low}
            stroke={candle.bullish ? "#10B981" : "#EF4444"}
            strokeWidth="2"
          />
          {/* Body */}
          <rect
            x={i * 14 + 3}
            y={80 - Math.max(candle.open, candle.close)}
            width="10"
            height={Math.max(2, Math.abs(candle.close - candle.open))}
            rx="1"
            fill={candle.bullish ? "#10B981" : "#EF4444"}
            fillOpacity="0.9"
          />
        </g>
      ))}
    </svg>
  );
};

const TrendLine = ({ width = 90, height = 45, trend = "up" }) => {
  const points = trend === "up" 
    ? "5,40 25,30 45,20 65,10 85,0"
    : "5,0 25,10 45,20 65,30 85,40";
  
  return (
    <svg width={width} height={height} viewBox="0 0 90 40" className="opacity-75">
      <polyline
        points={points}
        fill="none"
        stroke={trend === "up" ? "#10B981" : "#EF4444"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Trend dots */}
      {points.split(' ').map((point, i) => {
        const [x, y] = point.split(',').map(Number);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2.5"
            fill={trend === "up" ? "#10B981" : "#EF4444"}
            opacity="0.9"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
};

const PriceDisplay = ({ symbol, price, change }) => (
  <div className="text-center text-white/80 text-xs font-mono">
    <div className="font-bold">{symbol}</div>
    <div>${price}</div>
    <div className={`text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
      {change >= 0 ? '+' : ''}{change}%
    </div>
  </div>
);

const VolumeBar = ({ height = 20 }) => (
  <div className="flex items-end gap-1 opacity-40">
    {[8, 12, 6, 15, 10, 18, 9].map((h, i) => (
      <div
        key={i}
        className="w-1 bg-cyan-400"
        style={{ height: `${h}px` }}
      />
    ))}
  </div>
);

// Massive 3D Elements with Trading Data (Enhanced)
const Massive3DElements = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 1 }}>
      {/* Giant Floating Sphere - BTC Data */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full flex items-center justify-center"
        style={{
          top: '-100px',
          right: '-150px',
          background: 'radial-gradient(circle at 30% 30%, rgba(0, 212, 255, 0.6), rgba(59, 130, 246, 0.4), rgba(0, 0, 0, 0.1))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 200px rgba(0, 212, 255, 0.5), inset 0 0 100px rgba(255, 255, 255, 0.1)',
        }}
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="text-center">
          <PriceDisplay symbol="BTC/USD" price="43,250" change={2.34} />
          <div className="mt-4">
            <CandlestickChart width={120} height={60} />
          </div>
          <div className="mt-2 text-xs text-white/60">
            24H Vol: $2.4B
          </div>
        </div>
      </motion.div>

      {/* Massive Rotating Cube - ETH Data */}
      <motion.div
        className="absolute w-[400px] h-[400px] flex items-center justify-center"
        style={{
          top: '-80px',
          left: '-120px',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(236, 72, 153, 0.6), rgba(59, 130, 246, 0.4))',
          borderRadius: '30px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 150px rgba(168, 85, 247, 0.6), inset 0 0 80px rgba(255, 255, 255, 0.1)',
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          rotateZ: [0, 360],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="text-center">
          <PriceDisplay symbol="ETH/USD" price="2,640" change={-1.2} />
          <div className="mt-3">
            <TrendLine width={80} height={40} trend="down" />
          </div>
          <div className="mt-2">
            <VolumeBar />
          </div>
        </div>
      </motion.div>

      {/* Giant Torus Ring - FOREX Data */}
      <motion.div
        className="absolute w-[600px] h-[600px] flex items-center justify-center"
        style={{
          top: '10%',
          right: '-200px',
        }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          y: [0, -60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div 
          className="w-full h-full rounded-full border-[20px] flex items-center justify-center"
          style={{
            background: 'conic-gradient(from 0deg, rgba(34, 197, 94, 0.4), rgba(20, 184, 166, 0.5), rgba(0, 212, 255, 0.4), rgba(34, 197, 94, 0.4))',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 120px rgba(34, 197, 94, 0.6), inset 0 0 80px rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="text-center">
            <PriceDisplay symbol="EUR/USD" price="1.0845" change={0.15} />
            <div className="mt-4">
              <CandlestickChart width={100} height={50} color="green" />
            </div>
            <div className="mt-2 text-xs text-white/60">
              Forex • Major Pair
            </div>
          </div>
        </div>
      </motion.div>

      {/* Massive Cylinder - AAPL Stock */}
      <motion.div
        className="absolute w-[300px] h-[600px] flex items-center justify-center"
        style={{
          bottom: '-100px',
          left: '15%',
          background: 'linear-gradient(180deg, rgba(251, 191, 36, 0.6), rgba(245, 101, 101, 0.5), rgba(59, 130, 246, 0.4))',
          borderRadius: '40px 40px 150px 150px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 120px rgba(251, 191, 36, 0.5), inset 0 0 60px rgba(255, 255, 255, 0.1)',
        }}
        animate={{
          rotateY: [0, 20, -20, 0],
          y: [0, -30, 0],
          scaleY: [1, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="text-center">
          <PriceDisplay symbol="AAPL" price="182.50" change={1.2} />
          <div className="mt-4">
            <TrendLine width={70} height={35} trend="up" />
          </div>
          <div className="mt-3 text-xs text-white/60">
            NASDAQ • Tech
          </div>
        </div>
      </motion.div>

      {/* Giant Crystal Pyramid - TSLA */}
      <motion.div
        className="absolute w-[350px] h-[350px] flex items-center justify-center"
        style={{
          top: '5%',
          left: '50%',
          marginLeft: '-175px',
          background: 'linear-gradient(45deg, rgba(139, 69, 19, 0.5), rgba(168, 85, 247, 0.6), rgba(0, 212, 255, 0.4))',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          backdropFilter: 'blur(20px)',
          filter: 'drop-shadow(0 0 100px rgba(168, 85, 247, 0.6))',
        }}
        animate={{
          rotateZ: [0, 360],
          y: [0, -25, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="text-center mt-20">
          <PriceDisplay symbol="TSLA" price="248.75" change={-2.1} />
          <div className="mt-2">
            <CandlestickChart width={80} height={40} />
          </div>
        </div>
      </motion.div>

      {/* Massive Hexagon - Gold Futures */}
      <motion.div
        className="absolute w-[450px] h-[450px] flex items-center justify-center"
        style={{
          top: '-50px',
          right: '25%',
          background: 'conic-gradient(from 30deg, rgba(0, 212, 255, 0.5), rgba(168, 85, 247, 0.4), rgba(34, 197, 94, 0.5), rgba(0, 212, 255, 0.5))',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          backdropFilter: 'blur(20px)',
          filter: 'drop-shadow(0 0 120px rgba(0, 212, 255, 0.5))',
        }}
        animate={{
          rotateZ: [0, 360],
          y: [0, -35, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="text-center">
          <PriceDisplay symbol="GOLD" price="1,950" change={0.8} />
          <div className="mt-3">
            <TrendLine width={90} height={45} trend="up" />
          </div>
          <div className="mt-2 text-xs text-white/60">
            Commodities
          </div>
        </div>
      </motion.div>

      {/* Giant Donut - SPY Index */}
      <motion.div
        className="absolute w-[380px] h-[380px] flex items-center justify-center"
        style={{
          bottom: '5%',
          right: '5%',
        }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          y: [0, -35, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div 
          className="w-full h-full rounded-full border-[15px] flex items-center justify-center"
          style={{
            background: 'conic-gradient(from 45deg, rgba(255, 20, 147, 0.5), rgba(0, 191, 255, 0.6), rgba(50, 205, 50, 0.4), rgba(255, 20, 147, 0.5))',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 100px rgba(255, 20, 147, 0.5), inset 0 0 60px rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="text-center">
            <PriceDisplay symbol="SPY" price="445.20" change={1.1} />
            <div className="mt-3">
              <CandlestickChart width={85} height={42} />
            </div>
            <div className="mt-2 text-xs text-white/60">
              S&P 500 ETF
            </div>
          </div>
        </div>
      </motion.div>

      {/* Massive Octahedron - Oil Futures */}
      <motion.div
        className="absolute w-[320px] h-[320px] flex items-center justify-center"
        style={{
          bottom: '10%',
          left: '8%',
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.6), rgba(255, 140, 0, 0.5), rgba(220, 20, 60, 0.4))',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          backdropFilter: 'blur(20px)',
          filter: 'drop-shadow(0 0 100px rgba(255, 215, 0, 0.6))',
        }}
        animate={{
          rotateZ: [0, 360],
          y: [0, -28, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="text-center">
          <PriceDisplay symbol="OIL" price="85.40" change={-0.5} />
          <div className="mt-2">
            <TrendLine width={70} height={35} trend="down" />
          </div>
          <div className="mt-2">
            <VolumeBar height={15} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Live Market Ticker
const LiveTicker = () => {
  const [prices, setPrices] = useState({
    'BTC/USD': { price: 43250.5, change: 2.34 },
    'ETH/USD': { price: 2640.8, change: -1.2 },
    'AAPL': { price: 182.45, change: 0.8 },
    'EUR/USD': { price: 1.0845, change: 0.15 },
    'TSLA': { price: 248.9, change: -2.1 },
    'SPY': { price: 445.2, change: 1.1 },
  });

  const [visiblePairs, setVisiblePairs] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(symbol => {
          const volatility = symbol.includes('USD') && symbol.length > 6 ? 0.01 : 
                           symbol.includes('/') ? 50 : 2;
          const priceChange = (Math.random() - 0.5) * volatility;
          const changePercent = (Math.random() - 0.5) * 2;
          
          updated[symbol] = {
            price: Math.max(0.01, updated[symbol].price + priceChange),
            change: Math.max(-10, Math.min(10, updated[symbol].change + changePercent))
          };
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setVisiblePairs(2);
      else if (width < 768) setVisiblePairs(3);
      else if (width < 1024) setVisiblePairs(4);
      else setVisiblePairs(6);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-4 mt-12 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
    >
      {Object.entries(prices).slice(0, visiblePairs).map(([symbol, data]) => (
        <motion.div 
          key={symbol}
          className="group bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 min-w-[140px]"
          whileHover={{ 
            scale: 1.05, 
            borderColor: data.change >= 0 ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
            boxShadow: data.change >= 0 ? '0 0 20px rgba(34, 197, 94, 0.2)' : '0 0 20px rgba(239, 68, 68, 0.2)'
          }}
          layout
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-white font-bold text-sm">{symbol}</span>
            <div className={`flex items-center gap-1 ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span className="text-xs font-medium">
                {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="text-white font-mono text-sm">
            ${data.price.toLocaleString(undefined, { 
              minimumFractionDigits: symbol.includes('USD') && symbol.length > 6 ? 4 : 2,
              maximumFractionDigits: symbol.includes('USD') && symbol.length > 6 ? 4 : 2 
            })}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOut * value));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Main Hero Component
export default function EnhancedHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Smooth spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(useTransform(scrollY, [0, 500], [0, 150]), springConfig);
  const opacity = useSpring(useTransform(scrollY, [0, 400], [1, 0]), springConfig);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById('how-it-works');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* Background Layers - Fixed Z-Index Order */}
      <div className="absolute inset-0 z-0">
        <Massive3DElements />
      </div>
      
      <div className="absolute inset-0 z-10">
        <ParticleNetwork mousePosition={mousePosition} />
      </div>
      
      {/* Complex Gradient Background */}
      <div className="absolute inset-0 z-5">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/60 to-black/80" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 15% 25%, rgba(0, 212, 255, 0.08) 0%, transparent 40%),
              radial-gradient(circle at 85% 75%, rgba(0, 255, 136, 0.06) 0%, transparent 40%),
              radial-gradient(circle at 45% 10%, rgba(168, 85, 247, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 60% 90%, rgba(59, 130, 246, 0.04) 0%, transparent 40%)
            `
          }}
        />
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-20 text-center px-6 max-w-7xl mx-auto"
        style={{ y, opacity }}
      >
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-8 group hover:border-cyan-400/50 transition-all duration-300"
        >
          <motion.div
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-white/90 text-sm font-medium">
            🚀 AI Trading Intelligence • <span className="text-green-400">Live Now</span>
          </span>
          <motion.div
            className="flex items-center gap-1 text-xs text-white/60"
            whileHover={{ scale: 1.05 }}
          >
            <Activity size={12} />
            <AnimatedCounter value={1247} />+ signals today
          </motion.div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.9]"
        >
          <motion.span 
            className="block text-white/95 mb-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            The Future of
          </motion.span>
          <motion.span 
            className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-green-400 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ backgroundSize: '200% 200%' }}
            whileHover={{ scale: 1.02 }}
          >
            AI Trading
          </motion.span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 max-w-5xl mx-auto leading-relaxed"
        >
          Harness the power of advanced AI to predict market movements with{' '}
          <motion.span 
            className="text-cyan-400 font-bold"
            whileHover={{ scale: 1.1, textShadow: "0 0 20px rgba(0, 212, 255, 0.8)" }}
          >
            94% accuracy
          </motion.span>{' '}
          across Crypto, Forex, and Stock markets.{' '}
          <br className="hidden md:block" />
          Join{' '}
          <motion.span 
            className="text-green-400 font-bold"
            whileHover={{ scale: 1.1 }}
          >
            <AnimatedCounter value={50000} suffix="+" />
          </motion.span>{' '}
          profitable traders worldwide.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <motion.button
            className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-2xl overflow-hidden shadow-2xl min-w-[200px]"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 25px 50px rgba(0, 212, 255, 0.4)',
              filter: 'brightness(1.1)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Start Trading Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500"
              initial={{ x: '100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.4 }}
            />
          </motion.button>

          <motion.button
            className="group flex items-center gap-3 px-10 py-5 text-white/90 hover:text-white border-2 border-white/20 hover:border-white/40 rounded-2xl transition-all text-xl font-semibold min-w-[200px] backdrop-blur-sm"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(0, 212, 255, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToNext}
          >
            <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8"
        >
          {[
            { 
              value: '94.2', 
              suffix: '%', 
              label: 'AI Accuracy Rate', 
              icon: Target, 
              color: 'from-green-400 to-emerald-500',
              description: 'Verified trading accuracy'
            },
            { 
              value: '50', 
              suffix: 'K+', 
              label: 'Active Traders', 
              icon: Users, 
              color: 'from-blue-400 to-cyan-500',
              description: 'Growing community'
            },
            { 
              value: '24', 
              suffix: '/7', 
              label: 'Market Monitoring', 
              icon: Zap, 
              color: 'from-yellow-400 to-orange-500',
              description: 'Never miss opportunities'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="group relative"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 group-hover:border-cyan-400/50 transition-all duration-500 relative overflow-hidden">
                {/* Background Glow */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                  initial={false}
                />
                
                <stat.icon className="w-10 h-10 text-cyan-400 mb-6 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="text-4xl md:text-5xl font-black text-white mb-3">
                  <AnimatedCounter value={parseFloat(stat.value)} suffix={stat.suffix} />
                </div>
                <div className="text-white/70 text-lg font-medium mb-2">
                  {stat.label}
                </div>
                <div className="text-white/50 text-sm">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Live Market Ticker */}
        <LiveTicker />

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="flex flex-wrap justify-center items-center gap-6 mt-16 opacity-60"
        >
          <span className="text-white/50 text-sm font-medium">Trusted by leading traders from:</span>
          {['Goldman Sachs', 'JP Morgan', 'Binance', 'Coinbase', 'Interactive Brokers'].map((company, index) => (
            <motion.div
              key={company}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/40 text-sm font-medium"
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.7)'
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.4 + index * 0.1 }}
            >
              {company}
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={scrollToNext}
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center group-hover:border-cyan-400/50 transition-colors">
              <motion.div
                className="w-1 h-3 bg-white/40 rounded-full mt-2 group-hover:bg-cyan-400/80"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-white/40 text-xs font-medium group-hover:text-cyan-400/80 transition-colors">
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating Trading Icons */}
      <div className="absolute left-8 top-1/4 hidden xl:block">
        <motion.div
          animate={{ 
            y: [0, -25, 0], 
            rotate: [0, 8, -8, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="text-cyan-400/30 group-hover:text-cyan-400/60 transition-colors"
          whileHover={{ scale: 1.2, rotate: 15 }}
        >
          <Bitcoin size={64} />
        </motion.div>
      </div>

      <div className="absolute right-8 top-1/3 hidden xl:block">
        <motion.div
          animate={{ 
            y: [0, 30, 0], 
            rotate: [0, -12, 12, 0],
            x: [0, -10, 10, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="text-green-400/30 group-hover:text-green-400/60 transition-colors"
          whileHover={{ scale: 1.2, rotate: -15 }}
        >
          <TrendingUp size={56} />
        </motion.div>
      </div>

      <div className="absolute left-16 bottom-1/4 hidden xl:block">
        <motion.div
          animate={{ 
            y: [0, -20, 0], 
            rotate: [0, 360],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "linear"
          }}
          className="text-purple-400/30 group-hover:text-purple-400/60 transition-colors"
          whileHover={{ scale: 1.3 }}
        >
          <BarChart3 size={48} />
        </motion.div>
      </div>

      <div className="absolute right-16 bottom-1/3 hidden xl:block">
        <motion.div
          animate={{ 
            y: [0, 25, 0], 
            rotate: [0, -5, 5, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="text-yellow-400/30 group-hover:text-yellow-400/60 transition-colors"
          whileHover={{ scale: 1.2, rotate: 10 }}
        >
          <DollarSign size={52} />
        </motion.div>
      </div>

      {/* Additional Atmospheric Elements */}
      <div className="absolute top-20 left-1/4 hidden lg:block">
        <motion.div
          className="w-2 h-2 bg-cyan-400/60 rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 1,
          }}
        />
      </div>

      <div className="absolute bottom-32 right-1/4 hidden lg:block">
        <motion.div
          className="w-3 h-3 bg-green-400/50 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 2,
          }}
        />
      </div>

      {/* Data Stream Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{ 
              top: `${15 + i * 12}%`,
              width: '300px'
            }}
            animate={{
              x: ['-300px', 'calc(100vw + 300px)']
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </section>
  );
}