-- Neon-compatible migration for DJ Elite app
-- Extracted from Supabase dump

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS genres_id_seq AS integer START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS skills_id_seq AS integer START WITH 1 INCREMENT BY 1;

-- Create tables
CREATE TABLE IF NOT EXISTS genres (
    id integer NOT NULL DEFAULT nextval('genres_id_seq'::regclass),
    name text NOT NULL,
    CONSTRAINT genres_pkey PRIMARY KEY (id),
    CONSTRAINT genres_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS skills (
    id integer NOT NULL DEFAULT nextval('skills_id_seq'::regclass),
    name text NOT NULL,
    CONSTRAINT skills_pkey PRIMARY KEY (id),
    CONSTRAINT skills_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    dj_name text NOT NULL,
    bio text,
    age integer,
    location text,
    experience_level text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    profile_image_url text,
    genres text[],
    skills text[],
    venues text[],
    fee text,
    images text[],
    website text,
    social_links jsonb DEFAULT '{}'::jsonb,
    equipment text[] DEFAULT '{}'::text[],
    achievements text[] DEFAULT '{}'::text[],
    portfolio_tracks text[] DEFAULT '{}'::text[],
    contact_info jsonb DEFAULT '{}'::jsonb,
    premium_badge boolean DEFAULT false,
    referral_code text,
    referred_by_code text,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_user_id_key UNIQUE (user_id),
    CONSTRAINT profiles_experience_level_check CHECK ((experience_level = ANY (ARRAY['Beginner'::text, 'Intermediate'::text, 'Advanced'::text, 'Professional'::text])))
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    plan text DEFAULT 'free'::text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    stripe_subscription_id text,
    current_period_start timestamp with time zone DEFAULT now(),
    current_period_end timestamp with time zone DEFAULT (now() + '1 mon'::interval),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
    CONSTRAINT subscriptions_user_id_key UNIQUE (user_id),
    CONSTRAINT subscriptions_plan_check CHECK ((plan = ANY (ARRAY['free'::text, 'pro'::text, 'elite'::text]))),
    CONSTRAINT subscriptions_status_check CHECK ((status = ANY (ARRAY['active'::text, 'cancelled'::text, 'expired'::text])))
);

CREATE TABLE IF NOT EXISTS swipes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    swiper_id uuid,
    swiped_id uuid,
    direction text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT swipes_pkey PRIMARY KEY (id),
    CONSTRAINT swipes_direction_check CHECK ((direction = ANY (ARRAY['left'::text, 'right'::text, 'super'::text])))
);

CREATE TABLE IF NOT EXISTS matches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile1_id uuid,
    profile2_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT matches_pkey PRIMARY KEY (id),
    CONSTRAINT matches_profile1_id_profile2_id_key UNIQUE (profile1_id, profile2_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    match_id uuid,
    sender_id uuid,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    read_at timestamp with time zone,
    message_type character varying(20) DEFAULT 'text'::character varying,
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_message_type_check CHECK (((message_type)::text = ANY ((ARRAY['text'::character varying, 'image'::character varying, 'audio'::character varying])::text[])))
);

CREATE TABLE IF NOT EXISTS gigs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    venue text NOT NULL,
    location text NOT NULL,
    date date NOT NULL,
    duration integer NOT NULL,
    budget numeric(10,2) NOT NULL,
    status text DEFAULT 'open'::text,
    selected_dj_id uuid,
    booking_fee numeric(10,2) DEFAULT 0,
    referrer_commission numeric(10,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    event_type text NOT NULL,
    requirements jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT gigs_pkey PRIMARY KEY (id),
    CONSTRAINT gigs_budget_check CHECK ((budget >= (0)::numeric)),
    CONSTRAINT gigs_event_type_check CHECK ((event_type = ANY (ARRAY['wedding'::text, 'corporate'::text, 'birthday'::text, 'club'::text, 'concert'::text, 'festival'::text, 'private'::text]))),
    CONSTRAINT gigs_status_check CHECK ((status = ANY (ARRAY['open'::text, 'bidding'::text, 'awarded'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text])))
);

CREATE TABLE IF NOT EXISTS gig_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    gig_id uuid NOT NULL,
    dj_id uuid NOT NULL,
    proposed_fee numeric(10,2) NOT NULL,
    message text,
    status text DEFAULT 'pending'::text,
    dj_referred_by uuid,
    gig_referred_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    rating integer,
    rating_comment text,
    CONSTRAINT gig_applications_pkey PRIMARY KEY (id),
    CONSTRAINT gig_applications_gig_id_dj_id_key UNIQUE (gig_id, dj_id),
    CONSTRAINT gig_applications_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'shortlisted'::text, 'selected'::text, 'rejected'::text])))
);

CREATE TABLE IF NOT EXISTS referrals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    referrer_id uuid NOT NULL,
    referred_email text NOT NULL,
    referred_user_id uuid,
    status text DEFAULT 'pending'::text,
    referral_code text NOT NULL,
    personal_message text,
    created_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    CONSTRAINT referrals_pkey PRIMARY KEY (id),
    CONSTRAINT referrals_referred_email_key UNIQUE (referred_email),
    CONSTRAINT referrals_unique_referrer_email UNIQUE (referrer_id, referred_email),
    CONSTRAINT referrals_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'expired'::text])))
);

CREATE TABLE IF NOT EXISTS referral_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    reward_type text NOT NULL,
    reward_amount integer NOT NULL,
    description text NOT NULL,
    earned_at timestamp with time zone DEFAULT now(),
    claimed boolean DEFAULT false,
    claimed_at timestamp with time zone,
    CONSTRAINT referral_rewards_pkey PRIMARY KEY (id),
    CONSTRAINT referral_rewards_user_id_reward_type_earned_at_key UNIQUE (user_id, reward_type, earned_at),
    CONSTRAINT referral_rewards_reward_type_check CHECK ((reward_type = ANY (ARRAY['premium_days'::text, 'super_likes'::text, 'boosts'::text])))
);

CREATE TABLE IF NOT EXISTS notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    super_likes_bonus integer DEFAULT 0,
    boost_credits integer DEFAULT 0,
    referral_earnings numeric(10,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_stats_pkey PRIMARY KEY (id),
    CONSTRAINT user_stats_user_id_key UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    first_name text,
    subscribed_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true,
    CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id),
    CONSTRAINT newsletter_subscribers_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS career_accelerator_leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    first_name text,
    subscribed_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true,
    lead_source text DEFAULT 'career_accelerator_funnel'::text,
    CONSTRAINT career_accelerator_leads_pkey PRIMARY KEY (id),
    CONSTRAINT career_accelerator_leads_email_key UNIQUE (email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped ON swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile1 ON matches(profile1_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile2 ON matches(profile2_id);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_gigs_client ON gigs(client_id);
CREATE INDEX IF NOT EXISTS idx_gigs_status ON gigs(status);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- Insert sample data
INSERT INTO genres (name) VALUES 
('House'), ('Techno'), ('Hip Hop'), ('Pop'), ('Rock'), ('Electronic'), ('Jazz'), ('Reggae')
ON CONFLICT (name) DO NOTHING;

INSERT INTO skills (name) VALUES 
('Mixing'), ('Scratching'), ('Beat Matching'), ('Live Remixing'), ('MC Skills'), ('Lighting'), ('Sound Engineering')
ON CONFLICT (name) DO NOTHING;