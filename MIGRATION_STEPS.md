# DJ Elite: Supabase to Neon Migration Guide

## 🚀 Quick Start

### Step 1: Create Neon Account & Database
1. Go to https://console.neon.tech
2. Sign up (free tier available)
3. Create new project: "dj-elite-production"
4. Copy connection string (looks like: `postgresql://user:pass@ep-xxx.neon.tech/neondb`)

### Step 2: Import Schema to Neon
```bash
# Install Neon CLI (optional)
npm install -g neonctl

# Or use psql directly
psql "postgresql://user:pass@ep-xxx.neon.tech/neondb" -f neon-migration-schema.sql
```

### Step 3: Export Data from Supabase
```bash
# Get your Supabase connection string from: https://app.supabase.com/project/_/settings/database
# Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Export users
psql "YOUR_SUPABASE_CONNECTION_STRING" -c "COPY (SELECT id, email, created_at, last_sign_in_at, raw_user_meta_data FROM auth.users) TO STDOUT WITH CSV HEADER" > users.csv

# Export profiles
psql "YOUR_SUPABASE_CONNECTION_STRING" -c "COPY profiles TO STDOUT WITH CSV HEADER" > profiles.csv

# Export other tables
psql "YOUR_SUPABASE_CONNECTION_STRING" -c "COPY swipes TO STDOUT WITH CSV HEADER" > swipes.csv
psql "YOUR_SUPABASE_CONNECTION_STRING" -c "COPY matches TO STDOUT WITH CSV HEADER" > matches.csv
psql "YOUR_SUPABASE_CONNECTION_STRING" -c "COPY messages TO STDOUT WITH CSV HEADER" > messages.csv
psql "YOUR_SUPABASE_CONNECTION_STRING" -c "COPY subscriptions TO STDOUT WITH CSV HEADER" > subscriptions.csv
psql "YOUR_SUPABASE_CONNECTION_STRING" -c "COPY referrals TO STDOUT WITH CSV HEADER" > referrals.csv
```

### Step 4: Import Data to Neon
```bash
# Import users (map from auth.users to users table)
psql "YOUR_NEON_CONNECTION_STRING" -c "\COPY users(id, email, created_at, last_sign_in_at, metadata) FROM 'users.csv' WITH CSV HEADER"

# Import profiles
psql "YOUR_NEON_CONNECTION_STRING" -c "\COPY profiles FROM 'profiles.csv' WITH CSV HEADER"

# Import other tables
psql "YOUR_NEON_CONNECTION_STRING" -c "\COPY swipes FROM 'swipes.csv' WITH CSV HEADER"
psql "YOUR_NEON_CONNECTION_STRING" -c "\COPY matches FROM 'matches.csv' WITH CSV HEADER"
psql "YOUR_NEON_CONNECTION_STRING" -c "\COPY messages FROM 'messages.csv' WITH CSV HEADER"
psql "YOUR_NEON_CONNECTION_STRING" -c "\COPY subscriptions FROM 'subscriptions.csv' WITH CSV HEADER"
psql "YOUR_NEON_CONNECTION_STRING" -c "\COPY referrals FROM 'referrals.csv' WITH CSV HEADER"
```

### Step 5: Set Up Clerk for OAuth
1. Go to https://clerk.com
2. Create account and new application
3. Enable OAuth providers:
   - Google
   - Facebook
   - Spotify (custom OAuth)
   - Discord (custom OAuth)
4. Copy API keys

### Step 6: Update Environment Variables
Add to `.env.local`:
```env
# Neon Database
VITE_NEON_DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb

# Clerk Auth
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Existing
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef_test_1234567890abcdef1234567890abcdef12345678
```

### Step 7: Install Dependencies
```bash
npm install @clerk/clerk-react @neondatabase/serverless
```

### Step 8: Test Migration
```bash
# Create test branch in Neon
neonctl branches create --name test-migration

# Run app locally
npm run dev

# Test:
# - Login with Google
# - Create profile
# - Swipe functionality
# - Messaging
```

### Step 9: Deploy
```bash
# Add env vars to Netlify
netlify env:set VITE_NEON_DATABASE_URL "postgresql://..."
netlify env:set VITE_CLERK_PUBLISHABLE_KEY "pk_test_..."
netlify env:set CLERK_SECRET_KEY "sk_test_..."

# Deploy
npm run build
netlify deploy --prod
```

## 📋 Checklist

- [ ] Neon account created
- [ ] Schema imported to Neon
- [ ] Data exported from Supabase
- [ ] Data imported to Neon
- [ ] Clerk account created
- [ ] OAuth providers configured
- [ ] Environment variables updated
- [ ] Dependencies installed
- [ ] Code updated (see next files)
- [ ] Local testing complete
- [ ] Deployed to production

## ⚠️ Important Notes

1. **Backup First**: Export all Supabase data before starting
2. **Test Branch**: Use Neon branches for testing
3. **Gradual Rollout**: Deploy to staging first
4. **Monitor**: Watch for errors in Netlify logs

## 🆘 Troubleshooting

**Connection errors**: Check Neon connection string format
**Auth errors**: Verify Clerk API keys
**Missing data**: Re-run data import commands
**OAuth not working**: Check Clerk provider configuration

## Next Steps

See the following files for code updates:
- `neon-config.ts` - Database configuration
- `clerk-auth-context.tsx` - Authentication updates
