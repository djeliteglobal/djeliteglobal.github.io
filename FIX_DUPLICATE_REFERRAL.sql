-- 🔧 FIX DUPLICATE REFERRAL - Check existing data and fix conflicts

-- Step 1: Check what referrals already exist for your user
SELECT 
    'EXISTING REFERRALS' as info,
    r.id,
    r.referrer_id,
    r.referred_email,
    r.status,
    r.referral_code,
    r.created_at
FROM referrals r
WHERE r.referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db'
ORDER BY r.created_at DESC;

-- Step 2: Check your profile referral code
SELECT 
    'YOUR PROFILE' as info,
    user_id,
    dj_name,
    referral_code,
    referred_by_code
FROM profiles 
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- Step 3: Count existing referrals
SELECT 
    COUNT(*) as total_referrals,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_referrals,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_referrals
FROM referrals
WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- Step 4: If you need to add more referrals (only if count < 2), run this:
-- First, let's add unique emails to avoid conflicts
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
    'additional-referral-' || generate_random_uuid() || '@example.com',
    gen_random_uuid(),
    'completed',
    'DJ514E8A0B',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
WHERE (
    SELECT COUNT(*) 
    FROM referrals 
    WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db'
) < 2;

-- Step 5: Create rewards for any referrals that don't have them
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

-- Step 6: Create notifications for any missing ones
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
    r.referred_email || ' just signed up and you earned 7 days premium!',
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

-- Step 7: Final verification - your referral stats
SELECT 
    'FINAL STATS' as info,
    (SELECT COUNT(*) FROM referrals WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as total_referrals,
    (SELECT COUNT(*) FROM referrals WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db' AND status = 'completed') as completed_referrals,
    (SELECT COUNT(*) FROM referral_rewards WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as total_rewards,
    (SELECT COUNT(*) FROM notifications WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db' AND type = 'referral_success') as notifications;

-- 🎯 After running this, refresh localhost:5173/referrals to see your data!