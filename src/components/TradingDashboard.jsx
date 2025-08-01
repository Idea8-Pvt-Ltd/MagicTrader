import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, useInView } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, ShieldCheck, Activity, Zap } from 'lucide-react';

// Enhanced Animated Number with more effects
function AnimatedNumber({ value, decimals = 2, duration = 1.5, prefix = '', suffix = '', className = '' }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef();
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      let start = 0;
      let startTime = null;
      function animate(ts) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / (duration * 1000), 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setDisplay(start + (value - start) * easeOutQuart);
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display.toLocaleString(undefined, { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      })}{suffix}
    </span>
  );
}

// 3D Tilt Card Component
function TiltCard({ children, className = '', ...props }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!isHovered) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateXValue = (e.clientY - centerY) / (rect.height / 2) * -10;
    const rotateYValue = (e.clientX - centerX) / (rect.width / 2) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={className}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Glowing Border Component
function GlowingBorder({ children, className = "", glowColor = "primary" }) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-75 blur-sm"
        style={{
          background: glowColor === "primary" 
            ? "linear-gradient(45deg, #00D4FF, #00FF88, #00D4FF)" 
            : "linear-gradient(45deg, #FF6B6B, #FFE66D, #FF6B6B)"
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="relative bg-background rounded-2xl">
        {children}
      </div>
    </div>
  );
}

// Data Stream Component
function DataStream({ delay = 0 }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-8 bg-gradient-to-b from-primary/60 to-transparent"
          style={{
            left: `${20 + i * 15}%`,
            top: "-10%",
          }}
          animate={{
            y: ["0vh", "120vh"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: delay + i * 0.3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      ))}
    </motion.div>
  );
}

const signals = [
  {
    symbol: 'BTC/USD',
    type: 'BUY',
    from: 43250,
    to: 44100,
    strength: 'Strong',
    color: 'text-green-400',
    icon: <TrendingUp className="inline-block text-green-400" size={18} />,
    confidence: 94,
  },
  {
    symbol: 'AAPL',
    type: 'SELL',
    from: 182.5,
    to: 179.2,
    strength: 'Medium',
    color: 'text-red-400',
    icon: <TrendingDown className="inline-block text-red-400" size={18} />,
    confidence: 87,
  },
  {
    symbol: 'EUR/USD',
    type: 'BUY',
    from: 1.0845,
    to: 1.0890,
    strength: 'Strong',
    color: 'text-green-400',
    icon: <TrendingUp className="inline-block text-green-400" size={18} />,
    confidence: 92,
  },
];

