import React, { createContext, useContext, useEffect, useState } from 'react';
import Session from 'supertokens-auth-react/recipe/session';
import { signOut, redirectToAuth } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
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
      console.log(`🔐 SuperTokens: Starting ${provider} OAuth flow`);
      
      const referralCode = new URLSearchParams(window.location.search).get('ref');
      if (referralCode) {
        sessionStorage.setItem('dj_elite_referral_code', referralCode);
        console.log('🔗 Stored referral code:', referralCode);
      }

      console.log(`🚀 Redirecting to ${provider} auth...`);
      await redirectToAuth({ thirdPartyId: provider });
      console.log(`✅ Redirect initiated for ${provider}`);
    } catch (error: any) {
      console.error(`❌ SuperTokens OAuth error for ${provider}:`, error);
      throw new Error(`Failed to sign in with ${provider}: ${error.message}`);
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
        console.log('🔍 Checking SuperTokens session...');
        const sessionExists = await Session.doesSessionExist();
        console.log('📋 Session exists:', sessionExists);
        
        if (sessionExists) {
          const userId = await Session.getUserId();
          console.log('👤 User ID:', userId);
          
          // For now, create a basic user object
          // TODO: Fetch user profile from backend API
          setCurrentUser({
            name: 'DJ User',
            email: 'user@example.com',
            avatarUrl: `https://picsum.photos/seed/${userId}/100/100`,
            plan: 'Free'
          });
          console.log('✅ User session loaded');
        } else {
          console.log('❌ No active session');
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('❌ Session check failed:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);



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
