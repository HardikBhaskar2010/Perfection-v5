import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type AnimationConfig, DEFAULT_ANIMATION_CONFIG, prefersReducedMotion } from '@/lib/animation';

interface AnimationContextType {
  config: AnimationConfig;
  updateConfig: (newConfig: Partial<AnimationConfig>) => void;
  isReducedMotion: boolean;
  isAnimationEnabled: boolean;
  toggleAnimations: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

interface AnimationProviderProps {
  children: ReactNode;
  initialConfig?: Partial<AnimationConfig>;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ 
  children, 
  initialConfig = {} 
}) => {
  const [config, setConfig] = useState<AnimationConfig>({
    ...DEFAULT_ANIMATION_CONFIG,
    ...initialConfig,
  });

  const [isReducedMotion, setIsReducedMotion] = useState(prefersReducedMotion());
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);

  // Listen for changes in reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      setConfig(prev => ({
        ...prev,
        reducedMotion: e.matches,
      }));
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Set initial state
    setIsReducedMotion(mediaQuery.matches);
    setConfig(prev => ({
      ...prev,
      reducedMotion: mediaQuery.matches,
    }));

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const updateConfig = (newConfig: Partial<AnimationConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig,
    }));
  };

  const toggleAnimations = () => {
    setIsAnimationEnabled(prev => !prev);
  };

  const contextValue: AnimationContextType = {
    config: {
      ...config,
      reducedMotion: isReducedMotion || !isAnimationEnabled,
    },
    updateConfig,
    isReducedMotion,
    isAnimationEnabled,
    toggleAnimations,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

// Hook for getting animation-ready configuration
export const useAnimationConfig = () => {
  const { config } = useAnimation();
  return config;
};