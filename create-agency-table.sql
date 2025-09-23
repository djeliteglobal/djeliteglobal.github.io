-- Create agency applications table
CREATE TABLE IF NOT EXISTS agency_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  dj_name TEXT NOT NULL,
  epk_url TEXT,
  instagram_url TEXT,
  soundcloud_url TEXT,
  youtube_url TEXT,
  experience TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE agency_applications ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to insert/read
CREATE POLICY "Service role can manage agency applications" ON agency_applications
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users to read their own applications
CREATE POLICY "Users can read their own applications" ON agency_applications
  FOR SELECT USING (auth.email() = email);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_agency_applications_email ON agency_applications(email);
CREATE INDEX IF NOT EXISTS idx_agency_applications_status ON agency_applications(status);
CREATE INDEX IF NOT EXISTS idx_agency_applications_created_at ON agency_applications(created_at DESC);