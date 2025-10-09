import { sql } from '../config/supabase';

export interface SuperLike {
  id: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  is_mutual?: boolean;
}

export const sendSuperLike = async (profileId: string, userId: string): Promise<{ success: boolean; isMatch: boolean }> => {
  const profile = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (!profile.rows[0]) throw new Error('Profile not found');

  const profileIdVal = profile.rows[0].id;
  const today = new Date().toISOString().split('T')[0];
  const count = await sql`SELECT COUNT(*) FROM super_likes WHERE sender_id = ${profileIdVal} AND created_at >= ${today}`;

  if (parseInt(count.rows[0]?.count || '0') >= 1) {
    throw new Error('Daily super like limit reached');
  }

  await sql`INSERT INTO super_likes (sender_id, receiver_id) VALUES (${profileIdVal}, ${profileId})`;

  const mutual = await sql`SELECT * FROM super_likes WHERE sender_id = ${profileId} AND receiver_id = ${profileIdVal} LIMIT 1`;

  if (mutual.rows[0]) {
    await sql`INSERT INTO matches (profile1_id, profile2_id, is_super_match) VALUES (${profileIdVal}, ${profileId}, true)`;
    return { success: true, isMatch: true };
  }

  return { success: true, isMatch: false };
};

export const getSuperLikesReceived = async (userId: string): Promise<SuperLike[]> => {
  const profile = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (!profile.rows[0]) return [];

  const result = await sql`
    SELECT sl.*, p.* FROM super_likes sl
    LEFT JOIN profiles p ON sl.sender_id = p.id
    WHERE sl.receiver_id = ${profile.rows[0].id}
    ORDER BY sl.created_at DESC
  `;
  return result.rows;
};

export const getSuperLikeCount = async (userId: string): Promise<number> => {
  const profile = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (!profile.rows[0]) return 0;

  const today = new Date().toISOString().split('T')[0];
  const result = await sql`SELECT COUNT(*) FROM super_likes WHERE sender_id = ${profile.rows[0].id} AND created_at >= ${today}`;
  const count = parseInt(result.rows[0]?.count || '0');

  return 1 - count;
};
