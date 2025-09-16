// 🎤 DJ Elite Gig Marketplace & Referral Commission System
// Advanced B2B platform turning DJ connections into revenue streams

import { supabase } from '../config/supabase';
import { referralService } from './referralService';

export interface Gig {
  id: string;
  client_id: string; // Event organizer
  title: string;
  description: string;
  venue: string;
  location: string;
  date: string;
  duration: number; // hours
  budget: number;
  status: 'open' | 'bidding' | 'awarded' | 'confirmed' | 'completed' | 'cancelled';
  selected_dj_id?: string; // Awarded DJ
  booking_fee: number; // Platform fee (5-10%)
  referrer_commission: number; // 5-10% for gig referrers
  created_at: string;
  event_type: 'wedding' | 'corporate' | 'birthday' | 'club' | 'concert' | 'festival' | 'private';
  requirements: {
    genre?: string[];
    experience?: 'beginner' | 'intermediate' | 'professional';
    equipment?: string[];
    style?: string[];
  };
}

export interface GigApplication {
  id: string;
  gig_id: string;
  dj_id: string;
  proposed_fee: number;
  message: string;
  status: 'pending' | 'shortlisted' | 'selected' | 'rejected';
  dj_referred_by?: string; // Who referred this DJ to the platform
  gig_referred_by?: string; // Who suggested this DJ for this gig
  created_at: string;
}

export interface CommissionPayout {
  id: string;
  user_id: string;
  amount: number;
  type: 'signup_referral' | 'gig_referral';
  description: string;
  gig_id?: string;
  paid_at?: string;
  status: 'pending' | 'paid' | 'failed';
}

class GigMarketplaceService {
  private readonly PLATFORM_FEE = 0.10; // 10% platform fee
  private readonly GIG_REFERRAL_RATE = 0.05; // 5% commission for gig referrals
  private readonly DJ_SIGNUP_REFERRAL_RATE = 0.10; // 10% commission for original signup

