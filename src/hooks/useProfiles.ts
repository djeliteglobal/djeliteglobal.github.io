import { useQuery } from '@tanstack/react-query';
import { supabase } from '../config/supabase';

export const useProfiles = (userId?: string, limit = 20) => {
  return useQuery({
    queryKey: ['profiles', userId, limit],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', userId)
        .limit(limit);
      
      if (error) {
        console.error('Profile fetch error:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on timeout errors
      if (error?.code === '57014') return false;
      return failureCount < 2;
    },
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