import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck } from 'lucide-react';

const benefits = [
  'Free 30-day trial when we launch',
  'Exclusive trading strategies guide',
  'Priority customer support',
  'Early bird pricing (50% off first year)',
  'Access to private trader community',
];

const logos = [
  // Placeholder logos (use SVGs or images in real app)
  'https://upload.wikimedia.org/wikipedia/commons/4/44/Googleplex-Logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/0/08/Forbes_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/6/6a/Yahoo_Finance_Logo_2019.svg',
];

function AnimatedNumber({ value, className = '' }) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    let startTime = null;
    function animate(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / 1200, 1);
      setDisplay(start + (value - start) * progress);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [value]);
  return <span className={className}>{display.toLocaleString()}</span>;
}

export default function JoinWaitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  return (
    <section id="waitlist" className="relative py-20 bg-background text-white overflow-hidden">
      {/* Subtle particle background (placeholder) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute left-1/4 top-1/3 w-72 h-72 bg-primary rounded-full filter blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.3 }}
          className="absolute right-1/4 bottom-1/4 w-60 h-60 bg-secondary rounded-full filter blur-2xl"
        />
      </div>
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl font-bold mb-4 text-center"
        >
          Get Early Access to MagicTrader
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg md:text-xl text-white/80 mb-8 text-center"
        >
          Join 10,000+ traders already on the waitlist
        </motion.p>
        {/* Counter and Trust Signals */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <div className="text-primary font-bold text-lg flex items-center gap-2">
            <AnimatedNumber value={10847} className="text-2xl md:text-3xl font-extrabold" /> traders joined this week
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-primary/20 text-primary font-semibold px-3 py-1 rounded-full text-xs">100% Free to Join</span>
            <ShieldCheck className="text-secondary" size={20} title="Your email is safe with us" />
            <span className="text-xs text-white/60">Your email is safe with us</span>
          </div>
        </div>
        {/* Logos */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
          <span className="text-white/60 text-xs">As featured in</span>
          {logos.map((logo, i) => (
            <img key={i} src={logo} alt="Featured logo" className="h-7 grayscale opacity-80" />
          ))}
        </div>
        {/* Main Content: Benefits + Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Benefits List */}
          <motion.ul
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-5"
          >
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-3 text-lg text-white/90">
                <CheckCircle className="text-secondary animate-pulse" size={22} />
                <span>{b}</span>
              </li>
            ))}
          </motion.ul>
          {/* Email Form */}
          <motion.form
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
            className="bg-background/80 border border-primary/20 rounded-2xl shadow-lg p-8 flex flex-col gap-5"
            autoComplete="off"
          >
            <label htmlFor="email" className="text-left font-semibold text-white mb-1">Trading Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-background border border-primary/30 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg placeholder:text-white/50"
              placeholder="Enter your trading email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
              required
              aria-label="Email address"
            />
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-lg font-bold transition-all bg-primary text-background shadow-lg hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${status === 'loading' ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? 'Joining...' : status === 'success' ? 'Joined!' : 'Join Waitlist'}
            </button>
            <div className="text-xs text-white/60 text-center mt-1">No spam. Unsubscribe anytime.</div>
            {status === 'success' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-green-400 text-center font-semibold mt-2"
              >
                Success! You’re on the waitlist. Check your inbox for updates.
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
} 