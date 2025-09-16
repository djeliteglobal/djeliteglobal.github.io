import { supabase } from '../config/supabase';
import type { DJProfile } from '../types/profile';

interface ReferralData {
  id: string;
  referrer_id: string;
  referred_email: string;
  referred_user_id?: string;
  status: 'pending' | 'completed' | 'expired';
  reward_claimed: boolean;
  created_at: string;
  completed_at?: string;
  referral_code?: string;
  personal_message?: string;
}

interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  unclaimedRewards: number;
  totalRewardsEarned: number;
}

interface ReferralReward {
  type: 'premium_days' | 'super_likes' | 'boosts';
  amount: number;
  description: string;
}

class ReferralService {
  private readonly REFERRAL_REWARDS: { [key: string]: ReferralReward } = {
    first_referral: {
      type: 'premium_days',
      amount: 7,
      description: '7 days of DJ Elite Premium'
    },
    multiple_referrals: {
      type: 'super_likes',
      amount: 5,
      description: '5 Super Likes'
    },
    power_referrer: {
      type: 'boosts',
      amount: 1,
      description: '1 Free Boost (30 minutes)'
    }
  };

  /**
   * Generate a unique referral code for a user
   */
  async generateReferralCode(userId: string): Promise<string> {
    try {
      // Create a unique referral code based on user ID and timestamp
      const timestamp = Date.now().toString(36);
      const userHash = userId.slice(-8);
      const referralCode = `DJ${userHash}${timestamp}`.toUpperCase();

      // Store the referral code in user profile
      const { error } = await supabase
        .from('profiles')
        .update({ referral_code: referralCode })
        .eq('user_id', userId);

      if (error) throw error;

      return referralCode;
    } catch (error) {
      console.error('❌ REFERRAL: Error generating code:', error);
      throw error;
    }
  }

