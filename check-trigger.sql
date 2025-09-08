-- Check if trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'match_cleanup_trigger';

-- Check if function exists  
SELECT * FROM information_schema.routines 
WHERE routine_name = 'cleanup_match_data';

-- Test trigger manually
SELECT * FROM matches LIMIT 5;
SELECT * FROM swipes LIMIT 5;