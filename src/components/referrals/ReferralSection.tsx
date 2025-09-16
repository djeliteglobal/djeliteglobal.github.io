import React, { useState, useEffect } from 'react';
import { referralService } from '../../services/referralService';
import { useAuth } from '../../contexts/AuthContext';

export const ReferralSection: React.FC = () => {
  const { currentUser } = useAuth();
  const [referralCode, setReferralCode] = useState<string>('');
  const [stats, setStats] = useState({
    totalReferrals: 0,
    completedReferrals: 0,
    pendingReferrals: 0,
    unclaimedRewards: 0,
    totalRewardsEarned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    if (!currentUser) return;
    
    try {
      // Generate referral code if needed
      const code = await referralService.generateReferralCode('user-id');
      setReferralCode(code);
      
      // Load stats
      const userStats = await referralService.getReferralStats('user-id');
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `https://djelite.site?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    // Show toast notification
  };

  const shareContent = referralService.generateSocialShareContent(referralCode, currentUser?.name || 'DJ');

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin text-4xl mb-4">🎁</div>
        <p>Loading referral data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">🎁 Referral Program</h2>
        <p className="text-[color:var(--text-secondary)]">
          Invite DJs and earn premium rewards!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[color:var(--accent)]">{stats.completedReferrals}</div>
          <div className="text-sm text-[color:var(--text-secondary)]">Successful Referrals</div>
        </div>
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-500">{stats.totalRewardsEarned}</div>
          <div className="text-sm text-[color:var(--text-secondary)]">Rewards Earned</div>
        </div>
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500">{stats.pendingReferrals}</div>
          <div className="text-sm text-[color:var(--text-secondary)]">Pending</div>
        </div>
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-500">{stats.unclaimedRewards}</div>
          <div className="text-sm text-[color:var(--text-secondary)]">Unclaimed</div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Your Referral Link</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={`https://djelite.site?ref=${referralCode}`}
            readOnly
            className="flex-1 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={copyReferralLink}
            className="bg-[color:var(--accent)] text-black px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            📋 Copy
          </button>
        </div>
        <p className="text-xs text-[color:var(--text-secondary)] mt-2">
          Share this link and earn 7 days of premium when someone signs up!
        </p>
      </div>

      {/* Social Share */}
      <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Share on Social Media</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <span>📘</span>
            <span className="font-medium">Facebook</span>
          </button>
          <button className="flex items-center gap-2 bg-sky-500 text-white px-4 py-3 rounded-lg hover:bg-sky-600 transition-colors">
            <span>🐦</span>
            <span className="font-medium">Twitter</span>
          </button>
          <button className="flex items-center gap-2 bg-pink-600 text-white px-4 py-3 rounded-lg hover:bg-pink-700 transition-colors">
            <span>📸</span>
            <span className="font-medium">Instagram</span>
          </button>
          <button className="flex items-center gap-2 bg-blue-800 text-white px-4 py-3 rounded-lg hover:bg-blue-900 transition-colors">
            <span>💼</span>
            <span className="font-medium">LinkedIn</span>
          </button>
        </div>
      </div>

      {/* Rewards Info */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-300">🏆 Reward Tiers</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🥉</span>
            <div>
              <p className="font-medium">First Referral</p>
              <p className="text-sm text-[color:var(--text-secondary)]">7 days of DJ Elite Premium</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🥈</span>
            <div>
              <p className="font-medium">Every 3 Referrals</p>
              <p className="text-sm text-[color:var(--text-secondary)]">5 Super Likes bonus</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🥇</span>
            <div>
              <p className="font-medium">Power Referrer (10+)</p>
              <p className="text-sm text-[color:var(--text-secondary)]">Free profile boosts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};