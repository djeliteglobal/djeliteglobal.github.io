-- 🚀 CREATE REFERRAL TRIGGER - Auto-process referrals on signup

-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION complete_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
  referral_code_param TEXT;
BEGIN
  -- Check if user has referral code in metadata
  IF NEW.raw_user_meta_data ? 'referral_code' THEN
    referral_code_param := NEW.raw_user_meta_data->>'referral_code';
    
    -- Insert completed referral
    INSERT INTO referrals (
      referrer_id,
      referred_email,
      status,
      referral_code,
      created_at
    )
    SELECT 
      p.user_id,
      NEW.email,
      'completed',
      referral_code_param,
      NOW()
    FROM profiles p
    WHERE p.referral_code = referral_code_param
    LIMIT 1;
    
    -- Create notification for referrer
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      created_at
    )
    SELECT 
      p.user_id,
      'referral_success',
      '🎉 Your referral joined DJ Elite!',
      NEW.email || ' just signed up using your referral link!',
      NOW()
    FROM profiles p
    WHERE p.referral_code = referral_code_param
    LIMIT 1;
    
    -- Award reward to referrer
    INSERT INTO referral_rewards (
      user_id,
      reward_type,
      reward_amount,
      description,
      earned_at,
      claimed
    )
    SELECT 
      p.user_id,
      'premium_days',
      7,
      '7 days premium for successful referral',
      NOW(),
      true
    FROM profiles p
    WHERE p.referral_code = referral_code_param
    LIMIT 1;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created_referral ON auth.users;
CREATE TRIGGER on_auth_user_created_referral
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION complete_referral_signup();

-- Step 3: Test the trigger setup
SELECT 'TRIGGER CREATED' as status, 'Referrals will now auto-process on signup' as message;