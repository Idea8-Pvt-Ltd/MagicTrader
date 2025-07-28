import React from 'react';
import { motion } from 'framer-motion';
import { Eye, CheckCircle, Shield, Radar } from 'lucide-react';
import brainImage from '../assets/brain.png';

const features = [
  {
    icon: <Eye size={40} className="text-secondary" />,
    title: 'Predictive Signal Generation',
    description: 'AI analyzes 10,000+ data points per second to predict market movements with 94% accuracy',
    stat: { value: 50, unit: 'ms', label: 'Average Response Time' },
    color: 'text-secondary',
  },
  {
    icon: <CheckCircle size={40} className="text-primary" />,
    title: 'Smart Signal Validation',
    description: 'Multi-layer AI verification ensures only high-confidence signals reach your dashboard',
    stat: { value: 99.7, unit: '%', label: 'False Positive Reduction' },
    color: 'text-primary',
  },
  {
    icon: <Shield size={40} className="text-secondary" />,
    title: 'Real-Time Risk Management',
    description: 'Dynamic risk assessment adjusts position sizes and stop-losses based on market volatility',
    stat: { value: 40, unit: '%', label: 'Better Risk-Reward Ratios' },
    color: 'text-secondary',
  },
  {
    icon: <Radar size={40} className="text-primary" />,
    title: '24/7 Market Monitoring',
    description: 'Continuous surveillance of global markets identifies opportunities the moment they emerge',
    stat: { value: 1500, unit: '+', label: 'Assets Tracked' },
    color: 'text-primary',
  },
];

function AnimatedNumber({ value, unit = '', className = '' }) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    let startTime = null;
    function animate(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / 800, 1);
      setDisplay(start + (value - start) * progress);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [value]);
  return <span className={className}>{display.toLocaleString(undefined, { maximumFractionDigits: value % 1 === 0 ? 0 : 1 })}{unit}</span>;
}

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

export default function AIFeatures() {
  return (
    <section id="features" className="relative py-20 bg-background text-white overflow-hidden">
      {/* Content with cards - now in the back */}
      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          Powered by Advanced AI Technology
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg md:text-xl text-white/80 mb-12"
        >
          The intelligent trading assistant that never sleeps
        </motion.p>
        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px #00D4FF22' }}
              className="relative bg-background border border-primary/20 rounded-2xl p-8 flex flex-col items-center shadow-lg group hover:border-primary/40 transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="mb-4 p-4 rounded-full bg-background/80 shadow-lg group-hover:shadow-primary/40 transition-all drop-shadow-glow-blue animate-pulse"
                aria-label={feature.title + ' icon'}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-primary text-center">
                {feature.title}
              </h3>
              <p className="text-white/80 text-base text-center mb-4 leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-auto">
                <div className={`text-2xl font-bold ${feature.color} mb-1`}>
                  <AnimatedNumber value={feature.stat.value} unit={feature.stat.unit} className={feature.color} />
                </div>
                <div className="text-white/70 text-sm font-medium">
                  {feature.stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Background Image for entire section - now in the front */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-20">
        <img 
          src={brainImage} 
          alt="AI brain background" 
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
} 