  // 🎤 CREATE GIG POSTING
  async createGig(clientId: string, gigData: Omit<Gig, 'id' | 'client_id' | 'status' | 'created_at' | 'booking_fee' | 'referrer_commission'>): Promise<Gig> {
    try {
      const bookingFee = gigData.budget * this.PLATFORM_FEE;
      const referrerCommission = gigData.budget * this.GIG_REFERRAL_RATE;

      const { data, error } = await supabase
        .from('gigs')
        .insert({
          client_id: clientId,
          ...gigData,
          status: 'open',
          booking_fee: bookingFee,
          referrer_commission: referrerCommission,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      await this.notifyDJsOfGigOpportunity(data);
      return data;
    } catch (error) {
      console.error('❌ GIG: Failed to create gig', error);
      throw new Error('Failed to post gig');
    }
  }

  // 🎼 DJ APPLICATION PROCESS
  async applyForGig(djId: string, gigId: string, application: Omit<GigApplication, 'id' | 'dj_id' | 'gig_id' | 'status' | 'created_at'>): Promise<GigApplication> {
    try {
      // Check gig is still open
      const { data: gig } = await supabase
        .from('gigs')
        .select('status')
        .eq('id', gigId)
        .single();

      if (gig?.status !== 'open') {
        throw new Error('Gig is no longer accepting applications');
      }

      const { data, error } = await supabase
        .from('gig_applications')
        .insert({
          gig_id: gigId,
          dj_id: djId,
          ...application,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      await this.updateGigStatusToBidding(gigId);
      return data;
    } catch (error) {
      console.error('❌ GIG: Application failed', error);
      throw error;
    }
  }

  // 💰 AWARD GIG & PROCESS PAYMENT
  async awardGig(gigId: string, applicationId: string, clientId: string): Promise<boolean> {
    try {
      // Update gig status and selected DJ
      const { data: application } = await supabase
        .from('gig_applications')
        .select('dj_id, proposed_fee, gig_referred_by')
        .eq('id', applicationId)
        .single();

      if (!application) throw new Error('Application not found');

      // Update gig
      const { error: gigError } = await supabase
        .from('gigs')
        .update({
          selected_dj_id: application.dj_id,
          status: 'awarded'
        })
        .eq('id', gigId)
        .eq('client_id', clientId);

      if (gigError) throw gigError;

      // Update application status
      await supabase
        .from('gig_applications')
        .update({ status: 'selected' })
        .eq('gig_id', gigId)
        .neq('id', applicationId);

      // Process gig referral commission
      if (application.gig_referred_by) {
        await this.processGigReferralCommission(
          application.gig_referred_by,
          gigId,
          application.proposed_fee
        );
      }

      return true;
    } catch (error) {
      console.error('❌ GIG: Award failed', error);
      return false;
    }
  }

  // 🎵 CONFIRM GIG COMPLETION
  async confirmGigCompletion(gigId: string, djId: string): Promise<boolean> {
    try {
      const { data: gig } = await supabase
        .from('gigs')
        .select('*')
        .eq('id', gigId)
        .eq('selected_dj_id', djId)
        .single();

      if (!gig) throw new Error('Gig not found');

      // Update gig status
      const { error } = await supabase
        .from('gigs')
        .update({
          status: 'completed'
        })
        .eq('id', gigId);

      if (error) throw error;

      // Process final payments and commissions
      await this.processFinalPayments(gig);

      return true;
    } catch (error) {
      console.error('❌ GIG: Completion confirmation failed', error);
      return false;
    }
  }

  // 💳 PROCESS FINAL PAYMENTS & COMMISSIONS
  private async processFinalPayments(gig: Gig): Promise<void> {
    try {
      const totalFee = gig.budget + gig.booking_fee;
      const workingFee = gig.budget;

      // 1. Process platform fees
      await this.recordPlatformFee(gig.booking_fee, gig.id);

      // 2. Process gig referral commission
      const { data: application } = await supabase
        .from('gig_applications')
        .select('gig_referred_by')
        .eq('gig_id', gig.id)
        .eq('dj_id', gig.selected_dj_id!)
        .single();

      if (application?.gig_referred_by) {
        const commission = Math.round(gig.budget * this.GIG_REFERRAL_RATE);
        await this.recordGigReferralCommission(
          application.gig_referred_by,
          commission,
          gig.id
        );
      }

      // 3. Process DJ signup referral commission (if applicable)
      const { data: djProfile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('id', gig.selected_dj_id!)
        .single();

      if (djProfile) {
        const djReferer = await this.getOriginalDjReferrer(djProfile.user_id);
        if (djReferer) {
          const commission = Math.round(gig.budget * this.DJ_SIGNUP_REFERRAL_RATE);
          await this.recordDjSignupCommission(djReferer, commission, gig.id);
        }
      }

      await this.createPaymentRecords(gig);

    } catch (error) {
      console.error('❌ PAYMENT: Final payment processing failed', error);
    }
  }

  // 🎯 SUGGEST DJS FOR GIGS (INTELLIGENT MATCHING)
  async suggestDJsForGig(gigId: string, clientId: string, limit: number = 10): Promise<Array<{dj_id: string, match_score: number, referrer?: string}>> {
    try {
      const { data: gig } = await supabase
        .from('gigs')
        .select('*')
        .eq('id', gigId)
        .single();

      if (!gig) return [];

      // Complex matching algorithm considers:
      // - Location proximity
      // - Genre compatibility
      // - Experience level
      // - Equipment availability
      // - Previous successful gigs
      // - Ratings and reviews

      const { data: suggestions } = await supabase.rpc(
        'match_djs_to_gig',
        {
          p_gig_id: gigId,
          p_client_id: clientId,
          p_limit: limit
        }
      );

      return suggestions || [];
    } catch (error) {
      console.error('❌ GIG: DJ suggestions failed', error);
      return [];
    }
  }

  // 📊 GET USER'S EARNINGS DASHBOARD
  async getUserEarnings(userId: string): Promise<{
    total_earned: number;
    pending_payouts: number;
    paid_out: number;
    recent_commissions: CommissionPayout[];
    gigs_referred: number;
    djs_signed_up: number;
  }> {
    try {
      // Get all commissions for user
      const { data: commissions } = await supabase
        .from('commission_payouts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!commissions) {
        return {
          total_earned: 0,
          pending_payouts: 0,
          paid_out: 0,
          recent_commissions: [],
          gigs_referred: 0,
          djs_signed_up: 0
        };
      }

      const pending = commissions
        .filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + c.amount, 0);

      const paid = commissions
        .filter(c => c.status === 'paid')
        .reduce((sum, c) => sum + c.amount, 0);

      const gigsReferred = await this.getGigsReferredCount(userId);
      const djsSignedUp = await this.getDjsSignedUpCount(userId);

      return {
        total_earned: pending + paid,
        pending_payouts: pending,
        paid_out: paid,
        recent_commissions: commissions.slice(0, 10),
        gigs_referred: gigsReferred,
        djs_signed_up: djsSignedUp
      };
    } catch (error) {
      console.error('❌ EARNINGS: Dashboard query failed', error);
      return {
        total_earned: 0,
        pending_payouts: 0,
        paid_out: 0,
        recent_commissions: [],
        gigs_referred: 0,
        djs_signed_up: 0
      };
    }
  }

  // 🔔 NOTIFICATION SYSTEM
  private async notifyDJsOfGigOpportunity(gig: Gig): Promise<void> {
    try {
      const matchingDJs = await this.suggestDJsForGig(gig.id, gig.client_id);
      const djIds = matchingDJs.map(d => d.dj_id);

      if (djIds.length === 0) return;

      const notifications = djIds.map(djId => ({
        user_id: djId,
        type: 'gig_opportunity',
        title: `New ${gig.event_type} gig in ${gig.location}`,
        message: `${gig.title} - $${gig.budget}\nRequirements: ${gig.requirements.genre?.join(', ') || 'Open'}`,
        data: { gig_id: gig.id, budget: gig.budget }
      }));

      await supabase.from('notifications').insert(notifications);
    } catch (error) {
      console.error('❌ NOTIFICATION: DJ gig notification failed', error);
    }
  }

  // 🎯 REFER DJ FOR SPECIFIC GIG
  async referDjForGig(referrerId: string, djId: string, gigId: string): Promise<boolean> {
    try {
      // Update or create application with referrer info
      const { error } = await supabase
        .from('gig_applications')
        .update({
          gig_referred_by: referrerId
        })
        .eq('gig_id', gigId)
        .eq('dj_id', djId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('❌ REFER: DJ gig referral failed', error);
      return false;
    }
  }

  // 🔍 PRIVATE HELPER METHODS

  private async updateGigStatusToBidding(gigId: string): Promise<void> {
    await supabase
      .from('gigs')
      .update({ status: 'bidding' })
      .eq('id', gigId);
  }

  private async processGigReferralCommission(referrerId: string, gigId: string, gigValue: number): Promise<void> {
    const commission = Math.round(gigValue * this.GIG_REFERRAL_RATE);
    await this.recordGigReferralCommission(referrerId, commission, gigId);
  }

  private async recordGigReferralCommission(referrerId: string, amount: number, gigId: string): Promise<void> {
    await supabase.from('commission_payouts').insert({
      user_id: referrerId,
      amount: amount,
      type: 'gig_referral',
      description: `Commission for referring DJ to gig ${gigId}`,
      gig_id: gigId,
      status: 'pending'
    });
  }

  private async recordDjSignupCommission(referrerId: string, amount: number, gigId: string): Promise<void> {
    await supabase.from('commission_payouts').insert({
      user_id: referrerId,
      amount: amount,
      type: 'signup_referral',
      description: `Commission for DJ who originally referred the performer`,
      gig_id: gigId,
      status: 'pending'
    });
  }

  private async getOriginalDjReferrer(djUserId: string): Promise<string | null> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', djUserId)
      .single();

    if (!profile) return null;

    // This would need to be tracked in the referrals table
    // For now, return null - can be enhanced later
    return null;
  }

  private async recordPlatformFee(amount: number, gigId: string): Promise<void> {
    await supabase.from('platform_fees').insert({
      gig_id: gigId,
      amount: amount,
      type: 'booking_fee',
      created_at: new Date().toISOString()
    });
  }

  private async createPaymentRecords(gig: Gig): Promise<void> {
    // Record payment to DJ
    await supabase.from('payment_records').insert({
      gig_id: gig.id,
      recipient_id: gig.selected_dj_id,
      amount: gig.budget * (1 - this.PLATFORM_FEE), // DJ gets full fee minus fee
      type: 'dj_payment',
      status: 'pending'
    });

    // Record payment from client
    await supabase.from('payment_records').insert({
      gig_id: gig.id,
      sender_id: gig.client_id,
      amount: gig.budget + gig.booking_fee,
      type: 'client_payment',
      status: 'completed'
    });
  }

  private async getGigsReferredCount(userId: string): Promise<number> {
    const { count } = await supabase
      .from('gig_applications')
      .select('*', { count: 'exact', head: true })
      .eq('gig_referred_by', userId);
    return count || 0;
  }

  private async getDjsSignedUpCount(userId: string): Promise<number> {
    const { count } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', userId)
      .eq('status', 'completed');
    return count || 0;
  }
}

export const gigMarketplace = new GigMarketplaceService();
