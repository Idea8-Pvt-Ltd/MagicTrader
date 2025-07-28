import React from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import SupportedMarkets from './components/SupportedMarkets';
import TradingDashboard from './components/TradingDashboard';
import AIFeatures from './components/AIFeatures';
import SuccessStories from './components/SuccessStories';
import JoinWaitlist from './components/JoinWaitlist';

const sectionClass = 'min-h-screen flex flex-col justify-center items-center px-4 max-w-6xl mx-auto w-full py-20 scroll-mt-20';

function App() {
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <SupportedMarkets />
      <TradingDashboard />
      <AIFeatures />
      <SuccessStories />
      <JoinWaitlist />
    </Layout>
  );
}

export default App;
