import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';
import chartImage from '../assets/chart.png';

// Helper for animated numbers
function AnimatedNumber({ value, decimals = 2, duration = 1, prefix = '', className = '' }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    let startTime = null;
    function animate(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / (duration * 1000), 1);
      setDisplay(start + (value - start) * progress);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [value]);
  return <span className={className}>{prefix}{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
}

const signals = [
  {
    symbol: 'BTC/USD',
    type: 'BUY',
    from: 43250,
    to: 44100,
    strength: 'Strong',
    color: 'text-green-400',
    icon: <TrendingUp className="inline-block text-green-400" size={18} />,
  },
  {
    symbol: 'AAPL',
    type: 'SELL',
    from: 182.5,
    to: 179.2,
    strength: 'Medium',
    color: 'text-red-400',
    icon: <TrendingDown className="inline-block text-red-400" size={18} />,
  },
  {
    symbol: 'EUR/USD',
    type: 'BUY',
    from: 1.0845,
    to: 1.0890,
    strength: 'Strong',
    color: 'text-green-400',
    icon: <TrendingUp className="inline-block text-green-400" size={18} />,
  },
];

export default function TradingDashboard() {
  // Simulate price changes
  const [prices, setPrices] = useState([44100, 179.2, 1.0890]);
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prices => prices.map((p, i) => p + (Math.random() - 0.5) * (i === 2 ? 0.002 : i === 1 ? 0.05 : 5)));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Chart animation controls
  const chartControls = useAnimation();
  useEffect(() => {
    chartControls.start({ pathLength: 1 });
  }, [chartControls]);

  return (
    <section id="dashboard" className="relative py-20 bg-background text-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl font-bold mb-4 text-center"
        >
          See MagicTrader in Action
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg md:text-xl text-white/80 mb-12 text-center"
        >
          Real-time AI signals and portfolio management
        </motion.p>
        {/* Dashboard Mockup */}
        <div className="bg-[#181c23] rounded-3xl shadow-2xl border-2 border-primary/30 p-0 md:p-8 flex flex-col gap-6">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 border-b border-primary/20 bg-background/80 rounded-t-3xl">
            <div className="text-lg md:text-2xl font-bold text-primary">
              Portfolio Value: <AnimatedNumber value={47832.5} decimals={2} prefix="$" className="text-white" />
              <span className="ml-2 text-green-400 text-base font-semibold">(+<AnimatedNumber value={2341} decimals={0} prefix="$" className="text-green-400" /> today)</span>
            </div>
            <div className="text-base md:text-lg font-semibold text-blue-400">
              <span className="animate-pulse">12 Active Signals</span>
            </div>
            <div className="text-base md:text-lg font-semibold text-secondary">
              AI Accuracy: <AnimatedNumber value={94.2} decimals={1} suffix="%" className="text-secondary" /> This Week
            </div>
          </div>
          {/* Main Panels */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Live Signals Panel */}
            <div className="flex-1 bg-background/80 rounded-2xl border border-primary/20 p-6 flex flex-col gap-4 min-w-[220px]">
              <div className="font-bold text-lg text-primary mb-2">Live Signals</div>
              {signals.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className={`flex items-center justify-between p-3 rounded-xl bg-background/90 border-l-4 ${s.type === 'BUY' ? 'border-green-400' : 'border-red-400'} shadow group`}
                >
                  <div className="flex items-center gap-2">
                    {s.icon}
                    <span className="font-semibold text-white">{s.symbol}</span>
                    <span className={`ml-2 font-bold ${s.color}`}>{s.type}</span>
                  </div>
                  <div className="text-xs text-white/70">
                    {s.type === 'BUY' ? <ArrowUpRight className="inline-block text-green-400" size={16} /> : <ArrowDownRight className="inline-block text-red-400" size={16} />}
                    <span className="ml-1">{s.from} → <span className="font-bold text-white">{prices[i].toLocaleString(undefined, { maximumFractionDigits: i === 2 ? 4 : 2 })}</span></span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-semibold animate-pulse">{s.strength}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Chart Area */}
            <div className="flex-[2] flex flex-col items-center justify-center min-w-[260px]">
              <div className="w-full h-64 bg-background/80 rounded-2xl border border-primary/20 flex items-center justify-center relative overflow-hidden">
                {/* Chart Background Image */}
                <img 
                  src={chartImage} 
                  alt="Trading chart background" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                {/* Animated Candlestick Chart (SVG overlay) */}
                <svg width="95%" height="90%" viewBox="0 0 400 180" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  {/* Candles */}
                  <motion.rect x="20" y="80" width="10" height="60" rx="3" fill="#00FF88" initial={{ height: 0 }} animate={{ height: 60 }} transition={{ duration: 1 }} />
                  <motion.rect x="40" y="100" width="10" height="40" rx="3" fill="#00D4FF" initial={{ height: 0 }} animate={{ height: 40 }} transition={{ duration: 1.2 }} />
                  <motion.rect x="60" y="120" width="10" height="20" rx="3" fill="#ff4d4f" initial={{ height: 0 }} animate={{ height: 20 }} transition={{ duration: 1.4 }} />
                  <motion.rect x="80" y="90" width="10" height="50" rx="3" fill="#00FF88" initial={{ height: 0 }} animate={{ height: 50 }} transition={{ duration: 1.6 }} />
                  {/* AI Prediction Overlay */}
                  <motion.path
                    d="M20 110 Q60 60 120 100 Q180 140 240 80 Q300 40 380 100"
                    stroke="#00D4FF" strokeWidth="3" fill="none"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }}
                  />
                  {/* Entry/Exit Markers */}
                  <motion.circle cx="40" cy="100" r="6" fill="#00FF88" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1.2, delay: 1 }} />
                  <motion.circle cx="300" cy="40" r="6" fill="#ff4d4f" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1.2, delay: 1.2 }} />
                </svg>
                <div className="absolute bottom-2 left-4 text-xs text-white/60 z-20">AI Prediction Overlay</div>
              </div>
            </div>
            {/* Risk Analysis Panel */}
            <div className="flex-1 bg-background/80 rounded-2xl border border-primary/20 p-6 flex flex-col gap-4 min-w-[220px]">
              <div className="font-bold text-lg text-primary mb-2">Risk Analysis</div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-secondary" size={22} />
                <span className="text-white/80 font-semibold">Risk Score:</span>
                <span className="text-green-400 font-bold ml-1">Low (2/10)</span>
              </div>
              <div className="text-white/80 text-sm mb-1">
                Suggested Position Size: <span className="text-primary font-semibold">$2,500</span>
              </div>
              <div className="text-white/80 text-sm mb-1">
                Stop Loss: <span className="text-red-400 font-semibold">$42,900</span>
              </div>
              <div className="text-white/80 text-xs mt-2">AI-powered risk management for every trade</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 