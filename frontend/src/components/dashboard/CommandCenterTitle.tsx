import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const CommandCenterTitle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full py-12 select-none relative h-56">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="interactive-pill"
            initial={{ opacity: 0, scale: 0.9, y: 10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 10, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="flex items-center justify-center cursor-pointer group relative z-10 w-full"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              COMMAND
            </span>
            
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? 280 : 500, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="relative overflow-hidden rounded-[2rem] bg-black/40 border border-primary/20 backdrop-blur-xl shadow-[0_0_50px_rgba(168,85,247,0.15)] mx-4 md:mx-8 h-16 md:h-28"
            >
              <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap px-10">
                <span className="text-lg md:text-3xl font-black text-primary tracking-[0.2em] uppercase italic animate-pulse">
                  Welcome to Abyss
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent w-1/2 h-full -translate-x-full animate-[shimmer_3s_infinite]" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
            </motion.div>

            <span className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              CENTER
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="static-header"
            initial={{ opacity: 0, scale: 1.1, y: -10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, y: -10, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex flex-col items-start w-full max-w-4xl px-4 pointer-events-auto">
              <div className="flex items-center gap-2 text-primary mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-[0.2em]">Workspace</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-primary uppercase mb-3 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                Command Center
              </h1>
              <p className="text-muted-foreground text-lg font-medium max-w-lg leading-relaxed">
                Manage your synthesis modules and track your innovation progress.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        animate={{ width: isOpen ? "100%" : "0%", opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-12 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
    </div>
  );
};
