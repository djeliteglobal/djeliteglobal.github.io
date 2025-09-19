-- WORKING MOCK USERS - With proper user_id structure
-- Creates fake user_ids that won't conflict with real users

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
('00000000-0000-0000-0000-000000000001', 'DJ Phoenix', 'House DJ from NYC with 5+ years experience', 25, 'New York, NY', ARRAY['House','Deep House'], ARRAY['Mixing','Beatmatching'], 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000002', 'DJ Neon', 'Techno specialist from Berlin underground scene', 28, 'Berlin, Germany', ARRAY['Techno','Minimal'], ARRAY['Production','Remixing'], 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000003', 'DJ Vibe', 'Trance lover spinning progressive sets', 30, 'London, UK', ARRAY['Trance','Progressive'], ARRAY['Crowd Reading','MC Skills'], 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', ARRAY['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000004', 'DJ Storm', 'Hip Hop master with turntable skills', 26, 'Los Angeles, CA', ARRAY['Hip Hop','R&B'], ARRAY['Scratching','Turntablism'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000005', 'DJ Luna', 'Electronic music producer and performer', 24, 'Miami, FL', ARRAY['Electronic','Dubstep'], ARRAY['Equipment Setup','Technical Skills'], 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', ARRAY['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000006', 'DJ Blaze', 'Festival DJ bringing high energy sets', 29, 'Amsterdam, Netherlands', ARRAY['House','Techno'], ARRAY['Live Performance','Stage Presence'], 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400', ARRAY['https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000007', 'DJ Echo', 'Deep house specialist with vinyl collection', 27, 'Paris, France', ARRAY['Deep House','Minimal'], ARRAY['Music Curation','Playlist Creation'], 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', ARRAY['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000008', 'DJ Pulse', 'Club resident with 10+ years experience', 31, 'Tokyo, Japan', ARRAY['Progressive','Trance'], ARRAY['Networking','Business Development'], 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', ARRAY['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000009', 'DJ Nova', 'Rising star in the electronic scene', 23, 'Sydney, Australia', ARRAY['Pop','Top 40'], ARRAY['Social Media','Marketing'], 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', ARRAY['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000010', 'DJ Flux', 'Versatile performer for any crowd', 32, 'Toronto, Canada', ARRAY['Rock','Alternative'], ARRAY['Event Planning','Promotion'], 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', ARRAY['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000011', 'DJ Sonic', 'Bass specialist with festival experience', 26, 'Barcelona, Spain', ARRAY['Drum & Bass','Jungle'], ARRAY['Mixing','Beatmatching'], 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400', ARRAY['https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000012', 'DJ Prism', 'Hardstyle king from Italian underground', 28, 'Rome, Italy', ARRAY['Hardstyle','Hardcore'], ARRAY['Production','Remixing'], 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400', ARRAY['https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000013', 'DJ Volt', 'Breakbeat master with unique style', 30, 'Prague, Czech Republic', ARRAY['Breakbeat','UK Garage'], ARRAY['Scratching','Turntablism'], 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400', ARRAY['https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000014', 'DJ Zen', 'Ambient artist creating musical journeys', 29, 'Vienna, Austria', ARRAY['Ambient','Downtempo'], ARRAY['Music Curation','Playlist Creation'], 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400', ARRAY['https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000015', 'DJ Apex', 'Funk and disco revival specialist', 27, 'Stockholm, Sweden', ARRAY['Funk','Disco'], ARRAY['Live Performance','Stage Presence'], 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400', ARRAY['https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000016', 'DJ Cyber', 'Latin music specialist with global reach', 25, 'Mexico City, Mexico', ARRAY['Latin','Reggaeton'], ARRAY['Crowd Reading','MC Skills'], 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000017', 'DJ Frost', 'Afrobeat pioneer bringing African rhythms', 31, 'Lagos, Nigeria', ARRAY['Afrobeat','Amapiano'], ARRAY['Equipment Setup','Technical Skills'], 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000018', 'DJ Spark', 'Psytrance guru from the birthplace of Goa', 28, 'Goa, India', ARRAY['Psytrance','Goa'], ARRAY['Networking','Business Development'], 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', ARRAY['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000019', 'DJ Wave', 'Multi-genre professional with radio background', 33, 'São Paulo, Brazil', ARRAY['House','Techno','Trance'], ARRAY['Social Media','Marketing'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'], true, NOW()),
('00000000-0000-0000-0000-000000000020', 'DJ Drift', 'Underground legend from Motor City', 35, 'Detroit, MI', ARRAY['Techno','Minimal','Deep House'], ARRAY['Event Planning','Promotion'], 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', ARRAY['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'], true, NOW());

-- Cleanup command (delete by user_id pattern)
-- DELETE FROM profiles WHERE user_id::text LIKE '00000000-0000-0000-0000-%';