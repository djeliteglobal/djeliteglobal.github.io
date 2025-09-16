-- 🚀 MINIMAL REFERRAL SETUP - Just get it working!

-- Step 1: Add referral code column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- Step 2: Create basic referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  referral_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create basic notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Step 5: Create simple policies
DROP POLICY IF EXISTS "Users can view their own referrals" ON referrals;
CREATE POLICY "Users can view their own referrals" ON referrals FOR SELECT USING (
  referrer_id = auth.uid()
);

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (
  user_id = auth.uid()
);

-- Step 6: Set your referral code
UPDATE profiles 
SET referral_code = 'DJ514E8A0B' 
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- Step 7: Add your 2 referrals
INSERT INTO referrals (referrer_id, referred_email, referral_code, created_at)
VALUES 
('514e8a0b-010c-4f34-96ca-50c92aab12db', 'first-referral@example.com', 'DJ514E8A0B', NOW() - INTERVAL '10 days'),
('514e8a0b-010c-4f34-96ca-50c92aab12db', 'second-referral@example.com', 'DJ514E8A0B', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- Step 8: Add notifications
INSERT INTO notifications (user_id, type, title, message, created_at)
VALUES 
('514e8a0b-010c-4f34-96ca-50c92aab12db', 'referral_success', '🎉 First referral success!', 'Your first referral joined DJ Elite!', NOW() - INTERVAL '10 days'),
('514e8a0b-010c-4f34-96ca-50c92aab12db', 'referral_success', '🎉 Second referral success!', 'Another referral joined DJ Elite!', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- Step 9: Check results
SELECT 
    'RESULTS' as info,
    (SELECT COUNT(*) FROM referrals WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as referrals,
    (SELECT COUNT(*) FROM notifications WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as notifications,
    (SELECT referral_code FROM profiles WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as code;