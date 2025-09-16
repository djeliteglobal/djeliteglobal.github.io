-- 🎤 DJ ELITE GIG MARKETPLACE & COMMISSION SYSTEM
-- Creates revenue-generating gig marketplace with dual referral commissions

-- ===============================
-- GIG MARKETPLACE TABLES
-- ===============================

-- Gig postings table
CREATE TABLE IF NOT EXISTS gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  venue TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  duration INTEGER NOT NULL, -- hours
  budget DECIMAL(10,2) NOT NULL CHECK (budget >= 0),
  status TEXT CHECK (status IN ('open', 'bidding', 'awarded', 'confirmed', 'completed', 'cancelled')) DEFAULT 'open',
  selected_dj_id UUID REFERENCES auth.users(id),
  booking_fee DECIMAL(10,2) DEFAULT 0, -- 10% platform fee
  referrer_commission DECIMAL(10,2) DEFAULT 0, -- 5% commission for gig referrers
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  event_type TEXT CHECK (event_type IN ('wedding', 'corporate', 'birthday', 'club', 'concert', 'festival', 'private')) NOT NULL,
  requirements JSONB DEFAULT '{}' -- Genre, experience, equipment requirements
);

-- DJ applications for gigs
CREATE TABLE IF NOT EXISTS gig_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES gigs(id),
  dj_id UUID NOT NULL REFERENCES auth.users(id),
  proposed_fee DECIMAL(10,2) NOT NULL,
  message TEXT,
  status TEXT CHECK (status IN ('pending', 'shortlisted', 'selected', 'rejected')) DEFAULT 'pending',
  dj_referred_by UUID REFERENCES auth.users(id), -- Who referred this DJ to platform
  gig_referred_by UUID REFERENCES auth.users(id), -- Who recommended this DJ for this gig
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gig_id, dj_id), -- One application per DJ per gig
  rating INTEGER, -- Client rating after completion
  rating_comment TEXT -- Client feedback
);

-- Payment records for gig commissions
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES gigs(id),
  sender_id UUID REFERENCES auth.users(id), -- Client paying
  recipient_id UUID REFERENCES auth.users(id), -- DJ receiving payment
  amount DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('client_payment', 'dj_payment', 'platform_fee', 'commission_payout')),
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  description TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  stripe_payment_id TEXT, -- For Stripe integration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commission payout tracking
CREATE TABLE IF NOT EXISTS commission_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('signup_referral', 'gig_referral')) NOT NULL,
  description TEXT NOT NULL,
  gig_id UUID REFERENCES gigs(id),
  paid_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
  stripe_payout_id TEXT, -- For Stripe Connect payouts
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform fee tracking
CREATE TABLE IF NOT EXISTS platform_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES gigs(id),
  amount DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('booking_fee', 'processing_fee', 'cancellation_fee')) DEFAULT 'booking_fee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- PERFORMANCE INDEXES
-- ===============================

-- Gig search indexes
CREATE INDEX IF NOT EXISTS idx_gigs_status ON gigs(status);
CREATE INDEX IF NOT EXISTS idx_gigs_location ON gigs(location);
CREATE INDEX IF NOT EXISTS idx_gigs_date ON gigs(date);
CREATE INDEX IF NOT EXISTS idx_gigs_client ON gigs(client_id);
CREATE INDEX IF NOT EXISTS idx_gigs_selected_dj ON gigs(selected_dj_id);
CREATE INDEX IF NOT EXISTS idx_gigs_event_type ON gigs(event_type);

