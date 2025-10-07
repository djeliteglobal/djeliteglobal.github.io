import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { query } from '../config/neon';
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
  const { user, isLoaded } = useUser();
  const { signIn, signUp, signOut } = useClerk();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, name: string) => {
    try {
      const referralCode = new URLSearchParams(window.location.search).get('ref') || 
                          sessionStorage.getItem('dj_elite_referral_code');
      
      await signUp.create({
        emailAddress: email,
        password,
        firstName: name,
        unsafeMetadata: {
          referral_code: referralCode
        }
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
    } catch (error: any) {
      throw new Error(error.errors?.[0]?.message || 'Failed to create account');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signIn.create({
        identifier: email,
        password
      });
    } catch (error: any) {
      throw new Error(error.errors?.[0]?.message || 'Failed to sign in');
    }
  };

  const loginWithOAuth = async (provider: 'google' | 'facebook' | 'spotify' | 'discord') => {
    try {
      const referralCode = new URLSearchParams(window.location.search).get('ref');
      if (referralCode) {
        sessionStorage.setItem('dj_elite_referral_code', referralCode);
      }

      const strategy = provider === 'google' ? 'oauth_google' :
                      provider === 'facebook' ? 'oauth_facebook' :
                      provider === 'spotify' ? 'oauth_spotify' :
                      'oauth_discord';

      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: window.location.origin + '/sso-callback',
        redirectUrlComplete: window.location.origin
      });
    } catch (error: any) {
      throw new Error(error.errors?.[0]?.message || `Failed to sign in with ${provider}`);
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error: any) {
      throw new Error('Failed to sign out');
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      // Sync user to database
      syncUserToDatabase(user.id, user.primaryEmailAddress?.emailAddress || '', 
                        user.firstName || user.username || 'User');

      setCurrentUser({
        name: user.firstName || user.username || 'User',
        email: user.primaryEmailAddress?.emailAddress || '',
        avatarUrl: user.imageUrl || `https://picsum.photos/seed/${user.id}/100/100`,
        plan: 'Free'
      });

      // Process referral if exists
      const referralCode = sessionStorage.getItem('dj_elite_referral_code');
      if (referralCode) {
        processReferral(user.id, referralCode);
        sessionStorage.removeItem('dj_elite_referral_code');
      }
    } else {
      setCurrentUser(null);
    }
    
    setLoading(false);
  }, [user, isLoaded]);

  const syncUserToDatabase = async (userId: string, email: string, name: string) => {
    try {
      await query(
        `INSERT INTO users (id, email, metadata) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (id) DO UPDATE SET last_sign_in_at = NOW()`,
        [userId, email, JSON.stringify({ display_name: name })]
      );

      await query(
        `INSERT INTO profiles (user_id, dj_name, email) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (user_id) DO NOTHING`,
        [userId, name, email]
      );
    } catch (error) {
      console.error('Failed to sync user:', error);
    }
  };

  const processReferral = async (userId: string, referralCode: string) => {
    try {
      const referrer = await query(
        'SELECT user_id FROM profiles WHERE referral_code = $1',
        [referralCode]
      );

      if (referrer.length === 0) return;

      await query(
        `INSERT INTO referrals (referrer_id, referred_user_id, referral_code, status, completed_at) 
         VALUES ($1, $2, $3, 'completed', NOW())`,
        [referrer[0].user_id, userId, referralCode]
      );

      await query(
        `INSERT INTO notifications (user_id, type, title, message) 
         VALUES ($1, 'referral_success', '🎉 Your referral joined!', 'Someone signed up using your link!')`,
        [referrer[0].user_id]
      );
    } catch (error) {
      console.error('Failed to process referral:', error);
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
