-- DJ Elite Referral System - Complete Database Schema
-- Run this in your Supabase SQL Editor

-- Add referral_code to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'expired')) DEFAULT 'pending',
  reward_claimed BOOLEAN DEFAULT false,
  personal_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(referrer_id, referred_email)
);

-- Create referral_rewards table
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_id UUID REFERENCES referrals(id) ON DELETE CASCADE,
  reward_type TEXT CHECK (reward_type IN ('premium_days', 'super_likes', 'boosts')) NOT NULL,
  reward_amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_stats table for bonus tracking
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  super_likes_bonus INTEGER DEFAULT 0,
  boost_credits INTEGER DEFAULT 0,
  premium_days_bonus INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referrals
CREATE POLICY "Users can view their own referrals" ON referrals FOR SELECT USING (
  referrer_id = auth.uid() OR referred_user_id = auth.uid()
);
CREATE POLICY "Users can insert their own referrals" ON referrals FOR INSERT WITH CHECK (
  referrer_id = auth.uid()
);
CREATE POLICY "Users can update their own referrals" ON referrals FOR UPDATE USING (
  referrer_id = auth.uid()
);

-- RLS Policies for referral_rewards
CREATE POLICY "Users can view their own rewards" ON referral_rewards FOR SELECT USING (
  user_id = auth.uid()
);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (
  user_id = auth.uid()
);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (
  user_id = auth.uid()
);

-- RLS Policies for user_stats
CREATE POLICY "Users can view their own stats" ON user_stats FOR SELECT USING (
  user_id = auth.uid()
);
CREATE POLICY "Users can update their own stats" ON user_stats FOR ALL USING (
  user_id = auth.uid()
);

-- Function to complete referral when user signs up
CREATE OR REPLACE FUNCTION complete_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
  referral_record RECORD;
  referrer_profile_id UUID;
BEGIN
  -- Check if user was referred (look for referral code in metadata)
  IF NEW.raw_user_meta_data ? 'referral_code' THEN
    -- Find the referral record
    SELECT * INTO referral_record
    FROM referrals 
    WHERE referral_code = NEW.raw_user_meta_data->>'referral_code'
    AND status = 'pending'
    LIMIT 1;
    
    IF FOUND THEN
      -- Update referral status
      UPDATE referrals 
      SET 
        referred_user_id = NEW.id,
        status = 'completed',
        completed_at = NOW()
      WHERE id = referral_record.id;
      
      -- Get referrer profile ID
      SELECT id INTO referrer_profile_id
      FROM profiles 
      WHERE user_id = referral_record.referrer_id;
      
      -- Create notification for referrer
      INSERT INTO notifications (user_id, type, title, message, data)
      VALUES (
        referral_record.referrer_id,
        'referral_success',
        '🎉 Your referral joined DJ Elite!',
        'Someone just signed up using your referral link. You''ve earned rewards!',
        jsonb_build_object('new_user_id', NEW.id, 'referral_id', referral_record.id)
      );
      
      -- Award referral reward (7 days premium for first referral)
      INSERT INTO referral_rewards (user_id, referral_id, reward_type, reward_amount, description)
      VALUES (
        referral_record.referrer_id,
        referral_record.id,
        'premium_days',
        7,
        '7 days of DJ Elite Premium for successful referral'
      );
      
      -- Update user stats
      INSERT INTO user_stats (user_id, premium_days_bonus)
      VALUES (referral_record.referrer_id, 7)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        premium_days_bonus = user_stats.premium_days_bonus + 7,
        updated_at = NOW();
        
      -- Store referral code in new user's profile for tracking
      UPDATE profiles 
      SET referred_by_code = referral_record.referral_code
      WHERE user_id = NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created_referral ON auth.users;
CREATE TRIGGER on_auth_user_created_referral
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION complete_referral_signup();

-- Drop existing function if it exists with different signature
DROP FUNCTION IF EXISTS get_referral_leaderboard(INTEGER);

-- Function to get referral leaderboard
CREATE OR REPLACE FUNCTION get_referral_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  dj_name TEXT,
  referral_count BIGINT,
  total_rewards INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.dj_name,
    COUNT(r.id) as referral_count,
    (COUNT(r.id) * 10)::INTEGER as total_rewards
  FROM profiles p
  INNER JOIN referrals r ON p.user_id = r.referrer_id
  WHERE r.status = 'completed'
  GROUP BY p.user_id, p.dj_name
  ORDER BY referral_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);