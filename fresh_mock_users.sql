-- FRESH MOCK USERS - Clean slate with new IDs
-- First delete any existing mock users, then add new ones

-- Step 1: Clean up any existing mock users
DELETE FROM profiles WHERE user_id::text LIKE '00000000-0000-0000-0000-%';

-- Step 2: Disable foreign key constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Step 3: Insert fresh mock users with new IDs
INSERT INTO profiles (
  user_id, dj_name, bio, age, location, experience_level, genres, skills, venues, fee,
  profile_image_url, images, website, social_links, equipment, achievements, 
  portfolio_tracks, contact_info, premium_badge, is_active, created_at, referral_code
) VALUES 
('11111111-1111-1111-1111-111111111111', 'DJ Phoenix', 'House DJ from NYC with 5+ years experience', 25, 'New York, NY', 'Professional', ARRAY['House','Deep House'], ARRAY['Mixing','Beatmatching'], ARRAY['Club XYZ'], null, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], null, '{}', '{}', '{}', '{}', '{}', false, true, NOW(), 'DJ1111a1b2'),

('22222222-2222-2222-2222-222222222222', 'DJ Neon', 'Techno specialist from Berlin underground scene', 28, 'Berlin, Germany', 'Advanced', ARRAY['Techno','Minimal'], ARRAY['Production','Remixing'], ARRAY['Berghain'], null, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'], null, '{}', '{}', '{}', '{}', '{}', false, true, NOW(), 'DJ2222c3d4'),

('33333333-3333-3333-3333-333333333333', 'DJ Vibe', 'Trance lover spinning progressive sets', 30, 'London, UK', 'Professional', ARRAY['Trance','Progressive'], ARRAY['Crowd Reading'], ARRAY['Ministry of Sound'], null, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', ARRAY['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'], null, '{}', '{}', '{}', '{}', '{}', false, true, NOW(), 'DJ3333e5f6'),

('44444444-4444-4444-4444-444444444444', 'DJ Storm', 'Hip Hop master with turntable skills', 26, 'Los Angeles, CA', 'Advanced', ARRAY['Hip Hop','R&B'], ARRAY['Scratching','Turntablism'], ARRAY['Exchange LA'], null, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'], null, '{}', '{}', '{}', '{}', '{}', false, true, NOW(), 'DJ4444g7h8'),

('55555555-5555-5555-5555-555555555555', 'DJ Luna', 'Electronic music producer and performer', 24, 'Miami, FL', 'Intermediate', ARRAY['Electronic','Dubstep'], ARRAY['Equipment Setup'], ARRAY['LIV Miami'], null, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', ARRAY['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'], null, '{}', '{}', '{}', '{}', '{}', false, true, NOW(), 'DJ5555i9j0');

-- Check results
SELECT COUNT(*) as mock_users FROM profiles WHERE user_id::text LIKE '11111111-1111-1111-1111-%' OR user_id::text LIKE '22222222-2222-2222-2222-%' OR user_id::text LIKE '33333333-3333-3333-3333-%' OR user_id::text LIKE '44444444-4444-4444-4444-%' OR user_id::text LIKE '55555555-5555-5555-5555-%';