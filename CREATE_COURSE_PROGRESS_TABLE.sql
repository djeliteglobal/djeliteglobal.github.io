-- Create course_progress table for tracking free course completion
-- Run this in your Neon SQL editor

CREATE TABLE IF NOT EXISTS course_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  module_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_module_id ON course_progress(module_id);

-- Done! Now course progress tracking will work.
