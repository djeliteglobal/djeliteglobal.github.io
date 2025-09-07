-- Create separate table for DJ Career Accelerator leads
CREATE TABLE IF NOT EXISTS career_accelerator_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  lead_source TEXT DEFAULT 'career_accelerator_funnel'
);

-- Enable RLS
ALTER TABLE career_accelerator_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous signups
CREATE POLICY "Anyone can subscribe to career accelerator" ON career_accelerator_leads FOR INSERT WITH CHECK (true);