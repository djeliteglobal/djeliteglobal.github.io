import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { deleteMatch, fetchMatches } from '../services/profileService';

interface MatchStore {
  matches: any[];
  unmatchedIds: Set<string>;
  isLoading: boolean;
  
  loadMatches: () => Promise<void>;
  unmatch: (matchId: string) => Promise<void>;
  isUnmatched: (profileId: string) => boolean;
}

export const useMatchStore = create<MatchStore>()(
  subscribeWithSelector((set, get) => ({
    matches: [],
    unmatchedIds: new Set(),
    isLoading: false,

    loadMatches: async () => {
      set({ isLoading: true });
      try {
        const matches = await fetchMatches();
        const { unmatchedIds } = get();
        
        // Filter out unmatched profiles
        const filteredMatches = matches.filter(
          match => !unmatchedIds.has(match.id)
        );
        
        set({ matches: filteredMatches, isLoading: false });
      } catch (error) {
        console.error('Load matches error:', error);
        set({ isLoading: false });
      }
    },

    unmatch: async (matchId: string) => {
      const { matches, unmatchedIds } = get();
      
      // Find the match to get profile ID
      const match = matches.find(m => m.match_id === matchId);
      if (!match) return;
      
      // Optimistically update UI
      set({
        matches: matches.filter(m => m.match_id !== matchId),
        unmatchedIds: new Set([...unmatchedIds, match.id])
      });
      
      try {
        await deleteMatch(matchId);
        console.log('✅ Unmatch successful');
      } catch (error) {
        console.error('❌ Unmatch failed:', error);
        // Rollback on error
        set({ matches, unmatchedIds });
      }
    },

    isUnmatched: (profileId: string) => {
      return get().unmatchedIds.has(profileId);
    }
  }))
);