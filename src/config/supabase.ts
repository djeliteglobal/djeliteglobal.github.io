import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Fallback for missing config
if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn('Supabase not configured, using mock auth');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);