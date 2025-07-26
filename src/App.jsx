import React from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="min-h-screen scroll-smooth">  {/* Removed the bg-gradient */}
      <div id="hero" className="scroll-mt-0">
        <Hero />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="cta">
        <CTA />
      </div>
      <Footer />
    </div>
  );
}

export default App;
