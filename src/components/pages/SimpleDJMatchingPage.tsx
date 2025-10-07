import React, { useState, useCallback, useEffect } from 'react';
import { UltraFastSwipeCard } from '../swipe/UltraFastSwipeCard';
import { Button } from '../platform';
import { ReferralSection } from '../referrals/ReferralSection';
import { matchingEngine, type MatchingPreferences } from '../../services/matchingEngine';
import { useAuth } from '../../contexts/ClerkAuthContext';
import type { Opportunity } from '../../types/platform';
import type { DJProfile } from '../../types/profile';

// Simulate swipe result
const simulateSwipeResult = (direction: 'left' | 'right' | 'super') => {
  const isMatch = direction === 'right' || direction === 'super'
    ? Math.random() > (direction === 'super' ? 0.1 : 0.4)
    : false;
  return { match: isMatch, success: true };
};

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: 'Sarah Mix',
    age: 26,
    bio: 'House & Techno DJ from Berlin. Love underground vibes and late-night sets. Looking for collaboration opportunities!',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyNy42MTQgMTAwIDI1MCA4Ny42MTQyIDI1MCA2MEMyNTAgMzIuMzg1OCAyMjcuNjE0IDEwIDIwMCAxMEMxNzIuMzg2IDEwIDE1MCAzMi4zODU4IDE1MCA2MEMxNTAgODcuNjE0MiAxNzIuMzg2IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDM5MEgxMDBDMTAwIDMzMC4yIDEzOS44IDI4MCAyMDAgMjgwQzI2MC4yIDI4MCAzMDAgMzMwLjIgMzAwIDM5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+',
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyNy42MTQgMTAwIDI1MCA4Ny42MTQyIDI1MCA2MEMyNTAgMzIuMzg1OCAyMjcuNjE0IDEwIDIwMCAxMEMxNzIuMzg2IDEwIDE1MCAzMi4zODU4IDE1MCA2MEMxNTAgODcuNjE0MiAxNzIuMzg2IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDM5MEgxMDBDMTAwIDMzMC4yIDEzOS44IDI4MCAyMDAgMjgwQzI2MC4yIDI4MCAzMDAgMzMwLjIgMzAwIDM5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
    ],
    venue: 'Techno Club Berlin',
    location: 'Berlin, Germany',
    date: '2025-01-20',
    genres: ['House', 'Techno', 'Deep House'],
    fee: '$300/night',
    skills: ['Mixing', 'Production', 'Event Planning']
  },
  {
    id: 2,
    title: 'Mike Bass',
    age: 29,
    bio: 'Drum & Bass producer and DJ. 10+ years experience. Always down for back-to-back sets and studio sessions.',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyNy42MTQgMTAwIDI1MCA4Ny42MTQyIDI1MCA2MEMyNTAgMzIuMzg1OCAyMjcuNjE0IDEwIDIwMCAxMEMxNzIuMzg2IDEwIDE1MCAzMi4zODU4IDE1MCA2MEMxNTAgODcuNjE0MiAxNzIuMzg2IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDM5MEgxMDBDMTAwIDMzMC4yIDEzOS44IDI4MCAyMDAgMjgwQzI2MC4yIDI4MCAzMDAgMzMwLjIgMzAwIDM5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+',
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyNy42MTQgMTAwIDI1MCA4Ny42MTQyIDI1MCA2MEMyNTAgMzIuMzg1OCAyMjcuNjE0IDEwIDIwMCAxMEMxNzIuMzg2IDEwIDE1MCAzMi4zODU4IDE1MCA2MEMxNTAgODcuNjE0MiAxNzIuMzg2IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDM5MEgxMDBDMTAwIDMzMC4yIDEzOS44IDI4MCAyMDAgMjgwQzI2MC4yIDI4MCAzMDAgMzMwLjIgMzAwIDM5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyNy42MTQgMTAwIDI1MCA4Ny42MTQyIDI1MCA2MEMyNTAgMzIuMzg1OCAyMjcuNjE0IDEwIDIwMCAxMEMxNzIuMzg2IDEwIDE1MCAzMi4zODU4IDE1MCA2MEMxNTAgODcuNjE0MiAxNzIuMzg2IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDM5MEgxMDBDMTAwIDMzMC4yIDEzOS44IDI4MCAyMDAgMjgwQzI2MC4yIDI4MCAzMDAgMzMwLjIgMzAwIDM5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
    ],
    venue: 'DnB Nights London',
    location: 'London, UK',
    date: '2025-01-25',
    genres: ['Drum & Bass', 'Jungle', 'Breakbeat'],
    fee: '$250/night',
    skills: ['Production', 'Sound Engineering', 'Mastering']
  },
  {
    id: 3,
    title: 'Luna Trance',
    age: 24,
    bio: 'Trance & Progressive DJ. Festival regular. Love connecting with crowds through uplifting melodies.',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyNy42MTQgMTAwIDI1MCA4Ny42MTQyIDI1MCA2MEMyNTAgMzIuMzg1OCAyMjcuNjE0IDEwIDIwMCAxMEMxNzIuMzg2IDEwIDE1MCAzMi4zODU4IDE1MCA2MEMxNTAgODcuNjE0MiAxNzIuMzg2IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDM5MEgxMDBDMTAwIDMzMC4yIDEzOS44IDI4MCAyMDAgMjgwQzI2MC4yIDI4MCAzMDAgMzMwLjIgMzAwIDM5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+',
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyNy42MTQgMTAwIDI1MCA4Ny42MTQyIDI1MCA2MEMyNTAgMzIuMzg1OCAyMjcuNjE0IDEwIDIwMCAxMEMxNzIuMzg2IDEwIDE1MCAzMi4zODU4IDE1MCA2MEMxNTAgODcuNjE0MiAxNzIuMzg2IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDM5MEgxMDBDMTAwIDMzMC4yIDEzOS44IDI4MCAyMDAgMjgwQzI2MC4yIDI4MCAzMDAgMzMwLjIgMzAwIDM5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyNy42MTQgMTAwIDI1MCA4Ny42MTQyIDI1MCA2MEMyNTAgMzIuMzg1OCAyMjcuNjE0IDEwIDIwMCAxMEMxNzIuMzg2IDEwIDE1MCAzMi4zODU4IDE1MCA2MEMxNTAgODcuNjE0MiAxNzIuMzg2IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDM5MEgxMDBDMTAwIDMzMC4yIDEzOS44IDI4MCAyMDAgMjgwQzI2MC4yIDI4MCAzMDAgMzMwLjIgMzAwIDM5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
    ],
    venue: 'Trance Festival Amsterdam',
    location: 'Amsterdam, NL',
    date: '2025-02-01',
    genres: ['Trance', 'Progressive', 'Uplifting'],
    fee: '$400/night',
    skills: ['Festival DJ', 'Crowd Control', 'Music Production']
  }
];

