-- Phase 1: Critical Performance Indexes for 2x Speed Boost

-- Profiles table indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);

-- Matches table indexes  
CREATE INDEX IF NOT EXISTS idx_matches_profile1_id ON matches(profile1_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile2_id ON matches(profile2_id);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_matches_profiles ON matches(profile1_id, profile2_id);

-- Swipes table indexes
CREATE INDEX IF NOT EXISTS idx_swipes_swiper_id ON swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped_id ON swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_swipes_direction ON swipes(direction);
CREATE INDEX IF NOT EXISTS idx_swipes_created_at ON swipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_swipes_match_check ON swipes(swiped_id, swiper_id, direction);

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read_at ON messages(read_at);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(match_id, read_at) WHERE read_at IS NULL;

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(user_id, created_at) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_matches_user_lookup ON matches(profile1_id, profile2_id, created_at);

-- Performance optimization: Analyze tables
ANALYZE profiles;
ANALYZE matches; 
ANALYZE swipes;
ANALYZE messages;