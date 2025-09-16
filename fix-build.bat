@echo off
echo Installing missing dependencies...
npm install @stripe/stripe-js
npm install react react-dom
npm install react-router-dom
npm install @types/react @types/react-dom
echo Dependencies installed!
echo Building project...
npm run build
echo Build complete!