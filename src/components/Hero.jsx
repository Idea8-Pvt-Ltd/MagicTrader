import React from 'react';
import { motion } from 'framer-motion';
import { Bitcoin, Coins, DollarSign, LineChart } from 'lucide-react';

const stats = [
  { label: '1M+ Signals Generated' },
  { label: '94% Accuracy Rate' },
  { label: '50k+ Active Traders' },
];

const icons = [
  { icon: <Bitcoin size={32} />, label: 'BTC' },
  { icon: <Coins size={32} />, label: 'Crypto' },
  { icon: <DollarSign size={32} />, label: 'USD' },
  { icon: <LineChart size={32} />, label: 'Stocks' },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-background text-white">
      {/* Animated Background Gradient Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0 bg-gradient-to-br from-background via-black to-primary/30"
        aria-hidden="true"
      />
      {/* Animated Chart Lines (subtle) */}
      <motion.svg
        className="absolute inset-0 w-full h-full z-0 opacity-30"
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.3, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      >
        <motion.path
          d="M0,400 Q360,300 720,400 T1440,400"
          stroke="#00D4FF"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <motion.path
          d="M0,500 Q360,350 720,500 T1440,500"
          stroke="#00FF88"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
        />
      </motion.svg>
      {/* Floating Icons */}
      <div className="absolute left-8 top-1/3 z-10 flex flex-col gap-8 animate-float-slow">
        <motion.div initial={{ y: 20, opacity: 0.7 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="drop-shadow-glow-blue">
          {icons[0].icon}
        </motion.div>
        <motion.div initial={{ y: -20, opacity: 0.7 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, delay: 0.7 }} className="drop-shadow-glow-green">
          {icons[1].icon}
        </motion.div>
      </div>
      <div className="absolute right-8 bottom-1/4 z-10 flex flex-col gap-8 animate-float-slow">
        <motion.div initial={{ y: 20, opacity: 0.7 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.1, delay: 0.6 }} className="drop-shadow-glow-blue">
          {icons[2].icon}
        </motion.div>
        <motion.div initial={{ y: -20, opacity: 0.7 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.3, delay: 0.8 }} className="drop-shadow-glow-green">
          {icons[3].icon}
        </motion.div>
      </div>
      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-glow-blue"
        >
          AI-Powered Trading Signals That Actually Work
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-lg md:text-2xl text-white/80 mb-8 max-w-2xl"
        >
          Join thousands of traders using advanced AI to predict market movements across Crypto, Forex, and Stocks
        </motion.p>
        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          <button
            className="bg-primary text-background font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all text-lg"
            onClick={() => scrollToSection('waitlist')}
          >
            Join Waitlist
          </button>
          <button
            className="border-2 border-primary text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary hover:text-background transition-all text-lg"
            onClick={() => scrollToSection('how-it-works')}
          >
            Watch Demo
          </button>
        </motion.div>
        {/* Live Stats Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 md:gap-12 text-white/80 text-base md:text-lg font-medium mt-4"
          aria-label="Live trading stats"
        >
          {stats.map((stat, i) => (
            <div key={i} className="px-4 py-2 rounded-lg bg-background/70 backdrop-blur-sm shadow border border-primary/20 animate-glow">
              {stat.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 