import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DJElitePage } from './pages/DJElitePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessPage } from './pages/SuccessPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ThemeProvider } from './theme/ThemeProvider';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './contexts/AuthContext';
import { ReferralProvider } from './contexts/ReferralContext';
import ReferralDashboard from './components/premium/ReferralDashboard';
import { notificationService } from './services/notificationService';
import { startPeriodicProfileSync } from './services/profileService';
import { referralHandler } from './utils/referralHandler';
import { PremiumFeaturesDemo } from './components/platform/PremiumFeaturesDemo';
import { SimpleDJMatchingPage } from './components/pages/SimpleDJMatchingPage';
import './index.css';
import './debug.css';
import './styles/pages.css';

function App() {
  // Simple test logging to verify app starts
  console.log('🎯 App component loaded successfully!');
  // Initialize notifications, profile sync, and referral tracking on app start
  React.useEffect(() => {
    console.log('⚡ App component mounted!');
    
    // Initialize core services
    notificationService.initialize();
    referralHandler.initialize();

    // Start automatic Google profile picture sync
    const stopSync = startPeriodicProfileSync();

    // Cleanup on unmount
    return () => {
      stopSync();
    };
  }, []);

  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ReferralProvider>
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/funnel" element={<DJElitePage />} />
                <Route path="/swipe" element={<SimpleDJMatchingPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/premium" element={<PremiumFeaturesDemo />} />
                <Route path="/referrals" element={<ReferralDashboard />} />


              </Routes>
            </Router>
          </ReferralProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
