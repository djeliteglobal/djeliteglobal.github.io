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
import './index.css';
import './debug.css';

function App() {

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
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;