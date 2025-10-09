import { sql } from '../config/supabase';
import { matchingEngine } from './matchingEngine';

export interface TopPick {
  id: string;
  profile: any;
  score: number;
  reasons: string[];
  pickType: 'daily' | 'premium' | 'trending';
  expires_at: string;
}

export const generateTopPicks = async (userId: string): Promise<TopPick[]> => {
  if (!userId) return [];

  try {
    const matches = await matchingEngine.getOptimalMatches(userId, {}, 50);
    
    // Filter for top picks criteria
    const topCandidates = matches.filter(profile => 
      profile.matchScore && profile.matchScore > 80
    );

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const trendingProfiles = await sql`SELECT * FROM profiles WHERE last_active_at >= ${weekAgo} ORDER BY created_at DESC LIMIT 10`;

    // Combine and score
    const allPicks: TopPick[] = [];

    // Daily picks (highest compatibility)
    topCandidates.slice(0, 3).forEach((profile, index) => {
      allPicks.push({
        id: `daily-${profile.id}`,
        profile,
        score: profile.matchScore || 0,
        reasons: profile.matchReasons || [],
        pickType: 'daily',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    });

    const boostedProfiles = await sql`SELECT * FROM profiles WHERE is_boosted = true AND boost_expires_at > NOW() LIMIT 5`;

    boostedProfiles.rows.forEach(profile => {
      allPicks.push({
        id: `premium-${profile.id}`,
        profile,
        score: 95, // High score for boosted
        reasons: ['Premium member', 'Recently active'],
        pickType: 'premium',
        expires_at: profile.boost_expires_at
      });
    });

    trendingProfiles.rows.slice(0, 2).forEach(profile => {
      allPicks.push({
        id: `trending-${profile.id}`,
        profile,
        score: 85,
        reasons: ['Trending now', 'Popular with other DJs'],
        pickType: 'trending',
        expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
      });
    });

    // Remove duplicates and sort by score
    const uniquePicks = allPicks.filter((pick, index, self) => 
      index === self.findIndex(p => p.profile.id === pick.profile.id)
    );

    return uniquePicks
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

  } catch (error) {
    console.error('Error generating top picks:', error);
    return [];
  }
};

export const getTopPicks = async (userId: string): Promise<TopPick[]> => {
  const cacheKey = 'top_picks';
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { picks, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > 60 * 60 * 1000;
    
    if (!isExpired) {
      return picks.filter((pick: TopPick) => 
        new Date(pick.expires_at).getTime() > Date.now()
      );
    }
  }

  const picks = await generateTopPicks(userId);
  
  localStorage.setItem(cacheKey, JSON.stringify({
    picks,
    timestamp: Date.now()
  }));

  return picks;
};

export const recordTopPickView = async (pickId: string): Promise<void> => {
  try {
    await sql`INSERT INTO top_pick_analytics (pick_id, action, created_at) VALUES (${pickId}, 'view', NOW())`;
  } catch (error) {}
};

export const recordTopPickSwipe = async (pickId: string, direction: 'left' | 'right'): Promise<void> => {
  try {
    const action = direction === 'right' ? 'like' : 'pass';
    await sql`INSERT INTO top_pick_analytics (pick_id, action, created_at) VALUES (${pickId}, ${action}, NOW())`;
  } catch (error) {}
};
