import { PostgrestClient } from '@supabase/postgrest-js';
import { supabase } from '../config/supabase';

// Ultra-fast Supabase client with connection pooling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const turboClient = new PostgrestClient(
  `${supabaseUrl}/rest/v1`,
  {
    headers: {
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json'
    }
  }
);

// Lightning-fast message operations
export const turboSendMessage = async (matchId: string, senderId: string, content: string) => {
  // Get auth token from main supabase client
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  
  const { data, error } = await turboClient
    .from('messages')
    .insert({
      match_id: matchId,
      sender_id: senderId,
      content,
      message_type: 'text'
    })
    .select('*')
    .single()
    .setHeader('Authorization', `Bearer ${session.access_token}`);
    
  if (error) throw error;
  return data;
};

export const turboFetchMessages = async (matchId: string) => {
  const { data, error } = await turboClient
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true })
    .limit(100);
    
  if (error) throw error;
  return data || [];
};
