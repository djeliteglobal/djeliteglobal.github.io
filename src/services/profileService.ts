import { supabase, checkConfig } from '../config/supabase';

// Export supabase for other services
export { supabase };
import { DJProfile, SwipeResult } from '../types/profile';

export const fetchSwipeProfiles = async (): Promise<DJProfile[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get current user's profile
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) {
    // Create profile if doesn't exist
    await createProfile({ dj_name: 'New DJ', bio: 'Getting started' });
    return [];
  }

  // TESTING MODE: Show all profiles (no filtering)
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('user_id', user.id)
    .limit(10);
    
  console.log('🔍 PROFILES DEBUG (TESTING MODE):', { data, error, userProfile });

  if (error) throw error;
  
  // Transform to match expected format
  return (data || []).map(profile => {
    const profileImage = profile.profile_image_url || profile.images?.[0] || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400';
    return {
      id: profile.id,
      title: profile.dj_name || 'DJ',
      venue: profile.venues?.[0] || 'Local Venues',
      location: profile.location || 'Unknown Location',
      date: 'Available Now',
      fee: profile.fee || 'Negotiable',
      genres: profile.genres || ['House', 'Techno'],
      skills: profile.skills || ['Mixing'],
      bio: profile.bio || 'Passionate DJ ready to connect!',
      imageUrl: profileImage,
      images: profile.images || [profileImage]
    };
  });
};

// Debug function to check Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('events').select('count').limit(1);
    console.log('🔍 SUPABASE TEST:', { data, error });
    return !error;
  } catch (error) {
    console.error('🚨 SUPABASE CONNECTION FAILED:', error);
    return false;
  }
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

  // Check if profile already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (existing) return existing;

  // Auto-sync Google profile picture on signup
  const authProfilePic = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const defaultImage = authProfilePic || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f';
  
  // Use user's actual name from Google if available
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || profileData.dj_name;

  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      user_id: user.id,
      dj_name: displayName,
      bio: profileData.bio || 'New DJ ready to connect!',
      age: profileData.age,
      location: profileData.location,
      experience_level: profileData.experience_level || 'Beginner',
      profile_image_url: authProfilePic, // Always use Google profile pic
      genres: ['House', 'Techno'],
      skills: ['Mixing', 'Beatmatching'],
      venues: ['Local Clubs'],
      images: authProfilePic ? [authProfilePic] : [defaultImage]
    })
    .select()
    .single();

  if (error) throw error;
  return profile;
};

