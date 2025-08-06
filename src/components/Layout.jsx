import React from 'react';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16"> {/* pt-16 for fixed header offset */}
        {children}
      </main>
    </div>
  );
} 