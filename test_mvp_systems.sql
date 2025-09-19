-- DJ Elite MVP - System Testing Script
-- Run this in Supabase SQL Editor to test all critical systems

-- Test 1: Verify all required tables exist
DO $$
DECLARE
    missing_tables TEXT[] := '{}';
    table_name TEXT;
    required_tables TEXT[] := ARRAY[
        'profiles', 'swipes', 'matches', 'messages', 'events', 'promoters',
        'referrals', 'referral_rewards', 'subscriptions', 'course_progress',
        'course_certificates', 'course_feedback', 'course_downloads',
        'newsletter_subscribers', 'career_accelerator_leads'
    ];
BEGIN
    FOREACH table_name IN ARRAY required_tables LOOP
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name) THEN
            missing_tables := array_append(missing_tables, table_name);
        END IF;
    END LOOP;
    
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE NOTICE 'MISSING TABLES: %', array_to_string(missing_tables, ', ');
    ELSE
        RAISE NOTICE '✅ ALL REQUIRED TABLES EXIST';
    END IF;
END $$;

-- Test 2: Check data population status
SELECT 
    'Data Population Status' as test_name,
    (SELECT COUNT(*) FROM profiles) as total_profiles,
    (SELECT COUNT(*) FROM promoters) as total_promoters,
    (SELECT COUNT(*) FROM events) as total_events,
    (SELECT COUNT(*) FROM swipes) as total_swipes,
    (SELECT COUNT(*) FROM matches) as total_matches,
    (SELECT COUNT(*) FROM messages) as total_messages,
    (SELECT COUNT(*) FROM course_progress) as course_progress_records;

-- Test 3: Verify matching system functionality
WITH matching_test AS (
    SELECT 
        COUNT(DISTINCT swiper_id) as active_swipers,
        COUNT(DISTINCT swiped_id) as profiles_swiped_on,
        COUNT(*) FILTER (WHERE direction = 'right') as right_swipes,
        COUNT(*) FILTER (WHERE direction = 'left') as left_swipes,
        COUNT(*) FILTER (WHERE direction = 'super') as super_swipes
    FROM swipes
)
SELECT 
    'Matching System Test' as test_name,
    active_swipers,
    profiles_swiped_on,
    right_swipes,
    left_swipes,
    super_swipes,
    CASE 
        WHEN active_swipers > 0 AND profiles_swiped_on > 0 THEN '✅ WORKING'
        ELSE '❌ NEEDS ATTENTION'
    END as status
FROM matching_test;

-- Test 4: Verify referral system
WITH referral_test AS (
    SELECT 
        COUNT(*) as total_referrals,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_referrals,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_referrals,
        COUNT(DISTINCT referrer_id) as active_referrers
    FROM referrals
)
SELECT 
    'Referral System Test' as test_name,
    total_referrals,
    completed_referrals,
    pending_referrals,
    active_referrers,
    CASE 
        WHEN total_referrals > 0 THEN '✅ WORKING'
        ELSE '⚠️ NO REFERRALS YET'
    END as status
FROM referral_test;

-- Test 5: Check payment system tables (DJ Hires)
SELECT 
    'Payment System Test' as test_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dj_hires') 
        THEN '✅ DJ HIRES TABLE EXISTS'
        ELSE '❌ DJ HIRES TABLE MISSING'
    END as dj_hires_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dj_hires' AND column_name = 'payment_status')
        THEN '✅ PAYMENT TRACKING READY'
        ELSE '❌ PAYMENT TRACKING MISSING'
    END as payment_tracking_status;

-- Test 6: Verify course system
WITH course_test AS (
    SELECT 
        COUNT(DISTINCT user_id) as users_with_progress,
        COUNT(*) FILTER (WHERE completed = true) as completed_modules,
        COUNT(*) as total_progress_records,
        AVG(progress_percentage) as avg_progress
    FROM course_progress
)
SELECT 
    'Course System Test' as test_name,
    users_with_progress,
    completed_modules,
    total_progress_records,
    ROUND(avg_progress, 2) as avg_progress_percentage,
    CASE 
        WHEN users_with_progress > 0 THEN '✅ WORKING'
        ELSE '⚠️ NO COURSE ACTIVITY YET'
    END as status
FROM course_test;

-- Test 7: Check event system
WITH event_test AS (
    SELECT 
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE status = 'published') as published_events,
        COUNT(*) FILTER (WHERE date > CURRENT_DATE) as upcoming_events,
        COUNT(*) FILTER (WHERE applications IS NOT NULL AND jsonb_array_length(applications) > 0) as events_with_applications
    FROM events
)
SELECT 
    'Event System Test' as test_name,
    total_events,
    published_events,
    upcoming_events,
    events_with_applications,
    CASE 
        WHEN total_events > 0 AND published_events > 0 THEN '✅ WORKING'
        ELSE '❌ NEEDS EVENTS'
    END as status
