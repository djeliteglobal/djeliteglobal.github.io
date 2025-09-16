-- 🔧 FIX TRIGGER ERRORS - Make trigger safe and non-blocking

-- Drop the problematic trigger
DROP TRIGGER IF EXISTS on_auth_user_created_referral ON auth.users;

-- Create a safe trigger function that won't crash signup
CREATE OR REPLACE FUNCTION complete_referral_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Just return NEW without doing anything for now
  -- This prevents signup crashes while we debug
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Don't recreate the trigger yet - let signups work first
SELECT 'TRIGGER DISABLED' as status, 'Signups should work now' as message;