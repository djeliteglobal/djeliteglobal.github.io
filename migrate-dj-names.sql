-- Migration script to update all DJ names from OAuth or email
-- Run this in Supabase SQL Editor

UPDATE profiles 
SET dj_name = CASE
  -- Try OAuth name first (Google, Facebook, etc.)
  WHEN auth.users.raw_user_meta_data->>'full_name' IS NOT NULL 
    AND auth.users.raw_user_meta_data->>'full_name' != '' 
    THEN auth.users.raw_user_meta_data->>'full_name'
  
  -- Fallback to 'name' field from OAuth
  WHEN auth.users.raw_user_meta_data->>'name' IS NOT NULL 
    AND auth.users.raw_user_meta_data->>'name' != '' 
    THEN auth.users.raw_user_meta_data->>'name'
  
  -- Fallback to email username (before @) for generic names
  WHEN (profiles.dj_name = 'New DJ' OR profiles.dj_name = 'DJ' OR profiles.dj_name IS NULL OR profiles.dj_name = '')
    AND auth.users.email IS NOT NULL
    THEN split_part(auth.users.email, '@', 1)
  
  -- Keep existing name if it's custom
  ELSE profiles.dj_name
END,
updated_at = NOW()
FROM auth.users 
WHERE profiles.user_id = auth.users.id
  AND (
    -- Update if we have OAuth name and it's different
    (auth.users.raw_user_meta_data->>'full_name' IS NOT NULL 
     AND auth.users.raw_user_meta_data->>'full_name' != profiles.dj_name)
    OR
    (auth.users.raw_user_meta_data->>'name' IS NOT NULL 
     AND auth.users.raw_user_meta_data->>'name' != profiles.dj_name)
    OR
    -- Update generic names with email username
    (profiles.dj_name IN ('New DJ', 'DJ') OR profiles.dj_name IS NULL OR profiles.dj_name = '')
  );

-- Show results
SELECT 
  p.dj_name,
  u.email,
  u.raw_user_meta_data->>'full_name' as oauth_name,
  u.raw_user_meta_data->>'name' as oauth_name_alt
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
ORDER BY p.updated_at DESC;