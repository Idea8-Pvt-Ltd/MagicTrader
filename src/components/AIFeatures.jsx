import React, { useState, useEffect, useRef } from 'react';

const FeatureCard = ({ feature, isActive, onClick, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
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

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div
      ref={cardRef}
      className={`relative cursor-pointer transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      } ${isActive ? 'scale-105 z-20' : 'hover:scale-102'}`}
      onClick={onClick}
    >
      <div className={`relative p-8 rounded-2xl border transition-all duration-500 backdrop-blur-sm ${
        isActive
          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-400/60 shadow-2xl shadow-cyan-500/30'
          : 'bg-gray-800/40 border-gray-600/40 hover:border-gray-500/60 hover:bg-gray-700/50'
      }`}>
        
        {/* Feature Icon with Animation */}
        <div className={`mb-6 relative transition-all duration-500 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>
          <div className={`relative ${isActive && animationPhase > 0 ? 'animate-pulse' : ''}`}>
            {feature.icon}
          </div>
          
          {/* Active indicator rings */}
          {isActive && (
            <>
              <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-ping"></div>
              <div className="absolute inset-0 border border-cyan-400/20 rounded-full animate-pulse"></div>
            </>
          )}
        </div>

        {/* Feature Content */}
        <div className="mb-6">
          <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-gray-200'
          }`}>
            {feature.title}
          </h3>
          <p className={`text-base leading-relaxed transition-colors duration-300 ${
            isActive ? 'text-gray-300' : 'text-gray-400'
          }`}>
            {feature.description}
          </p>
        </div>

        {/* Feature Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {feature.metrics.map((metric, index) => (
            <div key={index} className={`text-center p-3 rounded-lg transition-all duration-300 ${
              isActive ? 'bg-gray-900/50 border border-gray-700/50' : 'bg-gray-900/30'
            }`}>
              <div className={`text-lg font-bold transition-colors duration-300 ${
                isActive ? metric.color : 'text-gray-500'
              }`}>
                {isActive ? metric.value : '---'}
              </div>
              <div className="text-xs text-gray-500 mt-1">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Benefits */}
        <div className="space-y-2">
          {feature.benefits.map((benefit, index) => (
            <div key={index} className={`flex items-center gap-3 transition-all duration-300 ${
              isActive ? 'text-gray-300' : 'text-gray-500'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' : 'bg-gray-600'
              }`}></div>
              <span className="text-sm font-medium">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Active Feature Glow */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/5 to-blue-500/5 animate-pulse"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/50 animate-bounce"></div>
          </>
        )}
      </div>
    </div>
  );
};

const AIVisualization = ({ activeFeature }) => {
  const [processingNodes, setProcessingNodes] = useState([]);
  const [dataFlow, setDataFlow] = useState([]);
  const [aiMetrics, setAiMetrics] = useState({
    processing: 0,
    accuracy: 0,
    signals: 0
  });

  const features = [
    {
      id: 'prediction',
      name: 'Signal Prediction',
      color: '#10b981',
      nodes: 12,
      connections: 8
    },
    {
      id: 'optimization',
      name: 'Portfolio Optimization',
      color: '#06b6d4',
      nodes: 16,
      connections: 12
    },
    {
      id: 'analysis',
      name: 'Risk Analysis',
      color: '#8b5cf6',
      nodes: 10,
      connections: 6
    },
    {
      id: 'execution',
      name: 'Smart Execution',
      color: '#f59e0b',
      nodes: 14,
      connections: 10
    }
  ];

  useEffect(() => {
    const currentFeature = features[activeFeature] || features[0];
    
    // Generate processing nodes
    const nodes = Array.from({ length: currentFeature.nodes }, (_, i) => ({
      id: i,
      x: 50 + (i % 4) * 60,
      y: 40 + Math.floor(i / 4) * 40,
      active: Math.random() > 0.3,
      intensity: Math.random()
    }));
    
    setProcessingNodes(nodes);
    
    // Generate data flow connections
    const connections = Array.from({ length: currentFeature.connections }, (_, i) => {
      const startNode = nodes[Math.floor(Math.random() * nodes.length)];
      const endNode = nodes[Math.floor(Math.random() * nodes.length)];
      return {
        id: i,
        x1: startNode.x,
        y1: startNode.y,
        x2: endNode.x,
        y2: endNode.y,
        active: Math.random() > 0.4
      };
    });
    
    setDataFlow(connections);
    
    // Update AI metrics
    setAiMetrics({
      processing: Math.floor(Math.random() * 500) + 800,
      accuracy: Math.floor(Math.random() * 10) + 90,
      signals: Math.floor(Math.random() * 20) + 15
    });
  }, [activeFeature]);

  return (
    <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-white font-bold text-xl mb-2">
            AI Engine: {features[activeFeature]?.name || 'Signal Prediction'}
          </h4>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Processing</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-cyan-400 font-bold text-2xl">
            {aiMetrics.processing}
          </div>
          <div className="text-gray-400 text-xs">Operations/sec</div>
        </div>
      </div>

      {/* AI Network Visualization */}
      <div className="relative h-48 mb-6">
        <svg width="100%" height="100%" viewBox="0 0 300 180" className="absolute inset-0">
          <defs>
            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={features[activeFeature]?.color || '#10b981'} stopOpacity="0.8" />
              <stop offset="100%" stopColor={features[activeFeature]?.color || '#10b981'} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* Data Flow Connections */}
          {dataFlow.map((connection, index) => (
            <line
              key={connection.id}
              x1={connection.x1}
              y1={connection.y1}
              x2={connection.x2}
              y2={connection.y2}
              stroke={connection.active ? (features[activeFeature]?.color || '#10b981') : '#374151'}
              strokeWidth={connection.active ? '2' : '1'}
              strokeOpacity={connection.active ? '0.8' : '0.3'}
              className={connection.active ? 'animate-pulse' : ''}
            />
          ))}
          
          {/* Processing Nodes */}
          {processingNodes.map((node, index) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.active ? '6' : '3'}
                fill={node.active ? 'url(#nodeGradient)' : '#374151'}
                className={node.active ? 'animate-pulse' : ''}
              />
              {node.active && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="8"
                  fill="none"
                  stroke={features[activeFeature]?.color || '#10b981'}
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  className="animate-ping"
                />
              )}
            </g>
          ))}
        </svg>
        
        {/* Floating Data Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animation: `float ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* AI Performance Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-green-400 font-bold text-xl mb-1">
            {aiMetrics.accuracy}%
          </div>
          <div className="text-gray-400 text-xs">Accuracy Rate</div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div 
              className="h-1 bg-green-400 rounded-full transition-all duration-1000"
              style={{ width: `${aiMetrics.accuracy}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-cyan-400 font-bold text-xl mb-1">
            {aiMetrics.signals}
          </div>
          <div className="text-gray-400 text-xs">Active Signals</div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div 
              className="h-1 bg-cyan-400 rounded-full transition-all duration-1000"
              style={{ width: `${(aiMetrics.signals / 30) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-purple-400 font-bold text-xl mb-1">
            2.3ms
          </div>
          <div className="text-gray-400 text-xs">Response Time</div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div className="h-1 bg-purple-400 rounded-full w-4/5"></div>
          </div>
        </div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default function AIFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const aiFeatures = [
    {
      id: 'prediction',
      title: 'Signal Prediction',
      description: 'Advanced machine learning models analyze market patterns, sentiment, and technical indicators to predict profitable trading opportunities with exceptional accuracy.',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      metrics: [
        { label: 'Accuracy Rate', value: '94.7%', color: 'text-green-400' },
        { label: 'Daily Signals', value: '247', color: 'text-cyan-400' }
      ],
      benefits: [
        'Real-time pattern recognition',
        'Multi-timeframe analysis',
        'Sentiment integration',
        'Backtested algorithms'
      ]
    },
    {
      id: 'optimization',
      title: 'Portfolio Optimization',
      description: 'Intelligent asset allocation and rebalancing based on risk tolerance, market conditions, and correlation analysis to maximize returns while minimizing risk.',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      metrics: [
        { label: 'Risk Reduction', value: '31%', color: 'text-blue-400' },
        { label: 'Return Boost', value: '127%', color: 'text-green-400' }
      ],
      benefits: [
        'Dynamic rebalancing',
        'Correlation analysis',
        'Risk-adjusted returns',
        'Multi-asset allocation'
      ]
    },
    {
      id: 'analysis',
      title: 'Risk Analysis',
      description: 'Comprehensive risk assessment using VaR models, stress testing, and scenario analysis to protect your capital in volatile market conditions.',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      metrics: [
        { label: 'Risk Score', value: '6.2/10', color: 'text-yellow-400' },
        { label: 'Max Drawdown', value: '8.4%', color: 'text-purple-400' }
      ],
      benefits: [
        'Value-at-Risk calculations',
        'Stress testing scenarios',
        'Correlation monitoring',
        'Real-time risk alerts'
      ]
    },
    {
      id: 'execution',
      title: 'Smart Execution',
      description: 'Intelligent order execution with optimal timing, slippage reduction, and market impact minimization using advanced algorithmic trading strategies.',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      metrics: [
        { label: 'Avg Slippage', value: '0.02%', color: 'text-green-400' },
        { label: 'Fill Rate', value: '99.8%', color: 'text-cyan-400' }
      ],
      benefits: [
        'Optimal entry/exit timing',
        'Slippage minimization',
        'Market impact reduction',
        'Multi-exchange routing'
      ]
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
      setActiveFeature(prev => (prev + 1) % aiFeatures.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isVisible, aiFeatures.length]);

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
      `}</style>
      
      <section id="ai-features" ref={sectionRef} className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-5">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="aiGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M80 0L0 0L0 80" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                <circle cx="40" cy="40" r="1.5" fill="currentColor" opacity="0.4"/>
                <circle cx="10" cy="10" r="0.5" fill="currentColor" opacity="0.3"/>
                <circle cx="70" cy="70" r="0.5" fill="currentColor" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#aiGrid)" className="text-cyan-400" />
          </svg>
        </div>
        
        {/* Floating AI Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 30}%`,
                animation: `float ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.7}s`
              }}
            ></div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Powered by <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Advanced AI</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Four core AI technologies working together to revolutionize your trading experience
            </p>
            
            {/* AI Stats */}
            <div className="flex justify-center gap-8 sm:gap-12 text-center">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  1.2B+
                </div>
                <div className="text-sm text-gray-400">Data Points Processed</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
                  847ms
                </div>
                <div className="text-sm text-gray-400">Avg Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-sm text-gray-400">Continuous Learning</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* AI Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {aiFeatures.map((feature, index) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  isActive={activeFeature === index}
                  onClick={() => setActiveFeature(index)}
                  delay={index * 200}
                />
              ))}
            </div>

            {/* AI Visualization */}
            <div className={`sticky top-8 transition-all duration-1000 delay-800 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}>
              <AIVisualization activeFeature={activeFeature} />
              
              {/* AI Capabilities */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Deep Learning', desc: 'Neural networks with 12+ layers', icon: '🧠' },
                  { title: 'Natural Language', desc: 'Market sentiment analysis', icon: '💬' },
                  { title: 'Computer Vision', desc: 'Chart pattern recognition', icon: '👁️' },
                  { title: 'Reinforcement Learning', desc: 'Self-improving algorithms', icon: '🔄' }
                ].map((capability, index) => (
                  <div key={index} className={`bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 transition-all duration-300 ${
                    index === activeFeature ? 'border-cyan-400/50 bg-cyan-500/10' : ''
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{capability.icon}</span>
                      <div>
                        <div className="text-white font-semibold text-sm">{capability.title}</div>
                        <div className="text-gray-400 text-xs">{capability.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className={`text-center mt-20 transition-all duration-1000 delay-1200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/40 max-w-4xl mx-auto relative overflow-hidden">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Experience the Future of AI Trading
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Join thousands of traders who have already discovered the power of our advanced AI algorithms. 
                  Start your journey to smarter trading today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Unlock AI Features
                  </button>
                  <button className="text-cyan-400 hover:text-cyan-300 font-semibold py-4 px-8 border border-cyan-400/50 hover:border-cyan-300/50 rounded-xl transition-all duration-300 backdrop-blur-sm">
                    Learn More About AI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}