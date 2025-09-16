-- 🚀 COMPLETE REFERRAL SETUP - Project: sxdlagcwryzzozyuznth
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/sxdlagcwryzzozyuznth/sql

-- PART 1: CREATE MISSING TABLES AND COLUMNS
-- ==========================================

-- Add referral columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT;
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
  completed_at TIMESTAMP WITH TIME ZONE
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

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  super_likes_bonus INTEGER DEFAULT 0,
  boost_credits INTEGER DEFAULT 0,
  premium_days_bonus INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PART 2: ENABLE RLS AND CREATE POLICIES
-- ======================================

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can insert their own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can update their own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can view their own rewards" ON referral_rewards;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view their own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON user_stats;

-- Create RLS policies
CREATE POLICY "Users can view their own referrals" ON referrals FOR SELECT USING (
  referrer_id = auth.uid() OR referred_user_id = auth.uid()
);
CREATE POLICY "Users can insert their own referrals" ON referrals FOR INSERT WITH CHECK (
  referrer_id = auth.uid()
);
CREATE POLICY "Users can update their own referrals" ON referrals FOR UPDATE USING (
  referrer_id = auth.uid()
);
CREATE POLICY "Users can view their own rewards" ON referral_rewards FOR SELECT USING (
  user_id = auth.uid()
);
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (
  user_id = auth.uid()
);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (
  user_id = auth.uid()
);
CREATE POLICY "Users can view their own stats" ON user_stats FOR SELECT USING (
  user_id = auth.uid()
);
CREATE POLICY "Users can update their own stats" ON user_stats FOR ALL USING (
  user_id = auth.uid()
);

-- PART 3: SET YOUR REFERRAL CODE
-- ==============================

UPDATE profiles 
SET referral_code = 'DJ514E8A0B' 
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db' 
AND (referral_code IS NULL OR referral_code = '');

-- PART 4: CREATE YOUR 2 TEST REFERRALS
-- ====================================

-- Only insert if you have less than 2 referrals
DO $$
DECLARE
    current_count INTEGER;
    needed_count INTEGER;
BEGIN
    -- Get current referral count
    SELECT COUNT(*) INTO current_count 
    FROM referrals 
    WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';
    
    -- Calculate how many we need to add
    needed_count := GREATEST(0, 2 - current_count);
    
    -- Add referrals if needed
    IF needed_count > 0 THEN
        INSERT INTO referrals (
            referrer_id,
            referred_email,
            referred_user_id,
            status,
            referral_code,
            created_at,
            completed_at
        ) 
        SELECT 
            '514e8a0b-010c-4f34-96ca-50c92aab12db',
            'referral-' || s || '@example.com',
            NULL,
            'completed',
            'DJ514E8A0B',
            NOW() - INTERVAL '7 days' * s,
            NOW() - INTERVAL '7 days' * s
        FROM generate_series(1, needed_count) s;
    END IF;
END $$;

-- PART 5: CREATE REWARDS FOR ALL COMPLETED REFERRALS
-- ==================================================

INSERT INTO referral_rewards (
    user_id,
    referral_id,
    reward_type,
    reward_amount,
    description,
    earned_at,
    claimed
) 
SELECT 
    '514e8a0b-010c-4f34-96ca-50c92aab12db',
    r.id,
    'premium_days',
    7,
    '7 days of DJ Elite Premium for successful referral',
    r.completed_at,
    true
FROM referrals r 
WHERE r.referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db'
AND r.status = 'completed'
AND NOT EXISTS (
    SELECT 1 FROM referral_rewards rr 
    WHERE rr.referral_id = r.id
);

-- PART 6: CREATE NOTIFICATIONS FOR ALL REFERRALS
-- ==============================================

INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    data,
    created_at,
    read
) 
SELECT 
    '514e8a0b-010c-4f34-96ca-50c92aab12db',
    'referral_success',
    '🎉 Your referral joined DJ Elite!',
    'Someone signed up using your referral link and you earned 7 days premium!',
    jsonb_build_object('referral_email', r.referred_email),
    r.completed_at,
    false
FROM referrals r 
WHERE r.referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db'
AND r.status = 'completed'
AND NOT EXISTS (
    SELECT 1 FROM notifications n 
    WHERE n.user_id = r.referrer_id 
    AND n.type = 'referral_success'
    AND n.data->>'referral_email' = r.referred_email
);

-- PART 7: CREATE INDEXES FOR PERFORMANCE
-- ======================================

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- PART 8: FINAL VERIFICATION
-- ==========================

SELECT 
    'SETUP COMPLETE!' as status,
    (SELECT COUNT(*) FROM referrals WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as total_referrals,
    (SELECT COUNT(*) FROM referrals WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db' AND status = 'completed') as completed_referrals,
    (SELECT COUNT(*) FROM referral_rewards WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as total_rewards,
    (SELECT COUNT(*) FROM notifications WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db' AND type = 'referral_success') as notifications,
    (SELECT referral_code FROM profiles WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as your_referral_code;

-- 🎯 After running this, refresh localhost:5173/referrals
-- You should see: Total Invites = 2, Completed = 2, Rewards = 2