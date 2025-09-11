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
import { notificationService } from './services/notificationService';
import { startPeriodicProfileSync } from './services/profileService';
import { PremiumFeaturesDemo } from './components/platform/PremiumFeaturesDemo';
import './index.css';
import './debug.css';
import './styles/pages.css';

function App() {
  // Initialize notifications and profile sync on app start
  React.useEffect(() => {
    notificationService.initialize();
    
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
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/funnel" element={<DJElitePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/premium" element={<PremiumFeaturesDemo />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;