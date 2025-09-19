-- Create course_progress table for tracking module completion
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- Enable RLS
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own progress" ON course_progress
    FOR SELECT USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = course_progress.user_id));

CREATE POLICY "Users can insert their own progress" ON course_progress
    FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM profiles WHERE id = course_progress.user_id));

CREATE POLICY "Users can update their own progress" ON course_progress
    FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = course_progress.user_id));