-- Application indexes
CREATE INDEX IF NOT EXISTS idx_applications_gig ON gig_applications(gig_id);
CREATE INDEX IF NOT EXISTS idx_applications_dj ON gig_applications(dj_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON gig_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_dj_referred ON gig_applications(dj_referred_by);
CREATE INDEX IF NOT EXISTS idx_applications_gig_referred ON gig_applications(gig_referred_by);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_gig ON payment_records(gig_id);
CREATE INDEX IF NOT EXISTS idx_payments_sender ON payment_records(sender_id);
CREATE INDEX IF NOT EXISTS idx_payments_recipient ON payment_records(recipient_id);
CREATE INDEX IF NOT EXISTS idx_payments_type ON payment_records(type);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payment_records(status);

-- Commission indexes
CREATE INDEX IF NOT EXISTS idx_commissions_user ON commission_payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_type ON commission_payouts(type);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commission_payouts(status);
CREATE INDEX IF NOT EXISTS idx_commissions_gig ON commission_payouts(gig_id);

-- ===============================
-- ROW LEVEL SECURITY POLICIES
-- ===============================

-- Drop existing policies if they exist (for re-runnable deployment)
DROP POLICY IF EXISTS "Clients can manage own gigs" ON gigs;
DROP POLICY IF EXISTS "Public can view open gigs" ON gigs;
DROP POLICY IF EXISTS "DJs can manage own applications" ON gig_applications;
DROP POLICY IF EXISTS "Clients can view applications for their gigs" ON gig_applications;
DROP POLICY IF EXISTS "Users can view payment records" ON payment_records;
DROP POLICY IF EXISTS "Users can view own commissions" ON commission_payouts;

-- Gigs: Clients can manage their own gigs, public can view open gigs
CREATE POLICY "Clients can manage own gigs" ON gigs
  FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Public can view open gigs" ON gigs
  FOR SELECT USING (status IN ('open', 'bidding'));

-- Applications: DJs can manage their own applications
CREATE POLICY "DJs can manage own applications" ON gig_applications
  FOR ALL USING (auth.uid() = dj_id);

CREATE POLICY "Clients can view applications for their gigs" ON gig_applications
  FOR SELECT USING (auth.uid() IN (
    SELECT client_id FROM gigs WHERE gigs.id = gig_applications.gig_id
  ));

-- Payments: View own payment records
CREATE POLICY "Users can view payment records" ON payment_records
  FOR SELECT USING (
    auth.uid() = sender_id OR
    auth.uid() = recipient_id OR
    auth.uid() IN (
      SELECT client_id FROM gigs WHERE gigs.id = payment_records.gig_id
    )
  );

-- Commissions: Users can view their own commissions
CREATE POLICY "Users can view own commissions" ON commission_payouts
  FOR SELECT USING (auth.uid() = user_id);

-- ===============================
-- HELPER FUNCTIONS & TRIGGERS
-- ===============================

-- Function to match DJs to gigs based on compatibility
CREATE OR REPLACE FUNCTION match_djs_to_gig(
  p_gig_id UUID,
  p_client_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(dj_id UUID, match_score DECIMAL(10,2), referrer_id UUID) AS $$
DECLARE
  gig_record RECORD;
  dj_record RECORD;
  final_score DECIMAL(10,2);
BEGIN
  -- Get gig details
  SELECT * INTO gig_record FROM gigs WHERE id = p_gig_id;

  -- Calculate match scores for all DJs
  RETURN QUERY
  SELECT
    p.id AS dj_id,
    COALESCE(
      -- Location match (20%)
      CASE WHEN p.location ILIKE '%' || gig_record.location || '%' THEN 0.2 ELSE 0 END +
      -- Genre match (40%)
      CASE WHEN p.genres && gig_record.requirements->>'genres' THEN 0.4 ELSE 0 END +
      -- Experience match (20%)
      CASE WHEN p.experience_level = gig_record.requirements->>'experience' THEN 0.2 ELSE 0 END +
      -- Equipment match (20%)
      CASE WHEN p.equipment && gig_record.requirements->>'equipment' THEN 0.2 ELSE 0 END
    , 0) AS match_score,
    -- Find original referrer of this DJ
    (SELECT referrer_id FROM referrals
     WHERE referred_user_id = p.user_id
     AND status = 'completed'
     LIMIT 1) AS referrer_id

  FROM profiles p
  WHERE p.id != gig_record.client_id -- Exclude client from own gigs
  ORDER BY match_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to process referral commissions on gig completion
CREATE OR REPLACE FUNCTION process_gig_commissions()
RETURNS TRIGGER AS $$
DECLARE
  commission_rate DECIMAL := 0.05; -- 5% commission rate
  dj_signup_referral_rate DECIMAL := 0.10; -- 10% for original signup referral
  commission_amount DECIMAL;
  dj_referrer UUID;
  gig_referrer UUID;
BEGIN
  -- Only process completed gigs
  IF NEW.status != 'completed' THEN
    RETURN NEW;
  END IF;

  -- Find gig and application details
  SELECT ga.gig_referred_by, ga.dj_referred_by, g.budget
  INTO gig_referrer, dj_referrer, commission_amount
  FROM gig_applications ga
  JOIN gigs g ON ga.gig_id = g.id
  WHERE ga.gig_id = NEW.id AND ga.dj_id = NEW.selected_dj_id;

  -- Process gig referral commission
  IF gig_referrer IS NOT NULL THEN
    INSERT INTO commission_payouts (user_id, amount, type, description, gig_id, status)
    VALUES (
      gig_referrer,
      commission_amount * commission_rate,
      'gig_referral',
      format('Commission for referring DJ to gig %s', NEW.id),
      NEW.id,
      'pending'
    );
  END IF;

  -- Process original DJ signup referral commission
  IF dj_referrer IS NOT NULL THEN
    INSERT INTO commission_payouts (user_id, amount, type, description, gig_id, status)
    VALUES (
      dj_referrer,
      commission_amount * dj_signup_referral_rate,
      'signup_referral',
      format('Commission for DJ who originally referred the performer'),
      NEW.id,
      'pending'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists (for re-runnable deployment)
DROP TRIGGER IF EXISTS trig_process_gig_commissions ON gigs;

-- Trigger to automatically process commissions when gigs complete
CREATE TRIGGER trig_process_gig_commissions
AFTER UPDATE ON gigs
FOR EACH ROW EXECUTE FUNCTION process_gig_commissions();

-- ===============================
-- SAMPLE DATA FOR TESTING
-- ===============================

-- SAMPLE DATA REMOVED FOR CLEAN DEPLOYMENT
-- The sample data referenced fake user IDs that don't exist in production
-- You can add test data after deployment with real user IDs

-- To add test gigs later, replace with real user IDs:
-- INSERT INTO gigs (client_id, title, description, venue, location, date, duration, budget, event_type, requirements)
-- VALUES (
--   'real-user-id-here',
--   'Sample Gig Title',
--   'Gig description here',
--   'Venue name',
--   'Location, State',
--   '2025-01-01', -- Date
--   4, -- Duration in hours
--   1500.00, -- Budget $1,500
--   'wedding', -- event_type
--   '{"genres": ["POP", "Electronic"], "experience": "intermediate"}'::jsonb
-- );

-- ===============================
-- ENABLE ROW LEVEL SECURITY
-- ===============================

ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gig_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_fees ENABLE ROW LEVEL SECURITY;

-- ===============================
-- MONITORING & ANALYTICS
-- ===============================

-- Create view for commission analytics
CREATE OR REPLACE VIEW commission_analytics AS
SELECT
  user_id,
  COUNT(*) as total_commissions,
  SUM(amount) as total_amount,
  AVG(amount) as avg_commission,
  SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid_amount,
  COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
  SUM(CASE WHEN type = 'gig_referral' THEN 1 ELSE 0 END) as gig_referrals,
  SUM(CASE WHEN type = 'signup_referral' THEN 1 ELSE 0 END) as signup_referrals
FROM commission_payouts
GROUP BY user_id;

-- ===============================
-- REVERSE ENGINEERING NOTES
-- ===============================

/*
STREAM-OF-CONSCIOUSNESS ON BUSINESS MODEL:

1. DJ ELITE becomes a COMMISSION platform, not just a matching app
2. Dual revenue streams: subscription + transaction fees
3. Users motivated to refer other DJs to earn ongoing commissions
4. Platform takes 10% fee + Referrer takes 5-10% commission
5. This creates a self-perpetuating commission ecosystem

IMPLEMENTATION ROADMAP:
1. ✅ Create gig marketplace service (DONE)
2. ❓ Deploy database schema to Supabase
3. ❓ Add gig creation UI for clients
4. ❓ Add DJ application UI
5. ❓ Integrate Stripe Connect for payments
6. ❓ Add dashboard for commission tracking
7. ❓ Build admin panel for gig moderation

POTENTIAL FEATURES:
- Gig search and filtering
- DJ portfolios/ratings
- Dispute resolution system
- Recurring client-DJ relationships
- VIP event bookings
- Multi-DJ unit bookings
*/

-- ===============================
-- DEPLOYMENT CHECKLIST
-- ===============================

/*
DEPLOYMENT STEPS:

1. Run this SQL in Supabase SQL Editor
2. Verify tables created: gigs, gig_applications, etc.
3. Test RLS policies working
4. Add gig creation component to app
5. Add Stripe Connect setup
6. Create referral tracking UI
7. Monitor commission payouts

EXPECTED FIRST WEEK IMPACT:
- Users creating gig postings
- DJs applying for gigs
- Commissions being earned
- Viral referral loops starting
- Platform revenue generation
*/
