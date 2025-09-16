-- 🗑️ REMOVE ALL TRIGGERS - Complete cleanup

-- Drop all possible triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_referral ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;

-- Drop all possible functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS complete_referral_signup();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.complete_referral_signup();

-- Check what triggers still exist
SELECT 
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' OR event_object_schema = 'public';

SELECT 'ALL TRIGGERS REMOVED' as status;