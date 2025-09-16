-- 🚀 SIMPLE REFERRAL FIX - Add missing columns and check data

-- Step 1: Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 2: Set your referral code if missing
UPDATE profiles 
SET referral_code = 'DJ514E8A0B' 
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db' 
AND referral_code IS NULL;

-- Step 3: Check what referrals exist
SELECT 
    'EXISTING REFERRALS' as info,
    COUNT(*) as count
FROM referrals 
WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- Step 4: Check your profile
SELECT 
    'YOUR PROFILE' as info,
    user_id,
    dj_name,
    referral_code
FROM profiles 
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- Step 5: Add test referrals if you have less than 2
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
    'test-referral-' || generate_random_uuid() || '@example.com',
    gen_random_uuid(),
    'completed',
    'DJ514E8A0B',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
FROM generate_series(1, 2 - COALESCE((
    SELECT COUNT(*) 
    FROM referrals 
    WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db'
), 0));

-- Step 6: Add rewards for completed referrals
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
    '7 days premium for referral',
    r.completed_at,
    true
FROM referrals r 
WHERE r.referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db'
AND r.status = 'completed'
AND NOT EXISTS (
    SELECT 1 FROM referral_rewards rr 
    WHERE rr.referral_id = r.id
);

-- Step 7: Add notifications
INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    created_at
) 
SELECT 
    '514e8a0b-010c-4f34-96ca-50c92aab12db',
    'referral_success',
    '🎉 Referral Success!',
    'You earned rewards from a successful referral!',
    r.completed_at
FROM referrals r 
WHERE r.referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db'
AND r.status = 'completed'
AND NOT EXISTS (
    SELECT 1 FROM notifications n 
    WHERE n.user_id = r.referrer_id 
    AND n.type = 'referral_success'
    AND n.created_at = r.completed_at
);

-- Step 8: Final check
SELECT 
    'FINAL RESULTS' as info,
    (SELECT COUNT(*) FROM referrals WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as referrals,
    (SELECT COUNT(*) FROM referral_rewards WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as rewards,
    (SELECT COUNT(*) FROM notifications WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') as notifications;