import React, { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import FooterAbout from './FooterAbout';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const showFooter = !pathname.startsWith('/about');

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-hero opacity-5 animate-gradient-shift pointer-events-none" />
      
      <Navbar />
      
      <main className="relative pt-16">
        {children}
      </main>

      {/* Global Note From Creator footer (hidden on About page) */}
      {showFooter && <FooterAbout />}
    </div>
  );
};

export default Layout;
