import React, { useState, useEffect, useCallback } from 'react';
import { EnhancedSwipeInterface } from '../swipe/EnhancedSwipeInterface';
import { getCurrentProfile } from '../../services/profileService';
import { useMatchStore } from '../../stores/matchStore';
import { Button } from '../platform';
import { ProfileEditor } from '../profile/ProfileEditor';
import { useAuth } from '../../contexts/AuthContext';
import type { Opportunity } from '../../types/platform';
import type { DJProfile } from '../../types/profile';

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
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
    genres: ['House', 'Techno', 'Deep House'],
    fee: '$300/night',
    skills: ['Mixing', 'Production', 'Event Planning']
  },
  {
    id: '2',
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
    genres: ['Drum & Bass', 'Jungle', 'Breakbeat'],
    fee: '$250/night',
    skills: ['Production', 'Sound Engineering', 'Mastering']
  }
];

export const MainDJMatchingPage: React.FC = () => {
  const [view, setView] = useState<'swipe' | 'profile' | 'matches'>('swipe');
  const [profiles, setProfiles] = useState<Opportunity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfiles, setHasProfiles] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<DJProfile | null>(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    initializeMatching();
  }, [currentUser]);

  const initializeMatching = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      // Get user's profile
      const userProfile = await getCurrentProfile();
      setCurrentProfile(userProfile);

      // Load opportunities using AI matching engine
      await loadOpportunities(userProfile);

    } catch (error) {
      console.error('Error initializing matching:', error);
      // Fallback to mock data for demo
      setProfiles(MOCK_OPPORTUNITIES);
      setHasProfiles(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOpportunities = async (userProfile: DJProfile) => {
    try {
      // For now, use mock data until AI engine is fully integrated
      // In production: const opportunities = await matchingEngine.getOptimalMatches(user.id, {});
      setProfiles(MOCK_OPPORTUNITIES);
      setHasProfiles(true);

      // TODO: Integrate with real AI matching engine
      console.log('🎯 Matching engine ready for integration with profile:', userProfile);
    } catch (error) {
      console.error('Error loading opportunities:', error);
      throw error;
    }
  };

  const handleSwipe = useCallback(async (direction: 'left' | 'right' | 'super') => {
    if (!profiles[currentIndex]) return;

    const swipedProfile = profiles[currentIndex];

    try {
      // Record swipe with AI engine (simulation for now)
      const result = { success: true, match: direction === 'right' && Math.random() > 0.7 };

      // Check connection limit for premium users
      if (direction === 'right') {
        const canConnectResult = await canConnect();
        if (!canConnectResult) {
          // Show premium pricing
          showConnectionLimitWarning();
          return;
        }
      }

      console.log(`📈 User ${direction} on ${swipedProfile.title} (${result.match ? 'MATCH!' : 'No match'})`);

      // Move to next profile
      setCurrentIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= profiles.length) {
          // Reload more profiles or show end state
          loadMoreProfiles();
        }
        return nextIndex;
      });

    } catch (error) {
      console.error('Error handling swipe:', error);
    }
  }, [currentIndex, profiles, canConnect]);

  const handleCardLeftScreen = useCallback((cardId: string) => {
    // Cleanup after card animation
    console.log('🗑️ Card left screen:', cardId);
  }, []);

  const loadMoreProfiles = async () => {
    try {
      // In production: const newProfiles = await matchingEngine.getOptimalMatches(user!.id, {}, 10);
      // For demo: just reshuffle existing ones
      if (profiles.length > 0) {
        const shuffled = [...profiles].sort(() => Math.random() - 0.5);
        setProfiles(prev => [...prev, ...shuffled.slice(0, 3)]);
      }
    } catch (error) {
      console.error('Error loading more profiles:', error);
    }
  };

  const showConnectionLimitWarning = () => {
    // This would trigger a modal showing connection limits
    console.log('🚫 Connection limit reached - show premium modal');
  };

  const getTabButtonClass = (isActive: boolean) => {
    const baseClass = 'px-4 py-2 rounded-lg transition-colors';
    const activeClass = 'bg-[color:var(--accent)] text-black';
    const inactiveClass = 'bg-[color:var(--surface-alt)] text-[color:var(--text-secondary)]';
    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg)]">
      {/* Header */}
      <div className="bg-[color:var(--surface)] border-b border-[color:var(--border)] px-4 py-4">
        <div className="max-w-md mx-auto flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold">DJ Elite</h1>
            <p className="text-sm text-[color:var(--text-secondary)]">Find your next gig</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setView('swipe')}
              className={getTabButtonClass(view === 'swipe')}
            >
              Discover
            </button>
            <button
              onClick={() => setView('matches')}
              className={getTabButtonClass(view === 'matches')}
            >
              Matches
            </button>
            <button
              onClick={() => setView('profile')}
              className={getTabButtonClass(view === 'profile')}
            >
              Profile
            </button>
          </div>
        </div>

        {/* Premium Status */}
        {subscriptionStore.isPremium ? (
          <div className="max-w-md mx-auto bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-purple-300">
              <span className="text-xl">💎</span>
              <div>
                <p className="text-sm font-semibold">Premium Active</p>
                <p className="text-xs">Unlimited connections • Advanced matching</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {view === 'swipe' && hasProfiles && (
          <div className="relative h-[600px]">
            {profiles.slice(currentIndex, currentIndex + 3).map((profile, i) => (
              <div
                key={profile.id}
                className={`absolute w-full h-full ${i === 0 ? 'z-10' : 'z-0'}`}
                style={{ transform: `translateX(${i * 2}px) rotate(${i * 1}deg)` }}
              >
                <EnhancedSwipeInterface
                  profiles={[profile]}
                  currentIndex={0}
                  onSwipe={handleSwipe}
                  onCardLeftScreen={handleCardLeftScreen}
                />
              </div>
            ))}
          </div>
        )}

        {view === 'swipe' && !hasProfiles && (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="text-6xl mb-4">🎶</div>
            <h2 className="text-2xl font-bold mb-2">No gigs available</h2>
            <p className="text-[color:var(--text-secondary)] mb-6">
              Check back soon for new opportunities!
            </p>
            <button
              onClick={() => loadOpportunities(currentProfile!)}
              className="bg-[color:var(--accent)] text-black px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        )}

        {view === 'profile' && (
          <div className="space-y-6">
            {currentProfile ? (
              <ProfileEditor initialData={currentProfile} />
            ) : (
              <div className="text-center">
                <p className="text-[color:var(--text-secondary)] mb-4">
                  Complete your profile to start matching
                </p>
                <Button onClick={() => setView('profile')} className="w-full">
                  Set Up Profile
                </Button>
              </div>
            )}
          </div>
        )}

        {view === 'matches' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold mb-2">Your Matches</h2>
            <p className="text-[color:var(--text-secondary)] mb-6">
              Start swiping to find your perfect gig!
            </p>
            <button
              onClick={() => setView('swipe')}
              className="bg-[color:var(--accent)] text-black px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Start Matching
            </button>
          </div>
        )}
      </div>

      {/* Connection Limit Warning */}
      <ConnectionLimitWarning />
    </div>
  );
};
