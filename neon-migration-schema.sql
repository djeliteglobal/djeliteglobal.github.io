-- NEON MIGRATION SCHEMA
-- DJ Elite Platform - Neon-compatible version
-- Removes: RLS policies, auth.users references, Supabase-specific features

-- ===============================
-- USERS TABLE (replaces auth.users)
-- ===============================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  provider TEXT,
  provider_id TEXT,
  metadata JSONB DEFAULT '{}'
);

-- ===============================
-- CORE TABLES
-- ===============================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dj_name TEXT NOT NULL,
  email TEXT,
  bio TEXT,
  age INTEGER,
  location TEXT,
  experience_level TEXT CHECK (experience_level IN ('Beginner', 'Intermediate', 'Advanced', 'Professional')),
  is_active BOOLEAN DEFAULT true,
  profile_image_url TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  equipment TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  portfolio_tracks TEXT[] DEFAULT '{}',
  contact_info JSONB DEFAULT '{}',
  premium_badge BOOLEAN DEFAULT false,
  referral_code TEXT UNIQUE,
  referred_by_code TEXT,
  referral_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  social_score INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS genres (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

INSERT INTO genres (name) VALUES 
  ('House'), ('Techno'), ('Trance'), ('Drum & Bass'), ('Dubstep'),
  ('Hip Hop'), ('Pop'), ('Rock'), ('Electronic'), ('Deep House'),
  ('Progressive'), ('Minimal'), ('Breakbeat'), ('Jungle'), ('Hardstyle')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS profile_genres (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, genre_id)
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

INSERT INTO skills (name) VALUES 
  ('Mixing'), ('Scratching'), ('Beat Matching'), ('Live Remixing'),
  ('Music Production'), ('Crowd Reading'), ('Equipment Setup'),
  ('Social Media'), ('Networking'), ('Event Planning')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS profile_skills (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, skill_id)
);

CREATE TABLE IF NOT EXISTS profile_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  swiped_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('left', 'right', 'super')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swiper_id, swiped_id)
);

CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  profile2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile1_id, profile2_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio'))
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- ===============================
-- SUBSCRIPTION SYSTEM
-- ===============================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT CHECK (plan IN ('free', 'pro', 'elite')) NOT NULL DEFAULT 'free',
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired')) NOT NULL DEFAULT 'active',
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ===============================
-- REFERRAL SYSTEM
-- ===============================

CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'expired')) DEFAULT 'pending',
  reward_claimed BOOLEAN DEFAULT false,
  personal_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(referrer_id, referred_email)
);

CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_id UUID REFERENCES referrals(id) ON DELETE CASCADE,
  reward_type TEXT CHECK (reward_type IN ('premium_days', 'super_likes', 'boosts')) NOT NULL,
  reward_amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  super_likes_bonus INTEGER DEFAULT 0,
  boost_credits INTEGER DEFAULT 0,
  premium_days_bonus INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- GIG MARKETPLACE
-- ===============================

CREATE TABLE IF NOT EXISTS gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  venue TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  duration INTEGER NOT NULL,
  budget DECIMAL(10,2) NOT NULL CHECK (budget >= 0),
  status TEXT CHECK (status IN ('open', 'bidding', 'awarded', 'confirmed', 'completed', 'cancelled')) DEFAULT 'open',
  selected_dj_id UUID REFERENCES users(id),
  booking_fee DECIMAL(10,2) DEFAULT 0,
  referrer_commission DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  event_type TEXT CHECK (event_type IN ('wedding', 'corporate', 'birthday', 'club', 'concert', 'festival', 'private')) NOT NULL,
  requirements JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS gig_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES gigs(id),
  dj_id UUID NOT NULL REFERENCES users(id),
  proposed_fee DECIMAL(10,2) NOT NULL,
  message TEXT,
  status TEXT CHECK (status IN ('pending', 'shortlisted', 'selected', 'rejected')) DEFAULT 'pending',
  dj_referred_by UUID REFERENCES users(id),
  gig_referred_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rating INTEGER,
  rating_comment TEXT,
  UNIQUE(gig_id, dj_id)
);

CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES gigs(id),
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('client_payment', 'dj_payment', 'platform_fee', 'commission_payout')),
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  description TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commission_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('signup_referral', 'gig_referral')) NOT NULL,
  description TEXT NOT NULL,
  gig_id UUID REFERENCES gigs(id),
  paid_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
  stripe_payout_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS platform_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES gigs(id),
  amount DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('booking_fee', 'processing_fee', 'cancellation_fee')) DEFAULT 'booking_fee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS viral_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  platform TEXT,
  content_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- INDEXES
-- ===============================

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped ON swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile1 ON matches(profile1_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile2 ON matches(profile2_id);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_gigs_status ON gigs(status);
CREATE INDEX IF NOT EXISTS idx_gigs_location ON gigs(location);
CREATE INDEX IF NOT EXISTS idx_gigs_date ON gigs(date);
CREATE INDEX IF NOT EXISTS idx_gigs_client ON gigs(client_id);
CREATE INDEX IF NOT EXISTS idx_applications_gig ON gig_applications(gig_id);
CREATE INDEX IF NOT EXISTS idx_applications_dj ON gig_applications(dj_id);
CREATE INDEX IF NOT EXISTS idx_payments_gig ON payment_records(gig_id);
CREATE INDEX IF NOT EXISTS idx_commissions_user ON commission_payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_viral_events_user_id ON viral_events(user_id);

-- ===============================
-- HELPER FUNCTIONS
-- ===============================

CREATE OR REPLACE FUNCTION get_swipe_feed(user_profile_id UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  dj_name TEXT,
  bio TEXT,
  age INTEGER,
  location TEXT,
  experience_level TEXT,
  genres TEXT[],
  skills TEXT[],
  images TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.dj_name,
    p.bio,
    p.age,
    p.location,
    p.experience_level,
    ARRAY_AGG(DISTINCT g.name) as genres,
    ARRAY_AGG(DISTINCT s.name) as skills,
    ARRAY_AGG(DISTINCT pi.image_url ORDER BY pi.is_primary DESC, pi.created_at) as images
  FROM profiles p
  LEFT JOIN profile_genres pg ON p.id = pg.profile_id
  LEFT JOIN genres g ON pg.genre_id = g.id
  LEFT JOIN profile_skills ps ON p.id = ps.profile_id
  LEFT JOIN skills s ON ps.skill_id = s.id
  LEFT JOIN profile_images pi ON p.id = pi.profile_id
  WHERE p.id != user_profile_id
    AND p.is_active = true
    AND p.id NOT IN (
      SELECT swiped_id FROM swipes WHERE swiper_id = user_profile_id
    )
  GROUP BY p.id, p.dj_name, p.bio, p.age, p.location, p.experience_level
  ORDER BY RANDOM()
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_swipe(swiper_profile_id UUID, swiped_profile_id UUID, swipe_direction TEXT)
RETURNS JSON AS $$
DECLARE
  match_exists BOOLEAN := false;
  result JSON;
BEGIN
  INSERT INTO swipes (swiper_id, swiped_id, direction) 
  VALUES (swiper_profile_id, swiped_profile_id, swipe_direction);
  
  IF swipe_direction = 'right' THEN
    SELECT EXISTS(
      SELECT 1 FROM swipes 
      WHERE swiper_id = swiped_profile_id 
        AND swiped_id = swiper_profile_id 
        AND direction = 'right'
    ) INTO match_exists;
    
    IF match_exists THEN
      INSERT INTO matches (profile1_id, profile2_id) 
      VALUES (
        LEAST(swiper_profile_id, swiped_profile_id),
        GREATEST(swiper_profile_id, swiped_profile_id)
      )
      ON CONFLICT DO NOTHING;
      
      result := json_build_object('match', true, 'is_super', swipe_direction = 'super');
    ELSE
      result := json_build_object('match', false);
    END IF;
  ELSE
    result := json_build_object('match', false);
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
