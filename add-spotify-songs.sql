-- Add spotify_songs column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS spotify_songs JSONB DEFAULT '[]'::jsonb;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_spotify_songs ON profiles USING GIN (spotify_songs);
