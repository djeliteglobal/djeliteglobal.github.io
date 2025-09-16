-- 🚀 VIRAL GROWTH MECHANICS - REFERRAL SYSTEM SCHEMA
-- This implementation will drive exponential user growth for DJ Elite

-- ===============================
-- MAIN REFERRAL TABLES
-- ===============================

-- Referral tracking table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id),
  referred_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('pending', 'completed', 'expired')) DEFAULT 'pending',
  referral_code TEXT NOT NULL,
  personal_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(referred_email), -- Prevent duplicate invitations
  UNIQUE(referral_code) -- Ensure unique referral codes
);

-- Referral rewards tracking
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  reward_type TEXT CHECK (reward_type IN ('premium_days', 'super_likes', 'boosts')) NOT NULL,
  reward_amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, reward_type, earned_at) -- Prevent duplicate rewards
);

-- User statistics for referral tracking
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  super_likes_bonus INTEGER DEFAULT 0,
  boost_credits INTEGER DEFAULT 0,
  referral_earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ===============================
-- NOTIFICATIONS INTEGRATION
-- ===============================

-- Referral notifications (optional if notifications already exist)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- ROW LEVEL SECURITY POLICIES
-- ===============================

-- Drop existing policies if they exist (for re-runnable deployment)
DROP POLICY IF EXISTS "Users can view own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can insert own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can update own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can view own rewards" ON referral_rewards;
DROP POLICY IF EXISTS "Users can update own rewards" ON referral_rewards;
DROP POLICY IF EXISTS "Users can view own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- Recreate all policies
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can insert own referrals" ON referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Users can update own referrals" ON referrals
  FOR UPDATE USING (auth.uid() = referrer_id);

-- Users can view their own referral rewards
CREATE POLICY "Users can view own rewards" ON referral_rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own rewards" ON referral_rewards
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can view/manage their own stats
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ===============================
-- INDEXES FOR PERFORMANCE
-- ===============================

-- Referral lookup indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_email ON referrals(referred_email);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);

-- Reward indexes
CREATE INDEX IF NOT EXISTS idx_rewards_user ON referral_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_claimed ON referral_rewards(claimed);

-- Stats indexes
CREATE INDEX IF NOT EXISTS idx_stats_user ON user_stats(user_id);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- ===============================
-- USEFUL STORED FUNCTIONS
-- ===============================

-- Function to get referral leaderboard
CREATE OR REPLACE FUNCTION get_referral_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(dj_name TEXT, referral_count BIGINT, total_rewards BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.dj_name,
    COUNT(r.id) as referral_count,
    COUNT(r.id) * 10 as total_rewards
  FROM referrals r
  JOIN profiles p ON r.referrer_id = p.user_id
  WHERE r.status = 'completed'
  GROUP BY p.user_id, p.dj_name
  ORDER BY referral_count DESC
  LIMIT limit_count;
END;
$$;

-- Helper function to get referral reward details
CREATE OR REPLACE FUNCTION get_referral_reward_details(user_uuid UUID)
RETURNS TABLE(reward_type TEXT, reward_amount INTEGER, description TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
  completed_count INTEGER;
BEGIN
  -- Count completed referrals
  SELECT COUNT(*) INTO completed_count
  FROM referrals
  WHERE referrer_id = user_uuid AND status = 'completed';

  -- Determine reward based on milestones
  IF completed_count = 1 THEN
    RETURN QUERY SELECT 'premium_days'::TEXT, 7::INTEGER, '7 days of DJ Elite Premium'::TEXT;
  ELSIF completed_count % 3 = 0 THEN
    RETURN QUERY SELECT 'super_likes'::TEXT, 5::INTEGER, '5 Super Likes'::TEXT;
  ELSIF completed_count >= 10 AND completed_count % 5 = 0 THEN
    RETURN QUERY SELECT 'boosts'::TEXT, 1::INTEGER, '1 Free Boost (30 minutes)'::TEXT;
  END IF;

  RETURN;
END;
$$;

-- Function to complete referral automatically
CREATE OR REPLACE FUNCTION complete_referral_process()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  referrer_uuid UUID;
  _reward_type TEXT;
  _reward_amount INTEGER;
  _description TEXT;
BEGIN
  -- Check if the new user signed up with a referral code
  IF NEW.raw_user_meta_data->>'referral_code' IS NOT NULL THEN
    -- Find the pending referral by code
    SELECT referrer_id INTO referrer_uuid
    FROM referrals
    WHERE referral_code = NEW.raw_user_meta_data->>'referral_code' AND status = 'pending'
    LIMIT 1;

    IF referrer_uuid IS NOT NULL THEN
      -- Update referral as completed
      UPDATE referrals
      SET referred_user_id = NEW.id, status = 'completed', completed_at = NOW()
      WHERE referral_code = NEW.raw_user_meta_data->>'referral_code' AND status = 'pending';

      -- Get reward details
      SELECT reward_type, reward_amount, description
      INTO _reward_type, _reward_amount, _description
      FROM get_referral_reward_details(referrer_uuid);

      IF _reward_type IS NOT NULL THEN
        -- Insert unclaimed reward for referrer
        INSERT INTO referral_rewards (user_id, reward_type, reward_amount, description, claimed)
        VALUES (referrer_uuid, _reward_type, _reward_amount, _description, FALSE);
      END IF;

      -- Send notification to referrer
      INSERT INTO notifications (user_id, type, title, message, data)
      VALUES (
        referrer_uuid,
        'referral_success',
        '🎉 Referral Successful!',
        'Someone you invited just joined DJ Elite. Check your rewards!',
        jsonb_build_object('new_user_id', NEW.id, 'dj_name', NEW.raw_user_meta_data->>'dj_name')
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists (for re-runnable deployment)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to run complete_referral_process after a new user is created
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION complete_referral_process();

-- ===============================
-- EXAMPLE DATA FOR TESTING
-- ===============================

-- SAMPLE DATA HAS BEEN REMOVED FOR CLEAN DEPLOYMENT
-- The sample data referenced fake user IDs that don't exist in production
-- You can add test data after deployment with real user IDs

-- To add test data later, replace the fake UUIDs with real user IDs:
-- INSERT INTO referrals (referrer_id, referred_email, status, referral_code) VALUES
-- ('real-user-id-here', 'test@example.com', 'pending', 'DJTEST123');

-- INSERT INTO referral_rewards (user_id, reward_type, reward_amount, description) VALUES
-- ('real-user-id-here', 'premium_days', 7, 'Test referral reward');

-- ===============================
-- CLEANUP & OPTIMIZATION
-- ===============================

-- Clean expired referrals automatically (uncomment to enable)
-- CREATE OR REPLACE FUNCTION cleanup_expired_referrals()
-- RETURNS void
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--   UPDATE referrals
--   SET status = 'expired'
--   WHERE status = 'pending'
--   AND created_at < NOW() - INTERVAL '30 days';
-- END;
-- $$;

-- ===============================
-- MIGRATION NOTES
-- ===============================

/*
Next Steps for Full Implementation:
1. Run this SQL in Supabase SQL Editor
2. Test the seed data
3. Integrate signup flow with referral completion
4. Add UI components for referral management
5. Test email integration when available
6. Monitor referral metrics and adjust rewards

Expected User Flow:
1. User shares referral link/code
2. Friend clicks link and signs up
3. Referral auto-completes on signup
4. Both users get instant rewards
5. Notifications sent to referrer
6. Stats update in real-time
*/

-- Enable RLS on all new tables
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
