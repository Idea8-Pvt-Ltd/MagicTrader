import React, { useState, useEffect } from "react";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950"></div>
      
      {/* Animated Gradient Orbs */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/30 to-cyan-400/20 rounded-full blur-3xl animate-pulse"
        style={{
          top: '10%',
          left: '10%',
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      ></div>
      <div 
        className="absolute w-80 h-80 bg-gradient-to-r from-indigo-500/20 to-blue-600/30 rounded-full blur-3xl animate-pulse delay-1000"
        style={{
          bottom: '20%',
          right: '10%',
          transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`
        }}
      ></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/60 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Hero Content */}
      <div className={`relative z-10 max-w-5xl mx-auto text-center px-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        
        {/* Badge */}
        <div className="inline-flex mt-2 items-center px-4 py-2 mb-8 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
          #1 AI Sales Agent in USA
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
            Close More Deals
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            While You Sleep
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Revolutionary AI outbound calling that converts prospects into customers 24/7. 
          <span className="text-blue-400 font-semibold"> 3x higher conversion rates</span> than traditional cold calling.
        </p>

        {/* AI Visualization */}
        <div className="relative mb-12">
          <div className="w-48 h-48 md:w-64 md:h-64 mx-auto relative">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-spin" style={{animationDuration: '8s'}}></div>
            <div className="absolute inset-4 rounded-full border border-blue-300/40 animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
            
            {/* Center Orb */}
            <div className="absolute inset-8 bg-gradient-to-tr from-blue-500 via-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/20">
              <div className="text-6xl md:text-7xl animate-bounce">🤖</div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-lg">
              ✓
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-lg">
              24/7
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full font-bold text-lg text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button className="px-8 py-4 border-2 border-blue-400/50 rounded-full font-semibold text-lg text-blue-300 hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-md">
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
              10,000+
            </div>
            <div className="text-slate-400">Calls Made Daily</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
              97%
            </div>
            <div className="text-slate-400">Human-Like Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
              $2.3M+
            </div>
            <div className="text-slate-400">Revenue Generated</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;