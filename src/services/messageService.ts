import { sql } from '../config/supabase';

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

export const sendMessage = async (matchId: string, content: string, userId: string): Promise<Message> => {
  const profile = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (!profile.rows[0]) throw new Error('Profile not found');

  const result = await sql`
    INSERT INTO messages (match_id, sender_id, content, message_type)
    VALUES (${matchId}, ${profile.rows[0].id}, ${content.trim()}, 'text')
    RETURNING *
  `;

  const message = result.rows[0];
  const sender = await sql`SELECT dj_name, profile_image_url FROM profiles WHERE id = ${message.sender_id}`;

  return {
    ...message,
    sender_name: sender.rows[0]?.dj_name,
    sender_avatar: sender.rows[0]?.profile_image_url
  };
};

export const fetchMessages = async (matchId: string): Promise<Message[]> => {
  const result = await sql`
    SELECT m.*, p.dj_name, p.profile_image_url
    FROM messages m
    LEFT JOIN profiles p ON m.sender_id = p.id
    WHERE m.match_id = ${matchId}
    ORDER BY m.created_at ASC
  `;

  return result.rows.map(msg => ({
    id: msg.id,
    match_id: msg.match_id,
    sender_id: msg.sender_id,
    content: msg.content,
    created_at: msg.created_at,
    read_at: msg.read_at,
    message_type: msg.message_type,
    sender_name: msg.dj_name,
    sender_avatar: msg.profile_image_url
  }));
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
  await sql`UPDATE messages SET read_at = ${new Date().toISOString()} WHERE id = ${messageId}`;
};

export const subscribeToMessages = (
  matchId: string, 
  onMessage: (message: Message) => void
) => {
  // Real-time subscriptions require WebSocket connection - implement polling as alternative
  const interval = setInterval(async () => {
    const messages = await fetchMessages(matchId);
    if (messages.length > 0) {
      onMessage(messages[messages.length - 1]);
    }
  }, 3000);

  return () => {
    clearInterval(interval);
  };
};
