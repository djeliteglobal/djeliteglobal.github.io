-- 🔧 DATABASE FIXES FOR REFERRAL SYSTEM ERRORS
-- Execute these SQL statements in Supabase to fix the missing column and query issues

-- =========================================
-- ADD MISSING referral_code COLUMN TO profiles
-- =========================================

-- Add referral_code column to profiles table (with smart mig authoritative prisoner)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'referral_code'
    ) THEN
        ALTER TABLE profiles ADD COLUMN referral_code TEXT;
        CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);
        RAISE NOTICE '✅ Added referral_code column to profiles table';
    ELSE
        RAISE NOTICE 'ℹ️  referral_code column already exists';
    END IF;
END $$;

-- =========================================
-- FIX REFERRAL LEADERBOARD QUERY ISSUES
-- =========================================

-- Fix the leaderboard query in referrals service
-- The error shows: referrals!referrer_id(dj_name) join syntax issue

-- Update the leaderboard function to fix query structure
CREATE OR REPLACE FUNCTION get_referral_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(dj_name TEXT, referral_count BIGINT, total_rewards BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  -- Fixed query structure for proper foreign key relationship
  SELECT
    COALESCE(p.dj_name, 'Anonymous DJ') as dj_name,
    COUNT(r.id) as referral_count,
    COUNT(r.id) * 10 as total_rewards -- $10 per referral assumed
  FROM referrals r
  LEFT JOIN profiles p ON r.referrer_id = p.user_id
  WHERE r.status = 'completed'
  GROUP BY p.user_id, p.dj_name
  ORDER BY referral_count DESC, p.dj_name
  LIMIT limit_count;
END;
$$;

-- =========================================
-- GENERATE MISSING REFERRAL CODES
-- =========================================

-- Generate referral codes for all existing users that don't have one
-- This will fix the "referral_code null" errors
UPDATE profiles
SET referral_code = 'DJ' || UPPER(SUBSTRING(user_id::text, 1, 4)) || RIGHT(MD5(RANDOM()::TEXT), 4)
WHERE referral_code IS NULL OR referral_code = '';

-- =========================================
-- VERIFICATION QUERIES
-- =========================================

-- Check that referral_code column exists and has data
SELECT
    'profiles table status' as check_type,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN referral_code IS NOT NULL AND referral_code != '' THEN 1 END) as profiles_with_codes
FROM profiles;

-- Check referral leaderboard function works
SELECT * FROM get_referral_leaderboard(5);

-- Verify all tables that referral system needs
SELECT
    table_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE information_schema.columns.table_name = t.table_name
    ) THEN true ELSE false END as table_exists
FROM (VALUES
    ('referrals'),
    ('referral_rewards'),
    ('user_stats'),
    ('notifications')
) AS t(table_name);

-- =========================================
-- TRIGGER FOR AUTO-REFERRAL CODE GENERATION
-- =========================================

-- Create trigger to automatically generate referral codes for new profiles
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Generate referral code if not provided
    IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
        NEW.referral_code := 'DJ' || UPPER(SUBSTRING(NEW.user_id::text, 1, 4)) || RIGHT(MD5(RANDOM()::TEXT), 4);
    END IF;
    RETURN NEW;
END;
$$;

-- Apply the trigger to profiles table
DROP TRIGGER IF EXISTS trigger_generate_referral_code ON profiles;
CREATE TRIGGER trigger_generate_referral_code
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION generate_referral_code();

-- =========================================
-- BACKFILL EXISTING DATA
-- =========================================

-- Backfill any profiles without referral codes
UPDATE profiles
SET referral_code = 'DJ' || UPPER(SUBSTRING(user_id::text, 1, 4)) || RIGHT(MD5(RANDOM()::TEXT), 4)
WHERE referral_code IS NULL OR LENGTH(referral_code) < 7;

-- =========================================
-- TEST ALL FUNCTIONS
-- =========================================

-- Test 1: Check if referral_code column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'referral_code';

-- Test 2: Check referral leaderboard
SELECT COUNT(*) as leaderboard_entries FROM get_referral_leaderboard(10);

-- Test 3: Check profiles with referral codes
SELECT
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN referral_code IS NOT NULL AND referral_code != '' THEN 1 END) as with_codes,
    COUNT(CASE WHEN LENGTH(COALESCE(referral_code,'')) >= 7 THEN 1 END) as valid_codes
FROM profiles;

-- =========================================
-- SUCCESS MESSAGE
-- =========================================

DO $$
BEGIN
    RAISE NOTICE '

    🎉 DATABASE FIXES COMPLETED!

    Expected Results:
    ✅ referral_code column added to profiles table
    ✅ Referral leaderboard function fixed
    ✅ All existing profiles have referral codes
    ✅ Auto-generation trigger installed
    ✅ Query errors should be resolved

    Next Steps:
    1. Refresh your Referral Dashboard
    2. Referral codes should now load properly
    3. Leaderboard should display without errors
    4. Social sharing links should work with codes

    🚀 Ready for viral user acquisition!

    ';
END $$;
