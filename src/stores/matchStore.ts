import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { deleteMatch, fetchMatches } from '../services/profileService';
import { checkConnectionLimit } from '../services/subscriptionService';
import { sanitizeForLog, validateInput } from '../utils/sanitizer';
import type { Match, MatchStore } from '../types/match';

let cachedUserId: string | null = null;

export const setMatchStoreUserId = (userId: string) => {
  cachedUserId = userId;
};

const getUserId = (): string => {
  if (!cachedUserId) {
    throw new Error('Not authenticated');
  }
  return cachedUserId;
};

export const useMatchStore = create<MatchStore>()(
  subscribeWithSelector((set, get) => ({
    matches: [],
    unmatchedIds: new Set(),
    isLoading: false,
    connectionLimit: null,

    loadMatches: async () => {
      set({ isLoading: true });
      try {
        const userId = getUserId();
        const matches = await fetchMatches(userId);
        const connectionLimit = await checkConnectionLimit(userId);
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
      const userId = getUserId();
      const connectionLimit = await checkConnectionLimit(userId);
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
        const userId = getUserId();
        await deleteMatch(matchId, userId);
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
