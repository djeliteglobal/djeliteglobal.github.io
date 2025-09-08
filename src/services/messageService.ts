import { supabase } from './profileService';

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string;
  message_type: 'text' | 'image' | 'audio';
  sender_name?: string;
  sender_avatar?: string;
}

export const sendMessage = async (matchId: string, content: string): Promise<Message> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) throw new Error('Profile not found');

  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      match_id: matchId,
      sender_id: userProfile.id,
      content: content.trim(),
      message_type: 'text'
    })
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(dj_name, profile_image_url)
    `)
    .single();

  if (error) throw error;

  return {
    ...message,
    sender_name: message.sender?.dj_name,
    sender_avatar: message.sender?.profile_image_url
  };
};

export const fetchMessages = async (matchId: string): Promise<Message[]> => {
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(dj_name, profile_image_url)
    `)
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (messages || []).map(msg => ({
    ...msg,
    sender_name: msg.sender?.dj_name,
    sender_avatar: msg.sender?.profile_image_url
  }));
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('id', messageId);

  if (error) throw error;
};

export const subscribeToMessages = (
  matchId: string, 
  onMessage: (message: Message) => void
) => {
  const channel = supabase
    .channel(`messages:${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      },
      async (payload) => {
        // Fetch full message with sender info
        const { data: message } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(dj_name, profile_image_url)
          `)
          .eq('id', payload.new.id)
          .single();

        if (message) {
          onMessage({
            ...message,
            sender_name: message.sender?.dj_name,
            sender_avatar: message.sender?.profile_image_url
          });
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};