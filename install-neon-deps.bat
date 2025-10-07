@echo off
echo Installing Neon and Clerk dependencies...
npm install @clerk/clerk-react@^4.30.0 @neondatabase/serverless@^0.9.0
echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Create Neon account at https://console.neon.tech
echo 2. Create Clerk account at https://clerk.com
echo 3. Update .env.local with your credentials
echo 4. Follow MIGRATION_STEPS.md
pause
