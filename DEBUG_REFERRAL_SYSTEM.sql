-- 🔍 DEBUG REFERRAL SYSTEM - Check what exists and fix missing data

-- 1. Check if referral tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('referrals', 'referral_rewards', 'notifications', 'user_stats');

-- 2. Check if referral_code column exists in profiles
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('referral_code', 'referred_by_code', 'last_active_at');

-- 3. Check your current profile
SELECT user_id, dj_name, referral_code, referred_by_code, created_at
FROM profiles
WHERE user_id = (SELECT auth.uid());

-- 4. If referral tables don't exist, create them now:
-- (Run the supabase-referral-system.sql file first)

-- 5. Generate referral code for your profile if missing
UPDATE profiles 
SET referral_code = 'DJ' || UPPER(SUBSTRING(user_id::text, 1, 8)) || UPPER(SUBSTRING(EXTRACT(epoch FROM NOW())::text, -4))
WHERE user_id = (SELECT auth.uid()) 
AND referral_code IS NULL;

-- 6. Create test referrals to simulate your previous 2 referrals
INSERT INTO referrals (
    referrer_id,
    referred_email,
    referred_user_id,
    status,
    referral_code,
    created_at,
    completed_at
) VALUES 
(
    (SELECT auth.uid()),
    'test-referral-1@example.com',
    gen_random_uuid(),
    'completed',
    (SELECT referral_code FROM profiles WHERE user_id = auth.uid()),
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days'
),
(
    (SELECT auth.uid()),
    'test-referral-2@example.com', 
    gen_random_uuid(),
    'completed',
    (SELECT referral_code FROM profiles WHERE user_id = auth.uid()),
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
);

-- 7. Create rewards for your referrals
INSERT INTO referral_rewards (
    user_id,
    referral_id,
    reward_type,
    reward_amount,
    description,
    earned_at
) VALUES 
(
    (SELECT auth.uid()),
    (SELECT id FROM referrals WHERE referrer_id = auth.uid() AND referred_email = 'test-referral-1@example.com'),
    'premium_days',
    7,
    '7 days of DJ Elite Premium for first referral',
    NOW() - INTERVAL '7 days'
),
(
    (SELECT auth.uid()),
    (SELECT id FROM referrals WHERE referrer_id = auth.uid() AND referred_email = 'test-referral-2@example.com'),
    'premium_days',
    7,
    '7 days of DJ Elite Premium for second referral',
    NOW() - INTERVAL '3 days'
);

-- 8. Create test notifications
INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    data,
    created_at
) VALUES 
(
    (SELECT auth.uid()),
    'referral_success',
    '🎉 Your referral joined DJ Elite!',
    'test-referral-1@example.com just signed up using your referral link. You''ve earned 7 days of premium!',
    '{"referral_email": "test-referral-1@example.com"}',
    NOW() - INTERVAL '7 days'
),
(
    (SELECT auth.uid()),
    'referral_success', 
    '🎉 Another referral success!',
    'test-referral-2@example.com just joined DJ Elite through your link. You''ve earned more rewards!',
    '{"referral_email": "test-referral-2@example.com"}',
    NOW() - INTERVAL '3 days'
);

-- 9. Verify everything was created
SELECT 'REFERRALS' as table_name, COUNT(*) as count FROM referrals WHERE referrer_id = auth.uid()
UNION ALL
SELECT 'REWARDS' as table_name, COUNT(*) as count FROM referral_rewards WHERE user_id = auth.uid()  
UNION ALL
SELECT 'NOTIFICATIONS' as table_name, COUNT(*) as count FROM notifications WHERE user_id = auth.uid() AND type = 'referral_success';

-- 10. Check your referral stats
SELECT
    COUNT(*) as total_referrals,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_referrals,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_referrals,
    0 as unclaimed_rewards,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) * 10 as total_rewards_earned
FROM referrals
WHERE referrer_id = (SELECT auth.uid());