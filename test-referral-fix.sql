-- 🎯 FINAL REFERRAL SYSTEM TEST - VERIFY FIX
-- Run this SQL to test the FIXED queries

-- Test the exact query your app is making with the correct column names:
SELECT
    user_id,
    dj_name as name,
    dj_name,
    profile_image_url
FROM profiles
WHERE referral_code = 'DJ514E68f7';

-- Test with another referral code to ensure it works:
SELECT
    user_id,
    dj_name as name,
    dj_name,
    profile_image_url
FROM profiles
WHERE referral_code IS NOT NULL
LIMIT 5;

-- ============================================

-- IF QUERY RETURNS RESULTS - SUCCESS! ✅
-- Your referral system will now work when you visit:
-- https://djelite.site/?ref=DJ514E68f7

-- IF QUERY RETURNS EMPTY - Check:
-- Do you have users with referral codes?
-- Was the referral code generated?
