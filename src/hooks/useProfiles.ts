import { useQuery } from '@tanstack/react-query';
import { supabase } from '../config/supabase';
import { mockProfiles } from '../data/mockProfiles';

export const useProfiles = (userId?: string, limit = 20) => {
  return useQuery({
    queryKey: ['profiles', userId, limit],
    queryFn: async () => {
      // Always return mock data to avoid database calls
      return mockProfiles;
    },
    enabled: false, // Completely disabled
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    retry: false,
  });
};

export const useCurrentUserProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      // Return mock current user data
      return {
        id: userId || 'current-user',
        user_id: userId || 'current-user',
        dj_name: 'Your DJ Name',
        profile_image_url: `https://picsum.photos/seed/${userId}/400/400`,
        location: 'Your Location',
        genres: ['Your Genre'],
        bio: 'Your bio here'
      };
    },
    enabled: false, // Completely disabled
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    retry: false,
  });
};