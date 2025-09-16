-- 🔧 FIX REFERRAL TABLES - Add missing tables the frontend expects

-- Create referral_rewards table (frontend expects this)
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL,
  reward_amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  claimed BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view their own rewards" ON referral_rewards;
CREATE POLICY "Users can view their own rewards" ON referral_rewards FOR SELECT USING (
  user_id = auth.uid()
);

-- Add missing RLS policies for referrals (INSERT/UPDATE)
DROP POLICY IF EXISTS "Users can insert their own referrals" ON referrals;
CREATE POLICY "Users can insert their own referrals" ON referrals FOR INSERT WITH CHECK (
  referrer_id = auth.uid()
);

DROP POLICY IF EXISTS "Users can update their own referrals" ON referrals;
CREATE POLICY "Users can update their own referrals" ON referrals FOR UPDATE USING (
  referrer_id = auth.uid()
);

-- Add missing RLS policies for notifications (UPDATE)
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (
  user_id = auth.uid()
);

-- Add rewards for your existing referrals
INSERT INTO referral_rewards (user_id, reward_type, reward_amount, description, earned_at, claimed)
VALUES 
('514e8a0b-010c-4f34-96ca-50c92aab12db', 'premium_days', 7, '7 days premium for first referral', NOW() - INTERVAL '10 days', true),
('514e8a0b-010c-4f34-96ca-50c92aab12db', 'premium_days', 7, '7 days premium for second referral', NOW() - INTERVAL '5 days', true)
ON CONFLICT DO NOTHING;

-- Final check
SELECT 
    'FIXED RESULTS' as info,
    (SELECT COUNT(*) FROM referrals WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as referrals,
    (SELECT COUNT(*) FROM referral_rewards WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as rewards,
    (SELECT COUNT(*) FROM notifications WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as notifications;