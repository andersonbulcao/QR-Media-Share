import { create } from 'zustand';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },
  signUp: async (email, password) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  },
  signOut: async () => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
  setUser: (user) => set({ user, loading: false }),
}));

// Initialize auth state only if Supabase is configured
if (isSupabaseConfigured()) {
  const supabase = getSupabaseClient();
  supabase.auth.onAuthStateChange((event, session) => {
    useAuthStore.getState().setUser(session?.user ?? null);
  });
}