@echo off
echo.
echo ========================================
echo   BUILD AND DEPLOY TO PRODUCTION
echo ========================================
echo.
echo Building production bundle...
call npm run build
echo.
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo   BUILD FAILED!
    echo ========================================
    echo.
    pause
    exit /b 1
)
echo.
echo Build successful! Deploying to Netlify...
echo.
call netlify deploy --prod
echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
pause
