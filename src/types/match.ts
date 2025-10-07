export interface Match {
  id: string;
  match_id: string;
  user_id: string;
  matched_user_id: string;
  created_at: string;
  status: 'active' | 'unmatched' | 'blocked';
  profile?: {
    id: string;
    name: string;
    avatar_url?: string;
    city?: string;
    genres?: string[];
  };
}

export interface MatchStore {
  matches: Match[];
  unmatchedIds: Set<string>;
  isLoading: boolean;
  connectionLimit: { canConnect: boolean; remaining: number } | null;
  
  loadMatches: () => Promise<void>;
  unmatch: (matchId: string) => Promise<void>;
  isUnmatched: (profileId: string) => boolean;
  checkCanConnect: () => Promise<boolean>;
}
