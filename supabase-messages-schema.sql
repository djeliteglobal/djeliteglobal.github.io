-- Messages table for real chat between matched users
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio'))
);

-- Index for fast message retrieval
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

-- RLS policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can only see messages from their matches
CREATE POLICY "Users can view messages from their matches" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM matches m 
      WHERE m.id = messages.match_id 
      AND (m.profile1_id = auth.uid() OR m.profile2_id = auth.uid())
    )
  );

-- Users can only send messages to their matches
CREATE POLICY "Users can send messages to their matches" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM matches m 
      WHERE m.id = messages.match_id 
      AND (m.profile1_id = auth.uid() OR m.profile2_id = auth.uid())
    )
  );

-- Users can update their own messages (for read receipts)
CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (sender_id = auth.uid());