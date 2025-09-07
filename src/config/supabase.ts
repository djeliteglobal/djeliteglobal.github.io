import { createClient } from '@supabase/supabase-js';

// Vitalik's rule: Fail fast, fail loud - but only when actually used
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 SUPABASE DEBUG:');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseAnonKey);
console.log('Mode:', import.meta.env.MODE);

// Create client even with missing config, but it will fail on first use
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Wrap all supabase calls to check config first
const checkConfig = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ SUPABASE CONFIG MISSING!');
    console.error('URL:', supabaseUrl || 'MISSING');
    console.error('Key:', supabaseAnonKey ? 'EXISTS' : 'MISSING');
    throw new Error(`Supabase not configured. Missing: ${!supabaseUrl ? 'VITE_SUPABASE_URL ' : ''}${!supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : ''}`);
  }
};

// Export wrapped client
export { supabase, checkConfig };