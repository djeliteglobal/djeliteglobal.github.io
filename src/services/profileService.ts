import { sql } from '../config/supabase';
import { useUser } from '@clerk/clerk-react';
import { sanitizeForLog, validateInput } from '../utils/sanitizer';
import { migrateDjNames } from '../utils/migrateDjNames';
import { matchingEngine } from './matchingEngine';
import { ApiError } from '../hooks/useApiError';

// Export migration function for admin use
export { migrateDjNames };
import { DJProfile, SwipeResult } from '../types/profile';

// Default profile image constant
const DEFAULT_PROFILE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMTExMTExIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE0MCIgcj0iNjAiIGZpbGw9IiMzMzMzMzMiLz4KPHBhdGggZD0iTTEwMCAzMDBDMTAwIDI1MCA0NSAyMDAgMjAwIDIwMFMzMDAgMjUwIDMwMCAzMDBWNDAwSDEwMFYzMDBaIiBmaWxsPSIjMzMzMzMzIi8+Cjwvc3ZnPgo=';

// ULTRA-FAST CACHE: Store profiles in memory for instant access
let profileCache: DJProfile[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

export const fetchSwipeProfiles = async (userId?: string): Promise<DJProfile[]> => {
  // INSTANT CACHE CHECK: Return cached data immediately if fresh
  const now = Date.now();
  if (profileCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('⚡ INSTANT CACHE HIT: Returning cached profiles');
    return [...profileCache];
  }

  if (!userId) throw new Error('Not authenticated');

  try {
    // Query Neon directly
    const data = await sql`
      SELECT * FROM profiles 
      WHERE user_id != ${userId}
      AND is_active = true
      LIMIT 20
    `;
    
    console.log('🚀 NEON FETCH: Loaded', data?.length || 0, 'profiles');

    // Transform and cache
    const profiles = (data || []).map((profile: any) => {
      const profileImage = profile.profile_image_url || profile.images?.[0] || DEFAULT_PROFILE_IMAGE;
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
    
    profileCache = profiles;
    cacheTimestamp = now;
    
    return profiles;
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    throw new ApiError(`Failed to fetch swipe profiles: ${error.message}`, { statusCode: 500 });
  }
};

// Debug function to check Neon connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    await sql`SELECT 1`;
    console.log('🔍 NEON TEST: Connected');
    return true;
  } catch (error: any) {
    console.error('🚨 NEON CONNECTION FAILED:', error);
    throw new ApiError(`Neon connection failed: ${error.message}`, { isNetworkError: true });
  }
};

export const createProfile = async (profileData: {
  dj_name: string;
  bio?: string;
  age?: number;
  location?: string;
  experience_level?: string;
}, userId: string): Promise<DJProfile> => {
  if (!userId) throw new Error('Not authenticated');

  const existing = await sql`SELECT * FROM profiles WHERE user_id = ${userId} LIMIT 1`;

  if (existing.rows[0]) {
    const existingProfile = existing.rows[0];
    const googlePicture = null;
    const googleName = null;
    
    const updates: any = { updated_at: new Date().toISOString() };
    
    // Auto-update name from OAuth or email
    const getUpdatedName = () => {
      if (googleName) return googleName;
      return null;
    };
    
    const updatedName = getUpdatedName();
    if (updatedName) {
      updates.dj_name = updatedName;
    }
    
    if (googlePicture) {
      const currentImages = existingProfile.images || [];
      const hasUserUploadedImage = currentImages.some((img: string) => 
        !img.includes('googleusercontent.com') && 
        !img.includes('data:image/svg') &&
        !img.includes('unsplash.com') &&
        !img.includes('picsum.photos')
      );
      
      if (!hasUserUploadedImage) {
        const newImages = [googlePicture, ...currentImages.filter((img: string) => img !== googlePicture)];
        updates.profile_image_url = googlePicture;
        updates.images = newImages;
      }
    }
    
    if (Object.keys(updates).length > 1) {
      const result = await sql`UPDATE profiles SET ${sql(updates)} WHERE id = ${existingProfile.id} RETURNING *`;
      return result.rows[0] || existingProfile;
    }
    return existingProfile;
  }

  const displayName = profileData.dj_name || 'DJ';

  const result = await sql`
    INSERT INTO profiles (user_id, dj_name, bio, age, location, experience_level, genres, skills, venues, images)
    VALUES (${userId}, ${displayName}, ${profileData.bio || 'New DJ ready to connect!'}, ${profileData.age}, ${profileData.location}, ${profileData.experience_level || 'Beginner'}, ${JSON.stringify(['House', 'Techno'])}, ${JSON.stringify(['Mixing', 'Beatmatching'])}, ${JSON.stringify(['Local Clubs'])}, ${JSON.stringify([DEFAULT_PROFILE_IMAGE])})
    RETURNING *
  `;

  return result.rows[0];
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

  if (error) {
    throw new ApiError(`Failed to upload image: ${error.message}`, { statusCode: error.code as any });
  }

  const { data: { publicUrl } } = supabase.storage
    .from('profile-images')
    .getPublicUrl(fileName);

  return publicUrl;
  */
};

export const updateProfile = async (profileData: Partial<DJProfile>, userId: string): Promise<DJProfile> => {
  if (!userId) throw new Error('Not authenticated');

  const cleanData = Object.fromEntries(
    Object.entries(profileData).filter(([_, value]) => value !== undefined)
  );

  const result = await sql`UPDATE profiles SET ${sql(cleanData)} WHERE user_id = ${userId} RETURNING *`;
  return result.rows[0];
};

export const getCurrentProfile = async (userId: string): Promise<DJProfile | null> => {
  if (!userId) return null;

  const result = await sql`SELECT * FROM profiles WHERE user_id = ${userId} LIMIT 1`;
  return result.rows[0] || null;
};

export const syncCurrentUserGoogleProfile = async (userId: string): Promise<void> => {
  // Deprecated - no longer needed with Clerk
  console.log('⚠️ SYNC: Skipped (Clerk handles profile sync)');
};

// Periodic sync function that runs every 30 minutes
export const startPeriodicProfileSync = (): (() => void) => {
  console.log('🔄 PERIODIC SYNC: Starting automatic Google profile picture sync...');
  
  // Run immediately
  syncCurrentUserGoogleProfile();
  
  // Then run every 2 hours (reduced frequency)
  const interval = setInterval(() => {
    console.log('⏰ PERIODIC SYNC: Running scheduled Google profile sync...');
    syncCurrentUserGoogleProfile();
  }, 2 * 60 * 60 * 1000); // 2 hours
  
  // Return cleanup function
  return () => {
    console.log('🛑 PERIODIC SYNC: Stopping automatic sync...');
    clearInterval(interval);
  };
};

export const recordSwipe = async (profileId: string, direction: 'left' | 'right' | 'super', userId: string): Promise<SwipeResult> => {
  if (!userId) throw new Error('Not authenticated');

  const profile = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (!profile.rows[0]) throw new Error('Profile not found');

  const userProfileId = profile.rows[0].id;

  try {
    await sql`INSERT INTO swipes (swiper_id, swiped_id, direction) VALUES (${userProfileId}, ${profileId}, ${direction})`;
  } catch (error: any) {
    if (error.code !== '23505') console.error('Swipe error:', error);
  }

  if (direction === 'right' || direction === 'super') {
    try {
      const reverseSwipe = await sql`SELECT * FROM swipes WHERE swiper_id = ${profileId} AND swiped_id = ${userProfileId} AND direction = 'right' LIMIT 1`;

      if (reverseSwipe.rows[0]) {
        try {
          await sql`INSERT INTO matches (profile1_id, profile2_id) VALUES (${userProfileId}, ${profileId})`;
        } catch (matchError: any) {
          if (matchError.code !== '23505') console.error('Match error:', matchError);
        }
        return { match: true };
      }
    } catch (error) {
      console.error('Match check error:', error);
    }
  }

  return { match: false };
};

export const fetchMatches = async (userId: string): Promise<DJProfile[]> => {
  if (!userId) throw new Error('Not authenticated');

  const profile = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (!profile.rows[0]) return [];

  const userProfileId = profile.rows[0].id;

  try {
    const matches = await sql`
      SELECT m.id as match_id, m.*, 
             p1.*, p2.*
      FROM matches m
      LEFT JOIN profiles p1 ON m.profile1_id = p1.id
      LEFT JOIN profiles p2 ON m.profile2_id = p2.id
      WHERE m.profile1_id = ${userProfileId} OR m.profile2_id = ${userProfileId}
    `;

    return matches.rows.map(match => {
      const otherProfile = match.profile1_id === userProfileId ? 
        { id: match.profile2_id, dj_name: match.dj_name } : 
        { id: match.profile1_id, dj_name: match.dj_name };
      return {
        ...otherProfile,
        match_id: match.match_id
      };
    });
  } catch (error) {
    console.error('Fetch matches error:', error);
    return [];
  }
};

export const undoSwipe = async (userId: string): Promise<void> => {
  if (!userId) throw new Error('Not authenticated');

  const profile = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (!profile.rows[0]) throw new Error('Profile not found');

  await sql`DELETE FROM swipes WHERE id = (SELECT id FROM swipes WHERE swiper_id = ${profile.rows[0].id} ORDER BY created_at DESC LIMIT 1)`;
};

export const deleteMatch = async (matchId: string, userId: string): Promise<void> => {
  if (!validateInput(matchId, 50)) throw new Error('Invalid match ID');
  if (!userId) throw new Error('Not authenticated');

  const profile = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;
  if (!profile.rows[0]) throw new Error('Profile not found');

  const userProfileId = profile.rows[0].id;
  console.log('🎯 HYBRID UNMATCH:', sanitizeForLog(matchId));
  
  const match = await sql`SELECT profile1_id, profile2_id FROM matches WHERE id = ${matchId} LIMIT 1`;

  if (match.rows[0]) {
    const otherProfileId = match.rows[0].profile1_id === userProfileId ? match.rows[0].profile2_id : match.rows[0].profile1_id;
    
    try {
      await sql`DELETE FROM matches WHERE id = ${matchId}`;
      await sql`DELETE FROM swipes WHERE swiper_id = ${userProfileId} AND swiped_id = ${otherProfileId}`;
      await sql`DELETE FROM swipes WHERE swiper_id = ${otherProfileId} AND swiped_id = ${userProfileId}`;
    } catch (deleteError) {
      console.error('Delete match error:', sanitizeForLog(deleteError));
      throw new ApiError(`Failed to delete match: ${deleteError.message}`, { statusCode: (deleteError as any).code });
    }
      
    console.log('✨ HYBRID UNMATCH COMPLETE!');
  }
};

export const subscribeToCareerAccelerator = async (email: string, firstName?: string): Promise<void> => {
  console.log('Attempting Career Accelerator signup:', { email, firstName });
  
  try {
    await sql`INSERT INTO career_accelerator_leads (email, first_name) VALUES (${email.trim()}, ${firstName?.trim() || null})`;
    console.log('Career Accelerator signup successful');
    

    
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
  } catch (err: any) {
    if (err.code === '23505') {
      console.log('Email already signed up for Career Accelerator');
      return;
    }
    console.error('Career Accelerator signup error:', err);
    throw new ApiError(`Career Accelerator signup failed: ${err.message}`, { statusCode: err.code as any, isNetworkError: err instanceof TypeError });
  }
};

export const subscribeToNewsletter = async (email: string, firstName?: string): Promise<void> => {
  console.log('Attempting to subscribe:', { email, firstName });
  
  try {
    await sql`INSERT INTO newsletter_subscribers (email, first_name) VALUES (${email.trim()}, ${firstName?.trim() || null})`;
    console.log('Newsletter subscription successful');
  } catch (err: any) {
    if (err.code === '23505') {
      console.log('Email already subscribed');
      return;
    }
    console.error('Newsletter subscription error:', err);
    throw new ApiError(`Newsletter subscription failed: ${err.message}`, { statusCode: err.code as any, isNetworkError: err instanceof TypeError });
  }
};
