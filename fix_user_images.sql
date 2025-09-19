-- FIX USER IMAGES - Remove pixelated OAuth images, use user-uploaded ones
-- This will clean up real user profiles to show better images

-- Step 1: Update profiles to use the second image (user-uploaded) as profile_image_url
-- and remove the first image (OAuth) from the images array
UPDATE profiles 
SET 
  profile_image_url = CASE 
    WHEN array_length(images, 1) > 1 THEN images[2]  -- Use second image as main
    ELSE profile_image_url  -- Keep current if only one image
  END,
  images = CASE 
    WHEN array_length(images, 1) > 1 THEN images[2:array_length(images, 1)]  -- Remove first image
    ELSE images  -- Keep current if only one image
  END
WHERE 
  -- Only update real users (not mock users)
  user_id::text NOT LIKE '11111111-1111-1111-1111-%' 
  AND user_id::text NOT LIKE '22222222-2222-2222-2222-%'
  AND user_id::text NOT LIKE '33333333-3333-3333-3333-%'
  AND user_id::text NOT LIKE '44444444-4444-4444-4444-%'
  AND user_id::text NOT LIKE '55555555-5555-5555-5555-%'
  AND user_id IS NOT NULL
  AND array_length(images, 1) > 1;  -- Only if they have multiple images

-- Step 2: Check results
SELECT 
  dj_name,
  profile_image_url,
  array_length(images, 1) as image_count
FROM profiles 
WHERE user_id IS NOT NULL 
  AND user_id::text NOT LIKE '11111111-%'
ORDER BY created_at DESC 
LIMIT 10;