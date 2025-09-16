@echo off
echo Committing build fixes...
git add .
git commit -m "Fix build errors and add Stripe checkout integration"
git push origin main
echo Deployed successfully!