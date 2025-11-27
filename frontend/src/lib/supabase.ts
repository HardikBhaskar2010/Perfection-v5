import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

// Create a mock client if credentials are not available
const createMockClient = () => {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ order: () => ({ execute: async () => ({ data: [], error: null }) }) }) }),
      insert: () => ({ select: () => ({ maybeSingle: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ maybeSingle: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }) }),
      delete: () => ({ eq: () => ({ execute: async () => ({ error: { message: 'Supabase not configured' } }) }) }),
    }),
  } as any;
};

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export type Database = any;
