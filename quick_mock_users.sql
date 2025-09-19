-- QUICK MOCK USERS - Optimized for speed
-- Creates 20 mock users instantly

INSERT INTO profiles (
  user_id, 
  dj_name, 
  bio, 
  age, 
  location, 
  genres, 
  skills, 
  profile_image_url,
  images,
  is_active,
  created_at
) VALUES 
(gen_random_uuid(), 'MOCK_DJ Phoenix', 'House DJ from NYC [MOCK]', 25, 'New York, NY', ARRAY['House','Deep House'], ARRAY['Mixing','Beatmatching'], 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Neon', 'Techno specialist [MOCK]', 28, 'Berlin, Germany', ARRAY['Techno','Minimal'], ARRAY['Production','Remixing'], 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Vibe', 'Trance lover [MOCK]', 30, 'London, UK', ARRAY['Trance','Progressive'], ARRAY['Crowd Reading','MC Skills'], 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', ARRAY['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Storm', 'Hip Hop master [MOCK]', 26, 'Los Angeles, CA', ARRAY['Hip Hop','R&B'], ARRAY['Scratching','Turntablism'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Luna', 'Electronic vibes [MOCK]', 24, 'Miami, FL', ARRAY['Electronic','Dubstep'], ARRAY['Equipment Setup','Technical Skills'], 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', ARRAY['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Blaze', 'Festival DJ [MOCK]', 29, 'Amsterdam, Netherlands', ARRAY['House','Techno'], ARRAY['Live Performance','Stage Presence'], 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400', ARRAY['https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Echo', 'Deep house specialist [MOCK]', 27, 'Paris, France', ARRAY['Deep House','Minimal'], ARRAY['Music Curation','Playlist Creation'], 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', ARRAY['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Pulse', 'Club resident [MOCK]', 31, 'Tokyo, Japan', ARRAY['Progressive','Trance'], ARRAY['Networking','Business Development'], 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', ARRAY['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Nova', 'Rising star [MOCK]', 23, 'Sydney, Australia', ARRAY['Pop','Top 40'], ARRAY['Social Media','Marketing'], 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', ARRAY['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Flux', 'Versatile performer [MOCK]', 32, 'Toronto, Canada', ARRAY['Rock','Alternative'], ARRAY['Event Planning','Promotion'], 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', ARRAY['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Sonic', 'Bass specialist [MOCK]', 26, 'Barcelona, Spain', ARRAY['Drum & Bass','Jungle'], ARRAY['Mixing','Beatmatching'], 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400', ARRAY['https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Prism', 'Hardstyle king [MOCK]', 28, 'Rome, Italy', ARRAY['Hardstyle','Hardcore'], ARRAY['Production','Remixing'], 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400', ARRAY['https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Volt', 'Breakbeat master [MOCK]', 30, 'Prague, Czech Republic', ARRAY['Breakbeat','UK Garage'], ARRAY['Scratching','Turntablism'], 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400', ARRAY['https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Zen', 'Ambient artist [MOCK]', 29, 'Vienna, Austria', ARRAY['Ambient','Downtempo'], ARRAY['Music Curation','Playlist Creation'], 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400', ARRAY['https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Apex', 'Funk lover [MOCK]', 27, 'Stockholm, Sweden', ARRAY['Funk','Disco'], ARRAY['Live Performance','Stage Presence'], 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400', ARRAY['https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Cyber', 'Latin specialist [MOCK]', 25, 'Mexico City, Mexico', ARRAY['Latin','Reggaeton'], ARRAY['Crowd Reading','MC Skills'], 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Frost', 'Afrobeat king [MOCK]', 31, 'Lagos, Nigeria', ARRAY['Afrobeat','Amapiano'], ARRAY['Equipment Setup','Technical Skills'], 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Spark', 'Psytrance guru [MOCK]', 28, 'Goa, India', ARRAY['Psytrance','Goa'], ARRAY['Networking','Business Development'], 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', ARRAY['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Wave', 'Multi-genre pro [MOCK]', 33, 'São Paulo, Brazil', ARRAY['House','Techno','Trance'], ARRAY['Social Media','Marketing'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'], true, NOW()),
(gen_random_uuid(), 'MOCK_DJ Drift', 'Underground legend [MOCK]', 35, 'Detroit, MI', ARRAY['Techno','Minimal','Deep House'], ARRAY['Event Planning','Promotion'], 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', ARRAY['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'], true, NOW());

-- Quick cleanup command
-- DELETE FROM profiles WHERE dj_name LIKE 'MOCK_%';