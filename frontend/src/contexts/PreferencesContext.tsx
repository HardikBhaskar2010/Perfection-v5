import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type UserMode = 'student' | 'normal';

export type ColorTheme = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'teal' | 'red';

export interface ThemeColors {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  description: string;
}

export const COLOR_THEMES: Record<ColorTheme, ThemeColors> = {
  blue: {
    name: 'Ocean Blue',
    primary: '217 91% 60%',
    secondary: '262 83% 58%',
    accent: '217 91% 60%',
    description: 'Classic blue theme with purple accents'
  },
  purple: {
    name: 'Royal Purple',
    primary: '271 81% 56%',
    secondary: '291 64% 42%',
    accent: '271 81% 66%',
    description: 'Rich purple with deep magenta tones'
  },
  green: {
    name: 'Forest Green',
    primary: '142 71% 45%',
    secondary: '173 58% 39%',
    accent: '142 76% 36%',
    description: 'Natural green with emerald highlights'
  },
  orange: {
    name: 'Sunset Orange',
    primary: '25 95% 53%',
    secondary: '36 100% 50%',
    accent: '14 91% 54%',
    description: 'Warm orange with golden accents'
  },
  pink: {
    name: 'Cherry Blossom',
    primary: '330 81% 60%',
    secondary: '340 82% 52%',
    accent: '350 89% 60%',
    description: 'Soft pink with vibrant rose tones'
  },
  teal: {
    name: 'Ocean Teal',
    primary: '173 80% 40%',
    secondary: '183 75% 35%',
    accent: '173 80% 50%',
    description: 'Cool teal with aqua accents'
  },
  red: {
    name: 'Crimson Red',
    primary: '0 84% 60%',
    secondary: '348 83% 47%',
    accent: '0 91% 71%',
    description: 'Bold red with deep crimson tones'
  }
};

interface PreferencesState {
  userMode: UserMode;
  showPrice: boolean;
  colorTheme: ColorTheme;
  setUserMode: (mode: UserMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
}

const PreferencesContext = createContext<PreferencesState | undefined>(undefined);

const STORAGE_KEY = 'user-preferences:v1';

interface StoredPreferences {
  userMode?: UserMode;
  colorTheme?: ColorTheme;
}

function loadFromStorage(): StoredPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { userMode: 'normal', colorTheme: 'blue' };
    const parsed = JSON.parse(raw) as StoredPreferences;
    return {
      userMode: parsed.userMode ?? 'normal',
      colorTheme: parsed.colorTheme ?? 'blue'
    };
  } catch {
    return { userMode: 'normal', colorTheme: 'blue' };
  }
}

function saveToStorage(preferences: StoredPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // ignore
  }
}

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<StoredPreferences>(() => 
    typeof window !== 'undefined' ? loadFromStorage() : { userMode: 'normal', colorTheme: 'blue' }
  );

  // Apply theme colors to CSS variables
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = COLOR_THEMES[preferences.colorTheme || 'blue'];
      const root = document.documentElement;
      
      root.style.setProperty('--primary', theme.primary);
      root.style.setProperty('--secondary', theme.secondary);
      root.style.setProperty('--accent', theme.accent);
      
      saveToStorage(preferences);
    }
  }, [preferences]);

  const setUserMode = (mode: UserMode) => {
    setPreferences(prev => ({ ...prev, userMode: mode }));
  };

  const setColorTheme = (theme: ColorTheme) => {
    setPreferences(prev => ({ ...prev, colorTheme: theme }));
  };

  const value = useMemo<PreferencesState>(() => ({
    userMode: preferences.userMode || 'normal',
    showPrice: preferences.userMode === 'normal',
    colorTheme: preferences.colorTheme || 'blue',
    setUserMode,
    setColorTheme,
  }), [preferences]);

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
};

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
