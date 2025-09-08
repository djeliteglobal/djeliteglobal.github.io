import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteMatch, fetchMatches } from '../services/profileService';

export const useMatches = () => {
  const queryClient = useQueryClient();

  const matchesQuery = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    staleTime: 0, // Always fresh
  });

  const unmatchMutation = useMutation({
    mutationFn: deleteMatch,
    onMutate: async (matchId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['matches'] });
      
      // Snapshot previous value
      const previousMatches = queryClient.getQueryData(['matches']);
      
      // Optimistically remove match
      queryClient.setQueryData(['matches'], (old: any[]) => 
        old?.filter(match => match.match_id !== matchId) || []
      );
      
      return { previousMatches };
    },
    onError: (err, matchId, context) => {
      // Rollback on error
      queryClient.setQueryData(['matches'], context?.previousMatches);
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });

  return {
    matches: matchesQuery.data || [],
    isLoading: matchesQuery.isLoading,
    unmatch: unmatchMutation.mutate,
    isUnmatching: unmatchMutation.isPending,
  };
};