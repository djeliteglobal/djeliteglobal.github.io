import { useQuery } from '@tanstack/react-query';
import { supabase } from '../config/supabase';
import { mockProfiles } from '../data/mockProfiles';

export const useProfiles = (userId?: string, limit = 20) => {
  return useQuery({
    queryKey: ['profiles', userId, limit],
    queryFn: async () => {
      if (!userId) return mockProfiles;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('user_id', userId)
          .limit(limit);
        
        if (error) {
          console.warn('Supabase error, using mock data:', error);
          return mockProfiles;
        }
        
        return data && data.length > 0 ? data : mockProfiles;
      } catch (error) {
        console.warn('Network error, using mock data:', error);
        return mockProfiles;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Disable all retries to prevent connection spam
    enabled: false, // Disable automatic queries for now
  });
};

export const useCurrentUserProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Current user profile fetch error:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};