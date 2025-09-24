import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: false, // Reduce auth connections
    persistSession: true,
    detectSessionInUrl: false // Reduce URL checking
  },
  realtime: {
    params: {
      eventsPerSecond: 2 // Limit realtime events
    }
  }
});

export { supabase };