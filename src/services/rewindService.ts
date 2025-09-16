import { supabase } from '../config/supabase';

export interface RewindAction {
  id: string;
  user_id: string;
  swiped_profile_id: string;
  original_direction: 'left' | 'right' | 'super';
  created_at: string;
}

export const undoLastSwipe = async (): Promise<{ success: boolean; profileId?: string }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) throw new Error('Profile not found');

  // Get last swipe
  const { data: lastSwipe } = await supabase
    .from('swipes')
    .select('*')
    .eq('swiper_id', userProfile.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!lastSwipe) throw new Error('No swipes to undo');

  // Check if rewind was already used today
  const { count: rewindCount } = await supabase
    .from('rewind_actions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', new Date().toISOString().split('T')[0]);

  if ((rewindCount || 0) >= 1) {
    throw new Error('Daily rewind limit reached');
  }

  // Delete the swipe
  const { error: deleteError } = await supabase
    .from('swipes')
    .delete()
    .eq('id', lastSwipe.id);

  if (deleteError) throw deleteError;

  // Record rewind action
  await supabase
    .from('rewind_actions')
    .insert({
      user_id: user.id,
      swiped_profile_id: lastSwipe.swiped_id,
      original_direction: lastSwipe.direction
    });

  // If it was a match, remove it
  if (lastSwipe.direction === 'right' || lastSwipe.direction === 'super') {
    await supabase
      .from('matches')
      .delete()
      .or(`profile1_id.eq.${userProfile.id},profile2_id.eq.${userProfile.id}`)
      .or(`profile1_id.eq.${lastSwipe.swiped_id},profile2_id.eq.${lastSwipe.swiped_id}`);
  }

  return { success: true, profileId: lastSwipe.swiped_id };
};

export const getRewindCount = async (): Promise<number> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from('rewind_actions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', new Date().toISOString().split('T')[0]);

  return 1 - (count || 0); // 1 free rewind per day
};