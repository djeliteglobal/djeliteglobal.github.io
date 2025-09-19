-- DJ Elite Platform - Mock Users Population Script
-- Run this in Supabase SQL Editor to create 200 realistic DJ profiles

-- First, let's create some realistic DJ names, locations, and bios
WITH mock_data AS (
  SELECT 
    gen_random_uuid() as user_id,
    dj_names.name as dj_name,
    locations.location,
    bios.bio,
    (18 + (random() * 45)::int) as age,
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
      ('DJ Kinetic'), ('DJ Luminous'), ('DJ Magnetic'), ('DJ Seismic'), ('DJ Atomic'),
      ('DJ Gravity'), ('DJ Photon'), ('DJ Electron'), ('DJ Neutron'), ('DJ Proton'),
      ('DJ Laser'), ('DJ Hologram'), ('DJ Digital'), ('DJ Binary'), ('DJ Circuit'),
      ('DJ Voltage'), ('DJ Current'), ('DJ Plasma'), ('DJ Neon'), ('DJ Chrome'),
      ('DJ Silver'), ('DJ Gold'), ('DJ Platinum'), ('DJ Diamond'), ('DJ Crystal'),
      ('DJ Sapphire'), ('DJ Ruby'), ('DJ Emerald'), ('DJ Onyx'), ('DJ Jade'),
      ('DJ Amber'), ('DJ Pearl'), ('DJ Coral'), ('DJ Ivory'), ('DJ Obsidian'),
      ('DJ Marble'), ('DJ Granite'), ('DJ Quartz'), ('DJ Opal'), ('DJ Topaz'),
      ('DJ Turquoise'), ('DJ Amethyst'), ('DJ Garnet'), ('DJ Peridot'), ('DJ Citrine'),
      ('DJ Moonstone'), ('DJ Sunstone'), ('DJ Bloodstone'), ('DJ Jasper'), ('DJ Agate'),
      ('DJ Malachite'), ('DJ Lapis'), ('DJ Carnelian'), ('DJ Aventurine'), ('DJ Fluorite'),
      ('DJ Hematite'), ('DJ Pyrite'), ('DJ Magnetite'), ('DJ Calcite'), ('DJ Dolomite'),
      ('DJ Gypsum'), ('DJ Halite'), ('DJ Sulfur'), ('DJ Graphite'), ('DJ Talc'),
      ('DJ Mica'), ('DJ Feldspar'), ('DJ Hornblende'), ('DJ Augite'), ('DJ Olivine'),
      ('DJ Pyroxene'), ('DJ Amphibole'), ('DJ Biotite'), ('DJ Muscovite'), ('DJ Chlorite'),
      ('DJ Serpentine'), ('DJ Actinolite'), ('DJ Tremolite'), ('DJ Epidote'), ('DJ Zoisite'),
      ('DJ Staurolite'), ('DJ Andalusite'), ('DJ Sillimanite'), ('DJ Kyanite'), ('DJ Cordierite'),
      ('DJ Spinel'), ('DJ Corundum'), ('DJ Beryl'), ('DJ Tourmaline'), ('DJ Zircon'),
      ('DJ Titanite'), ('DJ Rutile'), ('DJ Cassiterite'), ('DJ Wolframite'), ('DJ Molybdenite'),
      ('DJ Galena'), ('DJ Sphalerite'), ('DJ Chalcopyrite'), ('DJ Bornite'), ('DJ Covellite'),
      ('DJ Chalcocite'), ('DJ Cuprite'), ('DJ Tenorite'), ('DJ Malachite'), ('DJ Azurite'),
      ('DJ Chrysocolla'), ('DJ Turquoise'), ('DJ Variscite'), ('DJ Lazurite'), ('DJ Sodalite'),
      ('DJ Hauyne'), ('DJ Nosean'), ('DJ Cancrinite'), ('DJ Nepheline'), ('DJ Leucite'),
      ('DJ Analcime'), ('DJ Natrolite'), ('DJ Mesolite'), ('DJ Scolecite'), ('DJ Stilbite'),
      ('DJ Heulandite'), ('DJ Clinoptilolite'), ('DJ Mordenite'), ('DJ Ferrierite'), ('DJ Erionite'),
      ('DJ Chabazite'), ('DJ Phillipsite'), ('DJ Gmelinite'), ('DJ Levyne'), ('DJ Offretite'),
      ('DJ Paulingite'), ('DJ Merlinoite'), ('DJ Mazzite'), ('DJ Dachiardite'), ('DJ Epistilbite'),
      ('DJ Brewsterite'), ('DJ Stellerite'), ('DJ Barrerite'), ('DJ Cowlesite'), ('DJ Garronite'),
      ('DJ Gismondine'), ('DJ Harmotome'), ('DJ Wellsite'), ('DJ Yugawaralite'), ('DJ Boggsite'),
      ('DJ Tschernichite'), ('DJ Partheite'), ('DJ Prehnite'), ('DJ Pumpellyite'), ('DJ Lawsonite'),
      ('DJ Glaucophane'), ('DJ Riebeckite'), ('DJ Arfvedsonite'), ('DJ Eckermanite'), ('DJ Magnesio'),
      ('DJ Ferro'), ('DJ Fluoro'), ('DJ Chloro'), ('DJ Hydroxy'), ('DJ Oxy'),
      ('DJ Meta'), ('DJ Para'), ('DJ Ortho'), ('DJ Proto'), ('DJ Pseudo'),
      ('DJ Neo'), ('DJ Paleo'), ('DJ Meso'), ('DJ Ceno'), ('DJ Archean'),
      ('DJ Hadean'), ('DJ Eoarchean'), ('DJ Paleoarchean'), ('DJ Mesoarchean'), ('DJ Neoarchean'),
      ('DJ Paleoproterozoic'), ('DJ Mesoproterozoic'), ('DJ Neoproterozoic'), ('DJ Cambrian'), ('DJ Ordovician'),
      ('DJ Silurian'), ('DJ Devonian'), ('DJ Carboniferous'), ('DJ Permian'), ('DJ Triassic'),
      ('DJ Jurassic'), ('DJ Cretaceous'), ('DJ Paleogene'), ('DJ Neogene'), ('DJ Quaternary')
    ) as dj_names(name),
    (VALUES 
      ('New York, NY'), ('Los Angeles, CA'), ('Chicago, IL'), ('Miami, FL'), ('Las Vegas, NV'),
      ('San Francisco, CA'), ('Seattle, WA'), ('Austin, TX'), ('Nashville, TN'), ('Atlanta, GA'),
      ('Boston, MA'), ('Philadelphia, PA'), ('Denver, CO'), ('Phoenix, AZ'), ('San Diego, CA'),
      ('Portland, OR'), ('Detroit, MI'), ('Minneapolis, MN'), ('New Orleans, LA'), ('Charlotte, NC'),
      ('London, UK'), ('Berlin, Germany'), ('Amsterdam, Netherlands'), ('Paris, France'), ('Barcelona, Spain'),
      ('Rome, Italy'), ('Prague, Czech Republic'), ('Vienna, Austria'), ('Stockholm, Sweden'), ('Copenhagen, Denmark'),
      ('Oslo, Norway'), ('Helsinki, Finland'), ('Reykjavik, Iceland'), ('Dublin, Ireland'), ('Edinburgh, Scotland'),
      ('Manchester, UK'), ('Liverpool, UK'), ('Bristol, UK'), ('Brighton, UK'), ('Glasgow, Scotland'),
      ('Tokyo, Japan'), ('Seoul, South Korea'), ('Bangkok, Thailand'), ('Singapore'), ('Hong Kong'),
      ('Sydney, Australia'), ('Melbourne, Australia'), ('Brisbane, Australia'), ('Perth, Australia'), ('Adelaide, Australia'),
      ('Toronto, Canada'), ('Vancouver, Canada'), ('Montreal, Canada'), ('Calgary, Canada'), ('Ottawa, Canada'),
      ('Mexico City, Mexico'), ('Guadalajara, Mexico'), ('Monterrey, Mexico'), ('Tijuana, Mexico'), ('Cancun, Mexico'),
      ('São Paulo, Brazil'), ('Rio de Janeiro, Brazil'), ('Salvador, Brazil'), ('Brasília, Brazil'), ('Fortaleza, Brazil'),
      ('Buenos Aires, Argentina'), ('Córdoba, Argentina'), ('Rosario, Argentina'), ('Mendoza, Argentina'), ('La Plata, Argentina'),
      ('Santiago, Chile'), ('Valparaíso, Chile'), ('Concepción, Chile'), ('La Serena, Chile'), ('Temuco, Chile'),
      ('Lima, Peru'), ('Arequipa, Peru'), ('Trujillo, Peru'), ('Chiclayo, Peru'), ('Piura, Peru'),
      ('Bogotá, Colombia'), ('Medellín, Colombia'), ('Cali, Colombia'), ('Barranquilla, Colombia'), ('Cartagena, Colombia'),
      ('Caracas, Venezuela'), ('Maracaibo, Venezuela'), ('Valencia, Venezuela'), ('Barquisimeto, Venezuela'), ('Maracay, Venezuela'),
      ('Quito, Ecuador'), ('Guayaquil, Ecuador'), ('Cuenca, Ecuador'), ('Santo Domingo, Ecuador'), ('Machala, Ecuador'),
      ('La Paz, Bolivia'), ('Santa Cruz, Bolivia'), ('Cochabamba, Bolivia'), ('Sucre, Bolivia'), ('Oruro, Bolivia'),
      ('Asunción, Paraguay'), ('Ciudad del Este, Paraguay'), ('San Lorenzo, Paraguay'), ('Luque, Paraguay'), ('Capiatá, Paraguay'),
      ('Montevideo, Uruguay'), ('Salto, Uruguay'), ('Paysandú, Uruguay'), ('Las Piedras, Uruguay'), ('Rivera, Uruguay'),
      ('Georgetown, Guyana'), ('Paramaribo, Suriname'), ('Cayenne, French Guiana'), ('Stanley, Falkland Islands'), ('Ushuaia, Argentina')
    ) as locations(location),
    (VALUES 
      ('Passionate DJ with 5+ years of experience spinning at top clubs worldwide. Love connecting with fellow artists and creating unforgettable musical experiences.'),
      ('Electronic music enthusiast specializing in deep house and techno. Always looking for new collaborations and gig opportunities.'),
      ('Professional DJ and producer with a passion for underground sounds. Available for club nights, festivals, and private events.'),
      ('Versatile DJ comfortable with multiple genres. From intimate venues to massive festivals, I bring the energy every time.'),
      ('Music is my life! Experienced in reading crowds and creating the perfect atmosphere for any event. Let''s connect and make magic happen.'),
      ('Award-winning DJ with residencies at top venues. Specializing in progressive house and trance. Open to bookings worldwide.'),
      ('Rising star in the electronic scene. Known for seamless mixing and innovative track selection. Ready to take your event to the next level.'),
      ('Veteran DJ with 15+ years behind the decks. From vinyl to digital, I''ve mastered it all. Available for mentoring and collaborations.'),
      ('High-energy performer with a unique style that gets crowds moving. Experienced in festivals, clubs, and corporate events.'),
      ('Creative DJ and producer always pushing boundaries. Love experimenting with new sounds and connecting with like-minded artists.'),
      ('Professional mobile DJ available for weddings, parties, and corporate events. Extensive music library and top-quality equipment.'),
      ('Club resident with a passion for house music. Known for creating immersive musical journeys that keep dancefloors packed.'),
      ('Multi-genre DJ comfortable with everything from hip-hop to EDM. Adaptable to any crowd and always professional.'),
      ('Experienced festival DJ with a love for bass-heavy sounds. Bringing high-energy sets that create unforgettable moments.'),
      ('Skilled turntablist with a background in hip-hop and scratch techniques. Available for battles, showcases, and teaching.'),
      ('Electronic music purist with a deep knowledge of underground scenes. Curating unique sets that tell a story.'),
      ('Professional DJ with strong business acumen. Available for regular bookings and long-term venue partnerships.'),
      ('Creative artist blending traditional DJing with live elements. Offering a unique experience for discerning audiences.'),
      ('Experienced radio DJ transitioning to live performances. Bringing professional presentation skills to every event.'),
      ('Young and hungry DJ making waves in the local scene. Eager to connect with established artists and learn from the best.')
    ) as bios(bio),
    (VALUES 
      ('Beginner'), ('Intermediate'), ('Advanced'), ('Professional')
    ) as experience_levels(level),
    (VALUES 
      (ARRAY['House', 'Deep House']),
      (ARRAY['Techno', 'Minimal']),
      (ARRAY['Trance', 'Progressive']),
      (ARRAY['Hip Hop', 'R&B']),
      (ARRAY['Electronic', 'Dubstep']),
      (ARRAY['Pop', 'Top 40']),
      (ARRAY['Rock', 'Alternative']),
      (ARRAY['Drum & Bass', 'Jungle']),
      (ARRAY['Hardstyle', 'Hardcore']),
      (ARRAY['Breakbeat', 'UK Garage']),
      (ARRAY['Ambient', 'Downtempo']),
      (ARRAY['Funk', 'Disco']),
      (ARRAY['Latin', 'Reggaeton']),
      (ARRAY['Afrobeat', 'Amapiano']),
      (ARRAY['Psytrance', 'Goa'])
    ) as genres(genre_list),
    (VALUES 
      (ARRAY['Mixing', 'Beatmatching']),
      (ARRAY['Scratching', 'Turntablism']),
      (ARRAY['Music Production', 'Remixing']),
      (ARRAY['Crowd Reading', 'MC Skills']),
      (ARRAY['Equipment Setup', 'Technical Skills']),
      (ARRAY['Social Media', 'Marketing']),
      (ARRAY['Networking', 'Business Development']),
      (ARRAY['Event Planning', 'Promotion']),
      (ARRAY['Live Performance', 'Stage Presence']),
      (ARRAY['Music Curation', 'Playlist Creation'])
    ) as skills(skill_list),
    (VALUES 
      (ARRAY['Club XYZ', 'The Underground']),
      (ARRAY['Festival Grounds', 'Summer Beats']),
      (ARRAY['Rooftop Lounge', 'Sky Bar']),
      (ARRAY['Beach Club', 'Sunset Venue']),
      (ARRAY['Warehouse', 'Industrial Space']),
      (ARRAY['Hotel Lobby', 'Corporate Events']),
      (ARRAY['Wedding Venues', 'Private Parties']),
      (ARRAY['Radio Station', 'Podcast Studio']),
      (ARRAY['Music Festival', 'Outdoor Stage']),
      (ARRAY['Nightclub', 'VIP Lounge'])
    ) as venues(venue_list),
    (VALUES 
      ('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face'),
      ('https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face')
    ) as images(image_url)
  ORDER BY random()
  LIMIT 200
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
  fee,
  image_url,
  ARRAY[image_url],
  true,
  NOW() - (random() * interval '30 days'),
  NOW() - (random() * interval '7 days'),
  NOW() - (random() * interval '24 hours')
