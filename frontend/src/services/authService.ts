import { supabase } from '@/lib/supabase';
import type { AuthError, User } from '@supabase/supabase-js';
import { guestService, type GuestUser } from './guestService';
import type { AuthProvider } from '@/contexts/AuthContext';

export interface SignUpData {
  email: string;
  password: string;
  username?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | GuestUser | null;
  error: AuthError | null;
  isGuest?: boolean;
}

class AuthService {
  // Event emitter for guest login (since Supabase doesn't emit for guests)
  private guestLoginCallbacks: Array<(user: GuestUser) => void> = [];

  onGuestLogin(callback: (user: GuestUser) => void) {
    this.guestLoginCallbacks.push(callback);
    return () => {
      this.guestLoginCallbacks = this.guestLoginCallbacks.filter(cb => cb !== callback);
    };
  }

  private emitGuestLogin(user: GuestUser) {
    this.guestLoginCallbacks.forEach(callback => callback(user));
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return { user: null, error };
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            username: data.username || data.email.split('@')[0],
            email: data.email,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          return { user: authData.user, error: profileError as AuthError };
        }
      }

      return { user: authData.user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        user: null,
        error: error as AuthError,
      };
    }
  }

  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return { user: null, error };
      }

      return { user: authData.user, error: null, isGuest: false };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        user: null,
        error: error as AuthError,
      };
    }
  }

  // Sign in with Google OAuth - STEP 2: Fixed redirect URL
// Sign in with Google OAuth (FIXED)
  async signInWithGoogle(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
  
      return { error };
    } catch (err) {
      console.error('Google sign in error:', err);
      return { error: err as AuthError };
    }
  }
}

  // Continue as Guest - STEP 1: Enhanced guest login
  async continueAsGuest(): Promise<AuthResponse> {
    try {
      const guestUser = guestService.getOrCreateGuest();
      console.log('✅ Guest user created:', guestUser.id);
      
      // Emit guest login event to update AuthContext
      this.emitGuestLogin(guestUser);
      
      return { 
        user: guestUser, 
        error: null, 
        isGuest: true 
      };
    } catch (error) {
      console.error('Guest mode error:', error);
      return {
        user: null,
        error: { message: 'Failed to create guest session' } as AuthError,
      };
    }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      // Check if guest user
      if (guestService.isGuest()) {
        guestService.clearGuestData();
        console.log('✅ Guest session cleared');
        return { error: null };
      }

      // Regular user logout
      const { error } = await supabase.auth.signOut();
      
      // Clear any local storage
      localStorage.removeItem('user_projects');
      console.log('✅ User signed out');
      
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as AuthError };
    }
  }

  async getCurrentUser(): Promise<User | GuestUser | null> {
    try {
      // Check for guest user first
      if (guestService.isGuest()) {
        return guestService.getGuest();
      }

      // Check for authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      return user || null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  isGuestUser(user: User | GuestUser | null): user is GuestUser {
    return user !== null && 'isGuest' in user && user.isGuest === true;
  }

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
  }

  // Upgrade guest to real account (migrate data) - STEP 5
  async upgradeGuestToAccount(data: SignUpData): Promise<AuthResponse> {
    try {
      // Get guest data before clearing
      const guestData = guestService.getDataForMigration();

      // Create real account
      const result = await this.signUp(data);

      if (result.user && !result.error) {
        // TODO: Migrate guest projects to the new user account
        // This would require backend API to save projects
        console.log('Guest data to migrate:', guestData);

        // Clear guest data
        guestService.clearGuestData();
        console.log('✅ Guest upgraded to real account');
      }

      return result;
    } catch (error) {
      console.error('Upgrade error:', error);
      return {
        user: null,
        error: error as AuthError,
      };
    }
  }

  // Enhanced auth state change listener with provider tracking
  onAuthStateChange(callback: (user: User | GuestUser | null, provider?: AuthProvider) => void) {
    // Listen for real auth changes only (Supabase)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Determine provider from user metadata
        const provider = session.user.app_metadata?.provider === 'google' ? 'google' : 'email';
        callback(session.user, provider as AuthProvider);
        
        // Clear guest session when real user logs in
        if (guestService.isGuest()) {
          guestService.clearGuestData();
          console.log('✅ Guest session cleared after real login');
        }
      } else {
        callback(null, null);
      }
    });

    return subscription;
  }
}

export const authService = new AuthService();
