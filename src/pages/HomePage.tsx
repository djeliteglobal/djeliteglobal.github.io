import React, { useState, useEffect, createContext, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { AppState, AppContextType, Page } from '../types/platform';
import { TopBar, SideNav } from '../components/platform';
import { ProfileEditor } from '../components/profile/ProfileEditor';
import { LandingPage, Dashboard, CoursesPage, CourseDetailPage, CommunityPage, OpportunitiesPage, SettingsPage, EventsPage, ProfilePage, ReferralsPage, PremiumPage, FreeCoursePage } from '../components/pages';
import { FreeCourseAccess } from '../components/FreeCourseAccess';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';
import { useTranslation } from '../i18n/useTranslation';
import { PremiumFeaturesDemo } from '../components/platform/PremiumFeaturesDemo';
import { useReferral } from '../contexts/ReferralContext';
import { supabase } from '../config/supabase';
import '../services/layout-fix.css';

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

// Inject styles with proper cleanup
let stylesInjected = false;
if (typeof document !== 'undefined' && !stylesInjected) {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = bounceInStyles;
  styleSheet.id = 'dj-bounce-styles';
  document.head.appendChild(styleSheet);
  stylesInjected = true;
}

export const AppContext = createContext<AppContextType | null>(null);

const HomePageContent: React.FC = () => {
    const { currentUser } = useAuth();
    const { processReferralSignup } = useReferral();
    const { t } = useTranslation();
    const [showProfileEditor, setShowProfileEditor] = useState(false);
    const [appState, setAppState] = useState<AppState>(() => {
        const isFreeCourse = window.location.pathname === '/free_course';
        
        return {
            theme: 'dark',
            isLoggedIn: !!currentUser,
            page: isFreeCourse ? 'courses' : (currentUser ? 'opportunities' : 'landing'),
            courseId: null,
            isSidebarOpen: true,
        };
    });

    const [showAuthModal, setShowAuthModal] = useState(false);

    // Listen for custom auth modal events
    useEffect(() => {
        const handleOpenAuthModal = () => {
            setShowAuthModal(true);
        };

        window.addEventListener('openAuthModal', handleOpenAuthModal);
        return () => window.removeEventListener('openAuthModal', handleOpenAuthModal);
    }, []);

    // Process referral when new user authenticates - FIXED TIMING ISSUE
    useEffect(() => {
        const processNewUserReferral = async () => {
            if (currentUser) {
                console.log('🎯 REFERRAL SIGNUP DETECTED for user:', currentUser.name);
                console.log('🔍 Checking for referral data...');

                // Get user ID from Supabase
                const { data: user } = await supabase.auth.getUser();
                const userId = user.user?.id;

                if (userId) {
                    // Check if user has referral data in URL or session
                    const urlParams = new URLSearchParams(window.location.search);
                    const referralCode = urlParams.get('ref') || sessionStorage.getItem('referral_code');

                    if (referralCode) {
                        console.log('✅ Referral code found:', referralCode);

                        // Wait a moment for profile to be fully created
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        // Process referral
                        console.log('🚀 Processing referral conversion...');
                        await processReferralSignup(userId);

                        console.log('✅ Referral processing initiated');
                    } else {
                        console.log('⚠️ No referral code found for new user');
                    }
                }
            }
        };

        processNewUserReferral();
    }, [currentUser, processReferralSignup]);

    useEffect(() => {
        setAppState(prev => ({
            ...prev,
            isLoggedIn: !!currentUser,
            // Only set page on initial load, don't change it when user state changes
            page: prev.page === 'landing' && currentUser ? 'opportunities' : prev.page
        }));
    }, [currentUser]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(appState.theme === 'dark' ? 'light' : 'dark');
        root.classList.add(appState.theme);
    }, [appState.theme]);

    const navigate = useCallback((page: Page, courseId: number | null = null) => {
        if (page !== 'landing' && page !== 'free_course_access' && !currentUser) {
            setShowAuthModal(true);
            return;
        }
        setAppState(prev => ({
            ...prev,
            page,
            courseId,
        }));
    }, [currentUser]);

    // Handle direct course URL access (e.g., ?course=1 or ?wants_course=1 or /Free_course)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('course') || urlParams.get('wants_course');
        const isFreeCourse = window.location.pathname === '/free_course';

        if (isFreeCourse) {
            console.log('🎯 Found free course URL path');
            setAppState(prev => ({
                ...prev,
                page: 'courses'
            }));
        } else if (courseId && !isNaN(parseInt(courseId))) {
            console.log('🎯 Found course URL parameter:', courseId);

            // If user is not logged in, show auth modal first, then navigate
            if (!currentUser) {
                setShowAuthModal(true);
                // Store the intended course for after login
                sessionStorage.setItem('intended_course', courseId);
            } else {
                // User is logged in, navigate directly to the course
                setAppState(prev => ({
                    ...prev,
                    page: 'course_detail',
                    courseId: parseInt(courseId)
                }));
            }
        }
    }, [currentUser]);

    const contextValue = useMemo(() => ({ appState, setAppState, navigate }), [appState, navigate]);

    const renderPage = () => {
        switch (appState.page) {
            case 'dashboard':
                return currentUser ? <Dashboard /> : <LandingPage />;
            case 'free_course':
                return <FreeCoursePage />;
            case 'free_course_access':
                return <FreeCourseAccess />;
            case 'courses':
                return <CoursesPage />;
            case 'course_detail':
                return currentUser ? <CourseDetailPage /> : <LandingPage />;
            case 'community':
                return currentUser ? <CommunityPage /> : <LandingPage />;
            case 'opportunities':
                return currentUser ? <OpportunitiesPage /> : <LandingPage />;
            case 'events':
                return currentUser ? <EventsPage /> : <LandingPage />;
            case 'profile':
                return currentUser ? <ProfilePage /> : <LandingPage />;
            case 'referrals':
                return currentUser ? <ReferralsPage /> : <LandingPage />;
            case 'premium':
                return currentUser ? <PremiumPage /> : <LandingPage />;
            case 'premium_features':
                return currentUser ? <PremiumFeaturesDemo /> : <LandingPage />;
            case 'settings':
                return currentUser ? <SettingsPage /> : <LandingPage />;
            case 'landing':
                return <LandingPage />;
            default:
                return currentUser ? <OpportunitiesPage /> : <LandingPage />;
        }
    };
    
    return (
        <AppContext.Provider value={contextValue}>
            {currentUser || appState.page === 'courses' ? (
                <div className="flex h-screen w-full bg-[color:var(--bg)]">
                    <SideNav />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <TopBar />
                        <main className="flex-1 overflow-y-auto">
                            {renderPage()}
                        </main>
                    </div>

                    {currentUser && <ProfileEditor isOpen={showProfileEditor} onClose={() => setShowProfileEditor(false)} />}
                </div>
            ) : (
                <>
                    <LandingPage />
                    <div className="fixed bottom-4 right-4 z-50">
                        <Link 
                            to="/funnel" 
                            className="bg-[color:var(--accent)] text-black px-6 py-3 rounded-full font-bold hover:bg-[color:var(--accent-muted)] transition-all shadow-lg dj-button-animated"
                        >
                            🚀 {(() => {
                                const title = t('heroTitle');
                                const colonIndex = title.indexOf(':');
                                return colonIndex > 0 ? title.substring(0, colonIndex) : 'Start Now';
                            })()}
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
        <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] min-h-screen">
            <AuthProvider>
                <HomePageContent />
            </AuthProvider>
        </div>
    );
};
