-- DJ Elite Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dj_name TEXT NOT NULL,
  bio TEXT,
  age INTEGER,
  location TEXT,
  experience_level TEXT CHECK (experience_level IN ('Beginner', 'Intermediate', 'Advanced', 'Professional')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create genres table
CREATE TABLE IF NOT EXISTS genres (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- Insert common DJ genres
INSERT INTO genres (name) VALUES 
  ('House'), ('Techno'), ('Trance'), ('Drum & Bass'), ('Dubstep'),
  ('Hip Hop'), ('Pop'), ('Rock'), ('Electronic'), ('Deep House'),
  ('Progressive'), ('Minimal'), ('Breakbeat'), ('Jungle'), ('Hardstyle')
ON CONFLICT (name) DO NOTHING;

-- Create profile_genres junction table
CREATE TABLE IF NOT EXISTS profile_genres (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, genre_id)
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- Insert common DJ skills
INSERT INTO skills (name) VALUES 
  ('Mixing'), ('Scratching'), ('Beat Matching'), ('Live Remixing'),
  ('Music Production'), ('Crowd Reading'), ('Equipment Setup'),
  ('Social Media'), ('Networking'), ('Event Planning')
ON CONFLICT (name) DO NOTHING;

-- Create profile_skills junction table
CREATE TABLE IF NOT EXISTS profile_skills (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, skill_id)
);

-- Create profile_images table
CREATE TABLE IF NOT EXISTS profile_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  swiped_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('left', 'right', 'super')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swiper_id, swiped_id)
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  profile2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile1_id, profile2_id)
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for profile_genres
CREATE POLICY "Users can view all profile genres" ON profile_genres FOR SELECT USING (true);
CREATE POLICY "Users can manage their own profile genres" ON profile_genres FOR ALL USING (
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- RLS Policies for profile_skills
CREATE POLICY "Users can view all profile skills" ON profile_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage their own profile skills" ON profile_skills FOR ALL USING (
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- RLS Policies for profile_images
CREATE POLICY "Users can view all profile images" ON profile_images FOR SELECT USING (true);
CREATE POLICY "Users can manage their own profile images" ON profile_images FOR ALL USING (
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- RLS Policies for swipes
CREATE POLICY "Users can view their own swipes" ON swipes FOR SELECT USING (
  swiper_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert their own swipes" ON swipes FOR INSERT WITH CHECK (
  swiper_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- RLS Policies for matches
CREATE POLICY "Users can view their own matches" ON matches FOR SELECT USING (
  profile1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
  profile2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- RLS Policies for newsletter (admin only for now)
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Create functions for common operations
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle matches
CREATE OR REPLACE FUNCTION handle_swipe(swiper_profile_id UUID, swiped_profile_id UUID, swipe_direction TEXT)
RETURNS JSON AS $$
DECLARE
  match_exists BOOLEAN := false;
  result JSON;
BEGIN
  -- Insert the swipe
  INSERT INTO swipes (swiper_id, swiped_id, direction) 
  VALUES (swiper_profile_id, swiped_profile_id, swipe_direction);
  
  -- Check if it's a right swipe and if there's a mutual right swipe
  IF swipe_direction = 'right' THEN
    SELECT EXISTS(
      SELECT 1 FROM swipes 
      WHERE swiper_id = swiped_profile_id 
        AND swiped_id = swiper_profile_id 
        AND direction = 'right'
    ) INTO match_exists;
    
    -- If mutual right swipe, create a match
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped ON swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile1 ON matches(profile1_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile2 ON matches(profile2_id);