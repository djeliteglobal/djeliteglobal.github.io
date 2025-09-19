-- DJ Elite Platform - Course System Database Schema
-- Run this in Supabase SQL Editor to create course and progress tracking tables

-- Create course_progress table for tracking user progress
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- References profiles.id (not auth.users.id)
  module_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_minutes INTEGER DEFAULT 0,
  quiz_score INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Create course_certificates table for completion certificates
CREATE TABLE IF NOT EXISTS course_certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- References profiles.id
  course_name TEXT NOT NULL,
  completion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  certificate_url TEXT,
  verification_code TEXT UNIQUE,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_feedback table for user feedback
CREATE TABLE IF NOT EXISTS course_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- References profiles.id
  module_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  is_helpful BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_downloads table to track downloads
CREATE TABLE IF NOT EXISTS course_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- References profiles.id
  module_id TEXT NOT NULL,
  download_type TEXT NOT NULL, -- 'sample_pack', 'guide', 'template', etc.
  download_url TEXT NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_size_mb DECIMAL(10,2),
  UNIQUE(user_id, module_id, download_type)
);

-- Enable Row Level Security
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_progress
CREATE POLICY "Users can view their own course progress" ON course_progress FOR SELECT USING (
  user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update their own course progress" ON course_progress FOR ALL USING (
  user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- RLS Policies for course_certificates
CREATE POLICY "Users can view their own certificates" ON course_certificates FOR SELECT USING (
  user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert their own certificates" ON course_certificates FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- RLS Policies for course_feedback
CREATE POLICY "Users can manage their own feedback" ON course_feedback FOR ALL USING (
  user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- RLS Policies for course_downloads
CREATE POLICY "Users can view their own downloads" ON course_downloads FOR SELECT USING (
  user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can track their own downloads" ON course_downloads FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Create function to generate certificate
CREATE OR REPLACE FUNCTION generate_course_certificate(
  p_user_id UUID,
  p_course_name TEXT
) RETURNS UUID AS $$
DECLARE
  certificate_id UUID;
  verification_code TEXT;
BEGIN
  -- Generate unique verification code
  verification_code := 'CERT-' || UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 8));
  
  -- Insert certificate record
  INSERT INTO course_certificates (
    user_id,
    course_name,
    verification_code,
    completion_date
  ) VALUES (
    p_user_id,
    p_course_name,
    verification_code,
    NOW()
  ) RETURNING id INTO certificate_id;
  
  RETURN certificate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check course completion
CREATE OR REPLACE FUNCTION check_course_completion(
  p_user_id UUID,
  p_course_modules TEXT[]
) RETURNS BOOLEAN AS $$
DECLARE
  completed_count INTEGER;
  total_modules INTEGER;
BEGIN
  -- Count completed modules
  SELECT COUNT(*) INTO completed_count
  FROM course_progress
  WHERE user_id = p_user_id
    AND module_id = ANY(p_course_modules)
    AND completed = true;
  
  -- Get total number of modules
  total_modules := array_length(p_course_modules, 1);
  
  -- Return true if all modules are completed
  RETURN completed_count = total_modules;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user course statistics
CREATE OR REPLACE FUNCTION get_user_course_stats(p_user_id UUID)
RETURNS TABLE (
  total_modules_completed INTEGER,
  total_time_spent_hours DECIMAL,
  average_quiz_score DECIMAL,
  certificates_earned INTEGER,
  last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM course_progress WHERE user_id = p_user_id AND completed = true)::INTEGER,
    (SELECT COALESCE(SUM(time_spent_minutes), 0) / 60.0 FROM course_progress WHERE user_id = p_user_id),
    (SELECT COALESCE(AVG(quiz_score), 0) FROM course_progress WHERE user_id = p_user_id AND quiz_score IS NOT NULL),
    (SELECT COUNT(*) FROM course_certificates WHERE user_id = p_user_id)::INTEGER,
    (SELECT MAX(updated_at) FROM course_progress WHERE user_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_module_id ON course_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_completed ON course_progress(completed);
CREATE INDEX IF NOT EXISTS idx_course_certificates_user_id ON course_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_course_certificates_verification ON course_certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_course_feedback_user_id ON course_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_course_feedback_module_id ON course_feedback(module_id);
CREATE INDEX IF NOT EXISTS idx_course_downloads_user_id ON course_downloads(user_id);

-- Insert sample course progress for existing users (optional)
DO $$
DECLARE
  profile_record RECORD;
  modules TEXT[] := ARRAY[
    'intro-to-djing',
    'beatmatching-basics', 
    'eq-and-filters',
    'music-library',
    'first-mix-practice',
    'knowledge-check',
    'dj-starter-pack'
  ];
  module_id TEXT;
BEGIN
  -- For each existing profile, create some random progress
  FOR profile_record IN SELECT id FROM profiles WHERE created_at < NOW() - INTERVAL '1 day' LIMIT 50 LOOP
    -- Randomly complete some modules
    FOREACH module_id IN ARRAY modules LOOP
      IF random() < 0.3 THEN -- 30% chance of completion
        INSERT INTO course_progress (
          user_id,
          module_id,
          completed,
          completed_at,
          progress_percentage,
          time_spent_minutes,
          quiz_score
        ) VALUES (
          profile_record.id,
          module_id,
          true,
          NOW() - (random() * INTERVAL '30 days'),
          100,
          (5 + random() * 25)::INTEGER, -- 5-30 minutes
          CASE WHEN module_id = 'knowledge-check' THEN (70 + random() * 30)::INTEGER ELSE NULL END
        ) ON CONFLICT (user_id, module_id) DO NOTHING;
      ELSIF random() < 0.5 THEN -- 50% chance of partial progress
        INSERT INTO course_progress (
          user_id,
          module_id,
          completed,
          progress_percentage,
          time_spent_minutes
        ) VALUES (
          profile_record.id,
          module_id,
          false,
          (20 + random() * 60)::INTEGER, -- 20-80% progress
          (2 + random() * 15)::INTEGER -- 2-17 minutes
        ) ON CONFLICT (user_id, module_id) DO NOTHING;
      END IF;
    END LOOP;
    
    -- Generate certificate if all free modules completed
    IF (SELECT check_course_completion(profile_record.id, modules)) THEN
      PERFORM generate_course_certificate(profile_record.id, 'DJ Fundamentals - Free Course');
    END IF;
  END LOOP;
END $$;

-- Create trigger to auto-generate certificates
CREATE OR REPLACE FUNCTION auto_generate_certificate()
RETURNS TRIGGER AS $$
DECLARE
  free_modules TEXT[] := ARRAY[
    'intro-to-djing',
    'beatmatching-basics', 
    'eq-and-filters',
    'music-library',
    'first-mix-practice',
    'knowledge-check',
    'dj-starter-pack'
  ];
BEGIN
  -- Check if this completion makes the user eligible for a certificate
  IF NEW.completed = true AND OLD.completed = false THEN
    -- Check if all free modules are now completed
    IF (SELECT check_course_completion(NEW.user_id, free_modules)) THEN
      -- Check if certificate doesn't already exist
      IF NOT EXISTS (
        SELECT 1 FROM course_certificates 
        WHERE user_id = NEW.user_id 
        AND course_name = 'DJ Fundamentals - Free Course'
      ) THEN
        PERFORM generate_course_certificate(NEW.user_id, 'DJ Fundamentals - Free Course');
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_certificate
  AFTER UPDATE ON course_progress
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_certificate();

-- Display summary of course system setup
SELECT 
  'Course System Setup Complete' as status,
  (SELECT COUNT(*) FROM course_progress) as total_progress_records,
  (SELECT COUNT(*) FROM course_certificates) as total_certificates,
  (SELECT COUNT(DISTINCT user_id) FROM course_progress) as users_with_progress;