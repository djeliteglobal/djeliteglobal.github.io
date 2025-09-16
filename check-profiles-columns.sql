-- 🔍 INVESTIGATE PROFILES TABLE STRUCTURE
-- Find out what columns actually exist

-- Check all columns in profiles table
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- ==============================================

-- CHECK FIRST FEW RECORDS TO SEE WHICH COLUMNS HAVE DATA
SELECT * FROM profiles LIMIT 3;

-- ==============================================

-- LOOK FOR NAME-LIKE COLUMNS IN PARTICULAR
SELECT
    'profiles table overview' as summary,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN dj_name IS NOT NULL AND dj_name != '' THEN 1 END) as with_dj_names,
    COUNT(CASE WHEN profile_image_url IS NOT NULL THEN 1 END) as with_profile_images
FROM profiles;

-- Sample of dj_name values (if they exist):
SELECT user_id, dj_name, profile_image_url
FROM profiles
WHERE dj_name IS NOT NULL AND dj_name != ''
LIMIT 5;
