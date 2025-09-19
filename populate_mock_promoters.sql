-- DJ Elite Platform - Mock Promoters Population Script
-- Run this in Supabase SQL Editor to create 200 realistic promoter profiles and events

-- First, ensure we have the necessary tables for promoters and events
DO $$ 
BEGIN
    -- Create promoters table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'promoters') THEN
        CREATE TABLE promoters (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            company_name TEXT NOT NULL,
            contact_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            bio TEXT,
            location TEXT,
            website TEXT,
            social_links JSONB,
            venue_types TEXT[],
            preferred_genres TEXT[],
            budget_range TEXT,
            profile_image_url TEXT,
            is_verified BOOLEAN DEFAULT false,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id)
        );
        
        -- Enable RLS
        ALTER TABLE promoters ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "Anyone can view active promoters" ON promoters FOR SELECT USING (is_active = true);
        CREATE POLICY "Promoters can manage their own profile" ON promoters FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Ensure events table exists with proper structure
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
        CREATE TABLE events (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            promoter_id UUID REFERENCES promoters(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            venue TEXT NOT NULL,
            address TEXT,
            date DATE NOT NULL,
            time TIME NOT NULL,
            duration_hours INTEGER DEFAULT 4,
            budget DECIMAL(10,2),
            genres TEXT[],
            requirements TEXT,
            status TEXT CHECK (status IN ('draft', 'published', 'cancelled', 'completed')) DEFAULT 'published',
            applications JSONB DEFAULT '[]'::jsonb,
            selected_dj_id UUID,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE events ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "Anyone can view published events" ON events FOR SELECT USING (status = 'published');
        CREATE POLICY "Promoters can manage their own events" ON events FOR ALL USING (
            promoter_id IN (SELECT id FROM promoters WHERE user_id = auth.uid())
        );
    END IF;
END $$;

-- Create mock promoter data
WITH mock_promoters AS (
  SELECT 
    gen_random_uuid() as user_id,
    company_names.name as company_name,
    contact_names.name as contact_name,
    LOWER(REPLACE(contact_names.name, ' ', '.')) || '@' || domains.domain as email,
    phone_numbers.phone,
    bios.bio,
    locations.location,
    websites.website,
    social_links.links,
    venue_types.types,
    genres.genre_list,
    budget_ranges.range,
    images.image_url,
    (random() < 0.3) as is_verified  -- 30% are verified
  FROM 
    (VALUES 
      ('Elite Events Co'), ('Nightlife Productions'), ('Bass Drop Entertainment'), ('Rhythm & Soul Events'),
      ('Underground Collective'), ('Festival Vibes LLC'), ('Club Circuit'), ('Beat Street Productions'),
      ('Sonic Boom Events'), ('Pulse Entertainment'), ('Groove Masters'), ('Electric Nights'),
      ('Sound Wave Productions'), ('Party Central'), ('Music Mania Events'), ('DJ Booking Agency'),
      ('Venue Masters'), ('Event Horizon'), ('Nightclub Network'), ('Festival First'),
      ('Club Connections'), ('Beat Bureau'), ('Sound Solutions'), ('Party Planners Pro'),
      ('Music Event Management'), ('Nightlife Network'), ('Entertainment Express'), ('Event Elite'),
      ('Club Culture'), ('Festival Force'), ('Beat Box Events'), ('Sound Stage Productions'),
      ('Party Perfect'), ('Music Makers'), ('Event Excellence'), ('Club Collective'),
      ('Festival Focus'), ('Beat Boutique'), ('Sound Sphere'), ('Party Professionals'),
      ('Music Motion'), ('Event Empire'), ('Club Central'), ('Festival Fusion'),
      ('Beat Business'), ('Sound Studio'), ('Party Plus'), ('Music Management'),
      ('Event Energy'), ('Club Command'), ('Festival Flow'), ('Beat Base'),
      ('Sound Source'), ('Party Power'), ('Music Momentum'), ('Event Evolution'),
      ('Club Core'), ('Festival Fire'), ('Beat Blast'), ('Sound System'),
      ('Party Pulse'), ('Music Magic'), ('Event Elevation'), ('Club Catalyst'),
      ('Festival Frequency'), ('Beat Boom'), ('Sound Surge'), ('Party Peak'),
      ('Music Matrix'), ('Event Essence'), ('Club Concept'), ('Festival Flux'),
      ('Beat Bridge'), ('Sound Spectrum'), ('Party Pinnacle'), ('Music Mastery'),
      ('Event Epicenter'), ('Club Craft'), ('Festival Foundation'), ('Beat Build'),
      ('Sound Structure'), ('Party Platform'), ('Music Milestone'), ('Event Expertise'),
      ('Club Creation'), ('Festival Framework'), ('Beat Blueprint'), ('Sound Strategy'),
      ('Party Pathway'), ('Music Method'), ('Event Engineering'), ('Club Construction'),
      ('Festival Formation'), ('Beat Building'), ('Sound Synthesis'), ('Party Process'),
      ('Music Mechanism'), ('Event Execution'), ('Club Coordination'), ('Festival Facilitation'),
      ('Beat Breakthrough'), ('Sound Solution'), ('Party Production'), ('Music Manufacturing'),
      ('Event Establishment'), ('Club Cultivation'), ('Festival Fabrication'), ('Beat Development'),
      ('Sound Service'), ('Party Provision'), ('Music Methodology'), ('Event Enterprise'),
      ('Club Corporation'), ('Festival Firm'), ('Beat Business'), ('Sound Service'),
      ('Party Partnership'), ('Music Marketplace'), ('Event Organization'), ('Club Company'),
      ('Festival Foundation'), ('Beat Bureau'), ('Sound Service'), ('Party Provider'),
      ('Music Merchant'), ('Event Establishment'), ('Club Collective'), ('Festival Facility'),
      ('Beat Base'), ('Sound Station'), ('Party Place'), ('Music Marketplace'),
      ('Event Exchange'), ('Club Center'), ('Festival Forum'), ('Beat Bazaar'),
      ('Sound Shop'), ('Party Plaza'), ('Music Mall'), ('Event Emporium'),
      ('Club Commerce'), ('Festival Fair'), ('Beat Boutique'), ('Sound Store'),
      ('Party Point'), ('Music Market'), ('Event Outlet'), ('Club Corner'),
      ('Festival Facility'), ('Beat Building'), ('Sound Space'), ('Party Place'),
      ('Music Venue'), ('Event Estate'), ('Club Campus'), ('Festival Field'),
      ('Beat Block'), ('Sound Site'), ('Party Premises'), ('Music Manor'),
      ('Event Environment'), ('Club Complex'), ('Festival Facility'), ('Beat Base'),
      ('Sound Sanctuary'), ('Party Palace'), ('Music Mansion'), ('Event Estate'),
      ('Club Castle'), ('Festival Fort'), ('Beat Building'), ('Sound Structure'),
      ('Party Pavilion'), ('Music Monument'), ('Event Edifice'), ('Club Citadel'),
      ('Festival Fortress'), ('Beat Bastion'), ('Sound Stronghold'), ('Party Palace'),
      ('Music Metropolis'), ('Event Empire'), ('Club Kingdom'), ('Festival Federation'),
      ('Beat Borough'), ('Sound State'), ('Party Province'), ('Music Municipality'),
      ('Event Entity'), ('Club Community'), ('Festival Fellowship'), ('Beat Brotherhood'),
      ('Sound Society'), ('Party Partnership'), ('Music Movement'), ('Event Alliance'),
      ('Club Coalition'), ('Festival Federation'), ('Beat Band'), ('Sound Squad'),
      ('Party Pack'), ('Music Mob'), ('Event Ensemble'), ('Club Crew'),
      ('Festival Family'), ('Beat Bunch'), ('Sound Set'), ('Party Posse'),
      ('Music Mass'), ('Event Assembly'), ('Club Circle'), ('Festival Faction'),
      ('Beat Batch'), ('Sound Section'), ('Party Party'), ('Music Multitude'),
      ('Event Aggregate'), ('Club Cluster'), ('Festival Flock'), ('Beat Bundle'),
      ('Sound Selection'), ('Party Population'), ('Music Mass'), ('Event Array')
    ) as company_names(name),
    (VALUES 
      ('Alex Johnson'), ('Sarah Williams'), ('Mike Davis'), ('Emma Wilson'), ('Chris Brown'),
      ('Jessica Garcia'), ('David Miller'), ('Ashley Rodriguez'), ('James Martinez'), ('Amanda Anderson'),
      ('Ryan Taylor'), ('Nicole Thomas'), ('Kevin Jackson'), ('Stephanie White'), ('Brandon Harris'),
      ('Michelle Martin'), ('Tyler Thompson'), ('Lauren Garcia'), ('Justin Martinez'), ('Samantha Robinson'),
      ('Andrew Clark'), ('Brittany Lewis'), ('Nicholas Lee'), ('Danielle Walker'), ('Jonathan Hall'),
      ('Megan Allen'), ('Matthew Young'), ('Kimberly Hernandez'), ('Daniel King'), ('Rachel Wright'),
      ('Anthony Lopez'), ('Heather Hill'), ('Mark Scott'), ('Jennifer Green'), ('Steven Adams'),
      ('Lisa Baker'), ('Paul Gonzalez'), ('Maria Nelson'), ('Robert Carter'), ('Karen Mitchell'),
      ('Charles Perez'), ('Susan Roberts'), ('Joseph Turner'), ('Nancy Phillips'), ('Thomas Campbell'),
      ('Betty Parker'), ('Christopher Evans'), ('Helen Edwards'), ('Matthew Collins'), ('Sandra Stewart'),
      ('Anthony Sanchez'), ('Donna Morris'), ('Mark Rogers'), ('Carol Reed'), ('Steven Cook'),
      ('Ruth Bailey'), ('Paul Rivera'), ('Sharon Cooper'), ('Kenneth Richardson'), ('Michelle Cox'),
      ('Joshua Howard'), ('Kimberly Ward'), ('Kevin Torres'), ('Amy Peterson'), ('Brian Gray'),
      ('Angela Ramirez'), ('George James'), ('Shirley Watson'), ('Ronald Brooks'), ('Cynthia Kelly'),
      ('Jason Sanders'), ('Kathleen Price'), ('Edward Bennett'), ('Amy Wood'), ('Ryan Barnes'),
      ('Marie Ross'), ('Gary Henderson'), ('Janet Coleman'), ('Nicholas Jenkins'), ('Catherine Perry'),
      ('Eric Powell'), ('Frances Long'), ('Stephen Patterson'), ('Christine Hughes'), ('Andrew Flores'),
      ('Samantha Washington'), ('Gregory Butler'), ('Deborah Simmons'), ('Raymond Foster'), ('Rachel Gonzales'),
      ('Jack Bryant'), ('Carolyn Alexander'), ('Patrick Russell'), ('Martha Griffin'), ('Dennis Diaz'),
      ('Maria Hayes'), ('Jerry Myers'), ('Julie Ford'), ('Tyler Hamilton'), ('Joan Graham'),
      ('Aaron Sullivan'), ('Lisa Wallace'), ('Jose Woods'), ('Gloria Cole'), ('Henry West'),
      ('Theresa Jordan'), ('Douglas Owens'), ('Sara Reynolds'), ('Nathan Fisher'), ('Janice Ellis'),
      ('Peter Harrison'), ('Kelly Gibson'), ('Carl Mcdonald'), ('Beverly Cruz'), ('Arthur Marshall'),
      ('Denise Ortiz'), ('Willie Gomez'), ('Cheryl Murray'), ('Wayne Freeman'), ('Marilyn Wells'),
      ('Ralph Webb'), ('Judith Simpson'), ('Roy Stevens'), ('Evelyn Tucker'), ('Eugene Porter'),
      ('Irene Hunter'), ('Louis Hicks'), ('Tina Crawford'), ('Philip Henry'), ('Jacqueline Boyd'),
      ('Harold Mason'), ('Gloria Morales'), ('Roger Kennedy'), ('Teresa Warren'), ('Albert Dixon'),
      ('Sara Ramos'), ('Arthur Reeves'), ('Janice Coleman'), ('Joe Burns'), ('Katherine Gordon'),
      ('Lawrence Mendoza'), ('Ann Contreras'), ('Jesse Silva'), ('Diane Franklin'), ('Ernest Wright'),
      ('Julie Castro'), ('Danny Medina'), ('Kathryn Ortega'), ('Gerald Valdez'), ('Christina Castillo'),
      ('Harold Soto'), ('Lori Dominguez'), ('Carl Santos'), ('Tammy Espinoza'), ('Arthur Petersen'),
      ('Julie Carlson'), ('Jesse Aguilar'), ('Diane Vega'), ('Ernest Ramsey'), ('Christina Cohen'),
      ('Harold Cobb'), ('Lori Hunter'), ('Carl Bates'), ('Tammy Lloyd'), ('Arthur Mack'),
      ('Julie Stone'), ('Jesse Lamb'), ('Diane Barker'), ('Ernest Newman'), ('Christina Harmon'),
      ('Harold Harrington'), ('Lori Curry'), ('Carl Powers'), ('Tammy Marsh'), ('Arthur Savage'),
      ('Julie Holland'), ('Jesse Holmes'), ('Diane Brady'), ('Ernest Mcdaniel'), ('Christina Conner'),
      ('Harold Spears'), ('Lori Mcguire'), ('Carl Deleon'), ('Tammy Delacruz'), ('Arthur Stanton'),
      ('Julie Clements'), ('Jesse Collier'), ('Diane Franco'), ('Ernest Nieves'), ('Christina Donovan'),
      ('Harold Cannon'), ('Lori Barrera'), ('Carl Blackwell'), ('Tammy Estrada'), ('Arthur Contreras'),
      ('Julie Horne'), ('Jesse Livingston'), ('Diane Morse'), ('Ernest Burnett'), ('Christina Bush'),
      ('Harold Dunn'), ('Lori Reese'), ('Carl Klein'), ('Tammy Braun'), ('Arthur Beasley'),
      ('Julie Winters'), ('Jesse Shelton'), ('Diane Bolton'), ('Ernest Middleton'), ('Christina Pruitt'),
      ('Harold Malone'), ('Lori Lyons'), ('Carl Odom'), ('Tammy Mcfarland'), ('Arthur Benton'),
      ('Julie Mcbride'), ('Jesse Lamb'), ('Diane Barker'), ('Ernest Newman'), ('Christina Harmon')
    ) as contact_names(name),
    (VALUES 
      ('gmail.com'), ('outlook.com'), ('yahoo.com'), ('hotmail.com'), ('icloud.com'),
      ('protonmail.com'), ('aol.com'), ('live.com'), ('msn.com'), ('mail.com')
    ) as domains(domain),
    (VALUES 
      ('+1-555-0101'), ('+1-555-0102'), ('+1-555-0103'), ('+1-555-0104'), ('+1-555-0105'),
      ('+1-555-0106'), ('+1-555-0107'), ('+1-555-0108'), ('+1-555-0109'), ('+1-555-0110'),
      ('+44-20-7946-0958'), ('+44-20-7946-0959'), ('+44-20-7946-0960'), ('+49-30-12345678'),
      ('+33-1-42-86-83-26'), ('+31-20-794-7047'), ('+34-91-123-4567'), ('+39-06-1234-5678'),
      ('+420-2-1234-5678'), ('+43-1-234-5678'), ('+46-8-123-456-78'), ('+45-32-12-34-56'),
      ('+47-22-12-34-56'), ('+358-9-1234-567'), ('+354-581-2345'), ('+353-1-234-5678'),
      ('+81-3-1234-5678'), ('+82-2-1234-5678'), ('+66-2-123-4567'), ('+65-6123-4567'),
      ('+852-2123-4567'), ('+61-2-1234-5678'), ('+1-416-123-4567'), ('+52-55-1234-5678'),
      ('+55-11-1234-5678'), ('+54-11-1234-5678'), ('+56-2-1234-5678'), ('+51-1-234-5678'),
      ('+57-1-234-5678'), ('+58-212-123-4567'), ('+593-2-234-5678'), ('+591-2-234-5678')
    ) as phone_numbers(phone),
    (VALUES 
      ('Premier event production company specializing in electronic music events. We work with top venues and artists to create unforgettable experiences.'),
      ('Boutique event agency focused on underground and alternative music scenes. We pride ourselves on discovering new talent and creating intimate experiences.'),
      ('Full-service entertainment company with 10+ years experience in nightlife and festival production. We handle everything from booking to production.'),
      ('Innovative event collective pushing the boundaries of live music experiences. We specialize in immersive events and cutting-edge production.'),
      ('Professional event management company with a network of premium venues. We focus on high-quality events and exceptional artist treatment.'),
      ('Creative event production house specializing in unique venue experiences. From rooftops to warehouses, we transform spaces into musical journeys.'),
      ('Established nightlife brand with residencies at top clubs worldwide. We''re always looking for fresh talent to join our roster.'),
      ('Festival production company creating multi-day experiences. We work with emerging and established artists to curate diverse lineups.'),
      ('Corporate event specialists bringing professional entertainment to business functions. We understand the balance between energy and professionalism.'),
      ('Community-focused event organizers supporting local music scenes. We believe in giving back and nurturing emerging talent.'),
      ('Luxury event production for high-end clientele. We create exclusive experiences with attention to every detail.'),
      ('Mobile event services bringing the party anywhere. From private parties to corporate events, we have the equipment and expertise.'),
      ('Venue management company operating multiple locations. We''re always seeking resident DJs and regular performers.'),
      ('Music festival organizers with a passion for electronic music. We create immersive experiences that celebrate music and community.'),
      ('Event marketing and production agency. We handle promotion, booking, and production for venues and independent events.'),
      ('Nightclub chain with locations across major cities. We''re expanding our DJ roster and looking for versatile performers.'),
      ('Boutique wedding and private event company. We specialize in creating personalized musical experiences for special occasions.'),
      ('Concert promotion company working with venues of all sizes. From intimate clubs to large arenas, we book diverse musical acts.'),
      ('Event technology company providing sound, lighting, and production services. We work with promoters to enhance their events.'),
      ('Music industry collective connecting artists with opportunities. We focus on building long-term relationships and career development.')
    ) as bios(bio),
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
      ('Toronto, Canada'), ('Vancouver, Canada'), ('Montreal, Canada'), ('Calgary, Canada'), ('Ottawa, Canada')
    ) as locations(location),
    (VALUES 
      ('https://eliteevents.com'), ('https://nightlifeproductions.com'), ('https://bassdropent.com'),
      ('https://rhythmandsoul.events'), ('https://undergroundcollective.net'), ('https://festivalvibes.com'),
      ('https://clubcircuit.co'), ('https://beatstreetprod.com'), ('https://sonicboomevents.com'),
      ('https://pulseentertainment.net'), ('https://groovemasters.events'), ('https://electricnights.com')
    ) as websites(website),
    (VALUES 
      ('{"instagram": "@eliteevents", "twitter": "@eliteevents", "facebook": "EliteEventsOfficial"}'),
      ('{"instagram": "@nightlifeproductions", "twitter": "@nightlifeprod", "facebook": "NightlifeProductions"}'),
      ('{"instagram": "@bassdropent", "twitter": "@bassdropent", "facebook": "BassDropEntertainment"}'),
      ('{"instagram": "@rhythmandsoul", "twitter": "@rhythmandsoul", "facebook": "RhythmAndSoulEvents"}'),
      ('{"instagram": "@undergroundcollective", "twitter": "@undergroundcoll", "facebook": "UndergroundCollective"}'),
      ('{"instagram": "@festivalvibes", "twitter": "@festivalvibes", "facebook": "FestivalVibesLLC"}')
    ) as social_links(links),
    (VALUES 
      (ARRAY['Nightclubs', 'Rooftop Venues']),
      (ARRAY['Warehouses', 'Underground Spaces']),
      (ARRAY['Festivals', 'Outdoor Venues']),
      (ARRAY['Hotels', 'Corporate Spaces']),
      (ARRAY['Beach Clubs', 'Resort Venues']),
      (ARRAY['Concert Halls', 'Theaters']),
      (ARRAY['Private Venues', 'Exclusive Locations']),
      (ARRAY['Pop-up Spaces', 'Unique Venues']),
      (ARRAY['Wedding Venues', 'Event Halls']),
      (ARRAY['Bars', 'Lounges'])
    ) as venue_types(types),
    (VALUES 
      (ARRAY['House', 'Deep House', 'Tech House']),
      (ARRAY['Techno', 'Minimal', 'Industrial']),
      (ARRAY['Trance', 'Progressive', 'Psytrance']),
      (ARRAY['Hip Hop', 'R&B', 'Trap']),
      (ARRAY['Electronic', 'Dubstep', 'Bass']),
      (ARRAY['Pop', 'Top 40', 'Commercial']),
      (ARRAY['Rock', 'Alternative', 'Indie']),
      (ARRAY['Drum & Bass', 'Jungle', 'Breakbeat']),
      (ARRAY['Hardstyle', 'Hardcore', 'Gabber']),
      (ARRAY['Ambient', 'Downtempo', 'Chillout'])
    ) as genres(genre_list),
    (VALUES 
      ('$500-$2,000'), ('$1,000-$5,000'), ('$2,000-$10,000'), ('$5,000-$20,000'), ('$10,000+'),
      ('$200-$1,000'), ('$300-$1,500'), ('$750-$3,000'), ('$1,500-$7,500'), ('Negotiable')
    ) as budget_ranges(range),
    (VALUES 
      ('https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop'),
      ('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop'),
      ('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'),
      ('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'),
      ('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop'),
      ('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop'),
      ('https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=400&fit=crop'),
      ('https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop'),
      ('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop'),
      ('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=400&fit=crop')
    ) as images(image_url)
  ORDER BY random()
  LIMIT 200
)
INSERT INTO promoters (
  user_id,
  company_name,
  contact_name,
  email,
  phone,
  bio,
  location,
  website,
  social_links,
  venue_types,
  preferred_genres,
  budget_range,
  profile_image_url,
  is_verified,
  is_active,
  created_at,
  updated_at
)
SELECT 
  user_id,
  company_name,
  contact_name,
  email,
  phone,
  bio,
  location,
  website,
  links::jsonb,
  types,
  genre_list,
  range,
  image_url,
  is_verified,
  true,
  NOW() - (random() * interval '60 days'),
  NOW() - (random() * interval '7 days')
FROM mock_promoters;

-- Create events for the promoters
WITH event_data AS (
  SELECT 
    p.id as promoter_id,
    event_titles.title,
    event_descriptions.description,
    venues.venue,
    addresses.address,
    (CURRENT_DATE + (random() * 90)::int) as event_date,
    (TIME '18:00:00' + (random() * interval '6 hours')) as event_time,
    (2 + (random() * 8)::int) as duration_hours,
    budgets.budget,
    p.preferred_genres as genres,
    requirements.requirement
  FROM promoters p
  CROSS JOIN (VALUES 
    ('Saturday Night Fever'), ('Underground Sessions'), ('Rooftop Vibes'), ('Warehouse Party'),
    ('Summer Festival'), ('Beach Club Night'), ('Corporate Mixer'), ('Private Celebration'),
    ('New Year Bash'), ('Halloween Rave'), ('Spring Break Party'), ('Graduation Celebration'),
    ('Product Launch Event'), ('Charity Fundraiser'), ('Art Gallery Opening'), ('Fashion Show After-party'),
    ('Tech Conference Mixer'), ('Wedding Reception'), ('Birthday Celebration'), ('Anniversary Party'),
    ('Holiday Party'), ('Networking Event'), ('Album Release Party'), ('Club Opening'),
    ('Festival After-party'), ('VIP Experience'), ('Exclusive Showcase'), ('Industry Mixer'),
    ('Sunset Sessions'), ('Late Night Sessions'), ('Early Bird Special'), ('Midweek Madness'),
    ('Weekend Warriors'), ('Monthly Residency'), ('Special Guest Night'), ('Local Talent Showcase'),
    ('International DJ Night'), ('Genre Spotlight'), ('Throwback Thursday'), ('Future Sounds'),
    ('Deep House Journey'), ('Techno Underground'), ('Trance Nation'), ('Hip Hop Classics'),
    ('Electronic Fusion'), ('Pop Perfection'), ('Rock Revival'), ('Bass Drop'),
    ('Hardstyle Heaven'), ('Ambient Atmosphere'), ('Progressive Paradise'), ('Minimal Movement')
  ) as event_titles(title),
  (VALUES 
    ('Join us for an unforgettable night of music and dancing. Premium sound system and lighting guaranteed.'),
    ('Intimate venue, incredible atmosphere. Looking for a DJ who can read the crowd and keep the energy high.'),
    ('High-energy event with diverse crowd. Need a versatile DJ comfortable with multiple genres.'),
    ('Exclusive event for VIP guests. Seeking professional DJ with experience in upscale venues.'),
    ('All-night celebration requiring stamina and skill. Perfect opportunity for experienced performers.'),
    ('Daytime event with relaxed atmosphere. Looking for DJ who can create the perfect ambient vibe.'),
    ('Corporate function requiring professional presentation and appropriate music selection.'),
    ('Private celebration with specific music requests. Flexibility and client service essential.'),
    ('Large venue with state-of-the-art equipment. Opportunity to showcase skills to big audience.'),
    ('Underground venue with discerning crowd. Seeking DJ with deep knowledge of electronic music.')
  ) as event_descriptions(description),
  (VALUES 
    ('The Grand Ballroom'), ('Warehouse District'), ('Rooftop Terrace'), ('Beach Club Paradise'),
    ('Underground Vault'), ('Sky Lounge'), ('Garden Pavilion'), ('Industrial Space'),
    ('Luxury Hotel'), ('Private Residence'), ('Art Gallery'), ('Concert Hall'),
    ('Nightclub Main Room'), ('VIP Lounge'), ('Outdoor Stage'), ('Corporate Center'),
    ('Wedding Venue'), ('Community Center'), ('University Campus'), ('Resort Ballroom')
  ) as venues(venue),
  (VALUES 
    ('123 Main Street, Downtown'), ('456 Industrial Blvd, Warehouse District'), ('789 Rooftop Ave, Midtown'),
    ('321 Beach Road, Waterfront'), ('654 Underground St, Arts District'), ('987 Sky Lane, Financial District'),
    ('147 Garden Way, Suburbs'), ('258 Factory St, Industrial Zone'), ('369 Luxury Blvd, Uptown'),
    ('741 Private Dr, Residential'), ('852 Gallery St, Arts Quarter'), ('963 Concert Ave, Entertainment District')
  ) as addresses(address),
  (VALUES 
    (500.00), (750.00), (1000.00), (1500.00), (2000.00), (2500.00), (3000.00), (4000.00), (5000.00), (7500.00)
  ) as budgets(budget),
  (VALUES 
    ('Professional sound system required. Must bring own equipment.'),
    ('Venue provides basic setup. DJ to bring additional equipment as needed.'),
    ('Full production support available. Focus on performance and crowd engagement.'),
    ('Intimate setting requires appropriate volume levels and music selection.'),
    ('High-energy crowd expected. Ability to read and respond to audience essential.'),
    ('Mixed age group attending. Versatility in music selection important.'),
    ('Corporate environment requires clean versions and appropriate content.'),
    ('Special requests may be made during event. Flexibility appreciated.'),
    ('Long set time requires stamina and extensive music library.'),
    ('Unique venue acoustics. Experience with challenging spaces preferred.')
  ) as requirements(requirement)
  WHERE random() < 0.6  -- Each promoter has 60% chance of having an event
  ORDER BY random()
  LIMIT 300  -- Create up to 300 events
)
INSERT INTO events (
  promoter_id,
  title,
  description,
  venue,
  address,
  date,
  time,
  duration_hours,
  budget,
  genres,
  requirements,
  status,
  created_at,
  updated_at
)
SELECT 
  promoter_id,
  title,
  description,
  venue,
  address,
  event_date,
  event_time,
  duration_hours,
  budget,
  genres,
  requirement,
  CASE 
    WHEN random() < 0.8 THEN 'published'
    WHEN random() < 0.95 THEN 'draft'
    ELSE 'cancelled'
  END as status,
  NOW() - (random() * interval '30 days'),
  NOW() - (random() * interval '7 days')
FROM event_data;

-- Create some applications for events (simulate DJ interest)
WITH event_applications AS (
  SELECT 
    e.id as event_id,
    p.id as dj_profile_id,
    p.dj_name,
    p.bio,
    p.experience_level,
    p.fee,
    NOW() - (random() * interval '14 days') as applied_at
  FROM events e
  CROSS JOIN profiles p
  WHERE random() < 0.1  -- 10% chance of application
    AND e.status = 'published'
    AND e.date > CURRENT_DATE
  ORDER BY random()
  LIMIT 500
)
UPDATE events 
SET applications = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'dj_id', dj_profile_id,
      'dj_name', dj_name,
      'bio', bio,
      'experience_level', experience_level,
      'fee', fee,
      'applied_at', applied_at,
      'status', 'pending'
    )
  )
  FROM event_applications 
  WHERE event_applications.event_id = events.id
)
WHERE id IN (SELECT DISTINCT event_id FROM event_applications);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_promoters_location ON promoters(location);
CREATE INDEX IF NOT EXISTS idx_promoters_verified ON promoters(is_verified);
CREATE INDEX IF NOT EXISTS idx_promoters_active ON promoters(is_active);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_promoter ON events(promoter_id);
CREATE INDEX IF NOT EXISTS idx_events_budget ON events(budget);

-- Display summary of created data
SELECT 
  'Mock Promoter Data Summary' as summary,
  (SELECT COUNT(*) FROM promoters WHERE created_at > NOW() - interval '1 hour') as new_promoters,
  (SELECT COUNT(*) FROM events WHERE created_at > NOW() - interval '1 hour') as new_events,
  (SELECT COUNT(*) FROM events WHERE status = 'published' AND date > CURRENT_DATE) as upcoming_events,
  (SELECT COUNT(*) FROM events WHERE applications IS NOT NULL AND jsonb_array_length(applications) > 0) as events_with_applications;