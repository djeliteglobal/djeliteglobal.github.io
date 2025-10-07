@echo off
echo Installing SuperTokens and Neon dependencies...
npm install supertokens-auth-react supertokens-node @neondatabase/serverless
echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Create Neon account at https://console.neon.tech
echo 2. Create SuperTokens account at https://supertokens.com (or use managed service)
echo 3. Set up OAuth apps (Google, Facebook, Spotify, Discord)
echo 4. Update .env.local with your credentials
echo 5. Follow SUPERTOKENS_MIGRATION.md
pause
