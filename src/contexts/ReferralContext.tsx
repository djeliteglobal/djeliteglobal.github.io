import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { referralService } from '../services/referralService';

interface ReferralContextType {
  referralCode: string | null;
  referrerInfo: {
    name: string;
    dj_name: string;
    profile_image?: string;
  } | null;
  setReferralCode: (code: string | null) => void;
  clearReferral: () => void;
  processReferralSignup: (newUserId: string) => Promise<void>;
}

const ReferralContext = createContext<ReferralContextType | null>(null);

export const ReferralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referrerInfo, setReferrerInfo] = useState<{
    name: string;
    dj_name: string;
    profile_image?: string;
  } | null>(null);

  // Capture referral code from URL on app initialization
  useEffect(() => {
    const captureReferralFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref');

      if (refParam) {
        console.log('🎯 REFERRAL CONTEXT: Captured referral code from URL:', refParam);
        setReferralCode(refParam);

        // Store in session for persistence during signup
        sessionStorage.setItem('dj_elite_referral_code', refParam);
      }
    };

    // Check URL parameters
    captureReferralFromUrl();

    // Also check session storage for existing referral code
    const savedReferral = sessionStorage.getItem('dj_elite_referral_code');
    if (savedReferral) {
      console.log('💾 REFERRAL CONTEXT: Retrieved stored referral code:', savedReferral);
      setReferralCode(savedReferral);
    }
  }, []);

  // Load referrer profile information when referral code is set
  useEffect(() => {
    const loadReferrerInfo = async () => {
      if (!referralCode) {
        setReferrerInfo(null);
        return;
      }

      try {
        // Find the referrer by referral code
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id, dj_name, profile_image_url')
          .eq('referral_code', referralCode)
          .single();
        console.log('🔍 Debug: Profile query result:', profile?.dj_name);

        if (profile) {
          setReferrerInfo({
            name: profile.dj_name || 'DJ Friend',
            dj_name: profile.dj_name || 'DJ Elite',
            profile_image: profile.profile_image_url
          });
          console.log('👤 Found referrer:', profile.dj_name);
        }
      } catch (error) {
        console.error('❌ Error loading referrer info:', error);
      }
    };

    loadReferrerInfo();
  }, [referralCode]);

  // Process referral when new user completes signup
  const processReferralSignup = async (newUserId: string): Promise<void> => {
    if (!referralCode || !newUserId) {
      console.log('⚠️ REFERRAL CONTEXT: No referral code or new user ID to process');
      return;
    }

    try {
      console.log('🎯 REFERRAL CONTEXT: Processing referral conversion:', referralCode, 'for user:', newUserId);
      
      // Use the referral service to complete the referral
      const success = await referralService.completeReferral(referralCode, newUserId);
      
      if (success) {
        console.log('✅ REFERRAL CONTEXT: Referral processed successfully');
        // Clear referral after processing
        clearReferral();
      } else {
        console.log('⚠️ REFERRAL CONTEXT: Failed to process referral');
      }

    } catch (error) {
      console.error('❌ REFERRAL CONTEXT: Error processing referral:', error);
    }
  };

  const clearReferral = () => {
    setReferralCode(null);
    setReferrerInfo(null);
    sessionStorage.removeItem('dj_elite_referral_code');
  };

  const value: ReferralContextType = {
    referralCode,
    referrerInfo,
    setReferralCode,
    clearReferral,
    processReferralSignup,
  };

  return (
    <ReferralContext.Provider value={value}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = (): ReferralContextType => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error('useReferral must be used within ReferralProvider');
  }
  return context;
};
