import { supabase, checkConfig } from '../config/supabase';
import { DJProfile, SwipeResult } from '../types/profile';

export const fetchSwipeProfiles = async (): Promise<DJProfile[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) throw new Error('Profile not found');

  const { data, error } = await supabase.rpc('get_swipe_feed', {
    user_profile_id: userProfile.id,
    limit_count: 10
  });

  if (error) throw error;
  return data || [];
};

export const createProfile = async (profileData: {
  dj_name: string;
  bio?: string;
  age?: number;
  location?: string;
  experience_level?: string;
}): Promise<DJProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      user_id: user.id,
      dj_name: profileData.dj_name,
      bio: profileData.bio,
      age: profileData.age,
      location: profileData.location,
      experience_level: profileData.experience_level || 'Beginner'
    })
    .select()
    .single();

  if (error) throw error;
  return profile;
};

export const recordSwipe = async (profileId: string, direction: 'left' | 'right' | 'super'): Promise<SwipeResult> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) throw new Error('Profile not found');

  const { data, error } = await supabase.rpc('handle_swipe', {
    swiper_profile_id: userProfile.id,
    swiped_profile_id: profileId,
    swipe_direction: direction
  });

  if (error) throw error;
  return data;
};

export const fetchMatches = async (): Promise<DJProfile[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) throw new Error('Profile not found');

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or(`profile1_id.eq.${userProfile.id},profile2_id.eq.${userProfile.id}`);

  if (error) throw error;
  return data || [];
};

export const undoSwipe = async (profileId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) throw new Error('Profile not found');

  const { error } = await supabase
    .from('swipes')
    .delete()
    .eq('swiper_id', userProfile.id)
    .eq('swiped_id', profileId);

  if (error) throw error;
};

export const deleteMatch = async (matchId: string): Promise<void> => {
  const { error } = await supabase
    .from('matches')
    .delete()
    .eq('id', matchId);

  if (error) throw error;
};

export const subscribeToCareerAccelerator = async (email: string, firstName?: string): Promise<void> => {
  console.log('Attempting Career Accelerator signup:', { email, firstName });
  
  // Vitalik's config check - fail fast with clear error
  checkConfig();
  
  try {
    const { data, error } = await supabase
      .from('career_accelerator_leads')
      .insert({
        email: email.trim(),
        first_name: firstName?.trim() || null
      })
      .select();

    console.log('Career Accelerator response:', { data, error });
    
    if (error) {
      // Handle duplicate email gracefully
      if (error.code === '23505') {
        console.log('Email already signed up for Career Accelerator');
        return;
      }
      console.error('Career Accelerator error details:', error);
      throw new Error(`Career Accelerator signup failed: ${error.message}`);
    }
    
    console.log('Career Accelerator signup successful:', data);
    
    // Send welcome email via Resend
    try {
      const { sendWelcomeEmail } = await import('./emailService');
      await sendWelcomeEmail(email.trim(), firstName?.trim() || 'DJ');
      console.log('Welcome email sent successfully');
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
      // Don't throw - signup was successful even if email failed
    }
    
    // Add to ConvertKit for automation sequence
    try {
      const response = await fetch(`https://api.convertkit.com/v3/forms/${import.meta.env.VITE_CONVERTKIT_FORM_ID}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: import.meta.env.VITE_CONVERTKIT_API_KEY,
          email: email.trim(),
          first_name: firstName?.trim() || 'DJ'
        })
      });
      
      if (response.ok) {
        console.log('Added to ConvertKit automation');
      } else {
        console.error('ConvertKit failed:', await response.text());
      }
    } catch (convertKitError) {
      console.error('ConvertKit error:', convertKitError);
      // Don't throw - signup was successful even if ConvertKit failed
    }
  } catch (err) {
    console.error('Career Accelerator signup error:', err);
    throw err;
  }
};

export const subscribeToNewsletter = async (email: string, firstName?: string): Promise<void> => {
  console.log('Attempting to subscribe:', { email, firstName });
  
  // Vitalik's config check - fail fast with clear error
  checkConfig();
  
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.trim(),
        first_name: firstName?.trim() || null
      })
      .select();

    console.log('Supabase response:', { data, error });
    
    if (error) {
      // Handle duplicate email gracefully
      if (error.code === '23505') {
        console.log('Email already subscribed');
        return;
      }
      console.error('Supabase error details:', error);
      throw new Error(`Newsletter signup failed: ${error.message}`);
    }
    
    console.log('Newsletter subscription successful:', data);
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    throw err;
  }
};