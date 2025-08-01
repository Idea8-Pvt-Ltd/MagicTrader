import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ChevronUp, Mouse, ArrowDown, Zap, Star, Sparkles } from 'lucide-react';

// Smooth Scroll Progress Indicator
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary origin-left z-50"
      style={{ scaleX }}
    />
  );
}

// Section Transition Component
function SectionTransition({ children, sectionId, backgroundColor = 'from-background', delay = 0 }) {
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9]);

  return (
    <motion.section
      ref={ref}
      id={sectionId}
      className={`relative overflow-hidden bg-gradient-to-b ${backgroundColor} to-gray-900`}
      style={{ y, opacity, scale }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.section>
  );
}

// Floating Navigation Dots
function FloatingNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'markets', label: 'Markets' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'features', label: 'AI Features' },
    { id: 'testimonials', label: 'Stories' },
    { id: 'waitlist', label: 'Join' },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2 }}
    >
      <div className="bg-background/80 backdrop-blur-xl border border-primary/20 rounded-full p-4 shadow-lg">
        {sections.map((section, index) => (
          <motion.button
            key={section.id}
            className={`block w-3 h-3 rounded-full mb-3 last:mb-0 transition-all duration-300 ${
              activeSection === section.id 
                ? 'bg-primary shadow-lg shadow-primary/50' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            onClick={() => scrollToSection(section.id)}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            title={section.label}
          >
            <motion.div
              className="w-full h-full rounded-full"
              animate={{
                boxShadow: activeSection === section.id 
                  ? ['0 0 0px #00D4FF', '0 0 20px #00D4FF', '0 0 0px #00D4FF']
                  : '0 0 0px transparent'
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// Back to Top Button
function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsVisible(latest > 500);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg z-40"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0, rotate: 180 }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 10px 30px rgba(0, 212, 255, 0.4)"
          }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="text-background" size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Page Loading Animation
function PageLoader({ isLoading, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing AI Systems...');

  const loadingSteps = [
    'Initializing AI Systems...',
    'Loading Market Data...',
    'Calibrating Trading Algorithms...',
    'Connecting to Global Markets...',
    'Ready to Trade!'
  ];

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        const stepIndex = Math.min(Math.floor(newProgress / 20), loadingSteps.length - 1);
        setLoadingText(loadingSteps[stepIndex]);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading, onComplete]);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-background z-50 flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center max-w-md mx-auto px-4">
        {/* Logo Animation */}
        <motion.div
          className="text-4xl font-bold text-primary mb-8"
          animate={{
            scale: [1, 1.1, 1],
            textShadow: [
              '0 0 10px #00D4FF',
              '0 0 20px #00D4FF',
              '0 0 10px #00D4FF'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          MagicTrader
        </motion.div>

        {/* Progress Bar */}
        <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          className="text-white/80 text-lg"
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loadingText}
        </motion.p>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Scroll Indicator for Hero
function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsVisible(latest < 100);
    });
  }, [scrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 text-white/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 3 }}
        >
          <div className="flex flex-col items-center gap-2">
            <Mouse size={24} />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowDown size={16} />
            </motion.div>
            <span className="text-sm">Scroll to explore</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Section Divider with Animation
function SectionDivider({ variant = 'default' }) {
  const variants = {
    default: 'from-primary/20 via-secondary/40 to-primary/20',
    glow: 'from-transparent via-primary to-transparent',
    wave: 'from-secondary/30 via-primary/50 to-secondary/30'
  };

  return (
    <div className="relative h-px overflow-hidden">
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${variants[variant]}`}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      {/* Animated Sparkles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-1 h-1 bg-primary rounded-full"
          style={{ left: `${25 + i * 25}%` }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

// Cursor Trail Effect
function CursorTrail() {
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    let animationFrame;
    
    const handleMouseMove = (e) => {
      const newTrail = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      
      setTrails(prev => [...prev.slice(-10), newTrail]);
    };

    const updateTrails = () => {
      setTrails(prev => prev.filter(trail => Date.now() - trail.id < 1000));
      animationFrame = requestAnimationFrame(updateTrails);
    };

    window.addEventListener('mousemove', handleMouseMove);
    updateTrails();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          style={{
            left: trail.x - 4,
            top: trail.y - 4,
          }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ 
            scale: 0, 
            opacity: 0,
          }}
          transition={{ 
            duration: 1,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}

// Main Page Flow Component
export default function EnhancedPageFlow({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showCursorTrail, setShowCursorTrail] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Enable cursor trail after loading
    if (!isLoading) {
      setTimeout(() => setShowCursorTrail(true), 1000);
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        <PageLoader 
          isLoading={isLoading} 
          onComplete={() => setIsLoading(false)} 
        />
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Global Effects */}
          <ScrollProgress />
          <FloatingNav />
          <BackToTop />
          <ScrollIndicator />
          {showCursorTrail && <CursorTrail />}

          {/* Page Content with Transitions */}
          <div className="relative">
            {/* Hero Section */}
            <SectionTransition sectionId="hero" backgroundColor="from-background">
              <div className="min-h-screen">
                {/* Your enhanced Hero component goes here */}
                <div className="flex items-center justify-center min-h-screen text-white">
                  <div className="text-center">
                    <motion.h1
                      className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      MagicTrader Enhanced
                    </motion.h1>
                    <motion.p
                      className="text-xl text-white/80"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.8 }}
                    >
                      Experience the future of AI-powered trading
                    </motion.p>
                  </div>
                </div>
              </div>
            </SectionTransition>

            <SectionDivider variant="glow" />

            {/* How It Works Section */}
            <SectionTransition sectionId="how-it-works" backgroundColor="from-gray-900" delay={0.1}>
              <div className="min-h-screen flex items-center justify-center text-white">
                <motion.h2
                  className="text-4xl font-bold text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  How It Works Section
                </motion.h2>
              </div>
            </SectionTransition>

            <SectionDivider variant="wave" />

            {/* Markets Section */}
            <SectionTransition sectionId="markets" backgroundColor="from-background" delay={0.2}>
              <div className="min-h-screen flex items-center justify-center text-white">
                <motion.h2
                  className="text-4xl font-bold text-center"
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  Supported Markets Section
                </motion.h2>
              </div>
            </SectionTransition>

            <SectionDivider variant="default" />

            {/* Dashboard Section */}
            <SectionTransition sectionId="dashboard" backgroundColor="from-gray-900" delay={0.3}>
              <div className="min-h-screen flex items-center justify-center text-white">
                <motion.h2
                  className="text-4xl font-bold text-center"
                  initial={{ opacity: 0, rotateY: 90 }}
                  whileInView={{ opacity: 1, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  Trading Dashboard Section
                </motion.h2>
              </div>
            </SectionTransition>

            <SectionDivider variant="glow" />

            {/* AI Features Section */}
            <SectionTransition sectionId="features" backgroundColor="from-background" delay={0.4}>
              <div className="min-h-screen flex items-center justify-center text-white">
                <motion.h2
                  className="text-4xl font-bold text-center"
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                >
                  AI Features Section
                </motion.h2>
              </div>
            </SectionTransition>

            <SectionDivider variant="wave" />

            {/* Testimonials Section */}
            <SectionTransition sectionId="testimonials" backgroundColor="from-gray-900" delay={0.5}>
              <div className="min-h-screen flex items-center justify-center text-white">
                <motion.h2
                  className="text-4xl font-bold text-center"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, type: "spring" }}
                >
                  Success Stories Section
                </motion.h2>
              </div>
            </SectionTransition>

            <SectionDivider variant="default" />

            {/* Waitlist Section */}
            <SectionTransition sectionId="waitlist" backgroundColor="from-background" delay={0.6}>
              <div className="min-h-screen flex items-center justify-center text-white">
                <motion.h2
                  className="text-4xl font-bold text-center"
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  Join Waitlist Section
                </motion.h2>
              </div>
            </SectionTransition>
          </div>
        </motion.div>
      )}
    </>
  );
}