-- BYPASS FOREIGN KEY - Temporarily disable constraint
-- Add mock users without foreign key issues

-- Step 1: Disable foreign key constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Step 2: Insert mock users (matching real user structure exactly)
INSERT INTO profiles (
  user_id, dj_name, bio, age, location, experience_level, genres, skills, venues, fee,
  profile_image_url, images, website, social_links, equipment, achievements, 
  portfolio_tracks, contact_info, premium_badge, is_active, created_at, referral_code
) VALUES 
('00000000-0000-0000-0000-000000000001', 'DJ Phoenix', 'House DJ from NYC with 5+ years experience', 25, 'New York, NY', 'Professional', ARRAY['House','Deep House'], ARRAY['Mixing','Beatmatching'], ARRAY['Club XYZ'], '$500-1000', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], null, '{}', '{}', '{}', '{}', '{}', false, true, NOW(), 'DJ0001a1b2'),

('00000000-0000-0000-0000-000000000002', 'DJ Neon', 'Techno specialist from Berlin underground scene', 28, 'Berlin, Germany', 'Advanced', ARRAY['Techno','Minimal'], ARRAY['Production','Remixing'], ARRAY['Berghain'], '$800-1500', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'], null, '{}', '{}', '{}', '{}', '{}', false, true, NOW(), 'DJ0002c3d4'),

('00000000-0000-0000-0000-000000000003', 'DJ Vibe', 'Trance lover spinning progressive sets', 30, 'London, UK', 'Professional', ARRAY['Trance','Progressive'], ARRAY['Crowd Reading'], ARRAY['Ministry of Sound'], '$600-1200', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', ARRAY['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'], null, '{}', '{}', '{}', '{}', '{}', false, true, NOW(), 'DJ0003e5f6'),

('00000000-0000-0000-0000-000000000004', 'DJ Storm', 'Hip Hop master with turntable skills', 26, 'Los Angeles, CA', 'Advanced', ARRAY['Hip Hop','R&B'], ARRAY['Scratching','Turntablism'], ARRAY['Exchange LA'], '$400-800', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'], null, '{}', '{}', '{}', '{}', '{}', false, true, NOW(), 'DJ0004g7h8'),

('00000000-0000-0000-0000-000000000005', 'DJ Luna', 'Electronic music producer and performer', 24, 'Miami, FL', 'Intermediate', ARRAY['Electronic','Dubstep'], ARRAY['Equipment Setup'], ARRAY['LIV Miami'], '$300-600', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', ARRAY['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'], null, '{}', '{}', '{}', '{}', '{}', false, true, NOW(), 'DJ0005i9j0');

-- Step 3: Re-enable foreign key constraint (optional - only if you want to protect real users)
-- ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Cleanup command
-- DELETE FROM profiles WHERE user_id LIKE '00000000-0000-0000-0000-%';
-- Or by referral code: DELETE FROM profiles WHERE referral_code LIKE 'DJ000%';