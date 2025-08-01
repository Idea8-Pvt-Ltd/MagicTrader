import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, useMotionValue, useTransform } from 'framer-motion';
import { Bitcoin, Globe, LineChart, TrendingUp, TrendingDown, Zap, Target, BarChart3, DollarSign } from 'lucide-react';

// 3D Rotating Icon Component
function Rotating3DIcon({ children, rotationSpeed = 1, glowColor = '#00D4FF' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex items-center justify-center w-20 h-20 rounded-full"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        rotateY: isHovered ? 180 : 0,
        scale: isHovered ? 1.1 : 1,
      }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background Glow */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, ${glowColor}40 0%, transparent 70%)`,
          filter: "blur(10px)",
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.6 : 0.3,
        }}
      />
      
      {/* Icon Container */}
      <motion.div
        className="relative z-10 w-full h-full rounded-full bg-background/80 border-2 border-primary/30 backdrop-blur-sm flex items-center justify-center"
        style={{
          boxShadow: isHovered ? `0 0 30px ${glowColor}50` : `0 0 10px ${glowColor}30`,
        }}
        animate={{
          borderColor: isHovered ? glowColor + '60' : glowColor + '30',
          rotateY: [0, 360],
        }}
        transition={{
          borderColor: { duration: 0.3 },
          rotateY: { 
            duration: 8 / rotationSpeed, 
            repeat: Infinity, 
            ease: "linear" 
          }
        }}
      >
        {children}
      </motion.div>

      {/* Orbiting Particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-60"
          style={{
            background: glowColor,
            top: "50%",
            left: "50%",
          }}
          animate={{
            x: Math.cos((i * 120) * Math.PI / 180) * 40 - 4,
            y: Math.sin((i * 120) * Math.PI / 180) * 40 - 4,
            rotate: 360,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.3,
          }}
        />
      ))}
    </motion.div>
  );
}

// Animated Market Stats
function MarketStat({ value, label, trend = 0, delay = 0 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef();
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        let start = 0;
        let startTime = null;
        
        function animate(ts) {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / 1500, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          setDisplay(start + (value - start) * easeOutQuart);
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
      }, delay);
    }
  }, [inView, value, delay]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl font-bold text-primary mb-1">
        {Math.floor(display).toLocaleString()}+
      </div>
      <div className="text-sm text-white/70 mb-2">{label}</div>
      {trend !== 0 && (
        <motion.div
          className={`flex items-center justify-center gap-1 text-xs ${
            trend > 0 ? 'text-green-400' : 'text-red-400'
          }`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.5, type: "spring", bounce: 0.5 }}
        >
          {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}% today
        </motion.div>
      )}
    </div>
  );
}

// Interactive Trading Pair
function TradingPair({ pair, price, change, isActive = false, onClick }) {
  return (
    <motion.div
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
        isActive ? 'bg-primary/20 border border-primary/40' : 'bg-background/60 border border-white/10'
      }`}
      whileHover={{ 
        scale: 1.02, 
        backgroundColor: "rgba(0, 212, 255, 0.15)",
        borderColor: "rgba(0, 212, 255, 0.4)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${change >= 0 ? 'bg-green-400' : 'bg-red-400'}`}>
          <motion.div
            className="w-full h-full rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <span className="font-medium text-white">{pair}</span>
      </div>
      
      <div className="text-right">
        <div className="text-white font-semibold">${price}</div>
        <div className={`text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </div>
      </div>
    </motion.div>
  );
}

// Market Card Component
function MarketCard({ market, index, isInView }) {
  const [selectedPair, setSelectedPair] = useState(0);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef();

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setHoverPosition({
      x: (e.clientX - centerX) / (rect.width / 2),
      y: (e.clientY - centerY) / (rect.height / 2),
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 100, rotateX: -20 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        rotateY: isHovered ? hoverPosition.x * 5 : 0,
        rotateX: isHovered ? hoverPosition.y * -5 : 0,
      } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        type: "spring",
        bounce: 0.3
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: `0 25px 50px ${market.glowColor}30`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-gradient-to-b from-gray-900/95 to-background/95 border border-primary/20 rounded-3xl p-8 overflow-hidden cursor-pointer"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Animated Background Pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          background: `linear-gradient(45deg, ${market.glowColor}20, transparent)`,
        }}
        animate={{
          backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : ["0% 0%"],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Dynamic Border */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-30"
        style={{
          background: `linear-gradient(45deg, ${market.glowColor}, transparent, ${market.glowColor})`,
          padding: "1px",
        }}
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
          rotate: [0, 360],
        }}
        transition={{
          opacity: { duration: 0.3 },
          rotate: { duration: 8, repeat: Infinity, ease: "linear" }
        }}
      >
        <div className="w-full h-full bg-gradient-to-b from-gray-900/95 to-background/95 rounded-3xl" />
      </motion.div>

      <div className="relative z-10">
        {/* Icon Section */}
        <div className="flex justify-center mb-6">
          <Rotating3DIcon glowColor={market.glowColor} rotationSpeed={isHovered ? 2 : 1}>
            <span style={{ color: market.glowColor, fontSize: '2rem' }}>
              {market.icon}
            </span>
          </Rotating3DIcon>
        </div>

        {/* Title */}
        <motion.h3
          className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-white to-primary bg-clip-text text-transparent"
          animate={{
            backgroundPosition: isHovered ? ["0% 50%", "100% 50%"] : ["0% 50%"],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {market.title}
        </motion.h3>

        {/* Stats */}
        <div className="flex justify-center mb-6">
          <MarketStat 
            value={market.stats.pairs} 
            label={market.stats.label}
            trend={market.stats.trend}
            delay={index * 0.3}
          />
        </div>

        {/* Popular Assets/Pairs */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
            <Zap size={16} className="text-secondary" />
            Live Markets
          </h4>
          
          <div className="space-y-2">
            {market.tradingPairs.map((pair, i) => (
              <TradingPair
                key={i}
                pair={pair.symbol}
                price={pair.price}
                change={pair.change}
                isActive={selectedPair === i}
                onClick={() => setSelectedPair(i)}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <motion.p
          className="text-white/80 text-sm text-center leading-relaxed"
          animate={{
            opacity: isHovered ? 1 : 0.8,
          }}
        >
          {market.description}
        </motion.p>

        {/* AI Prediction Indicator */}
        <motion.div
          className="mt-4 flex items-center justify-center gap-2 p-3 bg-background/60 rounded-lg border border-primary/20"
          animate={{
            borderColor: isHovered ? `${market.glowColor}60` : "rgba(0, 212, 255, 0.2)",
            boxShadow: isHovered ? `0 0 20px ${market.glowColor}30` : "none",
          }}
        >
          <Target className="text-secondary" size={16} />
          <span className="text-xs text-white/70">
            AI Accuracy: <span className="text-secondary font-semibold">
              {market.accuracy}%
            </span>
          </span>
          <motion.div
            className="w-2 h-2 bg-green-400 rounded-full ml-2"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

const markets = [
  {
    icon: <Bitcoin size={32} />,
    title: 'Cryptocurrency',
    glowColor: '#F7931A',
    stats: { pairs: 500, label: 'Crypto Pairs', trend: 12.5 },
    tradingPairs: [
      { symbol: 'BTC/USD', price: '44,125.50', change: 2.4 },
      { symbol: 'ETH/USD', price: '2,845.20', change: -1.2 },
      { symbol: 'SOL/USD', price: '98.75', change: 5.8 },
    ],
    description: 'Ride the crypto waves with AI-powered signals for major cryptocurrencies and promising altcoins across all market conditions.',
    accuracy: 94.2,
  },
  {
    icon: <Globe size={32} />,
    title: 'Foreign Exchange',
    glowColor: '#00D4FF',
    stats: { pairs: 50, label: 'Forex Pairs', trend: 3.2 },
    tradingPairs: [
      { symbol: 'EUR/USD', price: '1.0892', change: 0.15 },
      { symbol: 'GBP/JPY', price: '188.45', change: -0.8 },
      { symbol: 'USD/CAD', price: '1.3456', change: 0.22 },
    ],
    description: 'Master currency markets with precision timing and advanced risk management across major and exotic forex pairs.',
    accuracy: 91.8,
  },
  {
    icon: <LineChart size={32} />,
    title: 'Stock Market',
    glowColor: '#00FF88',
    stats: { pairs: 1000, label: 'US Stocks', trend: 7.1 },
    tradingPairs: [
      { symbol: 'AAPL', price: '182.50', change: 1.2 },
      { symbol: 'TSLA', price: '248.75', change: -2.1 },
      { symbol: 'NVDA', price: '875.20', change: 3.8 },
    ],
    description: 'Navigate equity markets with AI insights on blue-chip stocks, growth companies, and emerging market opportunities.',
    accuracy: 89.5,
  },
];

export default function EnhancedSupportedMarkets() {
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
      id="markets" 
      className="relative py-20 bg-gradient-to-b from-background via-gray-900 to-background text-white overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{ y }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #F7931A 3px, transparent 3px),
            radial-gradient(circle at 75% 75%, #00D4FF 2px, transparent 2px),
            radial-gradient(circle at 50% 50%, #00FF88 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 150px 150px, 80px 80px',
        }} />
      </motion.div>

      {/* Floating Trading Symbols */}
      <motion.div
        className="absolute top-32 left-16 text-3xl font-bold text-orange-400/30"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ₿
      </motion.div>

      <motion.div
        className="absolute top-48 right-20 text-2xl font-bold text-blue-400/30"
        animate={{
          y: [0, 20, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        €
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-24 text-2xl font-bold text-green-400/30"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        $
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent"
            animate={isInView ? {
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Trade Across All Major Markets
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
          >
            One platform, unlimited opportunities across global financial markets
          </motion.p>

          {/* Global Market Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {[
              { label: 'Markets Tracked', value: '24/7', icon: <BarChart3 size={20} />, color: 'text-blue-400' },
              { label: 'Total Volume', value: '$2.1T', icon: <DollarSign size={20} />, color: 'text-green-400' },
              { label: 'Active Signals', value: '150+', icon: <Zap size={20} />, color: 'text-yellow-400' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 px-6 py-3 bg-background/60 rounded-lg border border-primary/20"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0, 212, 255, 0.2)",
                  borderColor: "rgba(0, 212, 255, 0.4)"
                }}
              >
                <span className={stat.color}>{stat.icon}</span>
                <div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {markets.map((market, index) => (
            <MarketCard
              key={index}
              market={market}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-16"
        >
          <motion.p
            className="text-lg text-white/80 mb-6"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            Ready to trade smarter across all markets?
          </motion.p>
          
          <motion.button
            className="group bg-gradient-to-r from-primary to-secondary text-background font-bold py-4 px-8 rounded-lg shadow-lg relative overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 35px rgba(0, 212, 255, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              Start Trading Today
              <TrendingUp size={20} />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}