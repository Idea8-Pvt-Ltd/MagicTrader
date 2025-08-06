import React from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import SupportedMarkets from './components/SupportedMarkets';
import LiveDemo from './components/LiveDemo';
import Testimonials from './components/Testimonials';

function App() {
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <SupportedMarkets />
      <LiveDemo />
      <Testimonials />
    </Layout>
  );
}

export default App;