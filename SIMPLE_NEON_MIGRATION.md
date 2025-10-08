# 🚀 Simple Migration: Supabase DB → Neon (Keep Clerk)

## ✅ What You're Doing

- ✅ Keep Clerk (OAuth already works)
- ✅ Move database from Supabase to Neon
- ✅ Keep all existing code
- ✅ Save 40% on database costs

## 📋 Quick Steps (20 minutes)

### Step 1: Create Neon Database (5 min)
1. Go to https://console.neon.tech
2. Sign up (free tier)
3. Create project: "dj-elite-production"
4. Copy connection string

### Step 2: Import Schema (2 min)
```bash
psql "YOUR_NEON_CONNECTION_STRING" -f neon-migration-schema.sql
```

### Step 3: Export Data from Supabase (5 min)
```bash
# Get Supabase connection string from: https://app.supabase.com/project/_/settings/database

# Export all tables
pg_dump -h db.sxdlagcwryzzozyuznth.supabase.co -U postgres -d postgres --data-only > supabase-data.sql
```

### Step 4: Import Data to Neon (2 min)
```bash
psql "YOUR_NEON_CONNECTION_STRING" -f supabase-data.sql
```

### Step 5: Update Environment Variables (1 min)
In `.env.local`, replace:
```env
# OLD
VITE_SUPABASE_URL=https://sxdlagcwryzzozyuznth.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx

# NEW
VITE_NEON_DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb
```

### Step 6: Update Database Config (2 min)
Replace `src/config/supabase.ts` with `src/config/neon.ts`

### Step 7: Install Neon Package (1 min)
```bash
npm install @neondatabase/serverless
```

### Step 8: Update Imports (2 min)
Find and replace in all files:
```typescript
// OLD
import { supabase } from '../config/supabase';
const { data } = await supabase.from('profiles').select('*');

// NEW
import { sql } from '../config/neon';
const profiles = await sql`SELECT * FROM profiles`;
```

### Step 9: Test Locally
```bash
npm run dev
```

### Step 10: Deploy
```bash
netlify env:set VITE_NEON_DATABASE_URL "postgresql://..."
npm run build
netlify deploy --prod
```

## 💰 Cost Savings

**Supabase:** $25-75/month  
**Neon:** $19/month  
**Savings:** $6-56/month

## ✅ What Stays the Same

- ✅ Clerk authentication (no changes)
- ✅ OAuth (Google, Facebook, Spotify, Discord)
- ✅ All your UI components
- ✅ All your business logic
- ✅ Stripe integration
- ✅ Netlify functions

## 🔧 What Changes

- Database queries (Supabase client → SQL queries)
- Environment variables
- Database config file

## 🆘 Need Help?

Run this to start:
```bash
npm install @neondatabase/serverless
```

Then follow steps 1-10 above.
