import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, Zap, Target, Users } from 'lucide-react';
import FloatingBitcoin from './FloatingBitcoin';
import FloatingEthereum from './FloatingEthereum';
// Import the video file
import brainVideo from '../assets/brain.mp4';

export default function Hero() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Video loading state
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Parallax effects
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => {
        setVideoLoaded(true);
        video.play().catch(console.error);
      };
      
      video.addEventListener('loadeddata', handleLoadedData);
      return () => video.removeEventListener('loadeddata', handleLoadedData);
    }
  }, []);

  const scrollToNext = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* 3D Brain Video Background - Centered */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1, pointerEvents: 'none' }}>
        <video
          ref={videoRef}
          className="h-[70vh] w-auto object-contain"
          style={{
            filter: videoLoaded ? 'none' : 'blur(20px)',
            transition: 'filter 1s ease-in-out',
            maxWidth: '50vw',
          }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          {/* Use the imported video */}
          <source src={brainVideo} type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
        
        {/* Video Loading Placeholder */}
        {!videoLoaded && (
          <div className="w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full animate-pulse" />
        )}
      </div>

      {/* Floating Crypto Logos */}
      <FloatingBitcoin top={15} left={10} size={120} opacity={1} duration={30} />
      <FloatingBitcoin top={70} left={85} size={80} opacity={1} duration={40} rotate={45} />
      <FloatingEthereum top={20} left={80} size={100} opacity={1} duration={35} />
      <FloatingEthereum top={75} left={15} size={60} opacity={1} duration={45} rotate={30} />
      
      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/95" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/70" />

      {/* Hero Content - Centered with Higher Z-Index */}
      <motion.div
        className="relative z-30 text-center px-6 max-w-5xl mx-auto"
        style={{ y, opacity }}
      >
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl border border-cyan-400/30 rounded-full mb-8 mt-2"
        >
          <motion.div
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [1, 0.7, 1] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity 
            }}
          />
          <span className="text-white font-bold">
            AI Neural Network • <span className="text-cyan-400">Processing Live Data</span>
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
        >
          <motion.span 
            className="block text-white mb-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Think Like AI
          </motion.span>
          <motion.span 
            className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-green-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            Trade Like Pro
          </motion.span>
        </motion.h1>

        {/* Enhanced Subheading with Increased Weight */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-4 max-w-4xl mx-auto leading-relaxed font-semibold"
        >
          Our AI processes millions of market data points in real-time,
          <br className="hidden md:block" />
          just like neural networks in the human brain.
        </motion.p>

        {/* Highlighted Accuracy Statement */}
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="text-2xl md:text-3xl lg:text-4xl mb-16 font-bold"
        >
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Experience 94.2% accurate trading signals.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
        >
          {/* Primary CTA */}
          <motion.button
            className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-2xl overflow-hidden shadow-2xl min-w-[250px]"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px rgba(0, 212, 255, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500"
              initial={{ x: "100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.4 }}
            />
            <span className="relative z-10 flex items-center justify-center gap-3">
              Start AI Trading
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight size={24} />
              </motion.div>
            </span>
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            className="group flex items-center gap-3 px-10 py-5 text-white/90 border-2 border-white/30 hover:border-cyan-400/50 rounded-2xl transition-all text-xl font-semibold min-w-[250px] backdrop-blur-sm"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(0, 212, 255, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToNext}
          >
            <Play size={24} />
            Watch AI Demo
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            { 
              value: '94.2%', 
              label: 'AI Accuracy Rate', 
              icon: Target, 
              color: 'text-green-400',
              description: 'Neural network precision'
            },
            { 
              value: '50K+', 
              label: 'Active Traders', 
              icon: Users, 
              color: 'text-blue-400',
              description: 'Growing AI community'
            },
            { 
              value: '24/7', 
              label: 'Brain Processing', 
              icon: Zap, 
              color: 'text-yellow-400',
              description: 'Never stops learning'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-cyan-400/30 transition-all"
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: "0 20px 40px rgba(0, 212, 255, 0.2)"
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 + index * 0.2 }}
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              <div className="relative z-10 text-center">
                <stat.icon className={`w-12 h-12 ${stat.color} mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`} />
                
                <div className="text-4xl font-black text-white mb-3">
                  {stat.value}
                </div>
                
                <div className="text-white/80 text-lg font-semibold mb-2">
                  {stat.label}
                </div>
                
                <div className="text-white/60 text-sm">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={scrollToNext}
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-6 h-10 border-2 border-white/30 group-hover:border-cyan-400/70 rounded-full flex justify-center transition-colors">
              <motion.div
                className="w-1 h-3 bg-white/50 group-hover:bg-cyan-400/80 rounded-full mt-2 transition-colors"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-white/50 group-hover:text-cyan-400/80 text-xs font-medium transition-colors">
              Explore AI Features
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Additional atmospheric elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400/60 rounded-full animate-pulse hidden lg:block" />
      <div className="absolute bottom-32 right-32 w-3 h-3 bg-blue-400/40 rounded-full animate-pulse hidden lg:block" />
      <div className="absolute top-1/3 right-16 w-1 h-1 bg-green-400/80 rounded-full animate-pulse hidden lg:block" />
    </section>
  );
}