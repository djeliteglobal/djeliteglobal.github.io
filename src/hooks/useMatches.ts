import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteMatch, fetchMatches } from '../services/profileService';

export const useMatches = () => {
  const queryClient = useQueryClient();

  const matchesQuery = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    staleTime: 0,
    gcTime: 0, // No cache
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const unmatchMutation = useMutation({
    mutationFn: deleteMatch,
    onMutate: async (matchId) => {
      await queryClient.cancelQueries({ queryKey: ['matches'] });
      
      const previousMatches = queryClient.getQueryData(['matches']);
      
      // Aggressively remove match
      queryClient.setQueryData(['matches'], (old: any[]) => {
        const filtered = old?.filter(match => match.match_id !== matchId) || [];
        console.log('🚀 OPTIMISTIC REMOVAL:', { matchId, before: old?.length, after: filtered.length });
        return filtered;
      });
      
      return { previousMatches };
    },
    onSuccess: async () => {
      // Just invalidate, don't refetch immediately
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      console.log('✅ MATCH DELETED - Cache invalidated');
    },
    onError: (err, matchId, context) => {
      queryClient.setQueryData(['matches'], context?.previousMatches);
      console.error('❌ Unmatch failed, rolled back');
    },
  });

  return {
    matches: matchesQuery.data || [],
    isLoading: matchesQuery.isLoading,
    unmatch: unmatchMutation.mutate,
    isUnmatching: unmatchMutation.isPending,
    refetch: matchesQuery.refetch,
  };
};