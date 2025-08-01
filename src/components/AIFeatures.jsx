import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { Eye, CheckCircle, Shield, Radar, Brain, Zap, Target, Activity } from 'lucide-react';
import ScrollAnimation, { ScrollParallax } from './ScrollAnimation';

// Enhanced Animated Number with glitch effect
function AnimatedNumber({ value, unit = '', className = '', delay = 0 }) {
  const [display, setDisplay] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const ref = useRef();
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      const timeout = setTimeout(() => {
        let start = 0;
        let startTime = null;
        
        function animate(ts) {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / 1500, 1);
          const easeOutCubic = 1 - Math.pow(1 - progress, 3);
          setDisplay(start + (value - start) * easeOutCubic);
          
          // Add glitch effect near completion
          if (progress > 0.8 && progress < 0.95 && !isGlitching) {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 200);
          }
          
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
      }, delay * 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [inView, value, delay, isGlitching]);

  return (
    <span 
      ref={ref} 
      className={`${className} ${isGlitching ? 'animate-pulse' : ''}`}
    >
      {display.toLocaleString(undefined, { 
        maximumFractionDigits: value % 1 === 0 ? 0 : 1 
      })}{unit}
    </span>
  );
}

// Morphing Icon Component
function MorphingIcon({ icons, interval = 3000, className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % icons.length);
    }, interval);
    return () => clearInterval(timer);
  }, [icons.length, interval]);

  return (
    <motion.div
      key={currentIndex}
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0, rotate: 180, opacity: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
      className={className}
    >
      {icons[currentIndex]}
    </motion.div>
  );
}

// Neural Network Visualization
function NeuralNetwork({ isActive = false }) {
  const nodes = [
    { x: 20, y: 30, size: 8 },
    { x: 20, y: 70, size: 6 },
    { x: 50, y: 20, size: 10 },
    { x: 50, y: 50, size: 8 },
    { x: 50, y: 80, size: 6 },
    { x: 80, y: 35, size: 12 },
    { x: 80, y: 65, size: 8 },
  ];

  const connections = [
    { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 1, to: 3 }, { from: 1, to: 4 },
    { from: 2, to: 5 }, { from: 3, to: 5 }, { from: 3, to: 6 }, { from: 4, to: 6 },
  ];

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="absolute inset-0 opacity-30">
      {/* Connections */}
      {connections.map((conn, i) => (
        <motion.line
          key={i}
          x1={nodes[conn.from].x}
          y1={nodes[conn.from].y}
          x2={nodes[conn.to].x}
          y2={nodes[conn.to].y}
          stroke="#00D4FF"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: isActive ? 1 : 0, 
            opacity: isActive ? 0.6 : 0.2 
          }}
          transition={{ duration: 1, delay: i * 0.1 }}
        />
      ))}
      
      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={node.size / 2}
          fill="#00FF88"
          initial={{ scale: 0 }}
          animate={{ 
            scale: isActive ? [1, 1.2, 1] : 1,
            opacity: isActive ? [0.6, 1, 0.6] : 0.4
          }}
          transition={{ 
            duration: 2, 
            delay: i * 0.1,
            repeat: isActive ? Infinity : 0
          }}
        />
      ))}
    </svg>
  );
}

// Particle Field Component
function ParticleField({ count = 30, isActive = false }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 2 + 1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-primary rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={isActive ? {
            y: [0, -20, 0],
            x: [0, 10, -10, 0],
            opacity: [0.3, 0.8, 0.3],
          } : {}}
          transition={{
            duration: particle.speed + 2,
            repeat: Infinity,
            delay: particle.id * 0.1,
          }}
        />
      ))}
    </div>
  );
}

