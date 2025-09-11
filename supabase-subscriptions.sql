-- Add subscription system to DJ Elite Platform
-- Run this in your Supabase SQL Editor

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT CHECK (plan IN ('free', 'pro', 'elite')) NOT NULL DEFAULT 'free',
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired')) NOT NULL DEFAULT 'active',
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add premium profile fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS equipment TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS achievements TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS portfolio_tracks TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS premium_badge BOOLEAN DEFAULT false;

-- Enable RLS for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subscription" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscription" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Create function to get user subscription with fallback to free
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID)
RETURNS TABLE (
  plan TEXT,
  status TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(s.plan, 'free') as plan,
    COALESCE(s.status, 'active') as status,
    COALESCE(s.current_period_end, NOW() + INTERVAL '1 month') as current_period_end
  FROM auth.users u
  LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
  WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check connection limits
CREATE OR REPLACE FUNCTION check_connection_limit(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  user_plan TEXT;
  user_profile_id UUID;
  connection_count INTEGER;
  max_connections INTEGER;
  result JSON;
BEGIN
  -- Get user's plan
  SELECT plan INTO user_plan FROM get_user_subscription(user_uuid) LIMIT 1;
  
  -- Get user's profile ID
  SELECT id INTO user_profile_id FROM profiles WHERE user_id = user_uuid;
  
  -- Set connection limits based on plan
  CASE user_plan
    WHEN 'free' THEN max_connections := 5;
    WHEN 'pro' THEN max_connections := -1; -- unlimited
    WHEN 'elite' THEN max_connections := -1; -- unlimited
    ELSE max_connections := 5;
  END CASE;
  
  -- If unlimited connections
  IF max_connections = -1 THEN
    result := json_build_object('canConnect', true, 'remaining', -1, 'plan', user_plan);
    RETURN result;
  END IF;
  
  -- Count current connections
  SELECT COUNT(*) INTO connection_count
  FROM matches 
  WHERE profile1_id = user_profile_id OR profile2_id = user_profile_id;
  
  -- Build result
  result := json_build_object(
    'canConnect', connection_count < max_connections,
    'remaining', GREATEST(0, max_connections - connection_count),
    'plan', user_plan,
    'current', connection_count,
    'max', max_connections
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_profiles_premium_badge ON profiles(premium_badge);

-- Insert default free subscriptions for existing users
INSERT INTO subscriptions (user_id, plan, status)
SELECT u.id, 'free', 'active'
FROM auth.users u
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE s.id IS NULL
ON CONFLICT (user_id) DO NOTHING;