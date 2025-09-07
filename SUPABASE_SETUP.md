# Supabase Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Create new project (choose any name)
4. Wait for database to initialize

### Step 2: Run Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire contents of `supabase-schema.sql`
3. Click **Run** to create all tables and functions

### Step 3: Get Environment Variables
1. Go to **Settings** → **API**
2. Copy these values:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 4: Update Environment File
Add to your `.env.local` file:

```env
# Existing Stripe keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Add these Supabase keys
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Test the Connection
1. Run `npm run dev`
2. Try to sign up/login
3. Check Supabase dashboard → **Authentication** → **Users**

## 🎯 What You Get

✅ **Complete DJ Profile System**
- User authentication (email + OAuth)
- DJ profiles with photos, genres, skills
- Tinder-style swiping
- Match system
- Newsletter subscription

✅ **Database Tables Created**
- `profiles` - DJ profile data
- `genres` - Music genres
- `skills` - DJ skills  
- `swipes` - Swipe history
- `matches` - Mutual matches
- `newsletter_subscribers` - Email list

✅ **Security**
- Row Level Security (RLS) enabled
- Users can only see/edit their own data
- Secure API functions

## 🔧 Next Steps

After setup, you can:
1. **Add sample data** via Supabase dashboard
2. **Test swiping functionality**
3. **Upload profile images** to Supabase Storage
4. **Connect newsletter to email service**

## 🆘 Troubleshooting

**"Not authenticated" errors:**
- Check if SUPABASE_URL and ANON_KEY are correct
- Verify user is logged in

**"Profile not found" errors:**
- User needs to create a profile first
- Check if profile was created in database

**SQL errors:**
- Make sure entire schema was run
- Check for typos in environment variables