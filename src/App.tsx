import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DJElitePage } from './pages/DJElitePage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';

const App: React.FC = () => {
    useEffect(() => {
        const root = window.document.documentElement;
        if (!root.classList.contains('dark')) {
            root.classList.add('dark');
        }
    }, []);
    
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DJElitePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
            </Routes>
        </Router>
    );
};

export default App;