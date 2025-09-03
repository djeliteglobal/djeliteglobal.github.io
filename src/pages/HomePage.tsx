import React, { useState, useEffect, createContext, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { AppState, AppContextType, Page } from '../types/platform';
import { TopBar, SideNav } from '../components/platform';
import { LandingPage, Dashboard, CoursesPage, CourseDetailPage, CommunityPage, OpportunitiesPage, SettingsPage, DJMatchingPage } from '../components/pages';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';

export const AppContext = createContext<AppContextType | null>(null);

const HomePageContent: React.FC = () => {
    const { currentUser } = useAuth();
    const [appState, setAppState] = useState<AppState>({
        theme: 'dark',
        isLoggedIn: !!currentUser,
        page: 'landing',
        courseId: null,
        isSidebarOpen: false,
    });
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        setAppState(prev => ({ ...prev, isLoggedIn: !!currentUser }));
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
            case 'dj_matching':
                return <DJMatchingPage />;
            case 'settings':
                return <SettingsPage />;
            default:
                return <Dashboard />;
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
                        <Link to="/funnel" className="bg-[color:var(--accent)] text-black px-6 py-3 rounded-full font-bold hover:bg-[color:var(--accent-muted)] transition-all shadow-lg">
                            🚀 DJ Elite Funnel
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
        <AuthProvider>
            <HomePageContent />
        </AuthProvider>
    );
};