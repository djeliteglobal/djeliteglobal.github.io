-- 🔍 CHECK ACTUAL DATABASE SCHEMA - See what really exists

-- Check all tables in public schema
SELECT 
    'TABLES' as type,
    table_name,
    'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check profiles table columns
SELECT 
    'PROFILES COLUMNS' as type,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY column_name;

-- Check referrals table columns (if exists)
SELECT 
    'REFERRALS COLUMNS' as type,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'referrals' 
ORDER BY column_name;

-- Check notifications table columns (if exists)
SELECT 
    'NOTIFICATIONS COLUMNS' as type,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY column_name;

-- Check referral_rewards table columns (if exists)
SELECT 
    'REWARDS COLUMNS' as type,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'referral_rewards' 
ORDER BY column_name;

-- Check your actual profile data
SELECT 
    'YOUR PROFILE' as type,
    user_id,
    dj_name,
    CASE WHEN referral_code IS NOT NULL THEN referral_code ELSE 'NULL' END as referral_code
FROM profiles 
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- Check existing referrals
SELECT 
    'EXISTING REFERRALS' as type,
    COUNT(*) as count,
    STRING_AGG(DISTINCT status, ', ') as statuses
FROM referrals 
WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- Check if trigger exists
SELECT 
    'TRIGGER STATUS' as type,
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created_referral';