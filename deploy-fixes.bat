@echo off
echo.
echo ========================================
echo   DEPLOYING NEON + CLERK FIXES
echo ========================================
echo.
echo Adding files to git...
git add .
echo.
echo Committing changes...
git commit -m "fix: remove Supabase references, use Neon + Clerk"
echo.
echo Pushing to repository...
git push
echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Netlify will auto-deploy in 1-2 minutes.
echo Check: https://app.netlify.com/sites/YOUR-SITE/deploys
echo.
pause
