import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const CommandCenterTitle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 overflow-hidden">
      <div className="flex items-center justify-center gap-2 md:gap-4 group cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <span className={cn(
          "text-4xl md:text-6xl font-black tracking-tighter transition-all duration-700 ease-out uppercase",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-12 opacity-80"
        )}>
          COMMAND
        </span>
        
        <div className={cn(
          "relative overflow-hidden transition-all duration-700 ease-out rounded-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 border border-primary/30 backdrop-blur-md shadow-glow",
          isOpen ? "w-[240px] md:w-[400px] h-12 md:h-20 opacity-100 scale-100" : "w-0 h-12 md:h-20 opacity-0 scale-90"
        )}>
          <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap px-8">
            <span className="text-sm md:text-xl font-bold text-primary animate-pulse tracking-widest uppercase italic">
              Welcome to the Hub, Architect
            </span>
          </div>
          {/* Animated glow inner line */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
        </div>

        <span className={cn(
          "text-4xl md:text-6xl font-black tracking-tighter transition-all duration-700 ease-out uppercase",
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-80"
        )}>
          CENTER
        </span>
      </div>
      
      {/* Subtle indicator line */}
      <div className={cn(
        "h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-all duration-1000 delay-500",
        isOpen ? "w-full opacity-100" : "w-0 opacity-0"
      )} />
    </div>
  );
};
