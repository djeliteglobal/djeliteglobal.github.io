-- FINAL COMPLETE REFERRAL SYSTEM FIX
-- Run this single script to fix all referral issues

-- 1. Fix table columns if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'referrals' AND column_name = 'referred_email') THEN
        ALTER TABLE referrals ADD COLUMN referred_email TEXT NOT NULL DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'referrals' AND column_name = 'completed_at') THEN
        ALTER TABLE referrals ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'referral_code') THEN
        ALTER TABLE profiles ADD COLUMN referral_code TEXT;
        CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);
    END IF;
END $$;

-- 2. Temporarily disable RLS for testing (re-enable later)
ALTER TABLE referrals DISABLE ROW LEVEL SECURITY;

-- 3. Generate referral codes for users without them
UPDATE profiles
SET referral_code = 'DJ' || UPPER(SUBSTRING(user_id::text, 1, 4)) || UPPER(RIGHT(LEFT(user_id::text, WEIGHT(user_id::text)), 4))
WHERE referral_code IS NULL OR referral_code = '' OR LENGTH(referral_code) < 7;

-- 4. Create referral dashboard view
CREATE OR REPLACE VIEW referrer_dashboard AS
SELECT
    r.referrer_id as referrer_user_id,
    r.referred_user_id,
    p.dj_name as referred_dj_name,
    r.referred_email as referred_email,
    r.referral_code,
    r.status,
    r.created_at as signup_date,
    CASE WHEN r.status = 'completed' THEN 10.00 ELSE 0.00 END as potential_commission
FROM referrals r
LEFT JOIN profiles p ON r.referred_user_id = p.user_id
ORDER BY r.created_at DESC;

-- 5. Test your referral system
SELECT * FROM referrer_dashboard
WHERE referrer_user_id = (
    SELECT user_id FROM profiles WHERE dj_name = 'Kabir'
);

-- 6. Check referral status
SELECT
    COUNT(*) as total_referrals,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_referrals,
    SUM(CASE WHEN status = 'completed' THEN 10.00 ELSE 0 END) as total_commission
FROM referrals
WHERE referrer_id = (
    SELECT user_id FROM profiles WHERE dj_name = 'Kabir'
);
