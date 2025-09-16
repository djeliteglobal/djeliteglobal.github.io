-- 🔍 DJ ELITE REFERRAL SYSTEM DEBUG & VERIFICATION

-- ===============================

-- 1. CHECK IF referral_code COLUMN EXISTS
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'referral_code';

-- ===============================

-- 2. CHECK EXISTING PROFILES AND REFERRAL CODES
SELECT
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN referral_code IS NOT NULL THEN 1 END) as profiles_with_codes,
    COUNT(CASE WHEN LENGTH(COALESCE(referral_code,'')) >= 7 THEN 1 END) as valid_codes
FROM profiles;

-- SAMPLE OF EXISTING REFERRAL CODES:
SELECT user_id, dj_name, referral_code
FROM profiles
WHERE referral_code IS NOT NULL
LIMIT 10;

-- ===============================

-- 3. GENERATE REFERRAL CODES FOR ALL EXISTING USERS
UPDATE profiles
SET referral_code = 'DJ' || UPPER(SUBSTRING(user_id::text, 1, 4)) ||
                    UPPER(RIGHT(MD5(RANDOM()::TEXT), 5))
WHERE referral_code IS NULL OR referral_code = '';

-- VERIFICATION QUERY:
SELECT 'REFERRAL CODES GENERATED' as status,
       COUNT(*) as total_codes_created
FROM profiles
WHERE referral_code LIKE 'DJ%' AND LENGTH(referral_code) = 11;

-- ===============================

-- 4. TEST SPECIFIC REFERRAL CODE LOOKUP
-- Replace 'DJ514E68f7' with the code from the error logs

SELECT user_id, name, dj_name, profile_image_url
FROM profiles
WHERE referral_code = 'DJ514E68f7';

-- ===============================

-- 5. CHECK RLS POLICIES (might be blocking access)
-- These might be interfering with the query

SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- TEMPORARY: If RLS is blocking, disable it for testing (re-enable later):
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY; -- ⚠️ TEMPORARY FOR TESTING
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;  -- ▶️ RE-ENABLE WHEN DONE

-- ===============================

-- 6. TEST THE EXACT QUERY FROM YOUR APP
-- This replicates what the React app is trying to do

SELECT user_id, name, dj_name, profile_image_url
FROM profiles
WHERE referral_code = 'DJ514E68f7';

-- If this works, the issue is elsewhere...

-- ===============================

-- 7. CHECK REFERRALS TABLE FOR EXISTING RECORDS
SELECT
    COUNT(*) as total_referrals,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
FROM referrals;

-- SAMPLE REFERRALS:
SELECT referrer_id, referral_code, status, created_at
FROM referrals
WHERE referral_code = 'DJ514E68f7'
LIMIT 5;

-- ===============================

-- 8. CHECK NOTIFICATIONS TABLE
SELECT COUNT(*) as total_notifications,
       COUNT(CASE WHEN type = 'referral_success' THEN 1 END) as referral_notifications
FROM notifications;

-- ===============================

-- 9. RUN A COMPLETE TEST: CREATE → PROCESS → VERIFY
-- STEP 1: Insert a test user with referral code
INSERT INTO profiles (user_id, name, dj_name, referral_code, created_at)
VALUES (
    gen_random_uuid(),
    'Test User',
    'Test DJ',
    'DJ514E68f7',
    NOW()
);

-- STEP 2: Test the lookup (should now work!)
SELECT user_id, name, dj_name, profile_image_url
FROM profiles
WHERE referral_code = 'DJ514E68f7';

-- ===============================

-- 🎯 FINAL SUCCESS VERIFICATION

DO $$
DECLARE
    profile_count INTEGER;
    referral_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count FROM profiles WHERE referral_code IS NOT NULL;
    SELECT COUNT(*) INTO referral_count FROM referrals WHERE referral_code IS NOT NULL;

    RAISE NOTICE '

    🎉 REFERRAL SYSTEM STATUS CHECK

    ✅ Profiles with referral codes: %', profile_count;
    RAISE NOTICE '✅ Referral records with codes: %', referral_count;

    IF profile_count > 0 THEN
        RAISE NOTICE '✅ REFERRAL SYSTEM SHOULD BE WORKING NOW!';
        RAISE NOTICE '✅ Try visiting: https://djelite.site/?ref=DJ514E68f7';
    ELSE
        RAISE NOTICE '❌ NEED TO GENERATE REFERRAL CODES FIRST';
    END IF;
END $$;
