import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { referralService, ReferralStats } from '../../services/referralService';
import { useAuth } from '../../contexts/AuthContext';

interface Referral {
  id: string;
  referred_email: string;
  status: string;
  created_at: string;
  personal_message?: string;
}

const ReferralDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    completedReferrals: 0,
    pendingReferrals: 0,
    unclaimedRewards: 0,
    totalRewardsEarned: 0
  });
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCode, setReferralCode] = useState<string>('LOADING...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(false);

  console.log('🎯 ReferralDashboard mounted!', { currentUser, loading });

  useEffect(() => {
    console.log('🔄 useEffect triggered with currentUser:', currentUser);
    if (currentUser) {
      loadReferralData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadReferralData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Starting to load referral data...');

      // Get current user ID from Supabase auth
      const { data: authUser } = await supabase.auth.getUser();
      const userId = authUser.user?.id;

      console.log('👤 Auth user ID:', userId);

      if (!userId) {
        setError('No authenticated user found');
        return;
      }

      // Check if referral tables exist
      console.log('🔍 Checking if referral tables exist...');
      const { data: tableCheck, error: tableError } = await supabase
        .from('referrals')
        .select('id')
        .limit(1);
      
      if (tableError && tableError.code === '42P01') {
        setError('Referral system not set up. Please run the database schema first.');
        return;
      }

      // Get referral stats
      console.log('📊 Loading referral stats...');
      const statsData = await referralService.getReferralStats(userId);
      console.log('✅ Stats loaded:', statsData);
      setStats(statsData);

      // Load user referrals
      console.log('👥 Loading user referrals...');
      const referralsData = await loadUserReferrals();
      console.log('✅ Referrals loaded:', referralsData.length, 'items');
      setReferrals(referralsData);

      // Get referral code
      console.log('🔗 Loading referral code...');
      const profile = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('user_id', userId)
        .single();

      if (profile.data?.referral_code) {
        console.log('✅ Referral code found:', profile.data.referral_code);
        setReferralCode(profile.data.referral_code);
      } else {
        console.log('🔧 Generating referral code...');
        const code = await referralService.generateReferralCode(userId);
        console.log('✅ Referral code generated:', code);
        setReferralCode(code);
      }

    } catch (err: any) {
      console.error('❌ Error loading referral data:', err);
      if (err.code === '42P01') {
        setError('Referral tables missing. Run supabase-referral-system.sql first.');
      } else {
        setError(err.message || 'Failed to load referral data');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUserReferrals = async (): Promise<Referral[]> => {
    const { data: authUser } = await supabase.auth.getUser();
    const userId = authUser.user?.id;

    if (!userId) return [];

    const { data } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    return data || [];
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`https://djelite.site?ref=${referralCode}`);
    alert('Referral link copied!');
  };

  // Error Screen
  if (error) {
    return (
      <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text-primary)] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-red-500">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
              <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            <h1 className="text-3xl font-bold text-red-500">Referral System Setup Required</h1>
          </div>
          <p className="text-[color:var(--text-secondary)] mb-6">{error}</p>
          
          {error.includes('tables missing') || error.includes('not set up') ? (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="currentColor"/>
                </svg>
                <h2 className="text-xl font-bold text-yellow-500">Quick Fix Instructions:</h2>
              </div>
              <ol className="text-[color:var(--text-secondary)] space-y-2 list-decimal list-inside">
                <li>Go to your Supabase SQL Editor</li>
                <li>Run the content from <code className="bg-[color:var(--surface)] px-2 py-1 rounded">supabase-referral-system.sql</code></li>
                <li>Then run <code className="bg-[color:var(--surface)] px-2 py-1 rounded">INSTANT_REFERRAL_FIX.sql</code> to restore your 2 referrals</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          ) : null}
          
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[color:var(--accent)] text-black rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black">
                  <path d="M3 7v6h6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="m21 17a9 9 0 00-9-9 9 9 0 00-6 2.3l-3 2.7" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                Reload Page
              </div>
            </button>
            <button
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                Open Supabase Dashboard
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[color:var(--accent)] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Loading Referral Dashboard...</h2>
          <p className="text-[color:var(--text-secondary)] mt-2">Fetching your referral data...</p>
        </div>
      </div>
    );
  }

  // No User Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text-primary)] p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Please Login First</h1>
          <p className="text-[color:var(--text-secondary)]">You need to be logged in to view your referral dashboard.</p>
        </div>
      </div>
    );
  }

  // Success - Main Dashboard
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text-primary)] p-8">
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed top-4 left-4 z-50 p-3 bg-[color:var(--surface)] border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--surface-alt)] transition-all duration-300"
      >
        <div className="space-y-1">
          <div className="w-6 h-0.5 bg-[color:var(--text-primary)]"></div>
          <div className="w-6 h-0.5 bg-[color:var(--text-primary)]"></div>
          <div className="w-6 h-0.5 bg-[color:var(--text-primary)]"></div>
        </div>
      </button>
      
      {/* Sliding Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-[color:var(--surface)] border-r border-[color:var(--border)] transform transition-transform duration-300 z-40 ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-[color:var(--border)]">
          <h1 className="text-xl font-display font-bold bg-gradient-to-r from-[var(--accent)] to-pink-500 bg-clip-text text-transparent">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-cyan-500">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" fill="currentColor"/>
              </svg>
              DJ Elite
            </div>
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => window.location.href = '/swipe'}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[color:var(--surface-alt)] text-[color:var(--text-secondary)] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/>
            </svg>
            <span className="font-medium">Discover</span>
          </button>
          <button
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-[color:var(--accent)] text-black transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-purple-500">
              <path d="M20 12v10H4V12" stroke="currentColor" strokeWidth="2" fill="none"/>
              <rect x="2" y="7" width="20" height="5" rx="1" fill="currentColor"/>
              <path d="M12 22V7" stroke="white" strokeWidth="2"/>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
            <span className="font-medium">Referrals</span>
          </button>
          <button
            onClick={() => window.location.href = '/premium'}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[color:var(--surface-alt)] text-[color:var(--text-secondary)] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
              <path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium">Premium</span>
          </button>
        </nav>
      </div>
      
      {/* Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-purple-500">
              <path d="M20 12v10H4V12" stroke="currentColor" strokeWidth="2" fill="none"/>
              <rect x="2" y="7" width="20" height="5" rx="1" fill="currentColor"/>
              <path d="M12 22V7" stroke="white" strokeWidth="2"/>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[var(--accent)] to-pink-500 bg-clip-text text-transparent">
              DJ Elite Referral Program
            </h1>
          </div>
          <p className="text-xl text-[color:var(--text-secondary)]">Share DJ Elite and earn amazing rewards!</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[color:var(--accent)]">{stats.totalReferrals}</div>
            <div className="text-[color:var(--text-secondary)]">Total Invites</div>
          </div>
          <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-500">{stats.completedReferrals}</div>
            <div className="text-[color:var(--text-secondary)]">Completed</div>
          </div>
          <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500">{stats.unclaimedRewards}</div>
            <div className="text-[color:var(--text-secondary)]">Unclaimed Rewards</div>
          </div>
          <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-purple-500">${stats.totalRewardsEarned}</div>
            <div className="text-[color:var(--text-secondary)]">Total Earned</div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Your Referral Link</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="text-lg bg-[color:var(--surface-alt)] border border-[color:var(--border)] p-3 rounded-lg font-mono">
                {referralCode}
              </div>
              <div className="text-sm text-[color:var(--text-secondary)] mt-2">
                Link: https://djelite.site?ref={referralCode}
              </div>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-6 py-3 bg-[color:var(--accent)] text-black rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                Copy Link
              </div>
            </button>
          </div>
        </div>

        {/* Referrals List */}
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Your Referrals</h2>

          {referrals.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4 flex justify-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="9" cy="7" r="4" fill="currentColor"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No referrals yet!</h3>
              <p className="text-[color:var(--text-secondary)]">Start inviting friends to earn rewards!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-lg">
                  <div>
                    <div className="font-semibold">{referral.referred_email}</div>
                    <div className="text-sm text-[color:var(--text-secondary)]">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </div>
                    {referral.personal_message && (
                      <div className="text-sm text-[color:var(--text-secondary)] mt-1">
                        "{referral.personal_message}"
                      </div>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    referral.status === 'completed' ? 'bg-green-500 text-white' :
                    referral.status === 'pending' ? 'bg-yellow-500 text-black' :
                    'bg-gray-500 text-white'
                  }`}>
                    {referral.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reward Tiers */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M4 22h16l-1-7H5l-1 7z" fill="currentColor"/>
              <path d="M8 9v6" stroke="white" strokeWidth="2"/>
              <path d="M16 9v6" stroke="white" strokeWidth="2"/>
            </svg>
            <h3 className="text-2xl font-bold text-purple-300">Reward Tiers</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="mb-2 flex justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-orange-600">
                  <circle cx="12" cy="8" r="6" fill="currentColor"/>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" fill="currentColor"/>
                  <path d="M12 6v2" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="font-bold">First Referral</h4>
              <p className="text-sm text-[color:var(--text-secondary)]">7 days DJ Elite Premium</p>
            </div>
            <div className="text-center p-4">
              <div className="mb-2 flex justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <circle cx="12" cy="8" r="6" fill="currentColor"/>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" fill="currentColor"/>
                  <path d="M12 6v2" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="font-bold">Every 3 Referrals</h4>
              <p className="text-sm text-[color:var(--text-secondary)]">5 Super Likes bonus</p>
            </div>
            <div className="text-center p-4">
              <div className="mb-2 flex justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                  <circle cx="12" cy="8" r="6" fill="currentColor"/>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" fill="currentColor"/>
                  <path d="M12 6v2" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="font-bold">Power Referrer (10+)</h4>
              <p className="text-sm text-[color:var(--text-secondary)]">Free profile boosts</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReferralDashboard;
