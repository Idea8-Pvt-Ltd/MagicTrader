import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const startCount = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * (end - startCount) + startCount));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

const ProcessStep = ({ step, title, description, icon, isActive, onClick, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const stepRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );

    if (stepRef.current) {
      observer.observe(stepRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={stepRef}
      className={`relative cursor-pointer transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${isActive ? 'scale-105' : 'hover:scale-102'}`}
      onClick={onClick}
    >
      <div className={`relative p-6 rounded-2xl border transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
          : 'bg-gray-800/40 border-gray-700/50 hover:border-gray-600/70'
      }`}>
        {/* Step Number */}
        <div className={`absolute -top-4 -left-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
            : 'bg-gray-700 text-gray-300'
        }`}>
          {step}
        </div>

        {/* Icon */}
        <div className={`mb-4 transition-all duration-300 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>
          {icon}
        </div>

        {/* Content */}
        <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
          isActive ? 'text-white' : 'text-gray-200'
        }`}>
          {title}
        </h3>
        
        <p className={`text-sm leading-relaxed transition-colors duration-300 ${
          isActive ? 'text-gray-300' : 'text-gray-400'
        }`}>
          {description}
        </p>

        {/* Active Glow Effect */}
        {isActive && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/5 to-blue-500/5 animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

const TradingVisualization = ({ activeStep }) => {
  const [dataPoints, setDataPoints] = useState([]);
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    // Generate sample data based on active step
    const generateData = () => {
      const points = [];
      const newSignals = [];
      
      for (let i = 0; i < 20; i++) {
        const value = 50 + Math.sin(i * 0.5) * 20 + (Math.random() - 0.5) * 10;
        points.push({ x: i * 15, y: value });
        
        if (i % 4 === 0 && activeStep >= 2) {
          newSignals.push({
            x: i * 15,
            y: value,
            type: Math.random() > 0.5 ? 'buy' : 'sell',
            confidence: Math.random() * 40 + 60
          });
        }
      }
      
      setDataPoints(points);
      setSignals(newSignals);
    };

    generateData();
    const interval = setInterval(generateData, 3000);
    return () => clearInterval(interval);
  }, [activeStep]);

  const pathData = dataPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div>
      
      <img src="media/mobile.png" alt="Mobile app screenshot" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px] lg:w-[550px]" />
 
    </div>
  );
};

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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
      setActiveStep(prev => prev === 4 ? 1 : prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const steps = [
    {
      title: "Connect Your Accounts",
      description: "Securely link your trading accounts from major exchanges. Our bank-grade encryption ensures your data stays protected while our AI gets to work.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    {
      title: "AI Market Analysis",
      description: "Our advanced algorithms analyze thousands of data points across crypto, forex, and stock markets in real-time, identifying profitable opportunities.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Smart Signal Generation",
      description: "Receive precise buy/sell signals with confidence scores, risk assessments, and optimal entry/exit points based on AI predictions.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Automated Execution",
      description: "Execute trades automatically or review recommendations first. Set your risk tolerance and let our AI optimize your portfolio 24/7.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
              <path d="M2,2 L8,2 L8,8 L14,8" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" className="text-cyan-400" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            How <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">MagicTrader</span> Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Four simple steps to transform your trading with the power of artificial intelligence
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <ProcessStep
                key={index}
                step={index + 1}
                title={step.title}
                description={step.description}
                icon={step.icon}
                isActive={activeStep === index + 1}
                onClick={() => setActiveStep(index + 1)}
                delay={index * 200}
              />
            ))}
          </div>

          {/* Trading Visualization */}
          <div className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <TradingVisualization activeStep={activeStep} />
            
            {/* Features List */}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/30">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Trading Smarter?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of traders who have already discovered the power of AI-driven trading strategies.
            </p>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}