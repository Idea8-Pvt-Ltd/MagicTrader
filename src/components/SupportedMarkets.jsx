import React from 'react';
import { motion } from 'framer-motion';
import { Bitcoin, Globe, LineChart } from 'lucide-react';

const markets = [
  {
    icon: <Bitcoin size={40} className="text-primary" />,
    title: 'Cryptocurrency',
    assets: 'BTC, ETH, ADA, SOL, DOGE',
    stats: '500+ Crypto Pairs',
    description: 'Ride the crypto waves with AI-powered signals for major and altcoins',
    border: 'border-primary',
  },
  {
    icon: <Globe size={40} className="text-secondary" />,
    title: 'Foreign Exchange',
    assets: 'EUR/USD, GBP/JPY, USD/CAD',
    stats: '50+ Forex Pairs',
    description: 'Master currency markets with precision timing and risk management',
    border: 'border-secondary',
  },
  {
    icon: <LineChart size={40} className="text-primary" />,
    title: 'Stock Market',
    assets: 'AAPL, TSLA, NVDA, AMZN',
    stats: '1000+ US Stocks',
    description: 'Navigate equity markets with AI insights on blue-chip and growth stocks',
    border: 'border-primary',
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

export default function SupportedMarkets() {
  return (
    <section id="markets" className="relative py-20 bg-background text-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          Trade Across All Major Markets
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg md:text-xl text-white/80 mb-12"
        >
          One platform, unlimited opportunities
        </motion.p>
        {/* Markets Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
        >
          {markets.map((market, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={{ scale: 1.04, boxShadow: '0 0 24px #00D4FF44' }}
              className={`relative bg-background border-2 ${market.border} rounded-2xl p-8 flex flex-col items-center shadow-lg transition-all group hover:border-white/40 hover:shadow-primary/30`}
            >
              <div className="mb-4 p-4 rounded-full bg-background/80 shadow-lg group-hover:shadow-primary/40 transition-all drop-shadow-glow-blue animate-pulse">
                {market.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary text-center">
                {market.title}
              </h3>
              <div className="text-white/80 text-sm mb-1">
                <span className="font-semibold">Popular:</span> {market.assets}
              </div>
              <div className="text-secondary font-semibold mb-2">{market.stats}</div>
              <p className="text-white/80 text-base text-center mb-2">
                {market.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 