import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseKey);
};

// Only create the client if we have the required configuration
export const supabase = isSupabaseConfigured()
  ? createClient<Database>(supabaseUrl!, supabaseKey!)
  : null;

// Helper function to get the Supabase client safely
export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Please check your environment variables.');
  }
  return supabase;
};