-- Fix user_id columns to support Clerk string IDs instead of UUID
-- Run this in your Neon SQL editor

-- 1. Profiles table
ALTER TABLE profiles ALTER COLUMN user_id TYPE TEXT;

-- 2. Subscriptions table
ALTER TABLE subscriptions ALTER COLUMN user_id TYPE TEXT;

-- 3. Notifications table
ALTER TABLE notifications ALTER COLUMN user_id TYPE TEXT;

-- 4. Presence table
ALTER TABLE presence ALTER COLUMN user_id TYPE TEXT;

-- 5. Super likes table
ALTER TABLE super_likes ALTER COLUMN sender_id TYPE TEXT;

-- 6. Rewinds table
ALTER TABLE rewinds ALTER COLUMN user_id TYPE TEXT;

-- 7. Top picks table
ALTER TABLE top_picks ALTER COLUMN user_id TYPE TEXT;

-- 8. Boosts table
ALTER TABLE boosts ALTER COLUMN user_id TYPE TEXT;

-- 9. Referrals table
ALTER TABLE referrals ALTER COLUMN referrer_id TYPE TEXT;
ALTER TABLE referrals ALTER COLUMN referred_user_id TYPE TEXT;

-- 10. Referral rewards table
ALTER TABLE referral_rewards ALTER COLUMN user_id TYPE TEXT;

-- Done! Now Clerk user IDs will work with your database.
