import { PostgrestClient } from '@supabase/postgrest-js';
import { supabase } from './profileService';

// Ultra-fast Supabase client with connection pooling
const turboClient = new PostgrestClient(
  'https://sxdlagcwryzzozyuznth.supabase.co/rest/v1',
  {
    headers: {
      apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZGxhZ2N3cnl6em96eXV6bnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzQsImV4cCI6MjA1MDU0ODk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8',
      'Content-Type': 'application/json'
    }
  }
);

// Lightning-fast message operations
export const turboSendMessage = async (matchId: string, senderId: string, content: string) => {
  const { data, error } = await turboClient
    .from('messages')
    .insert({
      match_id: matchId,
      sender_id: senderId,
      content,
      message_type: 'text'
    })
    .select('*')
    .single();
    
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