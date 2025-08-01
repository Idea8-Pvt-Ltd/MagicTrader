import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, useMotionValue, useTransform } from 'framer-motion';
import { CheckCircle, ShieldCheck, Zap, Users, Gift, Crown, Mail, Sparkles, Trophy, Star } from 'lucide-react';

// Enhanced Animated Counter
function AnimatedCounter({ value, duration = 2000, className = '' }) {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef();
  const inView = useInView(ref);

  useEffect(() => {
    if (inView && !isComplete) {
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(easeOutQuart * value));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsComplete(true);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, value, duration, isComplete]);

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString()}
      {isComplete && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block ml-1"
        >
          ✨
        </motion.span>
      )}
    </span>
  );
}

// Magnetic Button Component
function MagneticButton({ children, onClick, className = '', disabled = false, ...props }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef();

  const handleMouseMove = (e) => {
    if (!buttonRef.current || disabled) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
    );
    
    if (distance < 100) {
      const pullStrength = Math.max(0, (100 - distance) / 100);
      setMousePosition({
        x: (e.clientX - centerX) * pullStrength * 0.3,
        y: (e.clientY - centerY) * pullStrength * 0.3,
      });
    } else {
      setMousePosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!disabled) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [disabled]);

  return (
    <motion.button
      ref={buttonRef}
      className={`relative ${className}`}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      {...props}
    >
      {/* Magnetic Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.2 : 1,
        }}
      />
      {children}
    </motion.button>
  );
}

// Celebration Confetti
function Confetti({ isActive }) {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: ['#00D4FF', '#00FF88', '#FFD700', '#FF6B6B'][i % 4],
    size: Math.random() * 8 + 4,
    initialX: Math.random() * 100,
    initialY: -10,
  }));

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
            borderRadius: '50%',
            left: `${piece.initialX}%`,
            top: `${piece.initialY}%`,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: 0,
            rotate: 360,
            x: [-20, 20, -20],
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
            delay: piece.id * 0.02,
          }}
        />
      ))}
    </div>
  );
}

// Benefit Item Component
function BenefitItem({ benefit, index, isInView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02, 
        x: 10,
        backgroundColor: "rgba(0, 212, 255, 0.05)"
      }}
      className="flex items-center gap-4 p-4 rounded-lg transition-all duration-300 group cursor-pointer"
    >
      <motion.div
        className="flex-shrink-0"
        whileHover={{ rotate: 360, scale: 1.2 }}
        transition={{ duration: 0.5 }}
      >
        <CheckCircle className="text-secondary" size={24} />
      </motion.div>
      <span className="text-lg text-white/90 group-hover:text-white transition-colors">
        {benefit}
      </span>
      
      {/* Hover Glow */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-r opacity-0 group-hover:opacity-100"
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

const benefits = [
  'Free 30-day trial when we launch',
  'Exclusive trading strategies guide ($299 value)',
  'Priority customer support & onboarding',
  'Early bird pricing (50% off first year)',
  'Access to private trader community',
  'Weekly AI market insights reports',
];

const trustSignals = [
  { icon: <ShieldCheck size={20} />, text: 'Bank-level security', color: 'text-green-400' },
  { icon: <Users size={20} />, text: '50,000+ traders trust us', color: 'text-blue-400' },
  { icon: <Crown size={20} />, text: 'Industry-leading accuracy', color: 'text-yellow-400' },
];

export default function EnhancedWaitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const ref = useRef();
  const formRef = useRef();
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  
  const scrollY = useMotionValue(0);
  const y1 = useTransform(scrollY, [0, 500], [0, -50]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    const updateScrollY = () => scrollY.set(window.scrollY);
    const updateMousePosition = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    
    window.addEventListener('scroll', updateScrollY);
    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('scroll', updateScrollY);
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [scrollY]);

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleSubmit = async () => {
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }, 1500);
  };

  return (
    <section 
      ref={ref}
      id="waitlist" 
      className="relative py-20 bg-gradient-to-b from-background via-purple-900/20 to-background text-white overflow-hidden"
    >
      {/* Confetti Effect */}
      <Confetti isActive={showConfetti} />
      
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute w-96 h-96 bg-primary rounded-full filter blur-3xl"
          style={{ y: y1 }}
          animate={{
            x: [100, 300, 100],
            y: [100, 200, 100],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-0 w-80 h-80 bg-secondary rounded-full filter blur-3xl"
          style={{ y: y2 }}
          animate={{
            x: [-100, 100, -100],
            y: [200, 100, 200],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Mouse Follower Glow */}
      <motion.div
        className="fixed pointer-events-none z-10"
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      <div className="max-w-6xl mx-auto px-4 relative z-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
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
            Get Early Access to MagicTrader
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 mb-8"
          >
            Join <AnimatedCounter value={12847} className="text-primary font-bold" /> traders already on the waitlist
          </motion.p>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mb-8"
          >
            {trustSignals.map((signal, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-background/60 rounded-full border border-primary/20"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(0, 212, 255, 0.4)",
                  boxShadow: "0 5px 15px rgba(0, 212, 255, 0.2)"
                }}
              >
                <span className={signal.color}>{signal.icon}</span>
                <span className="text-sm text-white/80">{signal.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Logos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-2 mb-12 opacity-60"
          >
            <span className="text-sm text-white/60">As featured in</span>
            <div className="flex items-center gap-6 ml-4">
              {['TechCrunch', 'Forbes', 'CoinDesk'].map((name, i) => (
                <motion.div
                  key={i}
                  className="px-3 py-1 bg-white/10 rounded text-xs text-white/70"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                >
                  {name}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 mb-6">
              <Gift className="text-primary" size={24} />
              <h3 className="text-2xl font-bold text-primary">What You'll Get</h3>
            </div>
            
            {benefits.map((benefit, index) => (
              <BenefitItem 
                key={index}
                benefit={benefit}
                index={index}
                isInView={isInView}
              />
            ))}

            {/* Exclusive Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.2, type: "spring", bounce: 0.5 }}
              className="mt-8 p-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Crown className="text-yellow-400" size={24} />
                <div>
                  <div className="font-bold text-yellow-400">Limited Time Offer</div>
                  <div className="text-sm text-white/80">First 1000 members get lifetime 30% discount</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Email Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            {/* Form Container */}
            <div className="relative bg-gradient-to-b from-gray-900/90 to-background/90 backdrop-blur-xl border border-primary/30 rounded-3xl p-8 shadow-2xl overflow-hidden">
              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-30"
                style={{
                  background: "linear-gradient(45deg, #00D4FF, #00FF88, #00D4FF)",
                  padding: "2px",
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="w-full h-full bg-gradient-to-b from-gray-900/90 to-background/90 rounded-3xl" />
              </motion.div>

              <div className="relative z-10">
                {status !== 'success' ? (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-4"
                        animate={{
                          boxShadow: ["0 0 20px rgba(0, 212, 255, 0.3)", "0 0 30px rgba(0, 212, 255, 0.5)", "0 0 20px rgba(0, 212, 255, 0.3)"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <Zap className="text-primary" size={16} />
                        <span className="text-primary text-sm font-semibold">Join the AI Revolution</span>
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">Start Your Trading Journey</h3>
                      <p className="text-white/70">Enter your email to secure early access</p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                        <motion.input
                          type="email"
                          placeholder="Enter your trading email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={status === 'loading'}
                          className="w-full pl-12 pr-4 py-4 bg-background/80 border border-primary/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
                          whileFocus={{ 
                            scale: 1.02,
                            boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)"
                          }}
                          required
                        />
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm flex items-center gap-2"
                        >
                          <span>⚠️</span> {error}
                        </motion.div>
                      )}

                      <MagneticButton
                        onClick={handleSubmit}
                        disabled={status === 'loading'}
                        className={`w-full py-4 rounded-xl text-lg font-bold transition-all relative overflow-hidden ${
                          status === 'loading' 
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-primary to-secondary text-background shadow-lg'
                        }`}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {status === 'loading' ? (
                            <>
                              <motion.div
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              Joining Waitlist...
                            </>
                          ) : (
                            <>
                              Join Waitlist Free
                              <Sparkles size={20} />
                            </>
                          )}
                        </span>
                      </MagneticButton>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-white/50">
                        🔒 No spam. Unsubscribe anytime. Privacy protected.
                      </p>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 1,
                        repeat: 3,
                      }}
                    >
                      <Trophy className="text-white" size={32} />
                    </motion.div>
                    
                    <h3 className="text-3xl font-bold text-green-400 mb-4">
                      🎉 Welcome to MagicTrader!
                    </h3>
                    <p className="text-lg text-white/80 mb-6">
                      You're officially on the waitlist! Check your inbox for exclusive early access details.
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-white/70">
                      <Star className="text-yellow-400" size={16} />
                      <span>Position #{Math.floor(Math.random() * 100) + 12800} in queue</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}