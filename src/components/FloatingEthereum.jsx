import React from 'react';
import { motion } from 'framer-motion';

const FloatingEthereum = ({ top, left, delay, size = 80, opacity = 0.1, duration = 30, rotate = 0 }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        zIndex: 1,
        color: '#627eea', // Ethereum blue
      }}
      animate={{
        y: [0, 50, 0],
        rotate: [rotate, rotate - 360],
      }}
      transition={{
        y: {
          duration: duration + Math.random() * 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay || 0,
        },
        rotate: {
          duration: 100,
          repeat: Infinity,
          ease: 'linear',
        },
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L4.9 12 12 16l7.1-4L12 0zm0 18l-7.1-4 7.1 10 7.1-10L12 18z" />
      </svg>
    </motion.div>
  );
};

export default FloatingEthereum;
