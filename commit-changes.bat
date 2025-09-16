@echo off
echo Committing changes to GitHub...
git add .
git commit -m "Add premium tier images and Stripe checkout integration - Added premium tier images with card styling - Implemented embedded Stripe checkout at /checkout - Updated tier names to Pro DJ Pass and Elite DJ Pass - Added subscription processing with Netlify functions - Fixed settings page with password protection"
git push origin main
echo Changes committed successfully!
pause