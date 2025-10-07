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
import { AuthProvider } from './contexts/ClerkAuthContext';
import { ReferralProvider } from './contexts/ReferralContext';
import ReferralDashboard from './components/premium/ReferralDashboard';
import { notificationService } from './services/notificationService';
import { referralHandler } from './utils/referralHandler';
import { PremiumFeaturesDemo } from './components/platform/PremiumFeaturesDemo';
import { SimpleDJMatchingPage } from './components/pages/SimpleDJMatchingPage';
import AudioSuccessPage from './components/pages/AudioSuccessPage';
import MixingServicePage from './components/pages/MixingServicePage';
import MasteringServicePage from './components/pages/MasteringServicePage';
import ConsultingServicePage from './components/pages/ConsultingServicePage';
import AgencySignupPage from './components/pages/AgencySignupPage';
import CryptoPaymentPage from './components/pages/CryptoPaymentPage';
import CryptoSuccessPage from './components/pages/CryptoSuccessPage';
import WisePaymentPage from './components/pages/WisePaymentPage';
import BinancePayPage from './components/pages/BinancePayPage';
import BinanceSuccessPage from './components/pages/BinanceSuccessPage';
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
                <Route path="/free_course" element={<HomePage />} />
                <Route path="/audio-services" element={<HomePage />} />
                <Route path="/audio-services/success" element={<AudioSuccessPage />} />
                <Route path="/mixing-service" element={<MixingServicePage />} />
                <Route path="/mastering-service" element={<MasteringServicePage />} />
                <Route path="/consulting-service" element={<ConsultingServicePage />} />
                <Route path="/agency-signup" element={<AgencySignupPage />} />
                <Route path="/crypto-payment" element={<CryptoPaymentPage />} />
                <Route path="/crypto-success" element={<CryptoSuccessPage />} />
                <Route path="/wise-payment" element={<WisePaymentPage />} />
                <Route path="/binance-pay" element={<BinancePayPage />} />
                <Route path="/binance-success" element={<BinanceSuccessPage />} />
              </Routes>
            </Router>
          </ReferralProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