// 3D Feature Card Component
function FeatureCard({ feature, index, isInView }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef();
  const isInViewCard = useInView(ref, { once: true, amount: 0.3 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setMousePosition({
      x: (e.clientX - centerX) / (rect.width / 2),
      y: (e.clientY - centerY) / (rect.height / 2),
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInViewCard ? { 
        opacity: 1, 
        y: 0,
        rotateY: isHovered ? mousePosition.x * 5 : 0,
        rotateX: isHovered ? mousePosition.y * -5 : 0,
      } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        type: "spring",
        bounce: 0.3
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0, 212, 255, 0.2)",
        borderColor: "rgba(0, 212, 255, 0.5)",
        zIndex: 10
      }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-gradient-to-b from-gray-900/90 to-background/90 border border-primary/20 rounded-2xl p-8 overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Background Effects */}
      <ParticleField count={15} isActive={isHovered} />
      <NeuralNetwork isActive={isHovered} />
      
      {/* Glowing Border Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        style={{
          background: "linear-gradient(45deg, #00D4FF, #00FF88, #00D4FF)",
          padding: "1px",
        }}
        animate={{
          opacity: isHovered ? 0.3 : 0,
        }}
      />
      
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-10"
        style={{
          background: `linear-gradient(45deg, ${feature.gradient})`,
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.2 : 0.1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Icon Section */}
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={isInViewCard ? { 
            y: isHovered ? -5 : 0, 
            opacity: 1 
          } : {}}
          transition={{ 
            duration: 0.5, 
            delay: 0.2 + (index * 0.1),
            ease: "easeOut"
          }}
        >
          <div className="relative">
            <motion.div
              className="p-4 rounded-full bg-background/80 border-2 border-primary/30 backdrop-blur-sm"
              animate={{
                borderColor: isHovered ? "rgba(0, 212, 255, 0.6)" : "rgba(0, 212, 255, 0.3)",
                boxShadow: isHovered ? "0 0 30px rgba(0, 212, 255, 0.3)" : "0 0 10px rgba(0, 212, 255, 0.1)",
              }}
            >
              <MorphingIcon 
                icons={feature.icons} 
                className="text-4xl"
                interval={4000}
              />
            </motion.div>

            {/* Orbiting Elements */}
            {feature.orbitIcons?.map((OrbitIcon, i) => (
              <motion.div
                key={i}
                className="absolute w-6 h-6 text-secondary"
                style={{
                  top: "50%",
                  left: "50%",
                  transformOrigin: "0 0",
                }}
                animate={{
                  rotate: isHovered ? 360 : 0,
                  x: Math.cos((i * 120) * Math.PI / 180) * 40 - 12,
                  y: Math.sin((i * 120) * Math.PI / 180) * 40 - 12,
                }}
                transition={{
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  x: { duration: 0.5 },
                  y: { duration: 0.5 },
                }}
              >
                <OrbitIcon size={16} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          animate={{
            y: isHovered ? -2 : 0,
          }}
        >
          {feature.title}
        </motion.h3>
        
        {/* Description */}
        <motion.p
          className="text-white/80 text-base mb-6 leading-relaxed"
          animate={{
            opacity: isHovered ? 1 : 0.8,
          }}
        >
          {feature.description}
        </motion.p>

        {/* Stats */}
        <motion.div
          className="bg-background/60 rounded-lg p-4 border border-primary/10"
          animate={{
            backgroundColor: isHovered ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.6)",
            borderColor: isHovered ? "rgba(0, 212, 255, 0.3)" : "rgba(0, 212, 255, 0.1)",
          }}
        >
          <div className={`text-2xl font-bold ${feature.color} mb-1`}>
            <AnimatedNumber 
              value={feature.stat.value} 
              unit={feature.stat.unit} 
              delay={index * 0.3}
            />
          </div>
          <div className="text-white/70 text-sm font-medium">
            {feature.stat.label}
          </div>
        </motion.div>
      </div>

      {/* Hover Indicator */}
      <motion.div
        className="absolute bottom-4 right-4 opacity-0"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
      >
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
      </motion.div>
    </motion.div>
  );
}

const features = [
  {
    icons: [<Eye size={40} />, <Brain size={40} />, <Target size={40} />],
    orbitIcons: [Activity, Zap, Target],
    title: 'Predictive Signal Generation',
    description: 'AI analyzes 10,000+ data points per second to predict market movements with unprecedented accuracy using advanced neural networks',
    stat: { value: 50, unit: 'ms', label: 'Average Response Time' },
    color: 'text-secondary',
    gradient: '#00FF88, #00D4FF',
  },
  {
    icons: [<CheckCircle size={40} />, <Shield size={40} />, <Brain size={40} />],
    orbitIcons: [CheckCircle, Shield, Eye],
    title: 'Smart Signal Validation',
    description: 'Multi-layer AI verification system ensures only high-confidence signals reach your dashboard through rigorous validation',
    stat: { value: 99.7, unit: '%', label: 'False Positive Reduction' },
    color: 'text-primary',
    gradient: '#00D4FF, #00FF88',
  },
  {
    icons: [<Shield size={40} />, <Activity size={40} />, <Target size={40} />],
    orbitIcons: [Shield, Activity, Radar],
    title: 'Real-Time Risk Management',
    description: 'Dynamic risk assessment continuously adjusts position sizes and stop-losses based on market volatility and your risk profile',
    stat: { value: 40, unit: '%', label: 'Better Risk-Reward Ratios' },
    color: 'text-secondary',
    gradient: '#00FF88, #FF6B6B',
  },
  {
    icons: [<Radar size={40} />, <Eye size={40} />, <Activity size={40} />],
    orbitIcons: [Radar, Eye, Brain],
    title: '24/7 Market Monitoring',
    description: 'Continuous surveillance of global markets with AI-powered pattern recognition identifies opportunities the moment they emerge',
    stat: { value: 1500, unit: '+', label: 'Assets Tracked Globally' },
    color: 'text-primary',
    gradient: '#00D4FF, #00FF88',
  },
];

export default function EnhancedAIFeatures() {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  const scrollY = useMotionValue(0);
  const y = useTransform(scrollY, [0, 500], [0, -50]);

  useEffect(() => {
    const updateScrollY = () => scrollY.set(window.scrollY);
    window.addEventListener('scroll', updateScrollY);
    return () => window.removeEventListener('scroll', updateScrollY);
  }, [scrollY]);

  return (
    <section 
      ref={ref}
      id="features" 
      className="relative py-20 bg-gradient-to-b from-background via-gray-900 to-background text-white overflow-hidden"
    >
      {/* Animated Background Pattern with Parallax */}
      <ScrollParallax y={100}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, #00D4FF 2px, transparent 2px),
              radial-gradient(circle at 80% 80%, #00FF88 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }} />
        </div>
      </ScrollParallax>

      {/* Animated Floating Shapes with Scroll Parallax */}
      <ScrollParallax y={-50}>
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 border border-primary/20 rounded-lg"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </ScrollParallax>
      
      <ScrollParallax y={30}>
        <motion.div
          className="absolute bottom-32 right-16 w-16 h-16 bg-secondary/10 rounded-full"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </ScrollParallax>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Header with Scroll Animations */}
        <div className="text-center mb-16">
          <ScrollAnimation y={30} opacity={0} duration={0.8}>
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Powered by Advanced AI Technology
            </motion.h2>
          </ScrollAnimation>
          
          <ScrollAnimation y={40} opacity={0} duration={0.8} delay={0.2}>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              The intelligent trading assistant that never sleeps, powered by cutting-edge machine learning algorithms
            </p>
          </ScrollAnimation>

          {/* AI Status Indicator with Scroll Animation */}
          <ScrollAnimation y={20} opacity={0} duration={0.8} delay={0.4}>
            <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full">
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{
                  opacity: [1, 0.3, 1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <span className="text-green-400 text-sm font-medium">AI Systems Online</span>
            </div>
          </ScrollAnimation>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Bottom CTA with Scroll Animation */}
        <ScrollAnimation y={50} opacity={0} duration={1} delay={0.6}>
          <div className="text-center mt-16">
            <motion.button
              className="group bg-gradient-to-r from-primary to-secondary text-background font-bold py-4 px-8 rounded-lg shadow-lg relative overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(0, 212, 255, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10">Experience AI Trading Now</span>
            </motion.button>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}