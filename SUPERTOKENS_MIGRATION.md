# 🚀 DJ Elite: Supabase to Neon + SuperTokens Migration

## ✅ Why SuperTokens?

- ✅ **OAuth Support**: Google, Facebook, Spotify, Discord
- ✅ **Self-hosted or Managed**: Your choice
- ✅ **Open Source**: Free forever
- ✅ **Session Management**: Built-in
- ✅ **Works with Neon**: Perfect combo

---

## 📋 Quick Start (30 minutes)

### Step 1: Install Dependencies
```bash
npm install supertokens-auth-react supertokens-node @neondatabase/serverless
```

Or run: `install-supertokens.bat`

---

### Step 2: Create Neon Database (5 min)
1. Go to https://console.neon.tech
2. Sign up (free tier)
3. Create project: "dj-elite-production"
4. Copy connection string

**Import schema:**
```bash
psql "YOUR_NEON_CONNECTION_STRING" -f neon-migration-schema.sql
```

---

### Step 3: Set Up SuperTokens (10 min)

**Option A: Managed Service (Easiest)**
1. Go to https://supertokens.com/dashboard
2. Sign up (free tier: 5000 MAU)
3. Create app: "DJ Elite"
4. Copy connection URI and API key

**Option B: Self-Hosted (Free)**
```bash
docker run -p 3567:3567 -d registry.supertokens.io/supertokens/supertokens-postgresql
```

---

### Step 4: Set Up OAuth Apps (15 min)

**Google:**
1. https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Authorized redirect: `https://your-site.netlify.app/api/auth/callback/google`
4. Copy Client ID & Secret

**Facebook:**
1. https://developers.facebook.com/apps
2. Create app → Add Facebook Login
3. Valid OAuth Redirect: `https://your-site.netlify.app/api/auth/callback/facebook`
4. Copy App ID & Secret

**Spotify:**
1. https://developer.spotify.com/dashboard
2. Create app
3. Redirect URI: `https://your-site.netlify.app/api/auth/callback/spotify`
4. Copy Client ID & Secret

**Discord:**
1. https://discord.com/developers/applications
2. New Application
3. OAuth2 → Redirects: `https://your-site.netlify.app/api/auth/callback/discord`
4. Copy Client ID & Secret

---

### Step 5: Update Environment Variables

Copy `.env.supertokens.example` to `.env.local`:

```env
# Neon
VITE_NEON_DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb

# SuperTokens
SUPERTOKENS_CONNECTION_URI=https://try.supertokens.com
SUPERTOKENS_API_KEY=your-api-key

# OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
FACEBOOK_CLIENT_ID=xxxxx
FACEBOOK_CLIENT_SECRET=xxxxx
SPOTIFY_CLIENT_ID=xxxxx
SPOTIFY_CLIENT_SECRET=xxxxx
DISCORD_CLIENT_ID=xxxxx
DISCORD_CLIENT_SECRET=xxxxx

# Existing
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

---

### Step 6: Update Your App

**Update `src/App.tsx`:**
```typescript
import './config/supertokens';
import { AuthProvider } from './contexts/SuperTokensAuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app */}
    </AuthProvider>
  );
}
```

**Update `netlify.toml`:**
```toml
[[redirects]]
  from = "/api/auth/*"
  to = "/.netlify/functions/supertokens-auth/:splat"
  status = 200
```

---

### Step 7: Test Locally
```bash
npm run dev
```

Test:
- ✅ Login with Google
- ✅ Login with Facebook
- ✅ Login with Spotify
- ✅ Login with Discord
- ✅ Email/Password signup
- ✅ Profile creation
- ✅ Referral tracking

---

### Step 8: Deploy to Netlify

**Add environment variables:**
```bash
netlify env:set VITE_NEON_DATABASE_URL "postgresql://..."
netlify env:set SUPERTOKENS_CONNECTION_URI "https://..."
netlify env:set SUPERTOKENS_API_KEY "..."
netlify env:set GOOGLE_CLIENT_ID "..."
netlify env:set GOOGLE_CLIENT_SECRET "..."
# ... add all OAuth credentials
```

**Deploy:**
```bash
npm run build
netlify deploy --prod
```

---

## 📊 Migration Checklist

- [ ] Neon database created
- [ ] Schema imported
- [ ] SuperTokens account created
- [ ] Google OAuth configured
- [ ] Facebook OAuth configured
- [ ] Spotify OAuth configured
- [ ] Discord OAuth configured
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Local testing complete
- [ ] Netlify env vars configured
- [ ] Production deployment

---

## 🔥 Key Features

**SuperTokens handles:**
- ✅ Email/Password authentication
- ✅ OAuth (Google, Facebook, Spotify, Discord)
- ✅ Session management
- ✅ Email verification
- ✅ Password reset
- ✅ User metadata

**Your app handles:**
- ✅ Profile creation
- ✅ Referral tracking
- ✅ Subscription management
- ✅ Business logic

---

## 💰 Cost Comparison

**Supabase:** $75-125/month  
**Neon + SuperTokens:** $30-50/month  
**Savings:** 40-60%

**Breakdown:**
- Neon: $19/month (Pro)
- SuperTokens: Free (self-hosted) or $25/month (5000 MAU)
- Total: $19-44/month

---

## 🆘 Troubleshooting

**OAuth redirect errors:**
- Check redirect URIs match exactly
- Use HTTPS in production
- Verify OAuth app is in production mode

**Session errors:**
- Check SUPERTOKENS_CONNECTION_URI
- Verify API key is correct
- Check CORS settings

**Database errors:**
- Verify Neon connection string
- Check if schema is imported
- Test connection with psql

---

## 📚 Resources

- SuperTokens Docs: https://supertokens.com/docs
- Neon Docs: https://neon.tech/docs
- OAuth Setup: https://supertokens.com/docs/thirdpartyemailpassword/introduction

---

## Next Steps

1. Run `install-supertokens.bat`
2. Create Neon + SuperTokens accounts
3. Set up OAuth apps
4. Update `.env.local`
5. Test locally
6. Deploy!
