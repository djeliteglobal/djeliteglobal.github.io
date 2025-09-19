-- CLEANUP SCRIPT: Remove all mock data safely
-- Run this to delete mock users while preserving real users

-- Step 1: Delete mock profiles (they have specific patterns)
DELETE FROM profiles 
WHERE dj_name LIKE 'DJ %' 
   OR bio LIKE '%Passionate DJ with%'
   OR bio LIKE '%Electronic music enthusiast%'
   OR bio LIKE '%Professional DJ and producer%'
   OR location IN (
     'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL', 'Las Vegas, NV',
     'London, UK', 'Berlin, Germany', 'Amsterdam, Netherlands', 'Paris, France', 'Barcelona, Spain',
     'Tokyo, Japan', 'Seoul, South Korea', 'Bangkok, Thailand', 'Singapore', 'Hong Kong'
   )
   AND created_at > NOW() - INTERVAL '24 hours';  -- Only recent mock data

-- Step 2: Clean up orphaned swipes
DELETE FROM swipes 
WHERE swiper_id NOT IN (SELECT id FROM profiles)
   OR swiped_id NOT IN (SELECT id FROM profiles);

-- Step 3: Clean up orphaned matches  
DELETE FROM matches
WHERE profile1_id NOT IN (SELECT id FROM profiles)
   OR profile2_id NOT IN (SELECT id FROM profiles);

-- Step 4: Clean up orphaned messages
DELETE FROM messages
WHERE match_id NOT IN (SELECT id FROM matches);

-- Step 5: Clean up mock promoters and events
DELETE FROM events WHERE promoter_id IN (
  SELECT id FROM promoters 
  WHERE company_name LIKE '%Events%' 
     OR company_name LIKE '%Entertainment%'
     OR company_name LIKE '%Productions%'
);

DELETE FROM promoters 
WHERE company_name LIKE '%Events%' 
   OR company_name LIKE '%Entertainment%'
   OR company_name LIKE '%Productions%'
   OR created_at > NOW() - INTERVAL '24 hours';

-- Show cleanup summary
SELECT 
  'Cleanup Summary' as action,
  (SELECT COUNT(*) FROM profiles) as remaining_profiles,
  (SELECT COUNT(*) FROM swipes) as remaining_swipes,
  (SELECT COUNT(*) FROM matches) as remaining_matches,
  (SELECT COUNT(*) FROM messages) as remaining_messages,
  (SELECT COUNT(*) FROM promoters) as remaining_promoters,
  (SELECT COUNT(*) FROM events) as remaining_events;