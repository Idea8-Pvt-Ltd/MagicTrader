import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Marcus Chen',
    role: 'Day Trader, 3 years experience',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote: 'MagicTrader increased my win rate from 62% to 89% in just 2 months. The AI signals are incredibly accurate.',
    results: [
      { label: 'Portfolio Growth', value: 156, color: 'text-secondary', prefix: '+', suffix: '%', decimals: 0 },
      { label: 'Win Rate', value: 89, color: 'text-primary', prefix: '', suffix: '%', decimals: 0 },
    ],
    rating: 5,
    direction: 'left',
  },
  {
    name: 'Sarah Rodriguez',
    role: 'Crypto Trader & Analyst',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote: 
      "Finally, an AI that understands crypto volatility. I've made more in 6 months than my previous 2 years combined.",
    results: [
      { label: 'Returns', value: 243, color: 'text-secondary', prefix: '+', suffix: '%', decimals: 0 },
      { label: 'Signal Accuracy', value: 92, color: 'text-primary', prefix: '', suffix: '%', decimals: 0 },
    ],
    rating: 5,
    direction: 'up',
  },
  {
    name: 'James Thompson',
    role: 'Professional Forex Trader',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    quote: "The risk management alone is worth it. Haven't had a major loss since switching to MagicTrader.",
    results: [
      { label: 'Profit', value: 127, color: 'text-secondary', prefix: '+', suffix: '%', decimals: 0 },
      { label: 'Risk Control', value: 95, color: 'text-primary', prefix: '', suffix: '%', decimals: 0 },
    ],
    rating: 5,
    direction: 'right',
  },
];

function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '', className = '' }) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    let startTime = null;
    function animate(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / 900, 1);
      setDisplay(start + (value - start) * progress);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [value]);
  return <span className={className}>{prefix}{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

export default function SuccessStories() {
  return (
    <section id="testimonials" className="relative py-20 bg-background text-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          Real Traders, Real Results
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg md:text-xl text-white/80 mb-12"
        >
          Join thousands of profitable traders using MagicTrader AI
        </motion.p>
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: t.direction === 'left' ? -60 : t.direction === 'right' ? 60 : 0,
                y: t.direction === 'up' ? -60 : 0,
              }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2, type: 'spring' }}
              className="relative bg-background border border-primary/20 rounded-2xl p-8 flex flex-col items-center shadow-lg group hover:shadow-primary/30 transition-all"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background rounded-full p-1 border-4 border-background shadow-lg">
                <img src={t.avatar} alt={t.name + ' avatar'} className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
              </div>
              <div className="mt-10 mb-2 flex items-center gap-2">
                <span className="font-bold text-lg text-white">{t.name}</span>
                <span className="text-xs text-white/60">({t.role})</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(t.rating)].map((_, j) => (
                  <motion.span
                    key={j}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + j * 0.1 }}
                  >
                    <Star className="text-yellow-400" size={18} />
                  </motion.span>
                ))}
              </div>
              <div className="relative mb-4 mt-2">
                <Quote className="absolute -left-6 -top-2 text-primary opacity-60" size={28} />
                <p className="italic text-white/90 text-base leading-relaxed z-10">{t.quote}</p>
              </div>
              <div className="flex flex-col gap-1 mt-2 w-full">
                {t.results.map((r, k) => (
                  <div key={k} className="flex items-center justify-center gap-2">
                    <AnimatedNumber value={r.value} decimals={r.decimals} prefix={r.prefix} suffix={r.suffix} className={`font-bold text-lg ${r.color}`} />
                    <span className="text-white/70 text-sm">{r.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 