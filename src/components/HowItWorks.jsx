import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Zap, Target } from 'lucide-react';

const steps = [
  {
    title: 'AI Scans Markets',
    icon: <BrainCircuit size={40} className="text-primary" />,
    description: 'Our AI analyzes thousands of data points across crypto, forex, and stock markets in real-time',
  },
  {
    title: 'Generates Signals',
    icon: <Zap size={40} className="text-secondary" />,
    description: 'Advanced algorithms identify high-probability trading opportunities with precise entry and exit points',
  },
  {
    title: 'You Trade Smarter',
    icon: <Target size={40} className="text-primary" />,
    description: 'Receive instant notifications with clear buy/sell signals and risk management guidance',
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 bg-background text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          How MagicTrader AI Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg md:text-xl text-white/80 mb-12"
        >
          From market data to profitable signals in milliseconds
        </motion.p>
        {/* Steps Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-start z-10"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={card}
              className="relative bg-background border border-primary/20 rounded-2xl p-8 flex flex-col items-center shadow-lg group"
            >
              <motion.div
                whileHover={{ scale: 1.12 }}
                className="mb-4 p-4 rounded-full bg-background/80 shadow-lg group-hover:shadow-primary/40 transition-all drop-shadow-glow-blue animate-pulse"
                aria-label={step.title + ' icon'}
              >
                {step.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-primary text-center">
                {step.title}
              </h3>
              <p className="text-white/80 text-base text-center">
                {step.description}
              </p>
              {/* Connecting lines/arrows */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-16 h-2 z-20">
                  <svg width="100%" height="100%" viewBox="0 0 64 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 4 Q32 12 64 4" stroke="#00D4FF" strokeWidth="2" fill="none" />
                    <circle cx="64" cy="4" r="3" fill="#00D4FF" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 