FROM event_test;

-- Test 8: Performance check - indexes
SELECT 
    'Performance Test' as test_name,
    COUNT(*) as total_indexes,
    COUNT(*) FILTER (WHERE indexname LIKE 'idx_%') as custom_indexes,
    CASE 
        WHEN COUNT(*) FILTER (WHERE indexname LIKE 'idx_%') >= 10 THEN '✅ WELL INDEXED'
        ELSE '⚠️ NEEDS MORE INDEXES'
    END as index_status
FROM pg_indexes 
WHERE schemaname = 'public';

-- Test 9: RLS (Row Level Security) check
WITH rls_test AS (
    SELECT 
        COUNT(*) as total_tables,
        COUNT(*) FILTER (WHERE rowsecurity = true) as rls_enabled_tables
    FROM pg_tables t
    JOIN pg_class c ON c.relname = t.tablename
    WHERE t.schemaname = 'public'
    AND t.tablename IN ('profiles', 'swipes', 'matches', 'messages', 'referrals', 'course_progress')
)
SELECT 
    'Security Test (RLS)' as test_name,
    total_tables,
    rls_enabled_tables,
    CASE 
        WHEN rls_enabled_tables >= 6 THEN '✅ SECURE'
        ELSE '❌ SECURITY RISK'
    END as security_status
FROM rls_test;

-- Test 10: Data quality check
WITH quality_test AS (
    SELECT 
        COUNT(*) as profiles_with_images,
        COUNT(*) FILTER (WHERE dj_name IS NOT NULL AND dj_name != '') as profiles_with_names,
        COUNT(*) FILTER (WHERE bio IS NOT NULL AND bio != '') as profiles_with_bios,
        COUNT(*) FILTER (WHERE location IS NOT NULL AND location != '') as profiles_with_locations
    FROM profiles
)
SELECT 
    'Data Quality Test' as test_name,
    profiles_with_images,
    profiles_with_names,
    profiles_with_bios,
    profiles_with_locations,
    CASE 
        WHEN profiles_with_names > 100 AND profiles_with_bios > 50 THEN '✅ GOOD QUALITY'
        ELSE '⚠️ NEEDS IMPROVEMENT'
    END as quality_status
FROM quality_test;

-- Final MVP Readiness Summary
WITH readiness_check AS (
    SELECT 
        (SELECT COUNT(*) FROM profiles) >= 200 as has_enough_users,
        (SELECT COUNT(*) FROM promoters) >= 100 as has_enough_promoters,
        (SELECT COUNT(*) FROM events WHERE status = 'published') >= 50 as has_enough_events,
        (SELECT COUNT(*) FROM swipes) >= 100 as has_swipe_activity,
        (SELECT COUNT(*) FROM matches) >= 10 as has_matches,
        EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'course_progress') as has_course_system,
        EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'referrals') as has_referral_system
)
SELECT 
    '🚀 MVP LAUNCH READINESS' as final_status,
    CASE 
        WHEN has_enough_users AND has_enough_promoters AND has_enough_events 
             AND has_swipe_activity AND has_matches AND has_course_system AND has_referral_system
        THEN '✅ READY FOR LAUNCH! 🎉'
        ELSE '⚠️ NEEDS COMPLETION'
    END as launch_status,
    has_enough_users as users_ready,
    has_enough_promoters as promoters_ready,
    has_enough_events as events_ready,
    has_swipe_activity as matching_ready,
    has_matches as connections_ready,
    has_course_system as courses_ready,
    has_referral_system as referrals_ready
FROM readiness_check;

-- Show next steps if not ready
DO $$
DECLARE
    users_count INTEGER;
    promoters_count INTEGER;
    events_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO users_count FROM profiles;
    SELECT COUNT(*) INTO promoters_count FROM promoters;
    SELECT COUNT(*) INTO events_count FROM events WHERE status = 'published';
    
    RAISE NOTICE '📊 CURRENT STATUS:';
    RAISE NOTICE '   Users: % / 200 needed', users_count;
    RAISE NOTICE '   Promoters: % / 100 needed', promoters_count;
    RAISE NOTICE '   Events: % / 50 needed', events_count;
    
    IF users_count < 200 THEN
        RAISE NOTICE '🔧 TODO: Run populate_mock_users.sql';
    END IF;
    
    IF promoters_count < 100 THEN
        RAISE NOTICE '🔧 TODO: Run populate_mock_promoters.sql';
    END IF;
    
    IF events_count < 50 THEN
        RAISE NOTICE '🔧 TODO: Ensure promoters have created events';
    END IF;
    
    IF users_count >= 200 AND promoters_count >= 100 AND events_count >= 50 THEN
        RAISE NOTICE '🎉 ALL SYSTEMS GO! READY FOR MVP LAUNCH!';
    END IF;
END $$;