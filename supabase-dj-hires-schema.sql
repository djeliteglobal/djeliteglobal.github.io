-- DJ Hires/Bookings Schema for DJ Elite Platform
-- Add this to your existing Supabase database

-- Create dj_hires table
CREATE TABLE IF NOT EXISTS dj_hires (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  dj_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_location TEXT NOT NULL,
  duration_hours INTEGER NOT NULL,
  rate DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  special_requests TEXT,
  payment_intent_id TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hire_reviews table
CREATE TABLE IF NOT EXISTS hire_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hire_id UUID REFERENCES dj_hires(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hire_id, reviewer_id)
);

-- Enable Row Level Security
ALTER TABLE dj_hires ENABLE ROW LEVEL SECURITY;
ALTER TABLE hire_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dj_hires
CREATE POLICY "Users can view their own hires" ON dj_hires FOR SELECT USING (
  client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
  dj_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert their own hires" ON dj_hires FOR INSERT WITH CHECK (
  client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update their own hires" ON dj_hires FOR UPDATE USING (
  client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
  dj_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- RLS Policies for hire_reviews
CREATE POLICY "Users can view reviews for hires they're involved in" ON hire_reviews FOR SELECT USING (
  hire_id IN (
    SELECT id FROM dj_hires 
    WHERE client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
          dj_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Users can insert reviews for hires they're involved in" ON hire_reviews FOR INSERT WITH CHECK (
  reviewer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) AND
  hire_id IN (
    SELECT id FROM dj_hires 
    WHERE client_id = reviewer_id OR dj_id = reviewer_id
  )
);

-- Create function to get DJ hires for a profile
CREATE OR REPLACE FUNCTION get_dj_hires_for_profile(profile_id UUID)
RETURNS TABLE (
  id UUID,
  event_name TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  event_location TEXT,
  duration_hours INTEGER,
  rate DECIMAL(10,2),
  status TEXT,
  payment_status TEXT,
  client_dj_name TEXT,
  dj_dj_name TEXT,
  is_client BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id,
    h.event_name,
    h.event_date,
    h.event_location,
    h.duration_hours,
    h.rate,
    h.status,
    h.payment_status,
    client_profile.dj_name as client_dj_name,
    dj_profile.dj_name as dj_dj_name,
    CASE WHEN h.client_id = profile_id THEN true ELSE false END as is_client
  FROM dj_hires h
  JOIN profiles client_profile ON h.client_id = client_profile.id
  JOIN profiles dj_profile ON h.dj_id = dj_profile.id
  WHERE h.client_id = profile_id OR h.dj_id = profile_id
  ORDER BY h.event_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create DJ hire with payment
CREATE OR REPLACE FUNCTION create_dj_hire_with_payment(
  client_profile_id UUID,
  dj_profile_id UUID,
  event_name TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  event_location TEXT,
  duration_hours INTEGER,
  rate DECIMAL(10,2),
  special_requests TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  new_hire_id UUID;
  result JSON;
BEGIN
  -- Insert the hire record
  INSERT INTO dj_hires (
    client_id, dj_id, event_name, event_date, event_location, 
    duration_hours, rate, special_requests
  ) VALUES (
    client_profile_id, dj_profile_id, event_name, event_date, event_location,
    duration_hours, rate, special_requests
  ) RETURNING id INTO new_hire_id;
  
  result := json_build_object(
    'hire_id', new_hire_id,
    'status', 'pending',
    'payment_status', 'pending'
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update hire payment status
CREATE OR REPLACE FUNCTION update_hire_payment_status(
  hire_id UUID,
  payment_intent_id TEXT,
  payment_status TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Update the hire record
  UPDATE dj_hires 
  SET 
    payment_intent_id = payment_intent_id,
    payment_status = payment_status,
    status = CASE 
      WHEN payment_status = 'paid' THEN 'confirmed'
      WHEN payment_status = 'failed' THEN 'cancelled'
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = hire_id;
  
  result := json_build_object(
    'hire_id', hire_id,
    'payment_status', payment_status,
    'status', (SELECT status FROM dj_hires WHERE id = hire_id)
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dj_hires_client_id ON dj_hires(client_id);
CREATE INDEX IF NOT EXISTS idx_dj_hires_dj_id ON dj_hires(dj_id);
CREATE INDEX IF NOT EXISTS idx_dj_hires_status ON dj_hires(status);
CREATE INDEX IF NOT EXISTS idx_dj_hires_payment_status ON dj_hires(payment_status);
CREATE INDEX IF NOT EXISTS idx_dj_hires_event_date ON dj_hires(event_date);
CREATE INDEX IF NOT EXISTS idx_hire_reviews_hire_id ON hire_reviews(hire_id);
CREATE INDEX IF NOT EXISTS idx_hire_reviews_reviewer_id ON hire_reviews(reviewer_id);