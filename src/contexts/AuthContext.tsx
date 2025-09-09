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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          }
        }
      });
      if (error) {
        throw new Error(error.message === 'User already registered' ? 'An account with this email already exists' : 'Failed to create account');
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
      (event, session) => {
        if (session?.user) {
          const user: SupabaseUser = session.user;
          setCurrentUser({
            name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            avatarUrl: user.user_metadata?.avatar_url || `https://picsum.photos/seed/${user.id}/100/100`,
            plan: 'Free'
          });
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
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