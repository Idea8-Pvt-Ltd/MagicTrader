import React, { useState, useEffect, useRef } from 'react';

const LivePrice = ({ symbol, initialPrice, change, isActive }) => {
  const [price, setPrice] = useState(initialPrice);
  const [priceChange, setPriceChange] = useState(change);
  const [isIncreasing, setIsIncreasing] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPrice(prev => {
        const variation = (Math.random() - 0.5) * initialPrice * 0.001;
        const newPrice = prev + variation;
        setIsIncreasing(newPrice > prev);
        return Math.max(newPrice, initialPrice * 0.95);
      });
      
      setPriceChange(prev => {
        const newChange = prev + (Math.random() - 0.5) * 0.2;
        return Math.max(-5, Math.min(5, newChange));
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isActive, initialPrice]);

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
      isActive ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-900/30'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          isIncreasing ? 'bg-green-400' : 'bg-red-400'
        } ${isActive ? 'animate-pulse' : ''}`}></div>
        <span className="text-white font-medium text-sm">{symbol}</span>
      </div>
      <div className="text-right">
        <div className="text-white font-bold text-sm">
          ${typeof price === 'number' ? price.toLocaleString() : price}
        </div>
        <div className={`text-xs font-medium ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

const AISignal = ({ signal, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`transform transition-all duration-500 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
    }`}>
      <div className={`p-4 rounded-xl border-l-4 backdrop-blur-sm ${
        signal.type === 'BUY' 
          ? 'bg-green-500/10 border-green-400 shadow-lg shadow-green-500/20' 
          : 'bg-red-500/10 border-red-400 shadow-lg shadow-red-500/20'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded text-xs font-bold ${
              signal.type === 'BUY' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {signal.type}
            </div>
            <span className="text-white font-semibold">{signal.symbol}</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Confidence</div>
            <div className="text-cyan-400 font-bold">{signal.confidence}%</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-gray-400">Entry</div>
            <div className="text-white font-semibold">${signal.entry}</div>
          </div>
          <div>
            <div className="text-gray-400">Target</div>
            <div className="text-green-400 font-semibold">${signal.target}</div>
          </div>
        </div>
        
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-gray-700 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-1000 ${
                signal.type === 'BUY' ? 'bg-green-400' : 'bg-red-400'
              }`}
              style={{ width: `${signal.confidence}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-400">AI Score</span>
        </div>
      </div>
    </div>
  );
};

const PortfolioChart = ({ isActive }) => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [totalValue, setTotalValue] = useState(125450);
  const [totalGain, setTotalGain] = useState(23.7);

  useEffect(() => {
    const generateData = () => {
      const data = [];
      let value = 100000;
      
      for (let i = 0; i < 30; i++) {
        value += (Math.random() - 0.3) * 2000; // Slight upward bias
        data.push({
          x: i * 10,
          y: 120 - ((value - 90000) / 40000) * 100
        });
      }
      
      setPortfolioData(data);
      setTotalValue(value);
      setTotalGain(((value - 100000) / 100000) * 100);
    };

    generateData();
    
    if (isActive) {
      const interval = setInterval(generateData, 3000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const pathData = portfolioData.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-white font-semibold mb-1">Portfolio Performance</h4>
          <div className="text-2xl font-bold text-white">
            ${totalValue.toLocaleString()}
          </div>
          <div className={`text-sm font-medium ${totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalGain >= 0 ? '+' : ''}{totalGain.toFixed(1)}% Total Gain
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 mb-1">30 Days</div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-300">Live</span>
          </div>
        </div>
      </div>

      <svg width="100%" height="120" viewBox="0 0 300 120" className="mb-4">
        <defs>
          <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Chart Area */}
        <path
          d={`${pathData} L300 120 L0 120 Z`}
          fill="url(#portfolioGradient)"
        />
        
        {/* Chart Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
      </svg>

      {/* Asset Allocation */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { name: 'Crypto', percentage: 45, color: 'bg-cyan-500' },
          { name: 'Forex', percentage: 30, color: 'bg-blue-500' },
          { name: 'Stocks', percentage: 25, color: 'bg-purple-500' }
        ].map((asset, index) => (
          <div key={index} className="text-center">
            <div className={`w-full h-2 ${asset.color} rounded-full mb-2 opacity-80`}></div>
            <div className="text-xs text-gray-400">{asset.name}</div>
            <div className="text-sm font-bold text-white">{asset.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RiskMeter = ({ riskLevel = 6.5 }) => {
  const getRiskColor = (level) => {
    if (level < 4) return 'text-green-400';
    if (level < 7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLabel = (level) => {
    if (level < 4) return 'Low Risk';
    if (level < 7) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <h4 className="text-white font-semibold mb-4">Risk Assessment</h4>
      
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={getRiskColor(riskLevel)}
              style={{
                strokeDasharray: `${2 * Math.PI * 40}`,
                strokeDashoffset: `${2 * Math.PI * 40 * (1 - riskLevel / 10)}`,
                transition: 'stroke-dashoffset 1s ease-in-out'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${getRiskColor(riskLevel)}`}>
              {riskLevel}
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <div className={`font-semibold ${getRiskColor(riskLevel)}`}>
          {getRiskLabel(riskLevel)}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Portfolio Risk Score
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        {[
          { label: 'Diversification', score: 8.5, color: 'bg-green-500' },
          { label: 'Volatility', score: 6.2, color: 'bg-yellow-500' },
          { label: 'Correlation', score: 4.8, color: 'bg-blue-500' }
        ].map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{metric.label}</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 bg-gray-700 rounded-full">
                <div 
                  className={`h-1 ${metric.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${metric.score * 10}%` }}
                ></div>
              </div>
              <span className="text-xs text-white font-medium w-8">
                {metric.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function LiveDemo() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeDemo, setActiveDemo] = useState(true);
  const [currentSignalIndex, setCurrentSignalIndex] = useState(0);
  const sectionRef = useRef(null);

  const marketPrices = [
    { symbol: 'BTC/USD', price: 42350, change: 2.4 },
    { symbol: 'ETH/USD', price: 2650, change: -1.2 },
    { symbol: 'EUR/USD', price: 1.0945, change: 0.3 },
    { symbol: 'AAPL', price: 178.50, change: 1.8 },
    { symbol: 'GOOGL', price: 2845, change: -0.5 }
  ];

  const aiSignals = [
    {
      type: 'BUY',
      symbol: 'BTC/USD',
      confidence: 94,
      entry: '42,100',
      target: '44,500',
      timestamp: '2 min ago'
    },
    {
      type: 'SELL',
      symbol: 'EUR/USD',
      confidence: 87,
      entry: '1.0950',
      target: '1.0890',
      timestamp: '5 min ago'
    },
    {
      type: 'BUY',
      symbol: 'AAPL',
      confidence: 91,
      entry: '178.20',
      target: '185.00',
      timestamp: '8 min ago'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setActiveDemo(true);
        } else {
          setActiveDemo(false);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activeDemo) return;

    const interval = setInterval(() => {
      setCurrentSignalIndex(prev => (prev + 1) % aiSignals.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeDemo, aiSignals.length]);

  return (
    <section id="live-demo" ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-green-400/20 animate-pulse"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Live Trading <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">Dashboard</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            See MagicTrader's AI in action with real-time market analysis, signals, and portfolio management
          </p>
          
          {/* Demo Status */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live Demo Active</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-cyan-400 text-sm font-medium">{aiSignals.length} Active Signals</span>
            </div>
          </div>
        </div>

        {/* Demo Dashboard */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Market Prices */}
          <div className={`space-y-6 transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}>
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Live Market Prices
              </h3>
              <div className="space-y-3">
                {marketPrices.map((market, index) => (
                  <LivePrice
                    key={market.symbol}
                    symbol={market.symbol}
                    initialPrice={market.price}
                    change={market.change}
                    isActive={activeDemo}
                  />
                ))}
              </div>
            </div>

            <RiskMeter />
          </div>

          {/* Center Column - Portfolio Chart */}
          <div className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <PortfolioChart isActive={activeDemo} />
            
            {/* Trading Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Trades Today', value: '23', color: 'text-cyan-400' },
                { label: 'Win Rate', value: '94.2%', color: 'text-green-400' },
                { label: 'Active Positions', value: '7', color: 'text-blue-400' },
                { label: 'P&L Today', value: '+$2,847', color: 'text-green-400' }
              ].map((stat, index) => (
                <div key={index} className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
                  <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - AI Signals */}
          <div className={`space-y-6 transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Trading Signals
              </h3>
              
              <div className="space-y-4">
                {aiSignals.map((signal, index) => (
                  <AISignal
                    key={index}
                    signal={signal}
                    delay={index === currentSignalIndex ? 0 : 1000}
                  />
                ))}
              </div>
            </div>

            {/* AI Performance Metrics */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h4 className="text-white font-semibold mb-4">AI Performance</h4>
              <div className="space-y-4">
                {[
                  { metric: 'Signal Accuracy', value: 94.7, max: 100, color: 'bg-green-500' },
                  { metric: 'Processing Speed', value: 89, max: 100, color: 'bg-cyan-500' },
                  { metric: 'Market Coverage', value: 96, max: 100, color: 'bg-blue-500' }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">{item.metric}</span>
                      <span className="text-sm font-bold text-white">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 ${item.color} rounded-full transition-all duration-2000 ease-out`}
                        style={{ 
                          width: isVisible ? `${item.value}%` : '0%',
                          transitionDelay: `${index * 200}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/50 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Experience the Power of AI Trading
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              This is just a glimpse of what MagicTrader can do. Get access to the full platform with advanced features, 
              unlimited signals, and 24/7 AI monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Start Free Trial
              </button>
              <button className="text-cyan-400 hover:text-cyan-300 font-semibold py-4 px-8 border border-cyan-400/50 hover:border-cyan-300/50 rounded-xl transition-all duration-300 backdrop-blur-sm">
                Schedule Demo Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}