FROM mock_data;

-- Update the profiles table to ensure we have the correct columns
-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add genres column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'genres') THEN
        ALTER TABLE profiles ADD COLUMN genres TEXT[];
    END IF;
    
    -- Add skills column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'skills') THEN
        ALTER TABLE profiles ADD COLUMN skills TEXT[];
    END IF;
    
    -- Add venues column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'venues') THEN
        ALTER TABLE profiles ADD COLUMN venues TEXT[];
    END IF;
    
    -- Add fee column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'fee') THEN
        ALTER TABLE profiles ADD COLUMN fee TEXT;
    END IF;
    
    -- Add profile_image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'profile_image_url') THEN
        ALTER TABLE profiles ADD COLUMN profile_image_url TEXT;
    END IF;
    
    -- Add images column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'images') THEN
        ALTER TABLE profiles ADD COLUMN images TEXT[];
    END IF;
    
    -- Add last_active_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_active_at') THEN
        ALTER TABLE profiles ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create some realistic swipes between users to simulate activity
WITH random_swipes AS (
  SELECT 
    p1.id as swiper_id,
    p2.id as swiped_id,
    CASE 
      WHEN random() < 0.7 THEN 'right'
      WHEN random() < 0.95 THEN 'left'
      ELSE 'super'
    END as direction
  FROM profiles p1
  CROSS JOIN profiles p2
  WHERE p1.id != p2.id
  AND random() < 0.1  -- Only 10% of possible combinations to avoid too many swipes
  ORDER BY random()
  LIMIT 1000
)
INSERT INTO swipes (swiper_id, swiped_id, direction, created_at)
SELECT 
  swiper_id,
  swiped_id,
  direction,
  NOW() - (random() * interval '7 days')