export default function EnhancedTradingDashboard() {
  const [prices, setPrices] = useState([44100, 179.2, 1.0890]);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();
  const inView = useInView(ref);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prevPrices => 
        prevPrices.map((price, i) => {
          const volatility = i === 2 ? 0.002 : i === 1 ? 0.5 : 10;
          const change = (Math.random() - 0.5) * volatility;
          return Math.max(0, price + change);
        })
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);

  return (
    <section 
      ref={ref}
      id="dashboard" 
      className="relative py-20 bg-gradient-to-b from-background via-background to-gray-900 text-white overflow-hidden"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #00D4FF 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #00FF88 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent"
        >
          See MagicTrader in Action
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-white/80 mb-12 text-center"
        >
          Real-time AI signals and portfolio management
        </motion.p>

        {/* Main Dashboard Container */}
        <GlowingBorder className="relative">
          <motion.div 
            className="bg-gradient-to-b from-gray-900/90 to-background/90 backdrop-blur-xl rounded-3xl p-2 md:p-8 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <DataStream />
            
            {/* Top Performance Bar */}
            <motion.div 
              className="flex flex-col lg:flex-row justify-between items-center gap-4 p-6 mb-6 bg-background/80 rounded-2xl border border-primary/30 relative overflow-hidden"
              initial={{ y: -50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Animated Background Pulse */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
              
              <div className="text-center lg:text-left relative z-10">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  Portfolio Value: <AnimatedNumber value={47832.5} decimals={2} prefix="$" className="text-white" />
                </div>
                <motion.div 
                  className="text-green-400 text-lg font-semibold flex items-center gap-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp size={20} />
                  +<AnimatedNumber value={2341} decimals={0} prefix="$" className="text-green-400" /> today
                </motion.div>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-4 text-center relative z-10">
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-400/30"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)" }}
                >
                  <Activity className="text-blue-400" size={20} />
                  <span className="text-blue-400 font-semibold">
                    <AnimatedNumber value={12} decimals={0} /> Active Signals
                  </span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-lg border border-secondary/30"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 136, 0.3)" }}
                >
                  <Zap className="text-secondary" size={20} />
                  <span className="text-secondary font-semibold">
                    AI Accuracy: <AnimatedNumber value={94.2} decimals={1} suffix="%" />
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Live Signals Panel */}
              <TiltCard className="lg:col-span-4">
                <motion.div 
                  className="bg-background/80 rounded-2xl border border-primary/20 p-6 h-full relative overflow-hidden"
                  initial={{ x: -100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <DataStream delay={0.5} />
                  
                  <div className="flex items-center gap-2 mb-6">
                    <Activity className="text-primary" size={24} />
                    <h3 className="font-bold text-xl text-primary">Live Signals</h3>
                    <motion.div
                      className="ml-auto w-3 h-3 bg-green-400 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    {signals.map((signal, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.8 + i * 0.2 }}
                        whileHover={{ 
                          scale: 1.02, 
                          boxShadow: signal.type === 'BUY' ? "0 5px 15px rgba(34, 197, 94, 0.2)" : "0 5px 15px rgba(239, 68, 68, 0.2)"
                        }}
                        className={`p-4 rounded-xl bg-background/90 border-l-4 ${
                          signal.type === 'BUY' ? 'border-green-400' : 'border-red-400'
                        } shadow-lg cursor-pointer relative overflow-hidden`}
                      >
                        {/* Confidence Bar */}
                        <motion.div
                          className={`absolute bottom-0 left-0 h-1 ${
                            signal.type === 'BUY' ? 'bg-green-400' : 'bg-red-400'
                          }`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${signal.confidence}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 1 + i * 0.2 }}
                        />
                        
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {signal.icon}
                            <span className="font-semibold text-white">{signal.symbol}</span>
                            <span className={`font-bold ${signal.color}`}>{signal.type}</span>
                          </div>
                          <div className="text-xs text-white/60">
                            {signal.confidence}% confidence
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            {signal.type === 'BUY' ? 
                              <ArrowUpRight className="text-green-400" size={16} /> : 
                              <ArrowDownRight className="text-red-400" size={16} />
                            }
                            <span className="text-white/70">
                              {signal.from} → <span className="font-bold text-white">
                                {prices[i]?.toLocaleString(undefined, { 
                                  maximumFractionDigits: i === 2 ? 4 : 2 
                                })}
                              </span>
                            </span>
                          </div>
                          <motion.span 
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              signal.strength === 'Strong' ? 'bg-primary/20 text-primary' : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {signal.strength}
                          </motion.span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TiltCard>

              {/* Chart Area */}
              <TiltCard className="lg:col-span-5">
                <motion.div 
                  className="bg-background/80 rounded-2xl border border-primary/20 p-6 h-full relative overflow-hidden"
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="text-secondary" size={24} />
                    <h3 className="font-bold text-xl text-secondary">AI Prediction Chart</h3>
                  </div>
                  
                  <div className="h-64 rounded-xl relative overflow-hidden">
                    <img 
                      src={require("../assets/chart.png")} 
                      alt="AI Prediction Chart" 
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute bottom-2 left-4 text-xs text-white/60">
                      AI Prediction Accuracy: 94.2%
                    </div>
                  </div>
                </motion.div>
              </TiltCard>

              {/* Risk Analysis Panel */}
              <TiltCard className="lg:col-span-3">
                <motion.div 
                  className="bg-background/80 rounded-2xl border border-primary/20 p-6 h-full relative overflow-hidden"
                  initial={{ x: 100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                >
                  <DataStream delay={1} />
                  
                  <div className="flex items-center gap-2 mb-6">
                    <ShieldCheck className="text-secondary" size={24} />
                    <h3 className="font-bold text-xl text-secondary">Risk Analysis</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Risk Score */}
                    <motion.div 
                      className="p-4 bg-green-500/10 border border-green-400/30 rounded-lg"
                      whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(34, 197, 94, 0.1)" }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 font-medium">Risk Score</span>
                        <motion.span 
                          className="text-green-400 font-bold text-lg"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Low (2/10)
                        </motion.span>
                      </div>
                      <motion.div 
                        className="w-full bg-gray-700 rounded-full h-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        <motion.div 
                          className="bg-green-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "20%" }}
                          transition={{ duration: 1, delay: 1.7 }}
                        />
                      </motion.div>
                    </motion.div>
                    
                    {/* Position Size */}
                    <motion.div 
                      className="p-3 bg-primary/10 border border-primary/30 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 }}
                    >
                      <div className="text-white/80 text-sm mb-1">Suggested Position Size</div>
                      <div className="text-primary font-bold text-lg">
                        <AnimatedNumber value={2500} prefix="$" decimals={0} />
                      </div>
                    </motion.div>
                    
                    {/* Stop Loss */}
                    <motion.div 
                      className="p-3 bg-red-500/10 border border-red-400/30 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 }}
                    >
                      <div className="text-white/80 text-sm mb-1">Stop Loss</div>
                      <div className="text-red-400 font-bold text-lg">
                        <AnimatedNumber value={42900} prefix="$" decimals={0} />
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="text-white/60 text-xs text-center mt-4 p-2 bg-background/50 rounded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                    >
                      AI-powered risk management for every trade
                    </motion.div>
                  </div>
                </motion.div>
              </TiltCard>
            </div>
          </motion.div>
        </GlowingBorder>
      </div>
    </section>
  );
}