import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Zap, Target } from 'lucide-react';
import mobile from '../assets/mobile.png'; // Make sure to add your image to the assets folder

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
    <section id="how-it-works" className="relative py-20 bg-background text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={mobile} 
                alt="AI Trading Dashboard" 
                className="w-full h-auto object-cover"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent pointer-events-none" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/4 -left-8 w-64 h-64 bg-cyan-400/10 rounded-full mix-blend-screen blur-3xl" />
            <div className="absolute -z-10 bottom-1/4 -right-8 w-48 h-48 bg-purple-400/10 rounded-full mix-blend-screen blur-3xl" />
          </motion.div>

          {/* Right Column - Content */}
          <div className="lg:pl-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white"
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
              className="relative space-y-8"
            >
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={card}
                  className="relative bg-background/50 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-6 flex items-start space-x-4 group hover:border-cyan-400/40 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-cyan-400/10 to-cyan-600/10 group-hover:shadow-glow transition-all"
                    aria-label={step.title + ' icon'}
                  >
                    {step.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-cyan-300">
                      {step.title}
                    </h3>
                    <p className="text-white/80 text-base">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}