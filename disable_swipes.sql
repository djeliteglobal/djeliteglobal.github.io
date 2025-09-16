-- TEMPORARILY DISABLE SWIPE LOGGING FOR STABILITY TESTING
-- Run this in Supabase SQL Editor to temporarily stop swipe errors

-- 1. Clear any problematic swipe data (optional)
-- DELETE FROM swipes WHERE swiper_id IS NULL OR swiped_id IS NULL;

-- 2. Make swipe operations non-blocking by removing the unique constraint temporarily
ALTER TABLE swipes DROP CONSTRAINT IF EXISTS swipes_swiper_id_swiped_id_key;

-- 3. Add back with allow_duplicates flag (optional)
-- ALTER TABLE swipes ADD UNIQUE NULLS NOT DISTINCT (swiper_id, swiped_id);

-- OR simply make the database more forgiving by allowing duplicate swipes
-- (they will still be recorded but won't block the user experience)

COMMENT ON TABLE swipes IS 'Swipe records - temporarily allowing duplicates for stability';
