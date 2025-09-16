import { supabase } from '../config/supabase';
import { matchingEngine } from './matchingEngine';

export interface TopPick {
  id: string;
  profile: any;
  score: number;
  reasons: string[];
  pickType: 'daily' | 'premium' | 'trending';
  expires_at: string;
}

export const generateTopPicks = async (): Promise<TopPick[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    // Get AI-powered matches
    const matches = await matchingEngine.getOptimalMatches(user.id, {}, 50);
    
    // Filter for top picks criteria
    const topCandidates = matches.filter(profile => 
      profile.matchScore && profile.matchScore > 80
    );

    // Get trending profiles (most liked recently)
    const { data: trendingProfiles } = await supabase
      .from('profiles')
      .select(`
        *,
        swipe_count:swipes!swipes_swiped_id_fkey(count)
      `)
      .gte('last_active_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

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

    // Premium picks (boosted profiles)
    const { data: boostedProfiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_boosted', true)
      .gt('boost_expires_at', new Date().toISOString())
      .limit(5);

    (boostedProfiles || []).forEach(profile => {
      allPicks.push({
        id: `premium-${profile.id}`,
        profile,
        score: 95, // High score for boosted
        reasons: ['Premium member', 'Recently active'],
        pickType: 'premium',
        expires_at: profile.boost_expires_at
      });
    });

    // Trending picks
    (trendingProfiles || []).slice(0, 2).forEach(profile => {
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

export const getTopPicks = async (): Promise<TopPick[]> => {
  // Check cache first
  const cacheKey = 'top_picks';
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { picks, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > 60 * 60 * 1000; // 1 hour
    
    if (!isExpired) {
      return picks.filter((pick: TopPick) => 
        new Date(pick.expires_at).getTime() > Date.now()
      );
    }
  }

  // Generate fresh picks
  const picks = await generateTopPicks();
  
  // Cache results
  localStorage.setItem(cacheKey, JSON.stringify({
    picks,
    timestamp: Date.now()
  }));

  return picks;
};

export const recordTopPickView = async (pickId: string): Promise<void> => {
  try {
    await supabase
      .from('top_pick_analytics')
      .insert({
        pick_id: pickId,
        action: 'view',
        created_at: new Date().toISOString()
      });
  } catch (error) {
    // Silent fail for analytics
  }
};

export const recordTopPickSwipe = async (pickId: string, direction: 'left' | 'right'): Promise<void> => {
  try {
    await supabase
      .from('top_pick_analytics')
      .insert({
        pick_id: pickId,
        action: direction === 'right' ? 'like' : 'pass',
        created_at: new Date().toISOString()
      });
  } catch (error) {
    // Silent fail for analytics
  }
};