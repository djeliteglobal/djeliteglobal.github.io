-- Check if matches are actually being deleted
SELECT COUNT(*) as total_matches FROM matches;

-- Check specific match that keeps reappearing
SELECT * FROM matches WHERE id = '982218d3-9ec6-4a9b-a3dc-f9da5d50bd39';

-- Check swipes for that match
SELECT * FROM swipes WHERE 
  (swiper_id = '1a7efe13-f4f8-44a6-bfa3-220bb9e6c311' AND swiped_id = '2e197c67-3e08-4cad-afb9-7c6947f27b6e')
  OR 
  (swiper_id = '2e197c67-3e08-4cad-afb9-7c6947f27b6e' AND swiped_id = '1a7efe13-f4f8-44a6-bfa3-220bb9e6c311');

-- Check if trigger exists
SELECT * FROM information_schema.triggers WHERE trigger_name = 'match_cleanup_trigger';