import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, useMotionValue, useTransform } from 'framer-motion';
import { Star, Quote, TrendingUp, Award, Target, Zap, DollarSign, BarChart3 } from 'lucide-react';

// Enhanced Animated Number with profit effect
function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '', className = '', delay = 0, isProfit = false }) {
  const [display, setDisplay] = useState(0);
  const [showSparkle, setShowSparkle] = useState(false);
  const ref = useRef();
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      const timeout = setTimeout(() => {
        let start = 0;
        let startTime = null;
        
        function animate(ts) {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / 2000, 1);
          const easeOutCubic = 1 - Math.pow(1 - progress, 3);
          setDisplay(start + (value - start) * easeOutCubic);
          
          // Sparkle effect for profits
          if (isProfit && progress > 0.7 && progress < 0.8 && !showSparkle) {
            setShowSparkle(true);
            setTimeout(() => setShowSparkle(false), 500);
          }
          
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
      }, delay * 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [inView, value, delay, isProfit, showSparkle]);

  return (
    <span ref={ref} className={`relative ${className}`}>
      {prefix}{display.toLocaleString(undefined, { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      })}{suffix}
      {showSparkle && (
        <motion.span
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          className="absolute -top-2 -right-2 text-yellow-400"
        >
          ✨
        </motion.span>
      )}
    </span>
  );
}

