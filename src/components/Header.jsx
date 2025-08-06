import React, { useState } from 'react';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Markets', href: '#markets' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Testimonials', href: '#testimonials' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#111827]/95 backdrop-blur-md border-b border-[#222a36]/70 shadow-lg transition-all">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 h-16">
        {/* Logo/Wordmark */}
        <a href="#hero" className="text-2xl font-extrabold tracking-tight text-white select-none">
          MagicTrader
        </a>
        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 text-gray-100 font-medium">
          {navLinks.map(link => (
            <li key={link.name}>
              <a href={link.href} className="hover:text-primary transition-colors duration-200">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        {/* CTA Button (Desktop) */}
        <div className="hidden md:block">
          <a href="#waitlist" className="bg-[#222a36] text-cyan-300 font-semibold py-2 px-6 rounded-lg shadow hover:bg-cyan-900/80 hover:text-white transition-all">
            Join Waitlist
          </a>
        </div>
        {/* Hamburger (Mobile) */}
        <button
          className="md:hidden text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu">
            <path d="M4 8h20M4 16h20" />
          </svg>
        </button>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-background/40 px-4 pb-4 pt-2">
          <ul className="flex flex-col gap-4 text-white font-medium">
            {navLinks.map(link => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="block py-2 px-2 rounded hover:bg-background hover:text-primary transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <a href="#waitlist" className="bg-primary w-full block text-center text-background font-semibold py-2 px-6 rounded-lg shadow hover:bg-cyan-400 mt-2 transition-all">
                Join Waitlist
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
} 