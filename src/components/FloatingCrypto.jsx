import React from 'react';
import { motion } from 'framer-motion';

const FloatingCrypto = ({ top, left, delay, size = 80, opacity = 0.1, duration = 20, rotate = 0 }) => {
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
      }}
      animate={{
        y: [0, 30, 0],
        rotate: [rotate, rotate + 360],
      }}
      transition={{
        y: {
          duration: duration + Math.random() * 10,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        rotate: {
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        },
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
        <path d="M12 4.5C7.858 4.5 4.5 7.858 4.5 12s3.358 7.5 7.5 7.5 7.5-3.358 7.5-7.5S16.142 4.5 12 4.5zm0 13.5c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" />
      </svg>
    </motion.div>
  );
};

export default FloatingCrypto;
