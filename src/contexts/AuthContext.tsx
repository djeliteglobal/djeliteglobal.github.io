import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import type { User } from '../types/platform';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithOAuth: (provider: 'google' | 'facebook' | 'spotify' | 'discord') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Capture referral code from URL or session storage
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get('ref') || sessionStorage.getItem('dj_elite_referral_code');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
            // Include referral code in user metadata for trigger processing
            ...(referralCode && { referral_code: referralCode })
          }
        }
      });
      
      if (error) {
        throw new Error(error.message === 'User already registered' ? 'An account with this email already exists' : 'Failed to create account');
      }
      
      // Process referral manually for email signup too (backup)
      if (referralCode && data.user) {
        setTimeout(() => {
          processReferralAfterOAuth(data.user!.id, referralCode);
        }, 1000);
      }
      
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message === 'Invalid login credentials' ? 'Invalid email or password' : 'Failed to sign in');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const loginWithOAuth = async (provider: 'google' | 'facebook' | 'spotify' | 'discord') => {
    try {
      // Capture and store referral code before OAuth redirect
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get('ref');
      
      if (referralCode) {
        sessionStorage.setItem('dj_elite_referral_code', referralCode);
        console.log('🔗 OAUTH: Stored referral code for after redirect:', referralCode);
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) {
        throw new Error(`Failed to sign in with ${provider}`);
      }
    } catch (error: any) {
      throw new Error(error.message || `Failed to sign in with ${provider}`);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error('Failed to sign out');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  useEffect(() => {
    // If no Supabase config, skip auth and set loading false
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user: SupabaseUser = session.user;
          setCurrentUser({
            name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            avatarUrl: `https://picsum.photos/seed/${user.id}/100/100`,
            plan: 'Free'
          });
          
          // Process referral after OAuth signup
          if (event === 'SIGNED_IN') {
            const storedReferralCode = sessionStorage.getItem('dj_elite_referral_code');
            if (storedReferralCode) {
              console.log('🎯 OAUTH: Processing referral after OAuth login:', storedReferralCode);
              await processReferralAfterOAuth(user.id, storedReferralCode);
              sessionStorage.removeItem('dj_elite_referral_code');
            }
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Process referral manually after OAuth (since metadata doesn't work)
  const processReferralAfterOAuth = async (userId: string, referralCode: string) => {
    try {
      console.log('🔄 Processing referral manually:', { userId, referralCode });
      
      // Get user email
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email || 'unknown@example.com';
      const djName = user?.user_metadata?.display_name || userEmail.split('@')[0];
      
      // STEP 1: Ensure new user has a profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          dj_name: djName,
          email: userEmail,
          referred_by_code: referralCode
        }, { onConflict: 'user_id' });
      
      if (profileError) {
        console.error('❌ Failed to create profile:', profileError);
      }
      
      // STEP 2: Find referrer by referral code
      const { data: referrer } = await supabase
        .from('profiles')
        .select('user_id, dj_name')
        .eq('referral_code', referralCode)
        .single();
      
      if (!referrer) {
        console.log('❌ No referrer found for code:', referralCode);
        return;
      }
      
      console.log('✅ Found referrer:', referrer.dj_name);
      
      // STEP 3: Create referral record
      const { error: referralError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrer.user_id,
          referred_email: userEmail,
          referred_user_id: userId,
          status: 'completed',
          referral_code: referralCode,
          completed_at: new Date().toISOString()
        });
      
      if (referralError) {
        console.error('❌ Failed to create referral:', referralError);
        return;
      }
      
      console.log('✅ REFERRAL: Successfully processed referral');
      
      // STEP 4: Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: referrer.user_id,
          type: 'referral_success',
          title: '🎉 Your referral joined DJ Elite!',
          message: `${djName} just signed up using your referral link!`
        });
      
      console.log('✅ REFERRAL: Notification sent successfully');
      
      // STEP 5: Create reward
      await supabase
        .from('referral_rewards')
        .insert({
          user_id: referrer.user_id,
          reward_type: 'premium_days',
          reward_amount: 7,
          description: '7 days premium for successful referral',
          claimed: true
        });
      
      console.log('✅ REFERRAL: Reward created successfully');
      
    } catch (error) {
      console.error('❌ Error processing referral:', error);
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    loginWithOAuth,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{ backgroundColor: '#0B0D10', color: '#FFFFFF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>Loading...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};