import React, { useState, useEffect, createContext, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { AppState, AppContextType, Page } from '../types/platform';
import { TopBar, SideNav } from '../components/platform';
import { LandingPage, Dashboard, CoursesPage, CourseDetailPage, CommunityPage, OpportunitiesPage, SettingsPage, EventsPage } from '../components/pages';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';
import { useTranslation } from '../i18n/useTranslation';

// Add bounce animation styles for sticky button
const bounceInStyles = `
  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: translateY(200px) scale(0.5);
    }
    40% {
      opacity: 1;
      transform: translateY(-50px) scale(1.1);
    }
    60% {
      transform: translateY(20px) scale(0.9);
    }
    80% {
      transform: translateY(-10px) scale(1.05);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes shake {
    0%, 100% {
      transform: translateX(0) translateY(0) scale(1);
    }
    25% {
      transform: translateX(-3px) translateY(-2px) scale(1.02);
    }
    50% {
      transform: translateX(3px) translateY(2px) scale(0.98);
    }
    75% {
      transform: translateX(-2px) translateY(1px) scale(1.01);
    }
  }
  
  .dj-button-animated {
    animation: bounceIn 1.2s ease-out 4s both, shake 0.6s ease-in-out 9s infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = bounceInStyles;
  document.head.appendChild(styleSheet);
}

export const AppContext = createContext<AppContextType | null>(null);

const HomePageContent: React.FC = () => {
    const { currentUser } = useAuth();
    const { t } = useTranslation();
    const [appState, setAppState] = useState<AppState>({
        theme: 'dark',
        isLoggedIn: !!currentUser,
        page: currentUser ? 'opportunities' : 'landing',
        courseId: null,
        isSidebarOpen: false,
    });
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        setAppState(prev => ({ 
            ...prev, 
            isLoggedIn: !!currentUser,
            page: currentUser ? 'opportunities' : 'landing'
        }));
    }, [currentUser]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(appState.theme === 'dark' ? 'light' : 'dark');
        root.classList.add(appState.theme);
    }, [appState.theme]);

    const navigate = useCallback((page: Page, courseId: number | null = null) => {
        if (page !== 'landing' && !currentUser) {
            setShowAuthModal(true);
            return;
        }
        setAppState(prev => ({
            ...prev,
            page,
            courseId,
            isSidebarOpen: false,
        }));
    }, [currentUser]);
    
    const contextValue = useMemo(() => ({ appState, setAppState, navigate }), [appState, navigate]);

    const renderPage = () => {
        if (!currentUser) {
            return <LandingPage />;
        }
        switch (appState.page) {
            case 'dashboard':
                return <Dashboard />;
            case 'courses':
                return <CoursesPage />;
            case 'course_detail':
                return <CourseDetailPage />;
            case 'community':
                return <CommunityPage />;
            case 'opportunities':
                return <OpportunitiesPage />;
            case 'events':
                return <EventsPage />;
            case 'settings':
                return <SettingsPage />;
            default:
                return <OpportunitiesPage />;
        }
    };
    
    return (
        <AppContext.Provider value={contextValue}>
            {currentUser ? (
                <div className="flex h-screen w-full bg-[color:var(--bg)]">
                    <SideNav />
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <TopBar />
                        <main className="flex-1 overflow-y-auto">
                            {renderPage()}
                        </main>
                    </div>
                    {appState.isSidebarOpen && (
                        <div onClick={() => setAppState(prev => ({...prev, isSidebarOpen: false}))} className="fixed inset-0 z-30 bg-black/50 md:hidden"></div>
                    )}
                </div>
            ) : (
                <>
                    <LandingPage />
                    <div className="fixed bottom-4 right-4 z-50">
                        <Link 
                            to="/funnel" 
                            className="bg-[color:var(--accent)] text-black px-6 py-3 rounded-full font-bold hover:bg-[color:var(--accent-muted)] transition-all shadow-lg dj-button-animated"
                        >
                            🚀 {t('heroTitle').split(':')[0]}
                        </Link>
                    </div>
                </>
            )}
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </AppContext.Provider>
    );
};

export const HomePage: React.FC = () => {
    return (
        <div style={{ backgroundColor: '#0B0D10', color: '#FFFFFF', minHeight: '100vh' }}>
            <AuthProvider>
                <HomePageContent />
            </AuthProvider>
        </div>
    );
};