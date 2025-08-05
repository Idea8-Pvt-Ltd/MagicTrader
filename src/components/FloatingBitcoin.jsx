import React from 'react';
import { motion } from 'framer-motion';
import btcImage from '../assets/btc.png';

const FloatingBitcoin = ({ top, left, delay, size = 80, opacity = 0.1, duration = 25, rotate = 0 }) => {
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
        y: [0, 40, 0],
        rotate: [rotate, rotate + 360],
      }}
      transition={{
        y: {
          duration: duration + Math.random() * 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay || 0,
        },
        rotate: {
          duration: 80,
          repeat: Infinity,
          ease: 'linear',
        },
      }}
    >
      <img 
        src={btcImage} 
        alt="Bitcoin" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 8px rgba(247, 147, 26, 0.5))',
        }}
      />
    </motion.div>
  );
};

export default FloatingBitcoin;
