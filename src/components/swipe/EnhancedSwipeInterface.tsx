import React, { useState, useEffect } from 'react';
import { UltraFastSwipeCard } from './UltraFastSwipeCard';
import { ProfileDetailView } from '../profile/ProfileDetailView';
import { MatchNotification } from '../notifications/MatchNotification';
import { WhoLikedYou } from '../premium/WhoLikedYou';
import { ChatInterface } from '../messaging/ChatInterface';
import { sendSuperLike, getSuperLikeCount } from '../../services/superLikeService';
import { undoLastSwipe, getRewindCount } from '../../services/rewindService';
import { recordSwipe } from '../../services/profileService';
import { getTopPicks } from '../../services/topPicksService';
import { activateBoost, getBoostStats } from '../../services/boostService';
import type { Opportunity } from '../../types/platform';

interface EnhancedSwipeInterfaceProps {
  profiles: Opportunity[];
  currentIndex: number;
  onSwipe: (direction: 'left' | 'right' | 'super') => void;
  onCardLeftScreen: (id: string) => void;
}

export const EnhancedSwipeInterface: React.FC<EnhancedSwipeInterfaceProps> = ({
  profiles,
  currentIndex,
  onSwipe,
  onCardLeftScreen
}) => {
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [showWhoLikedYou, setShowWhoLikedYou] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [matchData, setMatchData] = useState<any>(null);
  const [superLikeCount, setSuperLikeCount] = useState(0);
  const [rewindCount, setRewindCount] = useState(0);
  const [boostStats, setBoostStats] = useState({ views: 0, likes: 0, timeLeft: 0 });
  const [topPicks, setTopPicks] = useState<any[]>([]);

  const currentProfile = profiles[currentIndex];

  useEffect(() => {
    loadCounts();
    loadTopPicks();
  }, []);

  const loadCounts = async () => {
    try {
      const [superLikes, rewinds, boost] = await Promise.all([
        getSuperLikeCount(),
        getRewindCount(),
        getBoostStats()
      ]);
      
      setSuperLikeCount(superLikes);
      setRewindCount(rewinds);
      setBoostStats(boost);
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  };

  const loadTopPicks = async () => {
    try {
      const picks = await getTopPicks();
      setTopPicks(picks);
    } catch (error) {
      console.error('Error loading top picks:', error);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right' | 'super') => {
    if (!currentProfile) return;

    try {
      // Record swipe in database
      const result = await recordSwipe(currentProfile.id, direction);
      
      // Check for match
      if (result.match) {
        setMatchData({
          name: currentProfile.title,
          avatar: currentProfile.imageUrl,
          matchId: result.matchId
        });
        setShowMatchNotification(true);
      }
      
      // Call parent handler
      onSwipe(direction);
      
    } catch (error) {
      console.error('Error handling swipe:', error);
      // Still call parent handler even if recording fails
      onSwipe(direction);
    }
  };

  const handleSuperLike = async () => {
    if (!currentProfile || superLikeCount <= 0) return;

    try {
      const result = await sendSuperLike(currentProfile.id);
      
      if (result.isMatch) {
        setMatchData({
          name: currentProfile.title,
          avatar: currentProfile.imageUrl,
          matchId: 'super-match'
        });
        setShowMatchNotification(true);
      }
      
      setSuperLikeCount(prev => prev - 1);
      onSwipe('super');
      
    } catch (error) {
      console.error('Error sending super like:', error);
      alert(error.message);
    }
  };

  const handleRewind = async () => {
    if (rewindCount <= 0) return;

    try {
      const result = await undoLastSwipe();
      if (result.success) {
        setRewindCount(prev => prev - 1);
        // TODO: Add profile back to stack
        alert('Last swipe undone!');
      }
    } catch (error) {
      console.error('Error rewinding:', error);
      alert(error.message);
    }
  };

  const handleBoost = async () => {
    try {
      await activateBoost('standard');
      await loadCounts();
      alert('Profile boosted for 30 minutes!');
    } catch (error) {
      console.error('Error activating boost:', error);
      alert(error.message);
    }
  };

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">No more profiles!</h2>
        <p className="text-[color:var(--text-secondary)] mb-6">
          Check out your matches or try our Top Picks
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setShowWhoLikedYou(true)}
            className="w-full bg-[color:var(--accent)] text-black py-3 px-6 rounded-lg font-semibold"
          >
            👀 See Who Liked You
          </button>
          <button
            onClick={loadTopPicks}
            className="w-full bg-[color:var(--surface)] border border-[color:var(--border)] py-3 px-6 rounded-lg font-semibold"
          >
            ⭐ View Top Picks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Top Action Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={handleRewind}
            disabled={rewindCount <= 0}
            className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold disabled:opacity-50"
          >
            ↶ Rewind ({rewindCount})
          </button>
          <button
            onClick={handleBoost}
            className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
          >
            🚀 Boost
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowWhoLikedYou(true)}
            className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
          >
            👀 Likes
          </button>
          <button
            onClick={() => setShowProfileDetail(true)}
            className="bg-[color:var(--surface)] text-[color:var(--text-primary)] px-3 py-1 rounded-full text-sm font-semibold"
          >
            ℹ️ Info
          </button>
        </div>
      </div>

      {/* Boost Status */}
      {boostStats.timeLeft > 0 && (
        <div className="absolute top-16 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs">
          🚀 Boosted: {boostStats.timeLeft}m left
        </div>
      )}

      {/* Main Swipe Card */}
      <UltraFastSwipeCard
        opportunity={currentProfile}
        onSwipe={handleSwipe}
        onCardLeftScreen={onCardLeftScreen}
        onOpenProfile={() => setShowProfileDetail(true)}
      />

      {/* Bottom Action Buttons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={() => handleSwipe('left')}
          className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white text-xl hover:scale-105 transition-transform"
        >
          ✕
        </button>
        
        <button
          onClick={handleSuperLike}
          disabled={superLikeCount <= 0}
          className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xl hover:scale-105 transition-transform disabled:opacity-50"
        >
          ⭐
        </button>
        
        <button
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 bg-[color:var(--accent)] rounded-full flex items-center justify-center text-black text-2xl hover:scale-105 transition-transform"
        >
          ♥
        </button>
      </div>

      {/* Super Like Counter */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-black/50 text-white px-3 py-1 rounded-full text-xs">
          ⭐ {superLikeCount} Super Likes
        </div>
      </div>

      {/* Modals */}
      <ProfileDetailView
        profile={currentProfile}
        isVisible={showProfileDetail}
        onClose={() => setShowProfileDetail(false)}
        onSwipe={(direction) => {
          setShowProfileDetail(false);
          handleSwipe(direction);
        }}
      />

      <MatchNotification
        isVisible={showMatchNotification}
        matchName={matchData?.name || ''}
        matchAvatar={matchData?.avatar || ''}
        onClose={() => setShowMatchNotification(false)}
        onSendMessage={() => {
          setShowMatchNotification(false);
          setShowChat(true);
        }}
        onKeepSwiping={() => setShowMatchNotification(false)}
      />

      {showWhoLikedYou && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="h-full overflow-y-auto bg-[color:var(--bg)]">
            <div className="sticky top-0 bg-[color:var(--surface)] p-4 border-b border-[color:var(--border)]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Who Liked You</h2>
                <button
                  onClick={() => setShowWhoLikedYou(false)}
                  className="w-8 h-8 bg-[color:var(--surface-alt)] rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>
            <WhoLikedYou />
          </div>
        </div>
      )}

      {showChat && matchData && (
        <ChatInterface
          matchId={matchData.matchId}
          matchName={matchData.name}
          matchAvatar={matchData.avatar}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};