FROM random_swipes
ON CONFLICT (swiper_id, swiped_id) DO NOTHING;

-- Create matches where there are mutual right swipes
INSERT INTO matches (profile1_id, profile2_id, created_at)
SELECT DISTINCT
  LEAST(s1.swiper_id, s1.swiped_id) as profile1_id,
  GREATEST(s1.swiper_id, s1.swiped_id) as profile2_id,
  GREATEST(s1.created_at, s2.created_at) as created_at
FROM swipes s1
JOIN swipes s2 ON s1.swiper_id = s2.swiped_id 
  AND s1.swiped_id = s2.swiper_id
WHERE s1.direction = 'right' 
  AND s2.direction = 'right'
  AND s1.swiper_id < s1.swiped_id  -- Avoid duplicates
ON CONFLICT (profile1_id, profile2_id) DO NOTHING;

-- Add some sample messages between matched users
WITH matched_pairs AS (
  SELECT 
    m.id as match_id,
    m.profile1_id,
    m.profile2_id,
    p1.dj_name as dj1_name,
    p2.dj_name as dj2_name
  FROM matches m
  JOIN profiles p1 ON m.profile1_id = p1.id
  JOIN profiles p2 ON m.profile2_id = p2.id
  ORDER BY random()
  LIMIT 50
),
sample_messages AS (
  SELECT 
    match_id,
    CASE WHEN random() < 0.5 THEN profile1_id ELSE profile2_id END as sender_id,
    CASE WHEN random() < 0.5 THEN profile2_id ELSE profile1_id END as receiver_id,
    message_content,
    NOW() - (random() * interval '5 days') as created_at
  FROM matched_pairs
  CROSS JOIN (VALUES 
    ('Hey! Love your music style 🎵'),
    ('Great to match with you! Are you available for any upcoming gigs?'),
    ('Your track selection is amazing! Would love to collaborate'),
    ('Hi there! I see we both love house music 🏠'),
    ('Awesome profile! Are you playing anywhere this weekend?'),
    ('Hey! I''m organizing an event next month, interested?'),
    ('Love your energy! Let''s connect and maybe do a B2B set'),
    ('Hi! I''m new to the scene, would love some advice'),
    ('Great to meet another DJ in the area! Coffee sometime?'),
    ('Your mixing skills are incredible! Any tips for a fellow DJ?')
  ) as messages(message_content)
  ORDER BY random()
  LIMIT 100
)
INSERT INTO messages (match_id, sender_id, content, created_at)
SELECT match_id, sender_id, message_content, created_at
FROM sample_messages;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_experience ON profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active_at);
CREATE INDEX IF NOT EXISTS idx_swipes_created_at ON swipes(created_at);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at);

-- Display summary of created data
SELECT 
  'Mock Data Creation Summary' as summary,
  (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - interval '1 hour') as new_profiles,
  (SELECT COUNT(*) FROM swipes WHERE created_at > NOW() - interval '1 hour') as new_swipes,
  (SELECT COUNT(*) FROM matches WHERE created_at > NOW() - interval '1 hour') as new_matches,
  (SELECT COUNT(*) FROM messages WHERE created_at > NOW() - interval '1 hour') as new_messages;