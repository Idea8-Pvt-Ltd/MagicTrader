import { motion, useInView, useAnimation, useScroll, useTransform, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useElementScroll, useViewportScroll } from 'framer-motion';

// Scroll-based animation utilities
const lerp = (start, end, t) => {
  return start * (1 - t) + end * t;
};

// Scroll-linked animations
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.16, 0.77, 0.47, 0.97] 
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: "backOut"
    }
  }
};

const rotateIn = {
  hidden: { rotate: -5, opacity: 0 },
  visible: { 
    rotate: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const ScrollAnimation = ({
  children,
  delay = 0,
  duration = 0.5,
  y = 20,
  x = 0,
  scale = 1,
  opacity = 0,
  once = false,
  className = '',
  type = 'fade',
  staggerChildren = 0.1,
  scrollSpeed = 1, // 0.5 (slow) to 2 (fast)
  scrollOffset = 0, // Pixels to offset the scroll trigger
  scrollSticky = false, // If true, element sticks to viewport while scrolling
  scrollStickyOffset = 0, // Offset for sticky position
  scrollReveal = true, // Whether to reveal on scroll
  scrollParallax = false, // Enable parallax effect
  scrollParallaxSpeed = 0.2, // Parallax speed (0-1)
  scrollFadeIn = true, // Fade in on scroll
  scrollScaleIn = false, // Scale in on scroll
  scrollRotateIn = 0, // Degrees to rotate on scroll
  scrollTranslateX = 0, // X translation on scroll
  scrollTranslateY = 0, // Y translation on scroll
  ...props
}) => {
  const ref = useRef(null);
  const [element, setElement] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);
  const springConfig = { stiffness: 100, damping: 15 };
  
  // Spring values for interactive effects
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);
  const springScale = useSpring(1, springConfig);
  
  // Scroll progress (0 to 1)
  const scrollProgress = useMotionValue(0);
  const { scrollY } = useViewportScroll();
  
  // Calculate scroll progress
  const updateScrollProgress = useCallback(() => {
    if (!ref.current) return;
    
    const elementRect = ref.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const elementHeight = elementRect.height;
    
    // Calculate progress based on element position
    const start = elementRect.top + scrollY.get() - viewportHeight + scrollOffset;
    const end = start + viewportHeight + elementHeight;
    const currentScroll = scrollY.get();
    
    // Calculate progress (0 to 1)
    let newProgress = (currentScroll - start) / (end - start);
    newProgress = Math.max(0, Math.min(1, newProgress)); // Clamp between 0 and 1
    
    setProgress(newProgress);
    scrollProgress.set(newProgress);
    
    // Check if in view
    const isVisible = (
      elementRect.top < viewportHeight * 0.8 && 
      elementRect.bottom > viewportHeight * 0.2
    );
    
    if (isVisible !== isInView) {
      setIsInView(isVisible);
      if (isVisible && scrollReveal) {
        controls.start('visible');
      }
    }
    
    // Handle sticky state
    if (scrollSticky) {
      const isSticky = (
        elementRect.top <= scrollStickyOffset && 
        elementRect.bottom > viewportHeight
      );
      
      if (isSticky !== isStuck) {
        setIsStuck(isSticky);
      }
    }
  }, [scrollY, scrollOffset, scrollReveal, scrollSticky, scrollStickyOffset, isInView, isStuck]);
  
  // Set up scroll listener
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    // Initial check
    updateScrollProgress();
    
    // Subscribe to scroll events
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, [updateScrollProgress]);

  // Handle mouse move for parallax effect
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width;
    const yPos = (e.clientY - rect.top) / rect.height;
    
    springX.set((xPos - 0.5) * 20);
    springY.set((yPos - 0.5) * 20);
    springScale.set(1.02);
  };

  // Reset on mouse leave
  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
    springScale.set(1);
    setIsHovered(false);
  };

  useEffect(() => {
    if (isInView) {
      const animationProps = {
        y: 0,
        x: 0,
        scale: 1,
        opacity: 1,
        transition: {
          duration: duration,
          delay: delay,
          ease: [0.16, 0.77, 0.47, 0.97],
          when: "beforeChildren",
          staggerChildren: staggerChildren
        },
      };
      
      // Apply different animations based on type
      switch(type) {
        case 'fade':
          controls.start({
            ...fadeIn.visible,
            transition: {
              ...fadeIn.visible.transition,
              delay: delay,
              staggerChildren: staggerChildren
            }
          });
          break;
        case 'slide':
          controls.start({
            ...slideUp.visible,
            transition: {
              ...slideUp.visible.transition,
              delay: delay,
              staggerChildren: staggerChildren
            }
          });
          break;
        case 'scale':
          controls.start({
            ...scaleIn.visible,
            transition: {
              ...scaleIn.visible.transition,
              delay: delay,
              staggerChildren: staggerChildren
            }
          });
          break;
        case 'rotate':
          controls.start({
            ...rotateIn.visible,
            transition: {
              ...rotateIn.visible.transition,
              delay: delay,
              staggerChildren: staggerChildren
            }
          });
          break;
        default:
          controls.start(animationProps);
      }
    }
  }, [isInView, controls, delay, duration, type, staggerChildren]);

  // Calculate dynamic styles based on scroll progress
  const getScrollStyles = () => {
    const styles = {};
    
    if (scrollParallax) {
      const parallaxY = progress * scrollParallaxSpeed * 100;
      styles.y = parallaxY;
    }
    
    if (scrollFadeIn) {
      styles.opacity = progress;
    }
    
    if (scrollScaleIn) {
      styles.scale = 0.8 + (progress * 0.4);
    }
    
    if (scrollRotateIn !== 0) {
      styles.rotate = progress * scrollRotateIn;
    }
    
    if (scrollTranslateX !== 0) {
      styles.x = progress * scrollTranslateX;
    }
    
    if (scrollTranslateY !== 0) {
      styles.y = (styles.y || 0) + (progress * scrollTranslateY);
    }
    
    return styles;
  };
  
  // Apply scroll-based transforms
  const scrollStyles = getScrollStyles();
  
  return (
    <motion.div
      ref={ref}
      initial={type === 'custom' ? { y, x, scale, opacity } : 'hidden'}
      animate={controls}
      className={`${className} ${scrollSticky ? 'sticky-element' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        ...(scrollSticky && isStuck ? { position: 'fixed', top: scrollStickyOffset } : {}),
        ...(scrollSticky && !isStuck ? { position: 'relative' } : {}),
        x: isHovered ? springX : scrollStyles.x || 0,
        y: isHovered ? springY : scrollStyles.y || 0,
        scale: isHovered ? springScale : scrollStyles.scale || 1,
        rotate: scrollStyles.rotate || 0,
        opacity: scrollStyles.opacity !== undefined ? scrollStyles.opacity : 1,
        ...props.style
      }}
      whileHover={{
        transition: { duration: 0.2 },
        zIndex: 10
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      {...props}
    >
      {children}
      
      {/* Debug info - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs p-1 rounded">
          {Math.round(progress * 100)}%
        </div>
      )}
    </motion.div>
  );
};

export const ScrollParallax = ({ 
  children, 
  y = 50, 
  x = 0,
  rotate = 0,
  scale = 1,
  className = '', 
  speed = 1,
  sticky = false, // Enable sticky behavior
  stickyOffset = 0, // Offset for sticky position
  scrollRange = [0, 1], // Range of scroll progress to animate over [start, end]
  scrollOffset = 0, // Additional scroll offset
  ...props 
}) => {
  const ref = useRef(null);
  const [isStuck, setIsStuck] = useState(false);
  const [element, setElement] = useState(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
    layoutEffect: false
  });
  
  // Handle sticky behavior
  useEffect(() => {
    if (!sticky || !ref.current) return;
    
    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(entry.intersectionRatio < 1);
      },
      { threshold: [1], rootMargin: `-${stickyOffset}px 0px 0px 0px` }
    );
    
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [sticky, stickyOffset]);

  // Create transforms directly with useTransform
  const yTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [y * speed, -y * speed]
  );
  
  const xTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [x * speed, -x * speed]
  );
  
  const rotateTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, rotate]
  );
  
  // Smooth spring-based parallax
  const springY = useSpring(yTransform, { stiffness: 100, damping: 30 });
  const springX = useSpring(xTransform, { stiffness: 100, damping: 30 });
  const springRotate = useSpring(rotateTransform, { stiffness: 50, damping: 15 });
  
  const springScale = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [1, scale, 1]),
    { stiffness: 100, damping: 20 }
  );
  
  // Opacity based on scroll position
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0]
  );

  // Interactive hover effect
  const [isHovered, setIsHovered] = useState(false);
  const hoverScale = useSpring(1, { stiffness: 300, damping: 15 });
  
  useEffect(() => {
    hoverScale.set(isHovered ? 1.05 : 1);
  }, [isHovered, hoverScale]);

  return (
    <motion.div
      ref={ref}
      style={{ 
        y: springY,
        x: springX,
        rotate: springRotate,
        scale: isHovered ? hoverScale : springScale,
        opacity,
        ...(sticky && isStuck ? { 
          position: 'sticky',
          top: stickyOffset,
          zIndex: 10 
        } : {})
      }}
      className={`${className} will-change-transform ${sticky ? 'sticky-parallax' : ''}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      {...props}
    >
      {children}
      
      {/* Debug info - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs p-1 rounded">
          {isStuck ? 'Sticky' : 'Normal'}
        </div>
      )}
    </motion.div>
  );
};

// Helper component for scroll-triggered animations
export const ScrollTrigger = ({ children, onEnter, onExit, onProgress, ...props }) => {
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  useAnimationFrame(() => {
    const progress = scrollYProgress.get();
    if (onProgress) onProgress(progress);
    
    if (progress > 0 && progress < 1 && onEnter) {
      onEnter(progress);
    } else if ((progress === 0 || progress === 1) && onExit) {
      onExit(progress);
    }
  });
  
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
};

// Export a hook for custom scroll animations
export const useScrollAnimation = (ref, options = {}) => {
  const {
    offset = [0, 1],
    onProgress,
    onEnter,
    onExit
  } = options;
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [offset[0], offset[1]]
  });
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(progress => {
      if (onProgress) onProgress(progress);
      
      if (progress > 0 && progress < 1 && onEnter) {
        onEnter(progress);
      } else if ((progress === 0 || progress === 1) && onExit) {
        onExit(progress);
      }
    });
    
    return () => unsubscribe();
  }, [scrollYProgress, onProgress, onEnter, onExit]);
  
  return {
    scrollYProgress,
    ref
  };
};

export default ScrollAnimation;
