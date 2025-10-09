import { sql } from '../config/supabase';

export interface Boost {
  id: string;
  user_id: string;
  profile_id: string;
  boost_type: 'standard' | 'super';
  duration_minutes: number;
  started_at: string;
  expires_at: string;
  views_gained: number;
  likes_gained: number;
}

export const activateBoost = async (boostType: 'standard' | 'super' = 'standard', userId: string): Promise<Boost> => {
  const profile = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (!profile.rows[0]) throw new Error('Profile not found');

  const profileId = profile.rows[0].id;
  const activeBoost = await sql`SELECT * FROM boosts WHERE profile_id = ${profileId} AND expires_at > NOW()`;
  if (activeBoost.rows[0]) throw new Error('Profile is already boosted');

  const duration = boostType === 'super' ? 60 : 30;
  const expiresAt = new Date(Date.now() + duration * 60 * 1000).toISOString();

  const result = await sql`
    INSERT INTO boosts (user_id, profile_id, boost_type, duration_minutes, started_at, expires_at, views_gained, likes_gained)
    VALUES (${userId}, ${profileId}, ${boostType}, ${duration}, NOW(), ${expiresAt}, 0, 0)
    RETURNING *
  `;

  await sql`UPDATE profiles SET is_boosted = true, boost_expires_at = ${expiresAt}, boost_multiplier = ${boostType === 'super' ? 10 : 5} WHERE id = ${profileId}`;

  return result.rows[0];
};

export const getActiveBoost = async (userId: string): Promise<Boost | null> => {
  const profile = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (!profile.rows[0]) return null;

  const result = await sql`SELECT * FROM boosts WHERE profile_id = ${profile.rows[0].id} AND expires_at > NOW() ORDER BY started_at DESC LIMIT 1`;
  return result.rows[0] || null;
};

export const getBoostedProfiles = async (limit: number = 10): Promise<any[]> => {
  const result = await sql`SELECT * FROM profiles WHERE is_boosted = true AND boost_expires_at > NOW() ORDER BY boost_multiplier DESC LIMIT ${limit}`;
  return result.rows;
};

export const recordBoostView = async (boostId: string): Promise<void> => {
  await sql`UPDATE boosts SET views_gained = views_gained + 1 WHERE id = ${boostId}`;
};

export const recordBoostLike = async (boostId: string): Promise<void> => {
  await sql`UPDATE boosts SET likes_gained = likes_gained + 1 WHERE id = ${boostId}`;
};

export const getBoostStats = async (userId: string): Promise<{ views: number; likes: number; timeLeft: number }> => {
  const boost = await getActiveBoost(userId);
  if (!boost) return { views: 0, likes: 0, timeLeft: 0 };

  const timeLeft = Math.max(0, new Date(boost.expires_at).getTime() - Date.now());
  
  return {
    views: boost.views_gained,
    likes: boost.likes_gained,
    timeLeft: Math.floor(timeLeft / 1000 / 60)
  };
};
