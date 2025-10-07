import React, { createContext, useContext, useEffect, useState } from 'react';
import Session from 'supertokens-auth-react/recipe/session';
import { signOut, redirectToAuth } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, name: string) => {
    try {
      const referralCode = new URLSearchParams(window.location.search).get('ref') || 
                          sessionStorage.getItem('dj_elite_referral_code');
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, referralCode })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create account');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const loginWithOAuth = async (provider: 'google' | 'facebook' | 'spotify' | 'discord') => {
    try {
      const referralCode = new URLSearchParams(window.location.search).get('ref');
      if (referralCode) {
        sessionStorage.setItem('dj_elite_referral_code', referralCode);
      }

      await redirectToAuth({ thirdPartyId: provider });
    } catch (error: any) {
      throw new Error(`Failed to sign in with ${provider}`);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setCurrentUser(null);
    } catch (error: any) {
      throw new Error('Failed to sign out');
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionExists = await Session.doesSessionExist();
        
        if (sessionExists) {
          const userId = await Session.getUserId();
          const response = await fetch('/api/user/profile');
          const userData = await response.json();

          setCurrentUser({
            name: userData.name || 'User',
            email: userData.email || '',
            avatarUrl: userData.avatarUrl || `https://picsum.photos/seed/${userId}/100/100`,
            plan: userData.plan || 'Free'
          });

          const referralCode = sessionStorage.getItem('dj_elite_referral_code');
          if (referralCode) {
            await processReferral(userId, referralCode);
            sessionStorage.removeItem('dj_elite_referral_code');
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

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
