Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DEPLOYING NEON + CLERK FIXES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .
Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "fix: remove Supabase references, use Neon + Clerk"
Write-Host ""
Write-Host "Pushing to repository..." -ForegroundColor Yellow
git push
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Netlify will auto-deploy in 1-2 minutes." -ForegroundColor White
Write-Host "Check: https://app.netlify.com/sites/YOUR-SITE/deploys" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
