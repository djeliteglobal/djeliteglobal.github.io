import { sql } from '../config/supabase';
import { Subscription, PLAN_LIMITS } from '../types/subscription';

export const getUserSubscription = async (userId: string): Promise<Subscription | null> => {
  const result = await sql`SELECT * FROM subscriptions WHERE user_id = ${userId} AND status = 'active' LIMIT 1`;
  return result?.rows?.[0] || null;
};

export const getUserPlan = async (userId: string): Promise<string> => {
  const subscription = await getUserSubscription(userId);
  return subscription?.plan || 'free';
};

export const checkConnectionLimit = async (userId: string): Promise<{ canConnect: boolean; remaining: number }> => {
  const plan = await getUserPlan(userId);
  const limits = PLAN_LIMITS[plan];
  
  if (limits.connections === -1) {
    return { canConnect: true, remaining: -1 };
  }

  const profile = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (!profile.rows[0]) return { canConnect: false, remaining: 0 };

  const result = await sql`SELECT COUNT(*) FROM matches WHERE profile1_id = ${profile.rows[0].id} OR profile2_id = ${profile.rows[0].id}`;
  const currentConnections = parseInt(result.rows[0]?.count || '0');
  const remaining = Math.max(0, limits.connections - currentConnections);
  
  return {
    canConnect: remaining > 0,
    remaining
  };
};

export const hasAdvancedProfile = async (userId: string): Promise<boolean> => {
  const plan = await getUserPlan(userId);
  return PLAN_LIMITS[plan].advanced_profile;
};

export const hasDirectContact = async (userId: string): Promise<boolean> => {
  const plan = await getUserPlan(userId);
  return PLAN_LIMITS[plan].direct_contact;
};