  /**
   * Send referral invitation via email
   */
  async sendReferralInvitation(
    referrerUserId: string, 
    recipientEmail: string,
    personalMessage?: string
  ): Promise<{ success: boolean; referralId?: string }> {
    try {
      // Get referrer profile
      const { data: referrer } = await supabase
        .from('profiles')
        .select('dj_name, referral_code')
        .eq('user_id', referrerUserId)
        .single();

      if (!referrer) throw new Error('Referrer profile not found');

      // Generate referral code if not exists
      let referralCode = referrer.referral_code;
      if (!referralCode) {
        referralCode = await this.generateReferralCode(referrerUserId);
      }

      // Create referral record
      const { data: referral, error: referralError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerUserId,
          referred_email: recipientEmail,
          status: 'pending',
          referral_code: referralCode,
          personal_message: personalMessage
        })
        .select()
        .single();

      if (referralError) throw referralError;

      // Send email via Edge Function (optional - graceful fallback)
      try {
        const emailData = {
          to: recipientEmail,
          referrer_name: referrer.dj_name,
          referral_code: referralCode,
          personal_message: personalMessage,
          referral_link: `https://djelite.site?ref=${referralCode}`
        };

        const { error: emailError } = await supabase.functions.invoke('send-referral-email', {
          body: emailData
        });

        if (emailError) {
          console.warn('⚠️ REFERRAL: Email send failed, but referral created:', emailError);
        }
      } catch (emailError) {
        console.warn('⚠️ REFERRAL: Email service not available:', emailError);
      }

      return { success: true, referralId: referral.id };
    } catch (error) {
      console.error('❌ REFERRAL: Error sending invitation:', error);
      return { success: false };
    }
  }

  /**
   * Process referral completion when someone signs up
   * This is now handled by database trigger, but keeping for manual processing
   */
  async completeReferral(referralCode: string, newUserId: string): Promise<boolean> {
    try {
      console.log('🔄 REFERRAL: Processing completion for code:', referralCode, 'user:', newUserId);
      
      // Find pending referral by code
      const { data: referral } = await supabase
        .from('referrals')
        .select('*')
        .eq('referral_code', referralCode)
        .eq('status', 'pending')
        .single();

      if (!referral) {
        console.log('⚠️ REFERRAL: No pending referral found for code:', referralCode);
        return false;
      }

      // Update referral status
      const { error: updateError } = await supabase
        .from('referrals')
        .update({
          referred_user_id: newUserId,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', referral.id);

      if (updateError) throw updateError;

      // Award referral rewards
      await this.awardReferralRewards(referral.referrer_id);

      // Send success notification
      await this.sendReferralSuccessNotification(referral.referrer_id, newUserId);

      console.log('✅ REFERRAL: Completed successfully', referral.id);
      return true;
    } catch (error) {
      console.error('❌ REFERRAL: Error completing referral:', error);
      return false;
    }
  }

  /**
   * Award rewards to referrer based on referral milestones
   */
  private async awardReferralRewards(referrerUserId: string): Promise<void> {
    try {
      console.log('🎁 REFERRAL: Awarding rewards to:', referrerUserId);
      
      // Get referrer's completed referral count
      const { count: completedCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', referrerUserId)
        .eq('status', 'completed');

      const referralCount = completedCount || 0;
      console.log('📊 REFERRAL: Total completed referrals:', referralCount);

      // Determine reward based on milestone
      let reward: ReferralReward | null = null;
      if (referralCount === 1) {
        reward = this.REFERRAL_REWARDS.first_referral;
      } else if (referralCount % 3 === 0) {
        reward = this.REFERRAL_REWARDS.multiple_referrals;
      } else if (referralCount >= 10 && referralCount % 5 === 0) {
        reward = this.REFERRAL_REWARDS.power_referrer;
      }

      if (!reward) {
        console.log('ℹ️ REFERRAL: No reward milestone reached');
        return;
      }

      console.log('🏆 REFERRAL: Reward milestone reached:', reward);

      // Create reward record
      const { error: rewardError } = await supabase
        .from('referral_rewards')
        .insert({
          user_id: referrerUserId,
          reward_type: reward.type,
          reward_amount: reward.amount,
          description: reward.description,
          earned_at: new Date().toISOString(),
          claimed: false
        });

      if (rewardError) {
        console.error('❌ REFERRAL: Reward creation failed:', rewardError);
        return;
      }

      // Apply reward immediately based on type
      await this.applyReward(referrerUserId, reward);

      console.log(`✅ REFERRAL: Reward awarded to ${referrerUserId}:`, reward);
    } catch (error) {
      console.error('❌ REFERRAL: Error awarding rewards:', error);
    }
  }

  /**
   * Apply reward to user account
   */
  private async applyReward(userId: string, reward: ReferralReward): Promise<void> {
    try {
      switch (reward.type) {
        case 'premium_days':
          // Extend premium subscription
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (subscription) {
            const currentEnd = new Date(subscription.current_period_end);
            const newEnd = new Date(currentEnd.getTime() + (reward.amount * 24 * 60 * 60 * 1000));
            
            await supabase
              .from('subscriptions')
              .update({ current_period_end: newEnd.toISOString() })
              .eq('user_id', userId);
          } else {
            // Create temporary premium access
            const endDate = new Date(Date.now() + (reward.amount * 24 * 60 * 60 * 1000));
            await supabase
              .from('subscriptions')
              .insert({
                user_id: userId,
                status: 'active',
                current_period_end: endDate.toISOString(),
                is_referral_reward: true
              });
          }
          break;

        case 'super_likes':
          // Add super likes to user account
          await supabase
            .from('user_stats')
            .upsert({
              user_id: userId,
              super_likes_bonus: reward.amount
            }, { onConflict: 'user_id' });
          break;

        case 'boosts':
          // Add boost credits
          await supabase
            .from('user_stats')
            .upsert({
              user_id: userId,
              boost_credits: reward.amount
            }, { onConflict: 'user_id' });
          break;
      }
    } catch (error) {
      console.error('❌ REFERRAL: Error applying reward:', error);
    }
  }

  /**
   * Send notification about successful referral
   */
  private async sendReferralSuccessNotification(referrerId: string, newUserId: string): Promise<void> {
    try {
      console.log('📢 REFERRAL: Sending notification to referrer:', referrerId);
      
      // Get new user profile (use dj_name as name, no separate name field)
      const { data: newUser } = await supabase
        .from('profiles')
        .select('dj_name')
        .eq('user_id', newUserId)
        .single();

      const djName = newUser?.dj_name || 'A new DJ';
      
      // Create notification
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: referrerId,
          type: 'referral_success',
          title: '🎉 Your referral joined DJ Elite!',
          message: `${djName} just signed up using your referral link. You've earned 7 days of premium!`,
          data: { new_user_id: newUserId, dj_name: djName }
        });

      if (error) {
        console.error('❌ REFERRAL: Notification failed:', error);
      } else {
        console.log('✅ REFERRAL: Notification sent successfully');
      }
    } catch (error) {
      console.error('❌ REFERRAL: Error sending notification:', error);
    }
  }

  /**
   * Get user's referral statistics
   */
  async getReferralStats(userId: string): Promise<ReferralStats> {
    try {
      // Get all referrals for user
      const { data: referrals } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', userId);

      if (!referrals) return this.getEmptyStats();

      // Get unclaimed rewards
      const { data: rewards } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('user_id', userId)
        .eq('claimed', false);

      const completed = referrals.filter((r: ReferralData) => r.status === 'completed');
      const pending = referrals.filter((r: ReferralData) => r.status === 'pending');

      return {
        totalReferrals: referrals.length,
        completedReferrals: completed.length,
        pendingReferrals: pending.length,
        unclaimedRewards: rewards?.length || 0,
        totalRewardsEarned: completed.length * 10 // Base reward value
      };
    } catch (error) {
      console.error('❌ REFERRAL: Error getting stats:', error);
      return this.getEmptyStats();
    }
  }

  /**
   * Get referral leaderboard
   */
  async getReferralLeaderboard(limit: number = 10): Promise<Array<{
    dj_name: string;
    referral_count: number;
    total_rewards: number;
  }>> {
    try {
      // Use RPC function if available (from database schema)
      try {
        const { data: leaderboardData, error } = await supabase.rpc('get_referral_leaderboard', { limit_count: limit });

        if (!error && leaderboardData && leaderboardData.length > 0) {
          return leaderboardData;
        }
      } catch (rpcError) {
        console.log('🔄 RPC not available, using fallback query');
      }

      // Fallback: Manual aggregation query
      const { data: referrals } = await supabase
        .from('referrals')
        .select('referrer_id')
        .eq('status', 'completed');

      if (!referrals || referrals.length === 0) return [];

      // Get unique referrer IDs and their counts
      const referrerCounts = referrals.reduce((acc: Map<string, number>, curr) => {
        const count = acc.get(curr.referrer_id) || 0;
        acc.set(curr.referrer_id, count + 1);
        return acc;
      }, new Map());

      // Get profile info for each referrer
      const leaderboard: Array<{
        dj_name: string;
        referral_count: number;
        total_rewards: number;
      }> = [];

      for (const [referrerId, count] of referrerCounts.entries()) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('dj_name')
            .eq('user_id', referrerId)
            .single();

          const djName = profile?.dj_name || 'Anonymous DJ';

          leaderboard.push({
            dj_name: djName,
            referral_count: count,
            total_rewards: count * 10 // $10 base commission per referral
          });
        } catch (profileError) {
          console.warn('⚠️ Could not load profile for referrer:', referrerId);
          // Add anonymous entry
          leaderboard.push({
            dj_name: 'Anonymous DJ',
            referral_count: count,
            total_rewards: count * 10
          });
        }
      }

      return leaderboard
        .sort((a, b) => b.referral_count - a.referral_count)
        .slice(0, limit);

    } catch (error) {
      console.error('❌ REFERRAL: Error getting leaderboard:', error);
      return [];
    }
  }

  /**
   * Generate shareable referral content for social media
   */
  generateSocialShareContent(referralCode: string, djName: string): {
    twitter: string;
    instagram: string;
    facebook: string;
    linkedin: string;
  } {
    const baseMessage = `🎧 Just discovered DJ Elite - the Tinder for DJs! Connect with DJs worldwide for collabs, gigs, and networking.`;
    const referralLink = `https://djelite.site?ref=${referralCode}`;
    const cta = `Join using my link and we both get premium features! 🎵`;

    return {
      twitter: `${baseMessage}\n\n${cta}\n\n${referralLink}\n\n#DJElite #DJNetworking #MusicCollab`,
      instagram: `${baseMessage}\n\n${cta}\n\nLink in bio! Use code: ${referralCode}\n\n#DJElite #DJLife #MusicNetworking`,
      facebook: `Hey DJ friends! 👋\n\n${baseMessage}\n\n${cta}\n\n${referralLink}`,
      linkedin: `Attention music industry professionals!\n\n${baseMessage}\n\nThis platform is revolutionizing DJ networking.\n\n${cta}\n\n${referralLink}`
    };
  }

  /**
   * Send referral success notification to referrer
   */
  async sendReferralNotification(referrerId: string, newUserName: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: referrerId,
          type: 'referral_success',
          title: '🎉 Referral Successful!',
          message: `${newUserName} just joined DJ Elite through your referral. Check your rewards!`,
          data: { new_user_name: newUserName }
        });
    } catch (error) {
      console.error('Failed to send referral notification:', error);
    }
  }

  private getEmptyStats(): ReferralStats {
    return {
      totalReferrals: 0,
      completedReferrals: 0,
      pendingReferrals: 0,
      unclaimedRewards: 0,
      totalRewardsEarned: 0
    };
  }
}

export const referralService = new ReferralService();
export type { ReferralData, ReferralStats, ReferralReward };
