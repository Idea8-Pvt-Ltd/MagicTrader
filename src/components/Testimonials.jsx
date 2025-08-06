import React, { useState, useEffect, useRef } from 'react';

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
      const threadCount = Math.floor((window.innerWidth * window.innerHeight) / 25000);
      
      for (let i = 0; i < threadCount; i++) {
        threadsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          connections: [],
          opacity: Math.random() * 0.4 + 0.2
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const maxDistance = 120;
      
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
            const opacity = (1 - distance / maxDistance) * 0.2;
            
            // Create gradient for thread
            const gradient = ctx.createLinearGradient(thread.x, thread.y, otherThread.x, otherThread.y);
            gradient.addColorStop(0, `rgba(6, 182, 212, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(59, 130, 246, ${opacity})`);
            gradient.addColorStop(1, `rgba(147, 51, 234, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(thread.x, thread.y);
            ctx.lineTo(otherThread.x, otherThread.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      threadsRef.current.forEach(thread => {
        const gradient = ctx.createRadialGradient(thread.x, thread.y, 0, thread.x, thread.y, 2);
        gradient.addColorStop(0, `rgba(6, 182, 212, ${thread.opacity})`);
        gradient.addColorStop(1, `rgba(6, 182, 212, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(thread.x, thread.y, 1.5, 0, Math.PI * 2);
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
      className="absolute inset-0 w-full h-full opacity-30"
      style={{ background: 'transparent' }}
    />
  );
};

const TestimonialCard = ({ testimonial, isActive, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`relative transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      } ${isActive ? 'scale-105 z-20' : ''}`}
    >
      <div className={`relative p-8 rounded-2xl backdrop-blur-sm transition-all duration-500 ${
        isActive
          ? 'bg-gray-800/60 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/20'
          : 'bg-gray-800/40 border border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/60'
      }`}>
        
        {/* Quote Icon */}
        <div className={`mb-6 transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-gray-500'}`}>
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
          </svg>
        </div>

        {/* Testimonial Content */}
        <div className="mb-6">
          <p className={`text-lg leading-relaxed mb-4 transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-gray-300'
          }`}>
            "{testimonial.content}"
          </p>
          
          {/* Rating Stars */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 transition-colors duration-300 ${
                  i < testimonial.rating 
                    ? (isActive ? 'text-yellow-400' : 'text-yellow-500') 
                    : 'text-gray-600'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${
            isActive 
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg' 
              : 'bg-gray-700'
          }`}>
            {testimonial.author.charAt(0)}
          </div>
          
          <div>
            <div className={`font-semibold transition-colors duration-300 ${
              isActive ? 'text-white' : 'text-gray-200'
            }`}>
              {testimonial.author}
            </div>
            <div className="text-sm text-gray-400">{testimonial.role}</div>
            <div className="text-xs text-gray-500">{testimonial.location}</div>
          </div>
        </div>

        {/* Trading Stats */}
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className={`font-bold text-lg transition-colors duration-300 ${
                isActive ? testimonial.stats.profit.color : 'text-gray-500'
              }`}>
                {testimonial.stats.profit.value}
              </div>
              <div className="text-xs text-gray-500">Total Profit</div>
            </div>
            <div>
              <div className={`font-bold text-lg transition-colors duration-300 ${
                isActive ? testimonial.stats.timeUsing.color : 'text-gray-500'
              }`}>
                {testimonial.stats.timeUsing.value}
              </div>
              <div className="text-xs text-gray-500">Using MagicTrader</div>
            </div>
          </div>
        </div>

        {/* Active Glow Effect */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/5 to-blue-500/5 animate-pulse pointer-events-none"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse"></div>
          </>
        )}
      </div>
    </div>
  );
};

const TrustBadge = ({ badge, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const badgeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.5 }
    );

    if (badgeRef.current) {
      observer.observe(badgeRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={badgeRef}
      className={`transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:bg-gray-800/60 hover:border-gray-600/60 transition-all duration-300">
        <div className="text-3xl mb-3">{badge.icon}</div>
        <div className="text-white font-semibold mb-2">{badge.title}</div>
        <div className="text-sm text-gray-400">{badge.description}</div>
      </div>
    </div>
  );
};

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      content: "MagicTrader's AI has completely transformed my trading strategy. In just 6 months, I've seen a 340% increase in my portfolio. The signal accuracy is incredible, and the risk management features have saved me from major losses multiple times.",
      author: "Sarah Chen",
      role: "Senior Crypto Trader",
      location: "Singapore",
      rating: 5,
      stats: {
        profit: { value: "+340%", color: "text-green-400" },
        timeUsing: { value: "6 months", color: "text-cyan-400" }
      }
    },
    {
      id: 2,
      content: "As a professional forex trader, I was skeptical about AI trading tools. But MagicTrader proved me wrong. The multi-timeframe analysis and sentiment integration have given me an edge I never had before. My win rate improved from 60% to 94%.",
      author: "Marcus Rodriguez",
      role: "Professional Forex Trader",
      location: "London, UK",
      rating: 5,
      stats: {
        profit: { value: "+180%", color: "text-green-400" },
        timeUsing: { value: "1 year", color: "text-cyan-400" }
      }
    },
    {
      id: 3,
      content: "The portfolio optimization feature is a game-changer. MagicTrader automatically rebalances my investments across crypto, stocks, and forex. I'm making consistent profits while sleeping! The AI handles everything with incredible precision.",
      author: "Jennifer Kim",
      role: "Portfolio Manager",
      location: "New York, USA",
      rating: 5,
      stats: {
        profit: { value: "+275%", color: "text-green-400" },
        timeUsing: { value: "8 months", color: "text-cyan-400" }
      }
    },
    {
      id: 4,
      content: "I started with zero trading experience. MagicTrader's AI taught me everything through its smart execution system. Now I'm consistently profitable and understand market patterns I never would have seen on my own. It's like having a mentor 24/7.",
      author: "David Thompson",
      role: "Beginner Trader",
      location: "Toronto, Canada",
      rating: 5,
      stats: {
        profit: { value: "+150%", color: "text-green-400" },
        timeUsing: { value: "4 months", color: "text-cyan-400" }
      }
    },
    {
      id: 5,
      content: "The risk analysis capabilities are outstanding. MagicTrader flagged potential market crashes days before they happened, protecting my entire portfolio. The AI's predictive power is unlike anything I've seen in 15 years of trading.",
      author: "Alexandra Walsh",
      role: "Investment Analyst",
      location: "Sydney, Australia",
      rating: 5,
      stats: {
        profit: { value: "+220%", color: "text-green-400" },
        timeUsing: { value: "10 months", color: "text-cyan-400" }
      }
    },
    {
      id: 6,
      content: "MagicTrader handles my entire trading operation. From signal generation to execution, everything is automated and optimized. I've reduced my daily trading time from 8 hours to 30 minutes while tripling my returns. It's revolutionary.",
      author: "Robert Chang",
      role: "Day Trader",
      location: "Hong Kong",
      rating: 5,
      stats: {
        profit: { value: "+310%", color: "text-green-400" },
        timeUsing: { value: "7 months", color: "text-cyan-400" }
      }
    }
  ];

  const trustBadges = [
    {
      icon: "🏆",
      title: "15,000+ Active Users",
      description: "Trusted by traders worldwide"
    },
    {
      icon: "💎",
      title: "$2.4M+ Profits Generated",
      description: "Total returns for our community"
    },
    {
      icon: "🔒",
      title: "Bank-Grade Security",
      description: "Your data is always protected"
    },
    {
      icon: "⚡",
      title: "99.9% Uptime",
      description: "Always available when you need it"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible, testimonials.length]);

  return (
    <section id="testimonials" ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Threads Background */}
      <ThreadsBackground />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Trusted by <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Traders Worldwide</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join thousands of successful traders who have transformed their portfolios with MagicTrader's AI
          </p>
          
          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-white font-bold text-xl">4.9/5</span>
            <span className="text-gray-400">from 2,847 reviews</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              isActive={activeTestimonial === index}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Trust Badges */}
        <div className={`transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Why Traders Trust MagicTrader</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Built with enterprise-grade security and reliability to handle your most important trades
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <TrustBadge
                key={index}
                badge={badge}
                delay={index * 150}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/50 max-w-4xl mx-auto relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Join Our Success Stories?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Start your journey with MagicTrader today and discover why thousands of traders trust our AI to grow their portfolios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Start Free Trial
                </button>
                <button className="text-cyan-400 hover:text-cyan-300 font-semibold py-4 px-8 border border-cyan-400/50 hover:border-cyan-300/50 rounded-xl transition-all duration-300 backdrop-blur-sm">
                  Read More Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}