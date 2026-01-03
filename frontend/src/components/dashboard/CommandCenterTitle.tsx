import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const CommandCenterTitle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full py-12 select-none">
      <div 
        className="flex items-center justify-center cursor-pointer group" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cn(
          "text-5xl md:text-8xl font-black tracking-tighter transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1) uppercase",
          isOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-[40%] opacity-0 scale-90"
        )}>
          COMMAND
        </span>
        
        <div className={cn(
          "relative overflow-hidden transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1) rounded-[2rem] bg-black/40 border border-primary/20 backdrop-blur-xl shadow-[0_0_50px_rgba(139,92,246,0.15)] mx-4 md:mx-8",
          isOpen ? "w-[280px] md:w-[500px] h-16 md:h-28 opacity-100 scale-100" : "w-0 h-16 md:h-28 opacity-0 scale-75"
        )}>
          <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap px-10">
            <span className="text-lg md:text-3xl font-black text-primary tracking-[0.2em] uppercase italic animate-pulse">
              Welcome to Abyss
            </span>
          </div>
          {/* Internal scanning effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent w-1/2 h-full -translate-x-full animate-[shimmer_3s_infinite]" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent shadow-[0_0_20px_rgba(139,92,246,0.8)]" />
        </div>

        <span className={cn(
          "text-5xl md:text-8xl font-black tracking-tighter transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1) uppercase",
          isOpen ? "translate-x-0 opacity-100 scale-100" : "-translate-x-[40%] opacity-0 scale-90"
        )}>
          CENTER
        </span>
      </div>
      
      {/* Decorative Abyss line */}
      <div className={cn(
        "mt-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-all duration-[1500ms] delay-700",
        isOpen ? "w-full opacity-100" : "w-0 opacity-0"
      )} />
    </div>
  );
};
