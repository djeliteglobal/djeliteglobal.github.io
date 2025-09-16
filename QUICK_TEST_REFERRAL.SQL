-- 🚀 QUICK REFERRAL SYSTEM TEST - RUN THESE QUERIES NOW!

-- 🎯 QUERY 1: Test your referral system
SELECT user_id, dj_name, referral_code
FROM profiles
WHERE referral_code LIKE 'DJ%';

-- 🎯 QUERY 2: Check your specific referral code
SELECT user_id, dj_name, referral_code, created_at
FROM profiles
WHERE user_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- 🎯 QUERY 3: Look for any referrals you've sent
SELECT id, referrer_id, referred_email, status, referral_code, created_at
FROM referrals
WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db'
ORDER BY created_at DESC;

-- 🎯 QUERY 4: If no results above, create a test referral
INSERT INTO referrals (
    referrer_id,
    referred_email,
    status,
    referral_code,
    created_at,
    personal_message
)
VALUES (
    '514e8a0b-010c-4f34-96ca-50c92aab12db',
    'hannai@example.com',
    'completed',
    'DJ514E6',
    NOW(),
    'Test referral from dashboard'
);

-- 🎯 QUERY 5: Verify the test referral was created
SELECT * FROM referrals WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- 🎯 QUERY 6: Test your referral stats calculation
SELECT
    COUNT(*) as total_referrals,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_referrals,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_referrals
FROM referrals
WHERE referrer_id = '514e8a0b-010c-4f34-96ca-50c92aab12db';

-- 🎯 AFTER RUNNING QUERY 4: Refresh your referral dashboard!
-- It should now show: Total Invites = 1, Completed = 1

-- 🎯 THIS WILL SHOW YOUR DASHBOARD WORKING IMMEDIATELY! 🏆
