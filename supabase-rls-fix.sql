-- Enable RLS on missing tables
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Add read-only policies for public data
CREATE POLICY "Anyone can read genres" ON genres FOR SELECT USING (true);
CREATE POLICY "Anyone can read skills" ON skills FOR SELECT USING (true);