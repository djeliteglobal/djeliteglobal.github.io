import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { deleteMatch, fetchMatches } from '../services/profileService';
import { checkConnectionLimit } from '../services/subscriptionService';
import { sanitizeForLog, validateInput } from '../utils/sanitizer';
import type { Match, MatchStore } from '../types/match';

export const useMatchStore = create<MatchStore>()(
  subscribeWithSelector((set, get) => ({
    matches: [],
    unmatchedIds: new Set(),
    isLoading: false,
    connectionLimit: null,

    loadMatches: async () => {
      set({ isLoading: true });
      try {
        const matches = await fetchMatches();
        const connectionLimit = await checkConnectionLimit();
        const { unmatchedIds } = get();
        
        // Filter out unmatched profiles
        const filteredMatches = matches.filter(
          match => !unmatchedIds.has(match.id)
        );
        
        set({ matches: filteredMatches, connectionLimit, isLoading: false });
      } catch (error) {
        console.error('Load matches error:', sanitizeForLog(error));
        set({ isLoading: false });
      }
    },

    checkCanConnect: async () => {
      const connectionLimit = await checkConnectionLimit();
      set({ connectionLimit });
      return connectionLimit.canConnect;
    },

    unmatch: async (matchId: string) => {
      const { matches, unmatchedIds } = get();
      
      // Find the match to get profile ID
      // Validate input to prevent NoSQL injection
      if (!validateInput(matchId, 50)) {
        console.error('Invalid match ID provided');
        return;
      }
      
      const match = matches.find(m => m.match_id === matchId);
      if (!match) return;
      
      // Optimistically update UI
      set({
        matches: matches.filter(m => m.match_id !== matchId),
        unmatchedIds: new Set([...unmatchedIds, match.id])
      });
      
      try {
        await deleteMatch(matchId);
        console.log('✅ Unmatch successful for ID:', sanitizeForLog(matchId));
      } catch (error) {
        console.error('❌ Unmatch failed:', sanitizeForLog(error));
        // Rollback on error
        set({ matches, unmatchedIds });
      }
    },

    isUnmatched: (profileId: string) => {
      return get().unmatchedIds.has(profileId);
    }
  }))
);