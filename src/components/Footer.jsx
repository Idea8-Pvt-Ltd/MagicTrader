import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-blue-950 text-blue-100 py-8 px-4 flex flex-col items-center text-center text-sm">
      <div className="mb-2 font-bold text-lg tracking-wide">SalesB2B <span className="font-normal text-blue-300">| AI That Closes Deals 24/7</span></div>
      <div className="mb-2">
        <a href="mailto:hello@salesb2b.ai" className="hover:underline text-blue-200">hello@salesb2b.ai</a>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mb-2 justify-center items-center">
        <a href="#" className="hover:underline text-blue-200">Privacy Policy</a>
        <span className="hidden sm:inline">|</span>
        <a href="#" className="hover:underline text-blue-200">Terms of Service</a>
        <span className="hidden sm:inline">|</span>
        <a href="#" className="hover:underline text-blue-200">Contact</a>
      </div>
      <div className="text-blue-400 mt-2">© 2025 SalesB2B. All rights reserved.</div>
    </footer>
  );
};

export default Footer; 