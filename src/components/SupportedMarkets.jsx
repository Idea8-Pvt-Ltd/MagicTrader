import React, { useState, useEffect, useRef } from 'react';

const MarketCard = ({ market, isActive, onClick, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(market.basePrice);
  const [priceChange, setPriceChange] = useState(market.change);
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
      const variation = (Math.random() - 0.5) * market.volatility;
      setCurrentPrice(prev => Math.max(prev + variation, market.basePrice * 0.9));
      setPriceChange(prev => {
        const newChange = prev + (Math.random() - 0.5) * 0.5;
        return Math.max(-5, Math.min(5, newChange));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, market]);

  return (
    <div
      ref={cardRef}
      className={`relative cursor-pointer transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      } ${isActive ? 'scale-105 z-10' : 'hover:scale-102'}`}
      onClick={onClick}
    >
      <div className={`relative p-6 rounded-2xl border transition-all duration-500 backdrop-blur-sm ${
        isActive
          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-400/60 shadow-2xl shadow-cyan-500/25'
          : 'bg-gray-800/60 border-gray-600/40 hover:border-gray-500/60 hover:bg-gray-700/60'
      }`}>
        {/* Market Icon */}
        <div className={`mb-4 transition-all duration-300 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>
          {market.icon}
        </div>

        {/* Market Info */}
        <div className="mb-4">
          <h3 className={`text-xl font-bold mb-1 transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-gray-200'
          }`}>
            {market.name}
          </h3>
          <p className={`text-sm transition-colors duration-300 ${
            isActive ? 'text-gray-300' : 'text-gray-400'
          }`}>
            {market.description}
          </p>
        </div>

        {/* Live Price (when active) */}
        {isActive && (
          <div className="mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Live Price</span>
              <span className={`text-xs font-medium ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
            <div className="text-lg font-bold text-white">
              ${currentPrice.toLocaleString()}
            </div>
          </div>
        )}

        {/* Market Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center">
            <div className={`text-sm font-bold transition-colors duration-300 ${
              isActive ? 'text-cyan-400' : 'text-gray-400'
            }`}>
              {market.pairs}+
            </div>
            <div className="text-xs text-gray-500">Pairs</div>
          </div>
          <div className="text-center">
            <div className={`text-sm font-bold transition-colors duration-300 ${
              isActive ? 'text-green-400' : 'text-gray-400'
            }`}>
              {market.accuracy}%
            </div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
        </div>

        {/* Popular Assets */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500 mb-2">Popular Assets</div>
          <div className="flex flex-wrap gap-2">
            {market.popularAssets.map((asset, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-gray-700/50 text-gray-400'
                }`}
              >
                {asset}
              </span>
            ))}
          </div>
        </div>

        {/* Active Glow */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 to-blue-500/10 animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
          </>
        )}
      </div>
    </div>
  );
};

const TradingChart = ({ market }) => {
  const [chartData, setChartData] = useState([]);
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const generateChartData = () => {
      const data = [];
      const newSignals = [];
      let price = market.basePrice;

      for (let i = 0; i < 30; i++) {
        price += (Math.random() - 0.5) * market.volatility;
        data.push({
          x: i * 10,
          y: 100 - ((price - market.basePrice * 0.9) / (market.basePrice * 0.2)) * 80
        });

        if (i % 6 === 0 && i > 0) {
          newSignals.push({
            x: i * 10,
            y: 100 - ((price - market.basePrice * 0.9) / (market.basePrice * 0.2)) * 80,
            type: Math.random() > 0.5 ? 'buy' : 'sell',
            strength: Math.random() * 40 + 60
          });
        }
      }

      setChartData(data);
      setSignals(newSignals);
    };

    generateChartData();
    const interval = setInterval(generateChartData, 4000);
    return () => clearInterval(interval);
  }, [market]);

  const pathData = chartData.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-white font-semibold">{market.name} Analysis</h4>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>

      <svg width="100%" height="150" viewBox="0 0 300 150" className="mb-4">
        <defs>
          <linearGradient id={`gradient-${market.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Chart Area */}
        <path
          d={`${pathData} L300 150 L0 150 Z`}
          fill={`url(#gradient-${market.id})`}
        />
        
        {/* Chart Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        
        {/* AI Signals */}
        {signals.map((signal, index) => (
          <g key={index}>
            <circle
              cx={signal.x}
              cy={signal.y}
              r="6"
              fill={signal.type === 'buy' ? '#10b981' : '#ef4444'}
              fillOpacity="0.2"
              className="animate-ping"
            />
            <circle
              cx={signal.x}
              cy={signal.y}
              r="3"
              fill={signal.type === 'buy' ? '#10b981' : '#ef4444'}
            />
            <text
              x={signal.x}
              y={signal.y - 10}
              textAnchor="middle"
              className="text-xs fill-white font-medium"
            >
              {signal.type.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>

      {/* Market Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-cyan-400 font-bold text-lg">
            {market.dailyVolume}
          </div>
          <div className="text-gray-400 text-xs">24h Volume</div>
        </div>
        <div>
          <div className="text-green-400 font-bold text-lg">
            {market.accuracy}%
          </div>
          <div className="text-gray-400 text-xs">AI Accuracy</div>
        </div>
        <div>
          <div className="text-purple-400 font-bold text-lg">
            {signals.length}
          </div>
          <div className="text-gray-400 text-xs">Active Signals</div>
        </div>
      </div>
    </div>
  );
};

export default function SupportedMarkets() {
  const [activeMarket, setActiveMarket] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const markets = [
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      description: 'Trade 500+ digital assets with advanced AI predictions',
      basePrice: 42350,
      change: 2.4,
      volatility: 150,
      pairs: 500,
      accuracy: 94,
      dailyVolume: '$2.4B',
      popularAssets: ['BTC', 'ETH', 'ADA', 'SOL', 'MATIC'],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'forex',
      name: 'Foreign Exchange',
      description: 'Major and minor currency pairs with precision timing',
      basePrice: 1.2450,
      change: -0.3,
      volatility: 0.002,
      pairs: 80,
      accuracy: 92,
      dailyVolume: '$6.6T',
      popularAssets: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'stocks',
      name: 'Stock Market',
      description: 'Global equities from NYSE, NASDAQ, and international exchanges',
      basePrice: 445.67,
      change: 1.2,
      volatility: 5,
      pairs: 3000,
      accuracy: 89,
      dailyVolume: '$200B',
      popularAssets: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
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
      setActiveMarket(prev => (prev + 1) % markets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible, markets.length]);

  return (
    <section id="markets" ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-transparent to-blue-600/20 animate-pulse"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="marketGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0L0 0L0 60" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#marketGrid)" className="text-cyan-400" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Supported <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Markets</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Trade across multiple asset classes with unified AI-powered insights
          </p>
          
          {/* Global Stats */}
          <div className="flex justify-center gap-8 sm:gap-12 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-400">3,580+</div>
              <div className="text-sm text-gray-400">Trading Pairs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">$9.2T+</div>
              <div className="text-sm text-gray-400">Daily Volume</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">92%</div>
              <div className="text-sm text-gray-400">Avg. Accuracy</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Market Cards */}
          <div className="space-y-6">
            {markets.map((market, index) => (
              <MarketCard
                key={market.id}
                market={market}
                isActive={activeMarket === index}
                onClick={() => setActiveMarket(index)}
                delay={index * 200}
              />
            ))}
          </div>

          {/* Trading Visualization */}
          <div className={`sticky top-8 transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <TradingChart market={markets[activeMarket]} />
            
            {/* Market Features */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Real-time Data', desc: 'Live market feeds', icon: '⚡' },
                { title: 'Multi-timeframe', desc: '1m to 1D analysis', icon: '📊' },
                { title: 'Risk Management', desc: 'Auto stop-loss', icon: '🛡️' },
                { title: 'Portfolio Sync', desc: 'Cross-asset optimization', icon: '🔄' }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <div className="text-white font-semibold text-sm">{feature.title}</div>
                      <div className="text-gray-400 text-xs">{feature.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/40 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Trade Across All Markets?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get access to our comprehensive trading platform with AI insights across crypto, forex, and stock markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Start Trading
              </button>
              <button className="text-cyan-400 hover:text-cyan-300 font-semibold py-3 px-8 border border-cyan-400/50 hover:border-cyan-300/50 rounded-xl transition-all duration-300 backdrop-blur-sm">
                View All Markets
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}