import React, { useState, useEffect } from "react";
import { PhoneCall, User, MailCheck } from "lucide-react";

const features = [
  {
    title: "24/7 Automated Calling",
    description: "Never miss a lead with AI that works around the clock, handling thousands of prospects simultaneously while you focus on closing deals.",
    icon: PhoneCall,
    color: "from-blue-500 to-cyan-400",
    stats: "10K+ calls/day"
  },
  {
    title: "Human-Like Voice AI",
    description: "Advanced conversational AI that adapts tone, pace, and personality to build genuine rapport with each prospect automatically.",
    icon: User,
    color: "from-indigo-500 to-blue-500",
    stats: "97% human accuracy"
  },
  {
    title: "Smart Email Follow-ups",
    description: "Intelligent email sequences that automatically personalize content based on call outcomes and prospect behavior patterns.",
    icon: MailCheck,
    color: "from-cyan-500 to-blue-600",
    stats: "3x higher open rates"
  },
];

const Features = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('features-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="features-section"
      className="relative w-full py-20 px-4 bg-slate-900 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-slate-900 to-indigo-950/50"></div>
      
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-600/20 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-indigo-500/15 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
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

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
            Powerful AI Features
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
              Why Sales Teams Choose
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SalesB2B AI
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Advanced AI technology that transforms how you connect with prospects and close deals faster than ever before.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className={`group relative transform transition-all duration-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${idx * 200}ms` }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Card Background */}
                <div className="relative h-full p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
                  
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm`}></div>
                  
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-2xl transform transition-all duration-300 ${hoveredIndex === idx ? 'scale-110 rotate-6' : ''}`}>
                      <IconComponent size={36} className="text-white" />
                    </div>
                    
                    {/* Stats Badge */}
                    <div className="absolute -top-2 -right-2 px-3 py-1 bg-green-500 rounded-full text-xs font-bold text-white shadow-lg animate-pulse">
                      {feature.stats}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Effect Lines */}
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl transition-all duration-300 ${hoveredIndex === idx ? 'w-full' : 'w-0'}`}></div>
                </div>

                {/* Floating Elements */}
                <div className={`absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full transition-all duration-300 ${hoveredIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full transition-all duration-300 ${hoveredIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full font-bold text-lg text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <span className="relative z-10">See All Features</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;