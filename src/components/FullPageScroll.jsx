import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { ChevronUp, ChevronDown } from 'lucide-react';

const FullPageScroll = ({ children, activeSection = 0, onSectionChange }) => {
  const [currentSection, setCurrentSection] = useState(activeSection);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const sections = React.Children.toArray(children);
  
  // Handle wheel event for mouse wheel scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleWheel = (e) => {
      if (isScrolling) return;
      
      // Prevent default to avoid page scroll
      e.preventDefault();
      
      // Determine scroll direction (1 for down, -1 for up)
      const direction = e.deltaY > 0 ? 1 : -1;
      
      // Calculate new section index
      let newSection = currentSection + direction;
      
      // Clamp between 0 and max sections
      newSection = Math.max(0, Math.min(newSection, sections.length - 1));
      
      // Only update if section changed
      if (newSection !== currentSection) {
        setIsScrolling(true);
        setCurrentSection(newSection);
        
        // Call onSectionChange if provided
        if (onSectionChange) {
          onSectionChange(newSection);
        }
        
        // Prevent rapid scrolling
        setTimeout(() => setIsScrolling(false), 1000);
      }
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [currentSection, isScrolling, sections.length, onSectionChange]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isScrolling) return;
      
      let newSection = currentSection;
      
      switch (e.key) {
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          newSection = Math.min(currentSection + 1, sections.length - 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          newSection = Math.max(currentSection - 1, 0);
          break;
        case 'Home':
          e.preventDefault();
          newSection = 0;
          break;
        case 'End':
          e.preventDefault();
          newSection = sections.length - 1;
          break;
        default:
          return;
      }
      
      if (newSection !== currentSection) {
        setIsScrolling(true);
        setCurrentSection(newSection);
        
        if (onSectionChange) {
          onSectionChange(newSection);
        }
        
        setTimeout(() => setIsScrolling(false), 1000);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, isScrolling, sections.length, onSectionChange]);
  
  // Handle touch swipe events
  const handlers = useSwipeable({
    onSwipedUp: () => {
      if (!isScrolling && currentSection < sections.length - 1) {
        setIsScrolling(true);
        const newSection = currentSection + 1;
        setCurrentSection(newSection);
        if (onSectionChange) onSectionChange(newSection);
        setTimeout(() => setIsScrolling(false), 1000);
      }
    },
    onSwipedDown: () => {
      if (!isScrolling && currentSection > 0) {
        setIsScrolling(true);
        const newSection = currentSection - 1;
        setCurrentSection(newSection);
        if (onSectionChange) onSectionChange(newSection);
        setTimeout(() => setIsScrolling(false), 1000);
      }
    },
    trackMouse: true
  });
  
  // Scroll to active section
  useEffect(() => {
    if (containerRef.current) {
      const section = containerRef.current.children[currentSection];
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, [currentSection]);
  
  // Navigation dots
  const renderDots = () => (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-4">
      {sections.map((_, index) => (
        <button
          key={index}
          onClick={() => {
            if (!isScrolling) {
              setIsScrolling(true);
              setCurrentSection(index);
              if (onSectionChange) onSectionChange(index);
              setTimeout(() => setIsScrolling(false), 1000);
            }
          }}
          className={`w-3 h-3 rounded-full transition-all ${
            index === currentSection 
              ? 'bg-primary scale-125' 
              : 'bg-gray-400 hover:bg-gray-600'
          }`}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
    </div>
  );
  
  // Navigation arrows
  const renderArrows = () => (
    <>
      {currentSection > 0 && (
        <button
          onClick={() => {
            if (!isScrolling) {
              setIsScrolling(true);
              const newSection = currentSection - 1;
              setCurrentSection(newSection);
              if (onSectionChange) onSectionChange(newSection);
              setTimeout(() => setIsScrolling(false), 1000);
            }
          }}
          className="fixed left-1/2 bottom-8 transform -translate-x-1/2 z-50 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Previous section"
        >
          <ChevronUp className="text-white" size={24} />
        </button>
      )}
      
      {currentSection < sections.length - 1 && (
        <button
          onClick={() => {
            if (!isScrolling) {
              setIsScrolling(true);
              const newSection = currentSection + 1;
              setCurrentSection(newSection);
              if (onSectionChange) onSectionChange(newSection);
              setTimeout(() => setIsScrolling(false), 1000);
            }
          }}
          className="fixed left-1/2 bottom-4 transform -translate-x-1/2 z-50 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Next section"
        >
          <ChevronDown className="text-white" size={24} />
        </button>
      )}
    </>
  );

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full overflow-hidden relative"
      {...handlers}
    >
      <AnimatePresence initial={false} custom={currentSection}>
        {sections.map((section, index) => (
          <motion.div
            key={index}
            className="h-screen w-full flex items-center justify-center"
            initial={{ y: '100%' }}
            animate={{
              y: `${-currentSection * 100}%`,
              transition: { duration: 0.8, ease: [0.16, 0.77, 0.47, 0.97] }
            }}
            exit={{ y: '-100%' }}
          >
            {section}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {renderDots()}
      {renderArrows()}
      
      {/* Progress indicator */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-1 rounded-full text-sm">
        {currentSection + 1} / {sections.length}
      </div>
    </div>
  );
};

// Section component for better semantics
const Section = ({ children, className = '', ...props }) => (
  <section 
    className={`h-full w-full ${className}`}
    {...props}
  >
    {children}
  </section>
);

FullPageScroll.Section = Section;

export default FullPageScroll;
