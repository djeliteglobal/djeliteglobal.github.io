-- Fix newsletter RLS policy to allow anonymous users
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;

CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Also allow reading for debugging (you can remove this later)
CREATE POLICY "Anyone can view newsletter subscribers" ON newsletter_subscribers 
FOR SELECT 
USING (true);