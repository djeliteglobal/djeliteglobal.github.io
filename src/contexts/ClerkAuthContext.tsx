import React, { createContext, useContext } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
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
  const { signOut, openSignIn } = useClerk();

  React.useEffect(() => {
    if (isLoaded && user && window.location.pathname === '/') {
      window.location.href = '/';
    }
  }, [isLoaded, user]);

  const currentUser: User | null = user ? {
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
    openSignIn({ redirectUrl: '/' });
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
    loading: !isLoaded
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
