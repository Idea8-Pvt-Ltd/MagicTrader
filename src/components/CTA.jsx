import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Clock, CreditCard } from "lucide-react";

const CTA = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('cta-section');
    if (section) observer.observe(section);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      id="cta-section"
      className="relative w-full py-20 px-4 bg-slate-900 overflow-hidden"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950"></div>
      
      {/* Interactive Background Orbs */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/25 to-cyan-400/15 rounded-full blur-3xl animate-pulse"
        style={{
          top: '20%',
          left: '20%',
          transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`
        }}
      ></div>
      <div 
        className="absolute w-80 h-80 bg-gradient-to-r from-indigo-500/20 to-blue-600/25 rounded-full blur-3xl animate-pulse delay-1000"
        style={{
          bottom: '10%',
          right: '15%',
          transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`
        }}
      ></div>
      
      {/* Center Spotlight Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-900/50"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Urgency Badge */}
        <div className={`inline-flex items-center px-4 py-2 mb-8 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md border border-orange-400/30 rounded-full text-orange-300 text-sm font-medium transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <Clock size={16} className="mr-2" />
          Limited Time: 50% Off First 3 Months
        </div>

        {/* Main Headline */}
        <h2 className={`text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <span className="bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
            Ready to 10x Your
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Sales Pipeline?
          </span>
        </h2>

        {/* Subheadline */}
        <p className={`text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl leading-relaxed transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          Join <span className="text-blue-400 font-bold">500+ companies</span> already using SalesB2B AI to close more deals while their competitors sleep.
        </p>

        {/* Social Proof Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 w-full max-w-2xl transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          {[
            { number: "300%", label: "Avg Lead Increase" },
            { number: "24/7", label: "Always Working" },
            { number: "97%", label: "Human Accuracy" },
            { number: "$2.3M+", label: "Revenue Generated" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-1">
                {stat.number}
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 mb-8 w-full justify-center transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full font-bold text-xl text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <span className="relative z-10 flex items-center justify-center">
              Start Free Trial
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button className="group px-10 py-5 border-2 border-blue-400/50 rounded-full font-bold text-xl text-blue-300 hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-md hover:border-blue-300 hover:text-white">
            <span className="flex items-center justify-center">
              Book Free Demo
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-400 text-sm transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="flex items-center">
            <CreditCard size={16} className="mr-2 text-green-400" />
            No credit card required
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-blue-400" />
            Setup in 60 seconds
          </div>
          <div className="flex items-center">
            <CheckCircle size={16} className="mr-2 text-green-400" />
            Cancel anytime
          </div>
        </div>

        {/* Risk Reversal */}
        <div className={`mt-8 p-6 bg-green-500/10 backdrop-blur-md border border-green-400/30 rounded-2xl max-w-2xl transform transition-all duration-1000 delay-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="flex items-center justify-center mb-3">
            <CheckCircle size={24} className="text-green-400 mr-3" />
            <span className="text-green-300 font-bold text-lg">30-Day Money-Back Guarantee</span>
          </div>
          <p className="text-slate-300 text-center">
            Try SalesB2B risk-free. If you don't see results in 30 days, we'll refund every penny.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;