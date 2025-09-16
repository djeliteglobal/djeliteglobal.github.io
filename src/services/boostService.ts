import { supabase } from '../config/supabase';

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

export const activateBoost = async (boostType: 'standard' | 'super' = 'standard'): Promise<Boost> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) throw new Error('Profile not found');

  // Check if already boosted
  const { data: activeBoost } = await supabase
    .from('boosts')
    .select('*')
    .eq('profile_id', userProfile.id)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (activeBoost) {
    throw new Error('Profile is already boosted');
  }

  const duration = boostType === 'super' ? 60 : 30; // minutes
  const expiresAt = new Date(Date.now() + duration * 60 * 1000).toISOString();

  const { data: boost, error } = await supabase
    .from('boosts')
    .insert({
      user_id: user.id,
      profile_id: userProfile.id,
      boost_type: boostType,
      duration_minutes: duration,
      started_at: new Date().toISOString(),
      expires_at: expiresAt,
      views_gained: 0,
      likes_gained: 0
    })
    .select()
    .single();

  if (error) throw error;

  // Update profile boost status
  await supabase
    .from('profiles')
    .update({
      is_boosted: true,
      boost_expires_at: expiresAt,
      boost_multiplier: boostType === 'super' ? 10 : 5
    })
    .eq('id', userProfile.id);

  return boost;
};

export const getActiveBoost = async (): Promise<Boost | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) return null;

  const { data: boost } = await supabase
    .from('boosts')
    .select('*')
    .eq('profile_id', userProfile.id)
    .gt('expires_at', new Date().toISOString())
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  return boost;
};

export const getBoostedProfiles = async (limit: number = 10): Promise<any[]> => {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_boosted', true)
    .gt('boost_expires_at', new Date().toISOString())
    .order('boost_multiplier', { ascending: false })
    .limit(limit);

  return profiles || [];
};

export const recordBoostView = async (boostId: string): Promise<void> => {
  await supabase.rpc('increment_boost_views', { boost_id: boostId });
};

export const recordBoostLike = async (boostId: string): Promise<void> => {
  await supabase.rpc('increment_boost_likes', { boost_id: boostId });
};

export const getBoostStats = async (): Promise<{ views: number; likes: number; timeLeft: number }> => {
  const boost = await getActiveBoost();
  if (!boost) return { views: 0, likes: 0, timeLeft: 0 };

  const timeLeft = Math.max(0, new Date(boost.expires_at).getTime() - Date.now());
  
  return {
    views: boost.views_gained,
    likes: boost.likes_gained,
    timeLeft: Math.floor(timeLeft / 1000 / 60) // minutes
  };
};