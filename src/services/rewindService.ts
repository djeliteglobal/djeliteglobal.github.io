import { sql } from '../config/supabase';

export interface RewindAction {
  id: string;
  user_id: string;
  swiped_profile_id: string;
  original_direction: 'left' | 'right' | 'super';
  created_at: string;
}

export const undoLastSwipe = async (userId: string): Promise<{ success: boolean; profileId?: string }> => {
  const profile = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (!profile.rows[0]) throw new Error('Profile not found');

  const profileId = profile.rows[0].id;
  const lastSwipe = await sql`SELECT * FROM swipes WHERE swiper_id = ${profileId} ORDER BY created_at DESC LIMIT 1`;
  if (!lastSwipe.rows[0]) throw new Error('No swipes to undo');

  const today = new Date().toISOString().split('T')[0];
  const rewindCount = await sql`SELECT COUNT(*) FROM rewind_actions WHERE user_id = ${userId} AND created_at >= ${today}`;
  if (parseInt(rewindCount.rows[0]?.count || '0') >= 1) throw new Error('Daily rewind limit reached');

  await sql`DELETE FROM swipes WHERE id = ${lastSwipe.rows[0].id}`;
  await sql`INSERT INTO rewind_actions (user_id, swiped_profile_id, original_direction) VALUES (${userId}, ${lastSwipe.rows[0].swiped_id}, ${lastSwipe.rows[0].direction})`;

  if (lastSwipe.rows[0].direction === 'right' || lastSwipe.rows[0].direction === 'super') {
    await sql`DELETE FROM matches WHERE (profile1_id = ${profileId} OR profile2_id = ${profileId}) AND (profile1_id = ${lastSwipe.rows[0].swiped_id} OR profile2_id = ${lastSwipe.rows[0].swiped_id})`;
  }

  return { success: true, profileId: lastSwipe.rows[0].swiped_id };
};

export const getRewindCount = async (userId: string): Promise<number> => {
  const today = new Date().toISOString().split('T')[0];
  const result = await sql`SELECT COUNT(*) FROM rewind_actions WHERE user_id = ${userId} AND created_at >= ${today}`;
  const count = parseInt(result.rows[0]?.count || '0');
  return 1 - count;
};
