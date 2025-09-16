-- Viral Mechanics Database Schema
-- Run this in Supabase SQL Editor

-- Add viral tracking columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS social_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS referral_code TEXT,
ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- Create viral events tracking table
CREATE TABLE IF NOT EXISTS viral_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'share', 'referral', 'invite'
  platform TEXT, -- 'twitter', 'instagram', 'whatsapp', etc.
  content_type TEXT, -- 'profile', 'match', 'general'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals tracking table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'rewarded'
  reward_amount INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(referred_id) -- One referral per user
);

-- Function to increment share count
CREATE OR REPLACE FUNCTION increment_share_count(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET 
    share_count = share_count + 1,
    social_score = social_score + 2
  WHERE profiles.user_id = increment_share_count.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process referral
CREATE OR REPLACE FUNCTION process_referral(referred_user_id UUID, referral_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  referrer_user_id UUID;
  referral_exists BOOLEAN;
BEGIN
  -- Find referrer by code
  SELECT user_id INTO referrer_user_id 
  FROM profiles 
  WHERE profiles.referral_code = process_referral.referral_code;
  
  IF referrer_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if referral already exists
  SELECT EXISTS(
    SELECT 1 FROM referrals 
    WHERE referred_id = referred_user_id
  ) INTO referral_exists;
  
  IF referral_exists THEN
    RETURN FALSE;
  END IF;
  
  -- Create referral record
  INSERT INTO referrals (referrer_id, referred_id, referral_code)
  VALUES (referrer_user_id, referred_user_id, process_referral.referral_code);
  
  -- Update referrer's profile
  UPDATE profiles 
  SET 
    referral_count = referral_count + 1,
    social_score = social_score + 10
  WHERE user_id = referrer_user_id;
  
  -- Update referred user's profile
  UPDATE profiles 
  SET referred_by = process_referral.referral_code
  WHERE user_id = referred_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to claim referral bonus
CREATE OR REPLACE FUNCTION claim_referral_bonus(user_id UUID)
RETURNS JSON AS $$
DECLARE
  unclaimed_count INTEGER;
  bonus_amount INTEGER;
BEGIN
  -- Count unclaimed referrals
  SELECT COUNT(*) INTO unclaimed_count
  FROM referrals 
  WHERE referrer_id = user_id AND status = 'completed';
  
  IF unclaimed_count = 0 THEN
    RETURN json_build_object('success', false, 'message', 'No unclaimed bonuses');
  END IF;
  
  bonus_amount := unclaimed_count * 5; -- $5 per referral
  
  -- Mark referrals as rewarded
  UPDATE referrals 
  SET status = 'rewarded'
  WHERE referrer_id = user_id AND status = 'completed';
  
  -- Update user's social score
  UPDATE profiles 
  SET social_score = social_score + (unclaimed_count * 5)
  WHERE profiles.user_id = claim_referral_bonus.user_id;
  
  RETURN json_build_object(
    'success', true, 
    'bonus_amount', bonus_amount,
    'referrals_claimed', unclaimed_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate referral codes for existing users
UPDATE profiles 
SET referral_code = UPPER(SUBSTRING(user_id::TEXT, 1, 8))
WHERE referral_code IS NULL;

-- Enable RLS
ALTER TABLE viral_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own viral events" ON viral_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own viral events" ON viral_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_viral_events_user_id ON viral_events(user_id);
CREATE INDEX IF NOT EXISTS idx_viral_events_created_at ON viral_events(created_at);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- Show results
SELECT 
  p.dj_name,
  p.referral_code,
  p.referral_count,
  p.share_count,
  p.social_score
FROM profiles p
WHERE p.referral_code IS NOT NULL
ORDER BY p.social_score DESC
LIMIT 10;