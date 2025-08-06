import React, { useState, useEffect, useRef } from 'react';
import Threads from './Threads';

const ThreadsBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const threadsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize threads
    const initThreads = () => {
      threadsRef.current = [];
      const threadCount = Math.floor((window.innerWidth * window.innerHeight) / 20000);

      for (let i = 0; i < threadCount; i++) {
        threadsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          connections: [],
          opacity: Math.random() * 0.5 + 0.3
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const maxDistance = 150;

      // Update threads
      threadsRef.current.forEach(thread => {
        thread.x += thread.vx;
        thread.y += thread.vy;

        // Bounce off edges
        if (thread.x < 0 || thread.x > canvas.width) thread.vx *= -1;
        if (thread.y < 0 || thread.y > canvas.height) thread.vy *= -1;

        // Keep within bounds
        thread.x = Math.max(0, Math.min(canvas.width, thread.x));
        thread.y = Math.max(0, Math.min(canvas.height, thread.y));
      });

      // Draw connections
      threadsRef.current.forEach((thread, i) => {
        threadsRef.current.slice(i + 1).forEach(otherThread => {
          const dx = thread.x - otherThread.x;
          const dy = thread.y - otherThread.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3;

            // Create gradient for thread
            const gradient = ctx.createLinearGradient(thread.x, thread.y, otherThread.x, otherThread.y);
            gradient.addColorStop(0, `rgba(6, 182, 212, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(59, 130, 246, ${opacity})`);
            gradient.addColorStop(1, `rgba(147, 51, 234, ${opacity})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(thread.x, thread.y);
            ctx.lineTo(otherThread.x, otherThread.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      threadsRef.current.forEach(thread => {
        const gradient = ctx.createRadialGradient(thread.x, thread.y, 0, thread.x, thread.y, 3);
        gradient.addColorStop(0, `rgba(6, 182, 212, ${thread.opacity})`);
        gradient.addColorStop(1, `rgba(6, 182, 212, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(thread.x, thread.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    initThreads();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40"
      style={{ background: 'transparent' }}
    />
  );
};

const TradingChart = () => {
  const [chartData, setChartData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(42350);
  const [priceChange, setPriceChange] = useState(2.4);

  useEffect(() => {
    // Generate initial chart data
    const initialData = [];
    let price = 42000;
    for (let i = 0; i < 50; i++) {
      price += (Math.random() - 0.5) * 100;
      initialData.push(price);
    }
    setChartData(initialData);

    // Animate chart data and price
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastPrice = newData[newData.length - 1];
        const newPrice = lastPrice + (Math.random() - 0.5) * 200;
        newData.push(newPrice);
        setCurrentPrice(newPrice);
        setPriceChange(((newPrice - 42000) / 42000) * 100);
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const pathData = chartData.map((price, index) => {
    const x = (index / (chartData.length - 1)) * 300;
    const y = 100 - ((price - 41000) / 2000) * 80;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="relative">
      <svg width="300" height="100" className="opacity-60">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          d={pathData}
          fill="none"
          stroke="url(#chartGradient)"
          strokeWidth="2"
          className="animate-pulse"
        />
      </svg>
      <div className="absolute top-2 right-2 text-right">
        <div className="text-lg font-bold text-white">
          ${currentPrice.toLocaleString()}
        </div>
        <div className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

const FloatingCard = ({ children, className = "", delay = 0 }) => (
  <div
    className={`bg-gray-900/20 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-gray-900/30 hover:border-cyan-400/30 hover:scale-105 ${className}`}
    style={{
      animation: `float 6s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.1) 0%, rgba(17, 24, 39, 0.2) 100%)'
    }}
  >
    {children}
  </div>
);

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotateX(0deg) rotateY(0deg); 
          }
          33% { 
            transform: translateY(-8px) rotateX(2deg) rotateY(-1deg); 
          }
          66% { 
            transform: translateY(-12px) rotateX(-1deg) rotateY(2deg); 
          }
        }
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(6, 182, 212, 0.1); 
          }
          50% { 
            box-shadow: 0 0 40px rgba(6, 182, 212, 0.6), 0 0 80px rgba(6, 182, 212, 0.2); 
          }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(6, 182, 212, 0.5); 
          }
          50% { 
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.8), 0 0 30px rgba(6, 182, 212, 0.4); 
          }
        }
        .glow-animation {
          animation: glow 2s ease-in-out infinite;
        }
        .pulse-glow {
          animation: pulse-glow 1.5s ease-in-out infinite;
        }
      `}</style>

      <section id="hero" className="relative min-h-screen overflow-hidden" style={{ background: '#0a0a12' }}>
        {/* Animated Threads Background */}
        {/* Wavy Threads as full Hero background */}
        <div className='mt-48' style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Threads />
        </div>

        {/* Floating Elements */}
        {/* <div className="absolute inset-0 pointer-events-none">
          <FloatingCard className="absolute top-20 left-10 w-48" delay={0}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full pulse-glow"></div>
              <span className="text-white text-sm font-medium">AI Signal: BUY</span>
            </div>
            <div className="text-cyan-400 font-bold mt-1 text-lg">ETH/USD</div>
            <div className="text-green-400 text-xs mt-1">Confidence: 94.7%</div>
          </FloatingCard>

          <FloatingCard className="absolute top-32 right-16 w-56" delay={1}>
            <TradingChart />
          </FloatingCard>

          <FloatingCard className="absolute bottom-32 left-20 w-48" delay={2}>
            <div className="text-white text-sm font-medium">Portfolio Growth</div>
            <div className="text-green-400 font-bold text-2xl">+127.3%</div>
            <div className="text-gray-300 text-xs">Past 30 days</div>
            <div className="flex items-center gap-1 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-400">Trending Up</span>
            </div>
          </FloatingCard>

          <FloatingCard className="absolute bottom-40 right-10 w-56" delay={1.5}>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-white text-sm font-medium">Risk Score</div>
                <div className="text-yellow-400 font-bold text-lg">Medium</div>
                <div className="text-gray-300 text-xs">Dynamic AI Analysis</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg">7.2</span>
              </div>
            </div>
          </FloatingCard>
        </div> */}

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            {/* Main Headline */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
                Trade Smarter with{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  AI Magic
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <p className="mt-6 text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Harness the power of advanced AI algorithms to predict market movements,
                optimize your portfolio, and maximize profits across
                <span className="text-cyan-400 font-semibold"> Crypto</span>,
                <span className="text-blue-400 font-semibold"> Forex</span>, and
                <span className="text-purple-400 font-semibold"> Stocks</span>.
              </p>
            </div>

            {/* Stats Row */}
            <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="mt-8 flex flex-wrap justify-center gap-8 sm:gap-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">94.7%</div>
                  <div className="text-sm text-gray-400">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">$2.4M+</div>
                  <div className="text-sm text-gray-400">Profits Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">15K+</div>
                  <div className="text-sm text-gray-400">Active Traders</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 glow-animation">
                  Start Trading Now
                </button>
                <button className="bg-transparent border-2 border-gray-600 hover:border-cyan-400 text-white font-semibold py-4 px-8 rounded-xl hover:bg-gray-800/50 transition-all duration-300 backdrop-blur-sm">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className={`transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Bank-grade Security
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  24/7 AI Monitoring
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No Hidden Fees
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
    </>
  );
}