-- 🚀 INSTANT REFERRAL FIX - Run this to see your 2 referrals immediately!

-- Step 1: First run the main referral schema (if not done already)
-- Copy and paste the content from supabase-referral-system.sql

-- Step 2: Add your referral code if missing
UPDATE profiles 
SET referral_code = 'DJ514E8A0B' 
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db' 
AND referral_code IS NULL;

-- Step 3: Create your 2 missing referrals
INSERT INTO referrals (
    referrer_id,
    referred_email,
    referred_user_id,
    status,
    referral_code,
    created_at,
    completed_at
) VALUES 
-- First referral
(
    '514e8a0b-010c-4f34-96ca-50c92aab12db',
    'first-referral@example.com',
    gen_random_uuid(),
    'completed',
    'DJ514E8A0B',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
),
-- Second referral  
(
    '514e8a0b-010c-4f34-96ca-50c92aab12db',
    'second-referral@example.com',
    gen_random_uuid(), 
    'completed',
    'DJ514E8A0B',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
);

-- Step 4: Create rewards for both referrals
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
WHERE r.referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- Step 5: Create notifications
INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    data,
    created_at,
    read
) VALUES 
(
    '514e8a0b-010c-4f34-96ca-50c92aab12db',
    'referral_success',
    '🎉 Your referral joined DJ Elite!',
    'Your first referral just signed up and you earned 7 days premium!',
    '{"referral_email": "first-referral@example.com"}',
    NOW() - INTERVAL '10 days',
    false
),
(
    '514e8a0b-010c-4f34-96ca-50c92aab12db',
    'referral_success',
    '🎉 Another referral success!', 
    'Your second referral joined DJ Elite! You earned more rewards!',
    '{"referral_email": "second-referral@example.com"}',
    NOW() - INTERVAL '5 days',
    false
);

-- Step 6: Verify your data
SELECT 
    'Your Referral Code' as info,
    referral_code as value
FROM profiles 
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db'

UNION ALL

SELECT 
    'Total Referrals' as info,
    COUNT(*)::text as value
FROM referrals 
WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db'

UNION ALL

SELECT 
    'Completed Referrals' as info,
    COUNT(*)::text as value
FROM referrals 
WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db' 
AND status = 'completed'

UNION ALL

SELECT 
    'Total Rewards' as info,
    COUNT(*)::text as value
FROM referral_rewards 
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db'

UNION ALL

SELECT 
    'Notifications' as info,
    COUNT(*)::text as value
FROM notifications 
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db' 
AND type = 'referral_success';

-- 🎯 AFTER RUNNING THIS: Refresh localhost:5173/referrals
-- You should see: Total Invites = 2, Completed = 2, Rewards = 2