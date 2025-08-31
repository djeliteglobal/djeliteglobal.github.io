import React, { useEffect } from 'react';
import { DJElitePage } from './pages';

const App: React.FC = () => {
    useEffect(() => {
        // Set dark theme permanently
        const root = window.document.documentElement;
        if (!root.classList.contains('dark')) {
            root.classList.add('dark');
        }
    }, []);
    
    return (
        <DJElitePage />
    );
};

export default App;