export const SimpleDJMatchingPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState<'discover' | 'matches' | 'referrals' | 'premium'>('discover');
  const [profiles, setProfiles] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [djProfiles, setDjProfiles] = useState<DJProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [processedSwipes, setProcessedSwipes] = useState<Set<string>>(new Set());
  const [swipeCooldown, setSwipeCooldown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matchingActive, setMatchingActive] = useState(false);

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'super') => {
    if (!profiles[currentIndex] || swipeCooldown) return;

    const swipedProfile = profiles[currentIndex];
    const swipeKey = `${swipedProfile.id}-${direction}`;

    // Prevent duplicate swipes
    if (processedSwipes.has(swipeKey)) {
      console.log('🚫 Duplicate swipe prevented:', swipeKey);
      return;
    }

    // Add cooldown to prevent rapid clicks
    setSwipeCooldown(true);
    setTimeout(() => setSwipeCooldown(false), 300);

    console.log(`User ${direction} on ${swipedProfile.title}`);

    // Mark this swipe as processed
    setProcessedSwipes(prev => new Set(prev).add(swipeKey));

    try {
      // Simulate API call
      const result = simulateSwipeResult(direction);

      if (result.match) {
        setMatchCount(prev => prev + 1);
        console.log(`🎉 MATCH with ${swipedProfile.title}!`);
      }
    } catch (error) {
      console.error('Swipe error:', error);
    }

    // Always move to next profile
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Reset to start with fresh swipe session
      setCurrentIndex(0);
      setProcessedSwipes(new Set());
    }
  }, [currentIndex, profiles, processedSwipes, swipeCooldown]);

  // Load DJ profiles using matching engine
  useEffect(() => {
    const loadDJProfiles = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setMatchingActive(true);
        console.log('🧠 Loading DJ profiles with matching engine...');
        
        const preferences: MatchingPreferences = {
          collaborationType: 'all'
        };
        
        const matches = await matchingEngine.getOptimalMatches(
          currentUser?.email || 'unknown',
          preferences,
          20
        );
        
        console.log(`✅ Loaded ${matches.length} DJ profiles`);
        setDjProfiles(matches);
        
        // Convert DJ profiles to opportunities format for display
        const opportunityProfiles: Opportunity[] = matches.map((profile, index) => ({
          id: index + 1, // Use index as id since Opportunity expects number
          title: profile.dj_name,
          age: profile.age,
          bio: profile.bio || '',
          imageUrl: profile.images?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyNy42MTQgMTAwIDI1MCA4Ny42MTQyIDI1MCA2MEMyNTAgMzIuMzg1OCAyMjcuNjE0IDEwIDIwMCAxMEMxNzIuMzg2IDEwIDE1MCAzMi4zODU4IDE1MCA2MEMxNTAgODcuNjE0MiAxNzIuMzg2IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDM5MEgxMDBDMTAwIDMzMC4yIDEzOS44IDI4MCAyMDAgMjgwQzI2MC4yIDI4MCAzMDAgMzMwLjIgMzAwIDM5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+',
          images: profile.images || [],
          venue: profile.location || 'Unknown',
          location: profile.location || 'Unknown',
          date: new Date().toISOString().split('T')[0], // Add required date field
          genres: profile.genres || [],
          fee: 'Negotiable',
          skills: profile.skills || [],
          matchScore: profile.matchScore,
          matchReasons: profile.matchReasons,
          compatibility: profile.compatibility
        }));
        
        setProfiles(opportunityProfiles);
      } catch (error) {
        console.error('❌ Error loading DJ profiles:', error);
        // Fallback to mock data
        setProfiles(MOCK_OPPORTUNITIES);
      } finally {
        setLoading(false);
        setMatchingActive(false);
      }
    };

    loadDJProfiles();
  }, [currentUser]);

  const handleCardLeftScreen = useCallback((cardId: string) => {
    console.log('Card left screen:', cardId);
  }, []);

  const currentProfile = profiles[currentIndex];

  const getTabButtonClass = (isActive: boolean) => {
    return `px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-[color:var(--accent)] text-black'
        : 'bg-[color:var(--surface-alt)] text-[color:var(--text-secondary)]'
    }`;
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)]">
      {/* Header */}
      <div className="bg-[color:var(--surface)] border-b border-[color:var(--border)] px-4 py-4">
        <div className="max-w-md mx-auto flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-cyan-500">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" fill="currentColor"/>
              </svg>
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-[var(--accent)] to-pink-500 bg-clip-text text-transparent">
                DJ Elite
              </h1>
            </div>
            <p className="text-sm text-[color:var(--text-secondary)]">Find your next gig opportunity</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveSection('discover')}
              className={getTabButtonClass(activeSection === 'discover')}
            >
              <div className="flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/>
                </svg>
                Discover
              </div>
            </button>
            <button
              onClick={() => setActiveSection('matches')}
              className={getTabButtonClass(activeSection === 'matches')}
            >
              <div className="flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor"/>
                </svg>
                Matches ({matchCount})
              </div>
            </button>
          </div>
        </div>

        {/* AI Status Indicator */}
        <div className={`max-w-md mx-auto bg-gradient-to-r ${matchingActive ? 'from-purple-500/10 to-pink-500/10 border-purple-500/30' : 'from-green-500/10 to-blue-500/10 border-green-500/30'} border rounded-lg p-3`}>
          <div className="flex items-center gap-2 text-purple-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`${matchingActive ? 'text-purple-300 animate-pulse' : 'text-green-300'}`}>
              <rect x="3" y="11" width="18" height="10" rx="2" ry="2" fill="currentColor"/>
              <circle cx="12" cy="5" r="2" fill="currentColor"/>
              <path d="M12 7v4" stroke="white" strokeWidth="2"/>
              <line x1="8" y1="16" x2="8" y2="16" stroke="white" strokeWidth="2"/>
              <line x1="16" y1="16" x2="16" y2="16" stroke="white" strokeWidth="2"/>
            </svg>
            <div>
              <p className="text-sm font-semibold">{matchingActive ? 'AI Matching Active' : 'AI Matching Ready'}</p>
              <p className="text-xs">{matchingActive ? 'Finding perfect DJ matches based on compatibility...' : `Found ${djProfiles.length} potential matches`}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {activeSection === 'discover' && currentProfile && (
          <div className="space-y-6">
            {/* Profile Counter */}
            <div className="text-center">
              <p className="text-sm text-[color:var(--text-secondary)]">
                DJ Profile {currentIndex + 1} of {profiles.length}
              </p>
              {currentProfile.matchScore && (
                <p className="text-sm text-[color:var(--accent)] font-semibold">
                  Match Score: {currentProfile.matchScore}%
                </p>
              )}
            </div>

            {/* Swipe Card Container */}
            <div className="relative h-[600px] flex items-center justify-center">
              <UltraFastSwipeCard
                opportunity={currentProfile}
                onSwipe={handleSwipe}
                onCardLeftScreen={handleCardLeftScreen}
              />
              
              {/* Match Reasons */}
              {currentProfile.matchReasons && currentProfile.matchReasons.length > 0 && (
                <div className="absolute bottom-4 left-4 right-4 bg-[color:var(--surface)]/90 backdrop-blur-sm border border-[color:var(--border)] rounded-lg p-3">
                  <p className="text-xs text-[color:var(--text-secondary)] mb-1">Why you match:</p>
                  <div className="flex flex-wrap gap-1">
                    {currentProfile.matchReasons.map((reason, index) => (
                      <span key={index} className="text-xs bg-[color:var(--accent)]/20 text-[color:var(--accent)] px-2 py-1 rounded-full">
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Swipe Instructions */}
            <div className="text-center space-y-2">
              <div className="flex justify-center gap-4 text-sm text-[color:var(--text-secondary)]">
                <div className="flex items-center gap-1">
                  <span className="text-red-500">←</span> Pass
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[var(--accent)]">→</span> Connect
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">↑</span> Super Like
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'discover' && loading && (
          <div className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[color:var(--accent)]"></div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Finding Your Matches</h2>
            <p className="text-[color:var(--text-secondary)]">
              Our AI is analyzing compatibility with other DJs...
            </p>
          </div>
        )}

        {activeSection === 'discover' && !currentProfile && !loading && (
          <div className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-pink-500">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
            <p className="text-[color:var(--text-secondary)] mb-6">
              You've seen all available DJ matches. Check back soon for new profiles!
            </p>
            <button
              onClick={() => {
                setCurrentIndex(0);
                // Clear matching cache to get fresh results
                matchingEngine.clearCache(currentUser?.email || 'unknown');
                window.location.reload();
              }}
              className="bg-[color:var(--accent)] text-black px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black">
                  <path d="M3 7v6h6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="m21 17a9 9 0 00-9-9 9 9 0 00-6 2.3l-3 2.7" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                Refresh Matches
              </div>
            </button>
          </div>
        )}

        {activeSection === 'matches' && (
          <div className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor"/>
                <path d="M8 10h8" stroke="white" strokeWidth="2"/>
                <path d="M8 14h4" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Your Matches</h2>
            <p className="text-[color:var(--text-secondary)] mb-6">
              You have {matchCount} potential collaborations waiting!
            </p>

            <div className="space-y-4 mb-8">
              {matchCount > 0 ? (
                profiles.slice(0, matchCount).map((profile, i) => (
                  <div
                    key={profile.id}
                    className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-4 text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={profile.imageUrl}
                        alt={profile.title}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{profile.title}</h3>
                        <p className="text-sm text-[color:var(--text-secondary)]">{profile.venue}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[color:var(--text-secondary)] mb-3">
                      Potential match based on your skills and location
                    </p>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="flex-1">
                        <div className="flex items-center gap-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor"/>
                          </svg>
                          Message
                        </div>
                      </Button>
                      <Button variant="ghost" className="flex-1">
                        <div className="flex items-center gap-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <circle cx="12" cy="12" r="3" fill="currentColor"/>
                          </svg>
                          View Details
                        </div>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[color:var(--text-secondary)] py-8">
                  No matches yet. Keep swiping to find opportunities!
                </p>
              )}
            </div>

            <button
              onClick={() => setActiveSection('discover')}
              className="bg-[color:var(--accent)] text-black px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/>
                </svg>
                Keep Matching
              </div>
            </button>
          </div>
        )}
        
        {activeSection === 'referrals' && <ReferralSection />}
        
        {activeSection === 'premium' && (
          <div className="p-6 space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                  <path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[var(--accent)] to-pink-500 bg-clip-text text-transparent">
                  DJ Elite Premium
                </h1>
              </div>
              <p className="text-xl text-[color:var(--text-secondary)]">Unlock the full power of professional DJ networking</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <div className="text-3xl font-bold mb-4">$0</div>
                <ul className="text-sm text-[color:var(--text-secondary)] space-y-2 mb-6">
                  <li>5 connections/day</li>
                  <li>Basic profile</li>
                  <li>Standard matching</li>
                </ul>
                <button className="w-full py-2 border border-[color:var(--border)] rounded-lg">Current Plan</button>
              </div>
              <div className="bg-gradient-to-b from-[color:var(--accent)]/10 to-transparent border-2 border-[color:var(--accent)] rounded-xl p-6 text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[color:var(--accent)] text-black px-4 py-1 rounded-full text-sm font-bold">POPULAR</div>
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="text-3xl font-bold mb-4">$19<span className="text-sm">/mo</span></div>
                <ul className="text-sm text-[color:var(--text-secondary)] space-y-2 mb-6">
                  <li>Unlimited connections</li>
                  <li>Premium profile</li>
                  <li>Priority matching</li>
                  <li>Profile boost</li>
                </ul>
                <button className="w-full py-2 bg-[color:var(--accent)] text-black rounded-lg font-semibold">Upgrade Now</button>
              </div>
              <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Elite</h3>
                <div className="text-3xl font-bold mb-4">$49<span className="text-sm">/mo</span></div>
                <ul className="text-sm text-[color:var(--text-secondary)] space-y-2 mb-6">
                  <li>Everything in Pro</li>
                  <li>VIP support</li>
                  <li>Advanced analytics</li>
                  <li>Custom branding</li>
                </ul>
                <button className="w-full py-2 border border-[color:var(--border)] rounded-lg">Coming Soon</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation - Platform Features */}
      <div className="fixed bottom-0 left-0 right-0 bg-[color:var(--surface)] border-t border-[color:var(--border)] px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          <button
            onClick={() => setActiveSection('referrals')}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all text-sm"
          >
            <div className="flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M20 12v10H4V12" stroke="currentColor" strokeWidth="2" fill="none"/>
                <rect x="2" y="7" width="20" height="5" rx="1" fill="currentColor"/>
                <path d="M12 22V7" stroke="white" strokeWidth="2"/>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
              Referrals
            </div>
          </button>
          <button
            onClick={() => setActiveSection('premium')}
            className="flex-1 bg-[color:var(--accent)] text-black px-3 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm"
          >
            <div className="flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-black">
                <path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
              </svg>
              Premium
            </div>
          </button>
        </div>
      </div>

      {/* Add bottom padding to account for fixed nav */}
      <div className="pb-24"></div>
    </div>
  );
};
