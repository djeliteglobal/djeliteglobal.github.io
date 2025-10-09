-- Fix course_progress table to use UUID instead of INTEGER for user_id
-- Run this in your Neon SQL editor

DROP TABLE IF EXISTS course_progress;

CREATE TABLE course_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  module_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

CREATE INDEX idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX idx_course_progress_module_id ON course_progress(module_id);
