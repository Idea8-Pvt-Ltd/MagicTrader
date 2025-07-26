import React, { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    title: "VP Sales at TechFlow Solutions",
    quote: "Increased our qualified leads by 300% in just 2 months. The ROI is incredible - we've already recovered our investment 10x over.",
    company: "TechFlow",
    avatar: "SC",
    color: "from-blue-500 to-cyan-400",
    metric: "300% Lead Increase"
  },
  {
    name: "Mike Rodriguez",
    title: "Sales Director at GrowthCorp",
    quote: "The AI sounds so natural, our prospects can't tell the difference. It's like having 50 seasoned sales reps working 24/7.",
    company: "GrowthCorp",
    avatar: "MR",
    color: "from-indigo-500 to-blue-500",
    metric: "24/7 Coverage"
  },
  {
    name: "Lisa Park",
    title: "Founder at ScaleUp Inc",
    quote: "Finally, a sales team that never sleeps. Game-changer for our pipeline - we're closing deals in different time zones effortlessly.",
    company: "ScaleUp",
    avatar: "LP",
    color: "from-cyan-500 to-blue-600",
    metric: "Global Reach"
  },
];

const Testimonials = () => {
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

    const section = document.getElementById('testimonials-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="testimonials-section"
      className="relative w-full py-20 px-4 bg-slate-900 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-blue-950/50"></div>
      
      {/* Animated Background Orbs */}
      <div className="absolute top-32 left-20 w-64 h-64 bg-gradient-to-r from-blue-600/15 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      <div className="absolute bottom-32 right-20 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-blue-500/15 rounded-full blur-3xl animate-pulse delay-1500"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
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
            <Star size={16} className="text-yellow-400 fill-yellow-400 mr-2" />
            Trusted by 500+ Companies
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
              Success Stories from
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            See how top sales teams are crushing their targets with SalesB2B AI
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`group relative transform transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${idx * 200}ms` }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card Container */}
              <div className="relative h-full p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
                
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${testimonial.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm`}></div>
                
                {/* Quote Icon */}
                <div className="relative mb-6">
                  <Quote size={32} className="text-blue-400/60" />
                </div>

                {/* 5-Star Rating */}
                <div className="flex mb-6 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      className={`text-yellow-400 fill-yellow-400 transition-all duration-300 ${hoveredIndex === idx ? 'scale-110' : ''}`}
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg text-slate-200 font-medium mb-6 leading-relaxed italic group-hover:text-white transition-colors duration-300">
                  "{testimonial.quote}"
                </blockquote>

                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-lg transform transition-all duration-300 ${hoveredIndex === idx ? 'scale-110' : ''}`}>
                    {testimonial.avatar}
                  </div>
                  
                  {/* Name & Title */}
                  <div className="flex-1">
                    <div className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors duration-300">
                      {testimonial.name}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {testimonial.title}
                    </div>
                  </div>
                </div>

                {/* Company Badge */}
                <div className="absolute top-6 right-6">
                  <div className="px-3 py-1 bg-slate-800/80 backdrop-blur-md border border-slate-600 rounded-full text-xs font-medium text-slate-300">
                    {testimonial.company}
                  </div>
                </div>

                {/* Metric Badge */}
                <div className="absolute -top-3 -left-3">
                  <div className={`px-3 py-1 bg-gradient-to-r ${testimonial.color} rounded-full text-xs font-bold text-white shadow-lg transition-all duration-300 ${hoveredIndex === idx ? 'scale-110' : 'scale-100'}`}>
                    {testimonial.metric}
                  </div>
                </div>

                {/* Hover Effect Line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${testimonial.color} rounded-b-2xl transition-all duration-300 ${hoveredIndex === idx ? 'w-full' : 'w-0'}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className={`mt-16 text-center transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { stat: "500+", label: "Happy Customers" },
              { stat: "98%", label: "Satisfaction Rate" },
              { stat: "$10M+", label: "Revenue Generated" },
              { stat: "24/7", label: "Support Available" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-1">
                  {item.stat}
                </div>
                <div className="text-slate-400 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-12 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full font-bold text-lg text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <span className="relative z-10">Join Our Success Stories</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;