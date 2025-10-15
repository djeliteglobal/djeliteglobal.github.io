import React, { createContext, useContext, useEffect } from 'react';
import { useUser, useClerk, SignIn, SignUp } from '@clerk/clerk-react';
import type { User } from '../types/platform';
import { setMatchStoreUserId } from '../stores/matchStore';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithOAuth: (provider: 'google' | 'facebook' | 'spotify' | 'discord') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  openSignIn: () => void;
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
  const { signOut, openSignIn } = useClerk();

  useEffect(() => {
    if (user?.id) {
      setMatchStoreUserId(user.id);
    }
  }, [user?.id]);

  const currentUser: User | null = user ? {
    id: user.id,
    name: user.fullName || user.username || 'User',
    email: user.primaryEmailAddress?.emailAddress || '',
    avatarUrl: user.imageUrl,
    plan: 'Free'
  } : null;

  const login = async (email: string, password: string) => {
    openSignIn();
  };

  const signup = async (email: string, password: string, name: string) => {
    openSignIn();
  };

  const loginWithOAuth = async (provider: 'google' | 'facebook' | 'spotify' | 'discord') => {
    openSignIn();
  };

  const logout = async () => {
    await signOut();
  };

  const value = {
    currentUser,
    login,
    signup,
    loginWithOAuth,
    logout,
    loading: !isLoaded,
    openSignIn
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoaded ? (
        <div style={{ backgroundColor: '#0B0D10', color: '#FFFFFF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>Loading...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
