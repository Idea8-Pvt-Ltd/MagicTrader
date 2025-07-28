import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, MessageCircle, Heart } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Supported Markets', href: '#markets' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'API Documentation', href: '#api' },
  ],
  company: [
    { name: 'About Us', href: '#about' },
    { name: 'Careers', href: '#careers' },
    { name: 'Blog', href: '#blog' },
    { name: 'Press Kit', href: '#press' },
    { name: 'Contact', href: '#contact' },
  ],
  support: [
    { name: 'Help Center', href: '#help' },
    { name: 'Trading Guide', href: '#guide' },
    { name: 'Community', href: '#community' },
    { name: 'Status Page', href: '#status' },
    { name: 'Security', href: '#security' },
  ],
};

const socialLinks = [
  { icon: <Twitter size={20} />, href: '#twitter', label: 'Twitter' },
  { icon: <Linkedin size={20} />, href: '#linkedin', label: 'LinkedIn' },
  { icon: <MessageCircle size={20} />, href: '#telegram', label: 'Telegram' },
  { icon: <MessageCircle size={20} />, href: '#discord', label: 'Discord' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-white border-t border-primary/20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h3 className="text-2xl font-extrabold tracking-tight gradient-text mb-2">
              MagicTrader
            </h3>
            <p className="text-primary font-semibold text-sm mb-2">
              AI-Powered Trading Intelligence
            </p>
            <p className="text-white/70 text-sm mb-4 leading-relaxed">
              Empowering traders worldwide with advanced AI signals and risk management tools.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ scale: 1.1, boxShadow: '0 0 12px #00D4FF' }}
                  className="p-2 rounded-lg bg-background/50 border border-primary/20 text-primary hover:text-white hover:bg-primary/20 transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 2 - Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 - Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 - Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-primary/20 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-white/60 text-sm">
              © 2025 MagicTrader. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <a href="#privacy" className="text-white/60 hover:text-primary transition-colors duration-200">
                Privacy Policy
              </a>
              <span className="text-white/40">|</span>
              <a href="#terms" className="text-white/60 hover:text-primary transition-colors duration-200">
                Terms of Service
              </a>
              <span className="text-white/40">|</span>
              <a href="#risk" className="text-white/60 hover:text-primary transition-colors duration-200">
                Risk Disclosure
              </a>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-white/60 text-sm">
              Made with <Heart className="text-red-400" size={14} /> for traders worldwide
            </div>
          </div>

          {/* Risk Disclosure Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/50 max-w-2xl mx-auto leading-relaxed">
              Trading involves substantial risk of loss and is not suitable for all investors. 
              Past performance does not guarantee future results. MagicTrader provides AI-powered 
              trading signals for informational purposes only and does not constitute financial advice.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 