@echo off
echo Installing Neon database driver...
npm install @neondatabase/serverless
echo.
echo Neon driver installed!
echo.
echo Next steps:
echo 1. Create Neon account at https://console.neon.tech
echo 2. Import schema: psql "YOUR_NEON_URL" -f neon-migration-schema.sql
echo 3. Export Supabase data and import to Neon
echo 4. Update .env.local with VITE_NEON_DATABASE_URL
echo 5. Follow SIMPLE_NEON_MIGRATION.md
pause
