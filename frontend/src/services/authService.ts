import { supabase } from '@/lib/supabase';
import type { AuthError, User } from '@supabase/supabase-js';

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
  user: User | null;
  error: AuthError | null;
}

class AuthService {
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

      return { user: authData.user, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        user: null,
        error: error as AuthError,
      };
    }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as AuthError };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user || null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
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

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });

    return subscription;
  }
}

export const authService = new AuthService();
