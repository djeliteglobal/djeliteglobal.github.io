import { supabase } from '../config/supabase';
import { Subscription, PLAN_LIMITS } from '../types/subscription';

export const getUserSubscription = async (): Promise<Subscription | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  return subscription;
};

export const getUserPlan = async (): Promise<string> => {
  const subscription = await getUserSubscription();
  return subscription?.plan || 'free';
};

export const checkConnectionLimit = async (): Promise<{ canConnect: boolean; remaining: number }> => {
  const plan = await getUserPlan();
  const limits = PLAN_LIMITS[plan];
  
  if (limits.connections === -1) {
    return { canConnect: true, remaining: -1 };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { canConnect: false, remaining: 0 };

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) return { canConnect: false, remaining: 0 };

  const { count } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .or(`profile1_id.eq.${userProfile.id},profile2_id.eq.${userProfile.id}`);

  const currentConnections = count || 0;
  const remaining = Math.max(0, limits.connections - currentConnections);
  
  return {
    canConnect: remaining > 0,
    remaining
  };
};

export const hasAdvancedProfile = async (): Promise<boolean> => {
  const plan = await getUserPlan();
  return PLAN_LIMITS[plan].advanced_profile;
};

export const hasDirectContact = async (): Promise<boolean> => {
  const plan = await getUserPlan();
  return PLAN_LIMITS[plan].direct_contact;
};