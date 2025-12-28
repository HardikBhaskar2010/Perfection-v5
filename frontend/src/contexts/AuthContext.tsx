import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/authService';
import { guestService, type GuestUser } from '@/services/guestService';

// Auth modes
export type AuthMode = 'unauthenticated' | 'guest' | 'authenticated';
export type AuthProvider = 'guest' | 'google' | 'email' | null;

interface AuthContextType {
  user: User | GuestUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  mode: AuthMode;
  provider: AuthProvider;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | GuestUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<AuthMode>('unauthenticated');
  const [provider, setProvider] = useState<AuthProvider>(null);

  // App startup check - STEP 3 from implementation plan
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Check for Supabase session first
        const currentUser = await authService.getCurrentUser();
        
        if (!mounted) return;

        if (currentUser && !authService.isGuestUser(currentUser)) {
          // Real authenticated user (could be from Google OAuth or email)
          setUser(currentUser);
          setMode('authenticated');
          // Try to determine provider from user metadata
          const userMetadata = (currentUser as User).app_metadata;
          if (userMetadata?.provider === 'google') {
            setProvider('google');
          } else {
            setProvider('email');
          }
        } else if (guestService.isGuest()) {
          // Restore guest session from localStorage
          const guestUser = guestService.getGuest();
          if (guestUser) {
            setUser(guestUser);
            setMode('guest');
            setProvider('guest');
            console.log('✅ Guest session restored from localStorage');
          }
        } else {
          // No session at all
          setMode('unauthenticated');
          setProvider(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setMode('unauthenticated');
          setProvider(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listen for real auth state changes from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        // Real user logged in
        const provider = session.user.app_metadata?.provider === 'google' ? 'google' : 'email';
        setUser(session.user);
        setMode('authenticated');
        setProvider(provider as AuthProvider);
        console.log('✅ User authenticated:', provider);
        
        // Clear guest session when real user logs in
        if (guestService.isGuest()) {
          guestService.clearGuestData();
          console.log('✅ Guest session cleared after real login');
        }
      } else if (!guestService.isGuest()) {
        // Logged out (but only if not guest)
        setUser(null);
        setMode('unauthenticated');
        setProvider(null);
        console.log('✅ User logged out');
      }
    });

    // Listen for guest login events
    const unsubscribeGuest = authService.onGuestLogin((guestUser) => {
      if (!mounted) return;
      setUser(guestUser);
      setMode('guest');
      setProvider('guest');
      console.log('✅ Guest mode activated');
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
      unsubscribeGuest();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: mode === 'authenticated' || mode === 'guest',
        mode,
        provider,
        isGuest: mode === 'guest',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
