-- SAFE MOCK USERS: Clearly marked for easy removal
-- This version adds identifiers to distinguish mock from real users

-- Add a mock_user flag to profiles table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_mock_user') THEN
        ALTER TABLE profiles ADD COLUMN is_mock_user BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create 50 clearly marked mock users (safer number)
WITH mock_data AS (
  SELECT 
    gen_random_uuid() as user_id,
    'MOCK_' || dj_names.name as dj_name,  -- Prefix with MOCK_
    bios.bio || ' [MOCK USER FOR TESTING]' as bio,  -- Clear indicator
    (18 + (random() * 45)::int) as age,
    locations.location,
    experience_levels.level as experience_level,
    genres.genre_list,
    skills.skill_list,
    venues.venue_list,
    images.image_url,
    (random() * 1000 + 100)::int as fee
  FROM 
    (VALUES 
      ('DJ Phoenix'), ('DJ Neon'), ('DJ Vibe'), ('DJ Storm'), ('DJ Luna'),
      ('DJ Blaze'), ('DJ Echo'), ('DJ Pulse'), ('DJ Nova'), ('DJ Flux'),
      ('DJ Sonic'), ('DJ Prism'), ('DJ Volt'), ('DJ Zen'), ('DJ Apex'),
      ('DJ Cyber'), ('DJ Frost'), ('DJ Spark'), ('DJ Wave'), ('DJ Drift'),
      ('DJ Nexus'), ('DJ Rebel'), ('DJ Mystic'), ('DJ Flash'), ('DJ Orbit'),
      ('DJ Titan'), ('DJ Vortex'), ('DJ Quantum'), ('DJ Stellar'), ('DJ Rhythm'),
      ('DJ Fusion'), ('DJ Matrix'), ('DJ Cosmic'), ('DJ Thunder'), ('DJ Mirage'),
      ('DJ Velocity'), ('DJ Phantom'), ('DJ Infinity'), ('DJ Catalyst'), ('DJ Spectrum'),
      ('DJ Enigma'), ('DJ Tempest'), ('DJ Radiance'), ('DJ Momentum'), ('DJ Eclipse'),
      ('DJ Synthesis'), ('DJ Resonance'), ('DJ Amplitude'), ('DJ Frequency'), ('DJ Harmony'),
      ('DJ Kinetic'), ('DJ Luminous'), ('DJ Magnetic'), ('DJ Seismic'), ('DJ Atomic')
    ) as dj_names(name),
    (VALUES 
      ('New York, NY'), ('Los Angeles, CA'), ('Miami, FL'), ('Berlin, Germany'), ('London, UK'),
      ('Amsterdam, Netherlands'), ('Paris, France'), ('Tokyo, Japan'), ('Sydney, Australia'), ('Toronto, Canada')
    ) as locations(location),
    (VALUES 
      ('Passionate DJ looking to connect with fellow artists. [MOCK USER FOR TESTING]'),
      ('Electronic music enthusiast specializing in house and techno. [MOCK USER FOR TESTING]'),
      ('Professional DJ available for bookings worldwide. [MOCK USER FOR TESTING]'),
      ('Versatile DJ comfortable with multiple genres. [MOCK USER FOR TESTING]'),
      ('Rising star in the electronic scene. [MOCK USER FOR TESTING]')
    ) as bios(bio),
    (VALUES 
      ('Beginner'), ('Intermediate'), ('Advanced'), ('Professional')
    ) as experience_levels(level),
    (VALUES 
      (ARRAY['House', 'Deep House']),
      (ARRAY['Techno', 'Minimal']),
      (ARRAY['Trance', 'Progressive']),
      (ARRAY['Hip Hop', 'R&B']),
      (ARRAY['Electronic', 'Dubstep'])
    ) as genres(genre_list),
    (VALUES 
      (ARRAY['Mixing', 'Beatmatching']),
      (ARRAY['Scratching', 'Turntablism']),
      (ARRAY['Music Production', 'Remixing']),
      (ARRAY['Crowd Reading', 'MC Skills']),
      (ARRAY['Equipment Setup', 'Technical Skills'])
    ) as skills(skill_list),
    (VALUES 
      (ARRAY['Club XYZ', 'The Underground']),
      (ARRAY['Festival Grounds', 'Summer Beats']),
      (ARRAY['Rooftop Lounge', 'Sky Bar']),
      (ARRAY['Beach Club', 'Sunset Venue']),
      (ARRAY['Warehouse', 'Industrial Space'])
    ) as venues(venue_list),
    (VALUES 
      ('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face')
    ) as images(image_url)
  ORDER BY random()
  LIMIT 50
)
INSERT INTO profiles (
  user_id, 
  dj_name, 
  bio, 
  age, 
  location, 
  experience_level, 
  genres, 
  skills, 
  venues, 
  fee,
  profile_image_url,
  images,
  is_active,
  is_mock_user,  -- Mark as mock user
  created_at,
  updated_at,
  last_active_at
)
SELECT 
  user_id,
  dj_name,
  bio,
  age,
  location,
  experience_level,
  genre_list,
  skill_list,
  venue_list,
  fee::text,
  image_url,
  ARRAY[image_url],
  true,
  true,  -- This is a mock user
  NOW(),
  NOW(),
  NOW()
FROM mock_data;

-- Show summary
SELECT 
  'Mock Users Created' as summary,
  COUNT(*) as total_mock_users
FROM profiles 
WHERE is_mock_user = true;