export const uploadProfileImage = async (file: File): Promise<string> => {
  // Fallback: Convert to base64 for now (until storage bucket is set up)
  return new Promise((resolve, reject) => {
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error('File size must be less than 2MB'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

  // TODO: Uncomment when storage bucket is created
  /*
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('profile-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('profile-images')
    .getPublicUrl(fileName);

  return publicUrl;
  */
};

export const updateProfile = async (profileData: Partial<DJProfile>): Promise<DJProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Clean the data - remove undefined values
  const cleanData = Object.fromEntries(
    Object.entries(profileData).filter(([_, value]) => value !== undefined)
  );

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(cleanData)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Update profile error:', error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }
  return profile;
};

export const getCurrentProfile = async (): Promise<DJProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Auto-sync Google profile picture if missing
  if (profile && !profile.profile_image_url) {
    const authProfilePic = user.user_metadata?.avatar_url || user.user_metadata?.picture;
    if (authProfilePic) {
      await supabase
        .from('profiles')
        .update({ profile_image_url: authProfilePic })
        .eq('user_id', user.id);
      profile.profile_image_url = authProfilePic;
    }
  }

  return profile;
};

export const syncAllGoogleProfilePictures = async (): Promise<void> => {
  // Skip admin operations that cause 403 errors
  console.log('Profile sync skipped - requires admin permissions');
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

  try {
    // Record the swipe
    await supabase
      .from('swipes')
      .insert({
        swiper_id: userProfile.id,
        swiped_id: profileId,
        direction: direction
      });
  } catch (error: any) {
    // Ignore duplicate swipes
    if (error.code !== '23505') {
      console.error('Swipe error:', error);
    }
  }

  // Check for match if it's a right swipe
  if (direction === 'right' || direction === 'super') {
    try {
      const { data: reverseSwipe } = await supabase
        .from('swipes')
        .select('*')
        .eq('swiper_id', profileId)
        .eq('swiped_id', userProfile.id)
        .eq('direction', 'right')
        .single();

      if (reverseSwipe) {
        // It's a match!
        try {
          await supabase
            .from('matches')
            .insert({
              profile1_id: userProfile.id,
              profile2_id: profileId
            });
        } catch (matchError: any) {
          // Ignore duplicate matches
          if (matchError.code !== '23505') {
            console.error('Match error:', matchError);
          }
        }
        return { match: true };
      }
    } catch (error) {
      console.error('Match check error:', error);
    }
  }

  return { match: false };
};

export const fetchMatches = async (): Promise<DJProfile[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) return [];

  try {
    const { data: matches } = await supabase
      .from('matches')
      .select(`
        *,
        profile1:profiles!matches_profile1_id_fkey(*),
        profile2:profiles!matches_profile2_id_fkey(*)
      `)
      .or(`profile1_id.eq.${userProfile.id},profile2_id.eq.${userProfile.id}`);

    return (matches || []).map(match => {
      const otherProfile = match.profile1_id === userProfile.id ? match.profile2 : match.profile1;
      return {
        ...otherProfile,
        match_id: match.id
      };
    });
  } catch (error) {
    console.error('Fetch matches error:', error);
    return [];
  }
};

export const undoSwipe = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) throw new Error('Profile not found');

  // Delete most recent swipe
  const { error } = await supabase
    .from('swipes')
    .delete()
    .eq('swiper_id', userProfile.id)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;
};

export const deleteMatch = async (matchId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) throw new Error('Profile not found');

  console.log('🔍 UNMATCH DEBUG: Starting deletion for matchId:', matchId);

  // First get the match to find the other profile
  const { data: match } = await supabase
    .from('matches')
    .select('profile1_id, profile2_id')
    .eq('id', matchId)
    .single();

  console.log('🔍 MATCH FOUND:', match);

  if (match) {
    const otherProfileId = match.profile1_id === userProfile.id ? match.profile2_id : match.profile1_id;
    console.log('🔍 OTHER PROFILE ID:', otherProfileId);
    
    // GENNADY'S NUCLEAR OPTION: Delete ALL matches between these two profiles
    const { error: matchError1 } = await supabase
      .from('matches')
      .delete()
      .eq('profile1_id', userProfile.id)
      .eq('profile2_id', otherProfileId);
      
    const { error: matchError2 } = await supabase
      .from('matches')
      .delete()
      .eq('profile1_id', otherProfileId)
      .eq('profile2_id', userProfile.id);
    
    // Also delete by specific ID
    const { error: matchError3 } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId);
    
    console.log('🔍 NUCLEAR MATCH DELETE:', { matchError1, matchError2, matchError3 });
    
    // Delete ALL swipe records between these profiles
    const { error: swipe1Error } = await supabase
      .from('swipes')
      .delete()
      .eq('swiper_id', userProfile.id)
      .eq('swiped_id', otherProfileId);
      
    const { error: swipe2Error } = await supabase
      .from('swipes')
      .delete()
      .eq('swiper_id', otherProfileId)
      .eq('swiped_id', userProfile.id);
      
    console.log('🔍 SWIPE DELETE RESULTS:', { swipe1Error, swipe2Error });
    console.log('💥 NUCLEAR UNMATCH COMPLETE: Obliterated all records!');
  }
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
    
    // Send emails via secure Netlify function
    try {
      const response = await fetch('/.netlify/functions/send-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName?.trim() || 'DJ'
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Emails sent:', result);
      } else {
        console.error('Email function failed:', await response.text());
      }
    } catch (emailError) {
      console.error('Email function error:', emailError);
      // Don't throw - signup was successful even if emails failed
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