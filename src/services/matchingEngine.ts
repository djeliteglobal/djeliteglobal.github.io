import { supabase } from '../config/supabase';
import type { DJProfile } from '../types/profile';

interface MatchScore {
  profileId: string;
  score: number;
  reasons: string[];
  compatibility: {
    musical: number;
    geographic: number;
    social: number;
    activity: number;
  };
}

interface MatchingPreferences {
  maxDistance?: number;
  preferredGenres?: string[];
  experienceLevel?: string[];
  collaborationType?: 'gigs' | 'production' | 'networking' | 'all';
}

class MatchingEngine {
  private cache = new Map<string, MatchScore[]>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 300000; // 5 minutes

  async getOptimalMatches(
    currentUserId: string, 
    preferences: MatchingPreferences = {},
    limit: number = 20
  ): Promise<DJProfile[]> {
    const cacheKey = `${currentUserId}_${JSON.stringify(preferences)}`;
    
    // Check cache first
    if (this.isValidCache(cacheKey)) {
      console.log('⚡ MATCHING ENGINE: Cache hit');
      return this.getCachedProfiles(cacheKey, limit);
    }

    console.log('🧠 MATCHING ENGINE: Computing optimal matches...');
    
    try {
      // Get current user profile
      const currentProfile = await this.getCurrentUserProfile(currentUserId);
      if (!currentProfile) throw new Error('User profile not found');

      // Get potential matches with advanced filtering
      const candidates = await this.getCandidateProfiles(currentUserId, preferences);
      
      // Calculate compatibility scores
      const scoredMatches = await Promise.all(
        candidates.map(candidate => this.calculateMatchScore(currentProfile, candidate))
      );

      // Sort by score and cache results
      const sortedMatches = scoredMatches
        .sort((a, b) => b.score - a.score)
        .slice(0, limit * 2); // Cache more for better UX

      this.cache.set(cacheKey, sortedMatches);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);

      return this.getCachedProfiles(cacheKey, limit);
    } catch (error) {
      console.error('❌ MATCHING ENGINE ERROR:', error);
      return this.getFallbackProfiles(currentUserId, limit);
    }
  }

  private async getCurrentUserProfile(userId: string): Promise<DJProfile | null> {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return data;
  }

  private async getCandidateProfiles(
    currentUserId: string, 
    preferences: MatchingPreferences
  ): Promise<DJProfile[]> {
    try {
      // SIMPLIFIED QUERY: Basic filtering without complex joins
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('user_id', currentUserId)
        .limit(50);

      // Apply preference filters if available
      if (preferences.preferredGenres?.length) {
        query = query.overlaps('genres', preferences.preferredGenres);
      }

      if (preferences.experienceLevel?.length) {
        query = query.in('experience_level', preferences.experienceLevel);
      }

      const { data, error } = await query;
      
      if (error) {
        console.warn('🔄 MATCHING ENGINE: Query error, using fallback', error);
        // Fallback to simplest query
        const { data: fallbackData } = await supabase
          .from('profiles')
          .select('*')
          .neq('user_id', currentUserId)
          .limit(20);
        return fallbackData || [];
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ MATCHING ENGINE: Database error', error);
      return [];
    }
  }

  private async calculateMatchScore(
    currentProfile: DJProfile, 
    candidate: DJProfile
  ): Promise<MatchScore> {
    const compatibility = {
      musical: this.calculateMusicalCompatibility(currentProfile, candidate),
      geographic: this.calculateGeographicCompatibility(currentProfile, candidate),
      social: await this.calculateSocialCompatibility(currentProfile.id, candidate.id),
      activity: this.calculateActivityScore(candidate)
    };

    const weights = { musical: 0.4, geographic: 0.2, social: 0.3, activity: 0.1 };
    const score = Object.entries(compatibility)
      .reduce((total, [key, value]) => total + (value * weights[key as keyof typeof weights]), 0);

    const reasons = this.generateMatchReasons(compatibility, currentProfile, candidate);

    return {
      profileId: candidate.id,
      score: Math.round(score * 100),
      reasons,
      compatibility
    };
  }

  private calculateMusicalCompatibility(profile1: DJProfile, profile2: DJProfile): number {
    const genres1 = new Set(profile1.genres || []);
    const genres2 = new Set(profile2.genres || []);
    const skills1 = new Set(profile1.skills || []);
    const skills2 = new Set(profile2.skills || []);

    // Genre overlap
    const genreOverlap = [...genres1].filter(g => genres2.has(g)).length;
    const genreScore = genreOverlap / Math.max(genres1.size, genres2.size, 1);

    // Complementary skills
    const skillComplement = [...skills1].filter(s => !skills2.has(s)).length;
    const skillScore = skillComplement / Math.max(skills1.size + skills2.size, 1);

    // Experience level compatibility
    const experienceScore = this.getExperienceCompatibility(
      profile1.experience_level, 
      profile2.experience_level
    );

    return (genreScore * 0.5) + (skillScore * 0.3) + (experienceScore * 0.2);
  }

  private calculateGeographicCompatibility(profile1: DJProfile, profile2: DJProfile): number {
    if (!profile1.location || !profile2.location) return 0.5;
    
    // Simple location matching (can be enhanced with actual coordinates)
    const location1 = profile1.location.toLowerCase();
    const location2 = profile2.location.toLowerCase();
    
    if (location1 === location2) return 1.0;
    if (location1.includes(location2) || location2.includes(location1)) return 0.8;
    
    // Check for same country/region
    const commonWords = location1.split(' ').filter(word => 
      location2.includes(word) && word.length > 2
    );
    
    return Math.min(commonWords.length * 0.3, 0.6);
  }

  private async calculateSocialCompatibility(profileId1: string, profileId2: string): Promise<number> {
    try {
      // SIMPLIFIED: Basic mutual connection check
      const { count: mutualConnections } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .or(`profile1_id.eq.${profileId1},profile2_id.eq.${profileId1}`)
        .limit(10);

      // Return basic social score
      return Math.min((mutualConnections || 0) * 0.1, 0.5);
    } catch (error) {
      // Silent fallback - don't break matching
      return 0.1; // Default small social score
    }
  }

  private calculateActivityScore(profile: DJProfile): number {
    if (!profile.last_active_at) return 0.1;
    
    const lastActive = new Date(profile.last_active_at).getTime();
    const now = Date.now();
    const daysSinceActive = (now - lastActive) / (1000 * 60 * 60 * 24);
    
    if (daysSinceActive < 1) return 1.0;
    if (daysSinceActive < 3) return 0.8;
    if (daysSinceActive < 7) return 0.6;
    if (daysSinceActive < 30) return 0.4;
    return 0.2;
  }

  private getExperienceCompatibility(exp1?: string, exp2?: string): number {
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
    const idx1 = levels.indexOf(exp1 || 'Beginner');
    const idx2 = levels.indexOf(exp2 || 'Beginner');
    
    const diff = Math.abs(idx1 - idx2);
    return Math.max(0, 1 - (diff * 0.25));
  }

  private generateMatchReasons(
    compatibility: MatchScore['compatibility'],
    currentProfile: DJProfile,
    candidate: DJProfile
  ): string[] {
    const reasons: string[] = [];
    
    if (compatibility.musical > 0.7) {
      const commonGenres = (currentProfile.genres || [])
        .filter(g => (candidate.genres || []).includes(g));
      if (commonGenres.length > 0) {
        reasons.push(`Both love ${commonGenres.slice(0, 2).join(' & ')}`);
      }
    }
    
    if (compatibility.geographic > 0.8) {
      reasons.push(`Both based in ${candidate.location}`);
    }
    
    if (compatibility.social > 0.5) {
      reasons.push('You have mutual connections');
    }
    
    if (compatibility.activity > 0.8) {
      reasons.push('Very active on the platform');
    }
    
    // Add skill-based reasons
    const complementarySkills = (currentProfile.skills || [])
      .filter(s => !(candidate.skills || []).includes(s));
    if (complementarySkills.length > 0) {
      reasons.push(`Can teach you ${complementarySkills[0]}`);
    }
    
    return reasons.slice(0, 3); // Limit to top 3 reasons
  }

  private isValidCache(cacheKey: string): boolean {
    const expiry = this.cacheExpiry.get(cacheKey);
    return expiry ? Date.now() < expiry : false;
  }

  private async getCachedProfiles(cacheKey: string, limit: number): Promise<DJProfile[]> {
    const cached = this.cache.get(cacheKey) || [];
    const profileIds = cached.slice(0, limit).map(m => m.profileId);
    
    if (profileIds.length === 0) return [];
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .in('id', profileIds);
    
    // Maintain order and add match reasons
    return (data || [])
      .sort((a, b) => profileIds.indexOf(a.id) - profileIds.indexOf(b.id))
      .map(profile => {
        const matchData = cached.find(m => m.profileId === profile.id);
        return {
          ...profile,
          matchScore: matchData?.score,
          matchReasons: matchData?.reasons,
          compatibility: matchData?.compatibility
        };
      });
  }

  private async getFallbackProfiles(currentUserId: string, limit: number): Promise<DJProfile[]> {
    console.log('🔄 MATCHING ENGINE: Using fallback profiles');
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .neq('user_id', currentUserId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return data || [];
  }

  // Clear cache when user preferences change
  clearCache(userId?: string): void {
    if (userId) {
      const keysToDelete = Array.from(this.cache.keys())
        .filter(key => key.startsWith(userId));
      keysToDelete.forEach(key => {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
      });
    } else {
      this.cache.clear();
      this.cacheExpiry.clear();
    }
    console.log('🗑️ MATCHING ENGINE: Cache cleared');
  }
}

export const matchingEngine = new MatchingEngine();
export type { MatchScore, MatchingPreferences };