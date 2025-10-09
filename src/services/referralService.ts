import { sql } from '../config/supabase';
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
  type: 'premium_days' | 'super_likes' | 'boosts' | 'account_upgrade';
  amount: number;
  description: string;
}

class ReferralService {
  private readonly REFERRAL_REWARDS: { [key: string]: ReferralReward } = {
    first_referral: { type: 'premium_days', amount: 7, description: '7 days of DJ Elite Premium' },
    multiple_referrals: { type: 'super_likes', amount: 5, description: '5 Super Likes' },
    power_referrer: { type: 'boosts', amount: 1, description: '1 Free Boost (30 minutes)' },
    mega_referrer: { type: 'account_upgrade', amount: 1, description: 'Free Account Upgrade to Pro Annual' }
  };

  async generateReferralCode(userId: string): Promise<string> {
    try {
      const timestamp = Date.now().toString(36);
      const userHash = userId.slice(-8);
      const referralCode = `DJ${userHash}${timestamp}`.toUpperCase();
      await sql`UPDATE profiles SET referral_code = ${referralCode} WHERE user_id = ${userId}`;
      return referralCode;
    } catch (error) {
      console.error('❌ REFERRAL: Error generating code:', error);
      throw error;
    }
  }

  async sendReferralInvitation(referrerUserId: string, recipientEmail: string, personalMessage?: string): Promise<{ success: boolean; referralId?: string }> {
    try {
      const referrer = await sql`SELECT dj_name, referral_code FROM profiles WHERE user_id = ${referrerUserId} LIMIT 1`;
      if (!referrer.rows[0]) throw new Error('Referrer profile not found');

      let referralCode = referrer.rows[0].referral_code;
      if (!referralCode) referralCode = await this.generateReferralCode(referrerUserId);

      const referral = await sql`INSERT INTO referrals (referrer_id, referred_email, status, referral_code, personal_message) VALUES (${referrerUserId}, ${recipientEmail}, 'pending', ${referralCode}, ${personalMessage}) RETURNING *`;
      return { success: true, referralId: referral.rows[0].id };
    } catch (error) {
      console.error('❌ REFERRAL: Error sending invitation:', error);
      return { success: false };
    }
  }

  async completeReferral(referralCode: string, newUserId: string): Promise<boolean> {
    try {
      const referral = await sql`SELECT * FROM referrals WHERE referral_code = ${referralCode} AND status = 'pending' LIMIT 1`;
      if (!referral.rows[0]) return false;

      await sql`UPDATE referrals SET referred_user_id = ${newUserId}, status = 'completed', completed_at = NOW() WHERE id = ${referral.rows[0].id}`;
      await this.awardReferralRewards(referral.rows[0].referrer_id);
      await this.sendReferralSuccessNotification(referral.rows[0].referrer_id, newUserId);
      return true;
    } catch (error) {
      console.error('❌ REFERRAL: Error completing referral:', error);
      return false;
    }
  }

  private async awardReferralRewards(referrerUserId: string): Promise<void> {
    try {
      const result = await sql`SELECT COUNT(*) FROM referrals WHERE referrer_id = ${referrerUserId} AND status = 'completed'`;
      const referralCount = parseInt(result.rows[0]?.count || '0');

      let reward: ReferralReward | null = null;
      if (referralCount === 1) reward = this.REFERRAL_REWARDS.first_referral;
      else if (referralCount % 3 === 0) reward = this.REFERRAL_REWARDS.multiple_referrals;
      else if (referralCount >= 10 && referralCount % 5 === 0) reward = this.REFERRAL_REWARDS.power_referrer;
      else if (referralCount >= 20) reward = this.REFERRAL_REWARDS.mega_referrer;

      if (!reward) return;

      await sql`INSERT INTO referral_rewards (user_id, reward_type, reward_amount, description, earned_at, claimed) VALUES (${referrerUserId}, ${reward.type}, ${reward.amount}, ${reward.description}, NOW(), false)`;
      await this.applyReward(referrerUserId, reward);
    } catch (error) {
      console.error('❌ REFERRAL: Error awarding rewards:', error);
    }
  }

  private async applyReward(userId: string, reward: ReferralReward): Promise<void> {
    try {
      switch (reward.type) {
        case 'premium_days':
          const subscription = await sql`SELECT * FROM subscriptions WHERE user_id = ${userId} LIMIT 1`;
          const endDate = new Date(Date.now() + (reward.amount * 24 * 60 * 60 * 1000)).toISOString();
          if (subscription.rows[0]) {
            const currentEnd = new Date(subscription.rows[0].current_period_end);
            const newEnd = new Date(currentEnd.getTime() + (reward.amount * 24 * 60 * 60 * 1000)).toISOString();
            await sql`UPDATE subscriptions SET current_period_end = ${newEnd} WHERE user_id = ${userId}`;
          } else {
            await sql`INSERT INTO subscriptions (user_id, status, current_period_end, is_referral_reward) VALUES (${userId}, 'active', ${endDate}, true)`;
          }
          break;
        case 'super_likes':
          await sql`INSERT INTO user_stats (user_id, super_likes_bonus) VALUES (${userId}, ${reward.amount}) ON CONFLICT (user_id) DO UPDATE SET super_likes_bonus = user_stats.super_likes_bonus + ${reward.amount}`;
          break;
        case 'boosts':
          await sql`INSERT INTO user_stats (user_id, boost_credits) VALUES (${userId}, ${reward.amount}) ON CONFLICT (user_id) DO UPDATE SET boost_credits = user_stats.boost_credits + ${reward.amount}`;
          break;
        case 'account_upgrade':
          await this.upgradeUserAccount(userId);
          break;
      }
    } catch (error) {
      console.error('❌ REFERRAL: Error applying reward:', error);
    }
  }

