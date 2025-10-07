import { supabase } from '../config/supabase';
import { referralService } from '../services/referralService';

export class ReferralHandler {
  private static instance: ReferralHandler;
  private referralCode: string | null = null;

  static getInstance(): ReferralHandler {
    if (!ReferralHandler.instance) {
      ReferralHandler.instance = new ReferralHandler();
    }
    return ReferralHandler.instance;
  }

  /**
   * Initialize referral tracking on app load
   */
  initialize(): void {
    // Capture referral code from URL
    this.captureReferralCode();
    
    // Listen for auth state changes to process referrals
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && this.referralCode) {
        this.processReferralForNewUser(session.user.id);
      }
    });
  }

  /**
   * Capture referral code from URL parameters
   */
  private captureReferralCode(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      console.log('🔗 REFERRAL: Captured referral code:', refCode);
      this.referralCode = refCode;
      
      // Store in sessionStorage for persistence across OAuth redirects
      sessionStorage.setItem('dj_elite_referral_code', refCode);
      
      // Clean URL without losing the referral tracking
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('ref');
      window.history.replaceState({}, document.title, cleanUrl.toString());
    } else {
      // Check if we have a stored referral code from OAuth redirect
      const storedCode = sessionStorage.getItem('dj_elite_referral_code');
      if (storedCode) {
        console.log('🔗 REFERRAL: Retrieved stored referral code:', storedCode);
        this.referralCode = storedCode;
      }
    }
  }

  /**
   * Process referral for newly signed up user
   */
  private async processReferralForNewUser(userId: string): Promise<void> {
    if (!this.referralCode) return;

    try {
      console.log('🎯 REFERRAL: Processing referral for new user:', userId, 'with code:', this.referralCode);
      
      // Check if user already has a profile (existing user)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, referred_by_code')
        .eq('user_id', userId)
        .single();

      // Only process referral for truly new users
      if (existingProfile?.referred_by_code) {
        console.log('ℹ️ REFERRAL: User already has referral code, skipping');
        this.clearReferralCode();
        return;
      }

      // Complete the referral
      const success = await referralService.completeReferral(this.referralCode, userId);
      
      if (success) {
        console.log('✅ REFERRAL: Successfully processed referral');
        
        // Update user profile with referral code
        await supabase
          .from('profiles')
          .update({ referred_by_code: this.referralCode })
          .eq('user_id', userId);
          
      } else {
        console.log('⚠️ REFERRAL: Failed to process referral - code may be invalid or expired');
      }
      
      // Clear the referral code after processing
      this.clearReferralCode();
      
    } catch (error) {
      console.error('❌ REFERRAL: Error processing referral:', error);
      this.clearReferralCode();
    }
  }

  /**
   * Clear stored referral code
   */
  private clearReferralCode(): void {
    this.referralCode = null;
    sessionStorage.removeItem('dj_elite_referral_code');
  }

  /**
   * Get current referral code (for testing)
   */
  getCurrentReferralCode(): string | null {
    return this.referralCode;
  }

  /**
   * Manually set referral code (for testing)
   */
  setReferralCode(code: string): void {
    this.referralCode = code;
    sessionStorage.setItem('dj_elite_referral_code', code);
  }

  /**
   * Validate referral code exists and is active
   */
  async validateReferralCode(code: string): Promise<boolean> {
    try {
      const { data: referrer } = await supabase
        .from('profiles')
        .select('id, dj_name')
        .eq('referral_code', code)
        .single();

      return !!referrer;
    } catch (error) {
      console.error('❌ REFERRAL: Error validating code:', error);
      return false;
    }
  }

  /**
   * Get referrer info for display
   */
  async getReferrerInfo(code: string): Promise<{ djName: string; isValid: boolean } | null> {
    try {
      const { data: referrer } = await supabase
        .from('profiles')
        .select('dj_name')
        .eq('referral_code', code)
        .single();

      if (referrer) {
        return {
          djName: referrer.dj_name,
          isValid: true
        };
      }
      
      return { djName: '', isValid: false };
    } catch (error) {
      console.error('❌ REFERRAL: Error getting referrer info:', error);
      return null;
    }
  }
}

// Export singleton instance
export const referralHandler = ReferralHandler.getInstance();
