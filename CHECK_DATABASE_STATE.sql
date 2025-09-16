-- 🔍 CHECK DATABASE STATE - Project: sxdlagcwryzzozyuznth

-- Step 1: Check if referral tables exist
SELECT 
    table_name,
    CASE WHEN table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('referrals', 'referral_rewards', 'notifications', 'user_stats')
ORDER BY table_name;

-- Step 2: Check profiles table columns
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('referral_code', 'referred_by_code', 'last_active_at')
ORDER BY column_name;

-- Step 3: Check your user profile
SELECT 
    user_id,
    dj_name,
    CASE WHEN referral_code IS NOT NULL THEN referral_code ELSE 'NULL' END as referral_code,
    created_at
FROM profiles 
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- Step 4: Check existing referrals for your user
SELECT 
    'REFERRALS FOR YOUR USER' as check_type,
    COUNT(*) as count,
    STRING_AGG(status, ', ') as statuses
FROM referrals 
WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- Step 5: Check if any referrals exist at all
SELECT 
    'ALL REFERRALS IN DATABASE' as check_type,
    COUNT(*) as total_count
FROM referrals;

-- Step 6: Check rewards for your user
SELECT 
    'REWARDS FOR YOUR USER' as check_type,
    COUNT(*) as count
FROM referral_rewards 
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- Step 7: Check notifications for your user
SELECT 
    'NOTIFICATIONS FOR YOUR USER' as check_type,
    COUNT(*) as count
FROM notifications 
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- Step 8: Summary of what needs to be created
SELECT 
    'SUMMARY' as info,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'referrals') = 0 
        THEN 'Need to create referral tables'
        WHEN (SELECT COUNT(*) FROM referrals WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db') = 0
        THEN 'Tables exist, need to add your referrals'
        ELSE 'Referrals exist, check rewards/notifications'
    END as action_needed;