  private async upgradeUserAccount(userId: string): Promise<void> {
    try {
      const existingSubscription = await sql`SELECT * FROM subscriptions WHERE user_id = ${userId} LIMIT 1`;
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      const endDate = oneYearFromNow.toISOString();

      if (existingSubscription.rows[0]) {
        await sql`UPDATE subscriptions SET status = 'active', plan_type = 'Pro Annual', current_period_end = ${endDate}, is_referral_reward = true, updated_at = NOW() WHERE user_id = ${userId}`;
      } else {
        await sql`INSERT INTO subscriptions (user_id, status, plan_type, current_period_end, is_referral_reward, created_at) VALUES (${userId}, 'active', 'Pro Annual', ${endDate}, true, NOW())`;
      }

      await sql`UPDATE profiles SET plan = 'Pro Annual', updated_at = NOW() WHERE user_id = ${userId}`;
      await sql`INSERT INTO notifications (user_id, type, title, message, data) VALUES (${userId}, 'account_upgrade', '🎉 Account Upgraded to Pro Annual!', 'Congratulations! You''ve earned a free Pro Annual upgrade through referrals.', ${JSON.stringify({ upgrade_type: 'Pro Annual', is_referral_reward: true })})`;
    } catch (error) {
      console.error('❌ REFERRAL: Error upgrading user account:', error);
    }
  }

  private async sendReferralSuccessNotification(referrerId: string, newUserId: string): Promise<void> {
    try {
      const newUser = await sql`SELECT dj_name FROM profiles WHERE user_id = ${newUserId} LIMIT 1`;
      const djName = newUser.rows[0]?.dj_name || 'A new DJ';
      await sql`INSERT INTO notifications (user_id, type, title, message, data) VALUES (${referrerId}, 'referral_success', '🎉 Your referral joined DJ Elite!', ${`${djName} just signed up using your referral link. You've earned 7 days of premium!`}, ${JSON.stringify({ new_user_id: newUserId, dj_name: djName })})`;
    } catch (error) {
      console.error('❌ REFERRAL: Error sending notification:', error);
    }
  }

  async getReferralStats(userId: string): Promise<ReferralStats> {
    try {
      const referrals = await sql`SELECT * FROM referrals WHERE referrer_id = ${userId}`;
      if (!referrals.rows.length) return this.getEmptyStats();

      const rewards = await sql`SELECT * FROM referral_rewards WHERE user_id = ${userId} AND claimed = false`;
      const completed = referrals.rows.filter((r: ReferralData) => r.status === 'completed');
      const pending = referrals.rows.filter((r: ReferralData) => r.status === 'pending');

      return {
        totalReferrals: referrals.rows.length,
        completedReferrals: completed.length,
        pendingReferrals: pending.length,
        unclaimedRewards: rewards.rows.length,
        totalRewardsEarned: completed.length * 10
      };
    } catch (error) {
      console.error('❌ REFERRAL: Error getting stats:', error);
      return this.getEmptyStats();
    }
  }

  async getReferralLeaderboard(limit: number = 10): Promise<Array<{ dj_name: string; referral_count: number; total_rewards: number; }>> {
    try {
      const referrals = await sql`SELECT referrer_id FROM referrals WHERE status = 'completed'`;
      if (!referrals.rows.length) return [];

      const referrerCounts = referrals.rows.reduce((acc: Map<string, number>, curr) => {
        const count = acc.get(curr.referrer_id) || 0;
        acc.set(curr.referrer_id, count + 1);
        return acc;
      }, new Map());

      const leaderboard: Array<{ dj_name: string; referral_count: number; total_rewards: number; }> = [];

      for (const [referrerId, count] of referrerCounts.entries()) {
        try {
          const profile = await sql`SELECT dj_name FROM profiles WHERE user_id = ${referrerId} LIMIT 1`;
          const djName = profile.rows[0]?.dj_name || 'Anonymous DJ';
          leaderboard.push({ dj_name: djName, referral_count: count, total_rewards: count * 10 });
        } catch {
          leaderboard.push({ dj_name: 'Anonymous DJ', referral_count: count, total_rewards: count * 10 });
        }
      }

      return leaderboard.sort((a, b) => b.referral_count - a.referral_count).slice(0, limit);
    } catch (error) {
      console.error('❌ REFERRAL: Error getting leaderboard:', error);
      return [];
    }
  }

  generateSocialShareContent(referralCode: string, djName: string): { twitter: string; instagram: string; facebook: string; linkedin: string; } {
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

  async sendReferralNotification(referrerId: string, newUserName: string): Promise<void> {
    try {
      await sql`INSERT INTO notifications (user_id, type, title, message, data) VALUES (${referrerId}, 'referral_success', '🎉 Referral Successful!', ${`${newUserName} just joined DJ Elite through your referral. Check your rewards!`}, ${JSON.stringify({ new_user_name: newUserName })})`;
    } catch (error) {
      console.error('Failed to send referral notification:', error);
    }
  }

  private getEmptyStats(): ReferralStats {
    return { totalReferrals: 0, completedReferrals: 0, pendingReferrals: 0, unclaimedRewards: 0, totalRewardsEarned: 0 };
  }
}

export const referralService = new ReferralService();
export type { ReferralData, ReferralStats, ReferralReward };