// Floating Testimonial Card
function FloatingTestimonialCard({ testimonial, index, isInView }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef();

  // Floating animation values
  const floatY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  useEffect(() => {
    // Continuous floating animation
    const interval = setInterval(() => {
      if (!isHovered) {
        floatY.set(Math.sin(Date.now() / 1000 + index) * 10);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [floatY, index, isHovered]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    setMousePosition({ x, y });
    rotateY.set(x * 15);
    rotateX.set(y * -15);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  // Entry animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 100, 
      scale: 0.8,
      rotateX: -30 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.2,
        type: "spring",
        bounce: 0.4
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{
        y: floatY,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 25px 50px rgba(0, 212, 255, 0.2)",
        zIndex: 10,
      }}
      className="relative bg-gradient-to-b from-gray-900/95 to-background/95 border border-primary/20 rounded-3xl p-8 backdrop-blur-xl cursor-pointer overflow-hidden"
    >
      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0"
        style={{
          background: `radial-gradient(circle at ${(mousePosition.x + 1) * 50}% ${(mousePosition.y + 1) * 50}%, rgba(0, 212, 255, 0.1) 0%, transparent 70%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: "linear-gradient(45deg, #00D4FF, #00FF88, #00D4FF)",
          padding: "1px",
        }}
        animate={{
          opacity: isHovered ? 0.6 : 0.2,
        }}
      >
        <div className="w-full h-full bg-gradient-to-b from-gray-900/95 to-background/95 rounded-3xl" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            className="relative mb-4"
            animate={{
              y: isHovered ? -5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Avatar with Morphing Border */}
            <motion.div
              className="relative w-20 h-20 rounded-full overflow-hidden border-4"
              style={{
                borderColor: testimonial.borderColor,
              }}
              animate={{
                borderColor: isHovered ? "#00D4FF" : testimonial.borderColor,
                boxShadow: isHovered ? `0 0 30px ${testimonial.borderColor}50` : `0 0 10px ${testimonial.borderColor}30`,
              }}
            >
              <img 
                src={testimonial.avatar} 
                alt={`${testimonial.name} avatar`} 
                className="w-full h-full object-cover"
              />
              
              {/* Success Badge */}
              <motion.div
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-background"
                initial={{ scale: 0 }}
                animate={{ scale: isInView ? 1 : 0 }}
                transition={{ delay: index * 0.2 + 0.5, type: "spring", bounce: 0.6 }}
              >
                <TrendingUp size={12} className="text-white" />
              </motion.div>
            </motion.div>

            {/* Floating Icons */}
            {testimonial.achievements.map((achievement, i) => (
              <motion.div
                key={i}
                className="absolute text-lg"
                style={{
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  x: Math.cos((i * 120 + (isHovered ? Date.now() / 100 : 0)) * Math.PI / 180) * 50 - 12,
                  y: Math.sin((i * 120 + (isHovered ? Date.now() / 100 : 0)) * Math.PI / 180) * 50 - 12,
                  rotate: isHovered ? 360 : 0,
                  scale: isHovered ? 1.2 : 0.8,
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  x: { duration: 0.5 },
                  y: { duration: 0.5 },
                  scale: { duration: 0.3 },
                }}
              >
                {achievement}
              </motion.div>
            ))}
          </motion.div>

          {/* Name and Role */}
          <motion.h3
            className="text-xl font-bold text-white mb-1"
            animate={{
              color: isHovered ? "#00D4FF" : "#ffffff",
            }}
          >
            {testimonial.name}
          </motion.h3>
          <p className="text-sm text-white/60 mb-3">{testimonial.role}</p>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(testimonial.rating)].map((_, j) => (
              <motion.div
                key={j}
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ 
                  delay: index * 0.2 + 0.7 + j * 0.1, 
                  type: "spring", 
                  bounce: 0.6 
                }}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 15,
                  filter: "drop-shadow(0 0 8px #FFD700)"
                }}
              >
                <Star className="text-yellow-400 fill-current" size={18} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quote Section */}
        <div className="relative mb-6">
          <motion.div
            className="absolute -top-2 -left-2"
            animate={{
              rotate: isHovered ? 15 : 0,
              scale: isHovered ? 1.2 : 1,
            }}
          >
            <Quote className="text-primary opacity-60" size={32} />
          </motion.div>
          
          <motion.p
            className="italic text-white/90 text-base leading-relaxed pl-8 relative z-10"
            animate={{
              opacity: isHovered ? 1 : 0.9,
            }}
          >
            {testimonial.quote}
          </motion.p>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-2 gap-4">
          {testimonial.results.map((result, k) => (
            <motion.div
              key={k}
              className="bg-background/60 rounded-lg p-4 border border-primary/10 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 + 1 + k * 0.1 }}
              whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                borderColor: result.color === 'text-secondary' ? "rgba(0, 255, 136, 0.3)" : "rgba(0, 212, 255, 0.3)",
                scale: 1.05,
              }}
            >
              {/* Background Pulse */}
              <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                  background: result.color === 'text-secondary' ? 
                    "linear-gradient(45deg, #00FF88, transparent)" : 
                    "linear-gradient(45deg, #00D4FF, transparent)"
                }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: k * 0.5,
                }}
              />

              <div className="relative z-10 text-center">
                <div className={`text-2xl font-bold ${result.color} mb-1`}>
                  <AnimatedNumber 
                    value={result.value} 
                    decimals={result.decimals} 
                    prefix={result.prefix} 
                    suffix={result.suffix}
                    delay={index * 0.3 + k * 0.2}
                    isProfit={result.prefix === '+'}
                  />
                </div>
                <div className="text-white/70 text-sm font-medium">
                  {result.label}
                </div>
              </div>

              {/* Result Icon */}
              <motion.div
                className="absolute top-2 right-2 opacity-20"
                animate={{
                  rotate: isHovered ? 360 : 0,
                  scale: isHovered ? 1.2 : 1,
                }}
                transition={{ duration: 1 }}
              >
                {result.prefix === '+' ? <TrendingUp size={16} /> : <BarChart3 size={16} />}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Hover Indicator */}
        <motion.div
          className="absolute top-4 right-4 opacity-0"
          animate={{
            opacity: isHovered ? 0.6 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
        >
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs text-primary">Interactive</span>
          </div>
        </motion.div>

        {/* Verification Badge */}
        <motion.div
          className="absolute bottom-4 left-4 opacity-70"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.2 + 1.5, type: "spring", bounce: 0.5 }}
        >
          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-400/30 rounded-full">
            <Award size={12} className="text-green-400" />
            <span className="text-xs text-green-400 font-medium">Verified</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

const testimonials = [
  {
    name: 'Marcus Chen',
    role: 'Professional Day Trader, 3 years experience',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
    quote: 'MagicTrader completely transformed my trading game. The AI signals are incredibly accurate, and I\'ve never felt more confident in my trades.',
    results: [
      { label: 'Portfolio Growth', value: 156, color: 'text-secondary', prefix: '+', suffix: '%', decimals: 0 },
      { label: 'Win Rate', value: 89, color: 'text-primary', prefix: '', suffix: '%', decimals: 0 },
    ],
    rating: 5,
    borderColor: '#00FF88',
    achievements: ['💰', '📈', '🎯'],
  },
  {
    name: 'Sarah Rodriguez',
    role: 'Crypto Trader & DeFi Analyst',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c955?w=150&h=150&fit=crop&crop=face&auto=format',
    quote: 'Finally, an AI that truly understands crypto volatility. The risk management features alone have saved me from countless bad trades.',
    results: [
      { label: 'Annual Returns', value: 243, color: 'text-secondary', prefix: '+', suffix: '%', decimals: 0 },
      { label: 'Signal Accuracy', value: 92, color: 'text-primary', prefix: '', suffix: '%', decimals: 0 },
    ],
    rating: 5,
    borderColor: '#00D4FF',
    achievements: ['🚀', '⚡', '🔥'],
  },
  {
    name: 'James Thompson',
    role: 'Professional Forex Trader, 8 years experience',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
    quote: 'The precision of these AI signals is unmatched. I\'ve been trading for 8 years, and this is the first tool that consistently beats my manual analysis.',
    results: [
      { label: 'Profit Increase', value: 127, color: 'text-secondary', prefix: '+', suffix: '%', decimals: 0 },
      { label: 'Risk Control', value: 95, color: 'text-primary', prefix: '', suffix: '%', decimals: 0 },
    ],
    rating: 5,
    borderColor: '#FFD700',
    achievements: ['🏆', '💎', '⭐'],
  },
];

export default function EnhancedSuccessStories() {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  const scrollY = useMotionValue(0);
  const y = useTransform(scrollY, [0, 500], [0, -30]);

  useEffect(() => {
    const updateScrollY = () => scrollY.set(window.scrollY);
    window.addEventListener('scroll', updateScrollY);
    return () => window.removeEventListener('scroll', updateScrollY);
  }, [scrollY]);

  return (
    <section 
      ref={ref}
      id="testimonials" 
      className="relative py-20 bg-gradient-to-b from-background via-gray-900 to-background text-white overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{ y }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 30% 30%, #00D4FF 2px, transparent 2px),
            radial-gradient(circle at 70% 70%, #00FF88 1px, transparent 1px)
          `,
          backgroundSize: '150px 150px',
        }} />
      </motion.div>

      {/* Floating Success Icons */}
      <motion.div
        className="absolute top-32 left-16 text-4xl"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        💰
      </motion.div>

      <motion.div
        className="absolute top-48 right-20 text-3xl"
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        📈
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-32 text-3xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        🎯
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
            Real Traders, Real Results
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
          >
            Join thousands of profitable traders using MagicTrader AI to transform their trading results
          </motion.p>

          {/* Success Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            {[
              { label: 'Success Rate', value: 94.2, suffix: '%', icon: '🎯' },
              { label: 'Avg. Profit Increase', value: 186, suffix: '%', icon: '📈' },
              { label: 'Happy Traders', value: 12500, suffix: '+', icon: '😊' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 px-6 py-3 bg-background/60 rounded-lg border border-primary/20"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0, 212, 255, 0.2)"
                }}
              >
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className="text-xl font-bold text-primary">
                    <AnimatedNumber 
                      value={stat.value} 
                      suffix={stat.suffix}
                      delay={0.5 + i * 0.2}
                    />
                  </div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <FloatingTestimonialCard
              key={index}
              testimonial={testimonial}
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
            Ready to join these successful traders?
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
              Start Your Success Story
              <TrendingUp size={20} />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}