import { supabase } from '../config/supabase';

export interface SuperLike {
  id: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  is_mutual?: boolean;
}

export const sendSuperLike = async (profileId: string): Promise<{ success: boolean; isMatch: boolean }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) throw new Error('Profile not found');

  // Check if user has super likes remaining
  const { count: todayCount } = await supabase
    .from('super_likes')
    .select('*', { count: 'exact', head: true })
    .eq('sender_id', userProfile.id)
    .gte('created_at', new Date().toISOString().split('T')[0]);

  if ((todayCount || 0) >= 1) {
    throw new Error('Daily super like limit reached');
  }

  // Send super like
  const { error } = await supabase
    .from('super_likes')
    .insert({
      sender_id: userProfile.id,
      receiver_id: profileId
    });

  if (error) throw error;

  // Check for mutual super like (instant match)
  const { data: mutualSuperLike } = await supabase
    .from('super_likes')
    .select('*')
    .eq('sender_id', profileId)
    .eq('receiver_id', userProfile.id)
    .single();

  if (mutualSuperLike) {
    // Create instant match
    await supabase
      .from('matches')
      .insert({
        profile1_id: userProfile.id,
        profile2_id: profileId,
        is_super_match: true
      });
    return { success: true, isMatch: true };
  }

  return { success: true, isMatch: false };
};

export const getSuperLikesReceived = async (): Promise<SuperLike[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) return [];

  const { data } = await supabase
    .from('super_likes')
    .select(`
      *,
      sender:profiles!super_likes_sender_id_fkey(*)
    `)
    .eq('receiver_id', userProfile.id)
    .order('created_at', { ascending: false });

  return data || [];
};

export const getSuperLikeCount = async (): Promise<number> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) return 0;

  const { count } = await supabase
    .from('super_likes')
    .select('*', { count: 'exact', head: true })
    .eq('sender_id', userProfile.id)
    .gte('created_at', new Date().toISOString().split('T')[0]);

  return 1 - (count || 0); // 1 free super like per day
};
