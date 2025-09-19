/**
 * Frontend Workaround for 406 Error in Profile Editor
 * 
 * Issue: The Profile Editor was triggering `fetchSwipeProfiles` and other swipe-related database queries,
 * leading to a 406 "Not Acceptable" error. This was due to direct imports of swipe functions
 * from `profileService` at the top level, causing them to be bundled and potentially executed
 * when the Profile Editor component loaded.
 * 
 * Solution: Implemented dynamic imports for all swipe-related and other non-profile-specific
 * functions from `../../services/profileService`. This ensures that these functions are
 * only loaded and executed when their respective components (e.g., OpportunitiesPage, MatchesList,
 * SettingsPage) explicitly require them, preventing unintended database queries when the
 * InlineProfileEditor is active.
 * 
 * Changes Made:
 * 1. Modified the top-level import from `../../services/profileService` to only include
 *    `subscribeToNewsletter` and `testSupabaseConnection`, which are used directly by
 *    LandingPage and CommunityPage respectively.
 * 2. Replaced direct imports with dynamic imports (`await import('../../services/profileService')`)
 *    for the following functions in their respective components:
 *    - `OpportunitiesPage`: `fetchSwipeProfiles`, `createProfile`, `recordSwipe`, `undoSwipe`
 *    - `MatchesList`: `supabase`, `deleteMatch`
 *    - `SettingsPage`: `migrateDjNames`, `supabase`
 *    - `InlineProfileEditor`: `getCurrentProfile`, `uploadProfileImage`, `updateProfile`
 * 
 * This approach ensures minimal changes while effectively isolating profile-specific logic
 * from swipe-related database operations, resolving the 406 error.
 */
import React, { useContext, useMemo, useState, useCallback, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../pages/HomePage';
import { useAuth } from '../../contexts/AuthContext';
import { Button, CourseCard, FaqItemComponent, PricingCard } from '../platform';
import { UltraFastSwipeCard } from '../swipe/UltraFastSwipeCard';
import { ChatInterface } from '../messaging/ChatInterface';
import { OptimizedImage } from '../OptimizedImage';
import { ProfileThumbnail } from '../ProfileThumbnail';
import { EventCreator } from '../events/EventCreator';
import { DJApplicationModal } from '../events/DJApplicationModal';
import ReferralDashboard from '../premium/ReferralDashboard';
import { FreeCourseAccess } from '../FreeCourseAccess';
import { loadCourses, FAQ_ITEMS, PRICING_PLANS, PlayCircleIcon, VideoIcon, FileTextIcon, HelpCircleIcon, XIcon, HeartIcon, StarIcon, UndoIcon, LockIcon, loadOpportunities } from '../../constants/platform';
import { subscribeToNewsletter, testSupabaseConnection } from '../../services/profileService';
import { useMatches } from '../../hooks/useMatches';
import { useProfileImagePreloader } from '../../hooks/useImagePreloader';
import type { Course, Opportunity } from '../../types/platform';
import { DJMatchingPage } from './DJMatchingPage';

// Add swipe animation styles
const swipeStyles = `
  @keyframes swipeRight {
    0%, 100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(20px);
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = swipeStyles;
  document.head.appendChild(styleSheet);
}

// Landing Page
export const LandingPage: React.FC = () => {
    const { navigate } = useContext(AppContext)!;
    
    return (
        <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)]">
            {/* Header */}
            <header className="fixed top-0 z-50 w-full bg-[color:var(--bg)]/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4">
                    <div className="text-2xl font-bold font-display">DJ Elite</div>
                    <div>
                        <Button onClick={() => navigate('dashboard')}>Log In</Button>
                    </div>
                </div>
            </header>
            
            <main>
                {/* Hero Section */}
                <section className="relative flex min-h-screen items-center justify-center pt-8 md:pt-20">
                    <div className="absolute inset-0 bg-black/50">
                        <img src="https://images.unsplash.com/photo-1517814761483-6769dab4e9c0" alt="DJ performing" className="h-full w-full object-cover opacity-30"/>
                    </div>
                    <div className="relative z-10 text-center text-white p-4 -mt-48 md:-mt-32">
                        {/* Swipe Right Logo */}
                        <div className="mb-6 flex justify-center">
                            <img 
                                src="/swipe-right.png" 
                                alt="Swipe Right" 
                                className="w-20 h-20"
                                style={{
                                    animation: 'swipeRight 2s ease-in-out infinite'
                                }}
                            />
                        </div>
                        <h1 className="font-display text-4xl font-bold md:text-7xl">One World Stage.</h1>
                        <h1 className="font-display text-4xl font-bold md:text-7xl text-[color:var(--accent)]">Swipe Right to DJ!</h1>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-[color:var(--text-secondary)]">
                            Connect with DJs worldwide, find your perfect gig match, and build your music community.
                        </p>
                        <div className="mt-10 flex justify-center">
                            <Button className="px-8 py-4 text-lg" onClick={() => navigate('dashboard')}>Get Started</Button>
                        </div>
                    </div>
                </section>
                
                {/* How It Works Section - Masterfully Designed */}
                <section className="py-16 sm:py-24 bg-[color:var(--surface)]">
                    <div className="container mx-auto px-4 max-w-6xl">
                        
                        {/* Problem (Social Proof + Loss Aversion) */}
                        <div className="text-center mb-12">
                            <p className="text-red-500 font-medium mb-2">Join 10,000+ DJs building connections</p>
                            <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--text-primary)] mb-4">
                                Tired of DJing alone with no network to grow?
                            </h2>
                        </div>

                        {/* Solution (Clear Value Prop) */}
                        <div className="text-center mb-16">
                            <h3 className="text-3xl md:text-4xl font-bold text-[color:var(--text-primary)] mb-4">
                                Connect with DJs who help each other succeed
                            </h3>
                            <p className="text-lg text-[color:var(--text-secondary)] max-w-2xl mx-auto">
                                Build relationships with DJs who have connections, exchange gigs, and grow together
                            </p>
                        </div>

                        {/* 3-Step Process (Progressive Disclosure + Natural Mapping) */}
                        <div className="mb-16">
                            <h4 className="text-xl font-semibold text-center mb-12 text-[color:var(--text-primary)]">
                                How the community works
                            </h4>
                            
                            <div className="grid md:grid-cols-5 gap-8 md:gap-4 items-center">
                                {/* Step 1 */}
                                <div className="text-center group">
                                    <div className="w-12 h-12 bg-[color:var(--accent)] text-black rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        1
                                    </div>
                                    <h5 className="font-semibold text-lg mb-2 text-[color:var(--text-primary)]">Create Profile</h5>
                                    <p className="text-[color:var(--text-secondary)] text-sm leading-relaxed">
                                        Share your style, experience, and what you can help other DJs with
                                    </p>
                                </div>

                                {/* Arrow */}
                                <div className="hidden md:flex items-center justify-center">
                                    <div className="text-[color:var(--accent)] text-2xl">→</div>
                                </div>

                                {/* Step 2 */}
                                <div className="text-center group">
                                    <div className="w-12 h-12 bg-[color:var(--accent)] text-black rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        2
                                    </div>
                                    <h5 className="font-semibold text-lg mb-2 text-[color:var(--text-primary)]">Connect & Collaborate</h5>
                                    <p className="text-[color:var(--text-secondary)] text-sm leading-relaxed">
                                        Match with DJs who complement your skills and share opportunities
                                    </p>
                                </div>

                                {/* Arrow */}
                                <div className="hidden md:flex items-center justify-center">
                                    <div className="text-[color:var(--accent)] text-2xl">→</div>
                                </div>

                                {/* Step 3 */}
                                <div className="text-center group">
                                    <div className="w-12 h-12 bg-[color:var(--accent)] text-black rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        3
                                    </div>
                                    <h5 className="font-semibold text-lg mb-2 text-[color:var(--text-primary)]">Grow Together</h5>
                                    <p className="text-[color:var(--text-secondary)] text-sm leading-relaxed">
                                        Exchange gigs, get referrals, and expand your network through collaboration
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Success Vision (Intrinsic Motivation) */}
                        <div className="bg-[color:var(--elevated)] rounded-xl p-8 mb-12 text-center">
                            <p className="text-xl md:text-2xl font-semibold text-[color:var(--text-primary)] mb-2">
                                Build a network that opens doors to new opportunities
                            </p>
                            <p className="text-[color:var(--text-secondary)]">
                                Connect with DJs who have club connections, share gigs, and grow your reach together
                            </p>
                        </div>

                        {/* Clear CTAs (Fitts's Law + Recognition over Recall) */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Button 
                                className="px-8 py-4 text-lg font-semibold" 
                                onClick={() => navigate('dashboard')}
                            >
                                Start Matching (Free)
                            </Button>
                            <Button 
                                variant="secondary" 
                                className="px-6 py-4 text-lg border border-[color:var(--border)] hover:border-[color:var(--accent)] transition-colors"
                            >
                                See Success Stories
                            </Button>
                        </div>

                        {/* Stakes (Loss Aversion) */}
                        <p className="text-center text-red-500 font-medium">
                            Don't miss out on the connections that could change your DJ career
                        </p>
                    </div>
                </section>
                
                {/* Pricing Section */}
                <section id="pricing" className="py-20 sm:py-32">
                    <div className="container mx-auto px-4">
                        <h2 className="text-center font-display text-3xl font-bold sm:text-5xl">Find Your Perfect Match</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-[color:var(--text-secondary)]">
                            Connect with DJs worldwide, discover gig opportunities, and build your music community. Start free!
                        </p>
                        <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-3">
                            {PRICING_PLANS.map((plan) => (
                                <PricingCard key={plan.name} plan={plan} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 sm:py-32 bg-[color:var(--surface)]">
                    <div className="container mx-auto px-4">
                        <h2 className="text-center font-display text-3xl font-bold sm:text-5xl">Frequently Asked Questions</h2>
                        <div className="mx-auto mt-12 max-w-3xl">
                            {FAQ_ITEMS.map((item) => (
                                <FaqItemComponent key={item.question} item={item} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            
            {/* Footer */}
            <footer className="bg-[color:var(--surface)] border-t border-[color:var(--border)] mt-20">
                <div className="container mx-auto px-4 py-16 text-center">
                    <div className="text-2xl font-bold font-display mb-4">DJ Elite</div>
                    <p className="mt-4 max-w-md mx-auto text-[color:var(--text-secondary)]">Connect with DJs worldwide, find your perfect gig match, and build your music community.</p>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const email = formData.get('email') as string;
                        try {
                            const { subscribeToNewsletter } = await import('../../services/profileService');
                            await subscribeToNewsletter(email, 'Newsletter Subscriber');
                            alert('✅ Subscribed! You\'ll get weekly DJ tips and insights.');
                            (e.target as HTMLFormElement).reset();
                        } catch (error: any) {
                            console.error('Newsletter signup error:', error);
                            alert(`Error: ${error?.message || 'Something went wrong'}`);
                        }
                    }} className="mt-6 max-w-sm mx-auto flex gap-2">
                        <input type="email" name="email" placeholder="Your email address" required className="flex-grow px-4 py-3 rounded-lg bg-[color:var(--bg)] border border-[color:var(--border)] focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none transition-all" />
                        <Button type="submit" className="px-6">Subscribe</Button>
                    </form>
                    <div className="mt-8 flex justify-center gap-6 text-[color:var(--muted)]">
                        <a href="/terms" className="hover:text-[color:var(--text-primary)] transition-colors">Terms</a>
                        <a href="/privacy" className="hover:text-[color:var(--text-primary)] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[color:var(--text-primary)] transition-colors">Contact</a>
                        <a href="https://buymeacoffee.com/elitedjs" target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--text-primary)] transition-colors">Buy Me a Coffee</a>
                    </div>
                    <p className="mt-8 text-sm text-[color:var(--muted)]">&copy; {new Date().getFullYear()} DJ Elite. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

// Dashboard Page
export const Dashboard: React.FC = () => {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        loadCourses()
            .then(setCourses)
            .catch(err => {
                console.error('Dashboard error:', err);
                setError('Failed to load courses');
                setCourses([]);
            })
            .finally(() => setLoading(false));
    }, []);
    
    const inProgressCourse = courses.find(c => c.progress > 0 && c.progress < 100);
    return (
        <div className="min-h-full bg-[color:var(--bg)] text-[color:var(--text-primary)] p-6">
            <h1 className="font-display text-3xl font-bold text-[color:var(--text-primary)]">Welcome back, {currentUser?.name.split(' ')[0]}!</h1>
            <p className="mt-1 text-[color:var(--text-secondary)]">Let's make some noise today.</p>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {inProgressCourse && (
                         <div className="group relative overflow-hidden rounded-xl bg-[color:var(--surface)] shadow-soft border border-[color:var(--border)]">
                            <img src={inProgressCourse.imageUrl} alt={inProgressCourse.title} className="h-64 w-full object-cover"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6">
                                <p className="text-sm font-semibold text-[color:var(--accent-muted)]">CONTINUE LEARNING</p>
                                <h2 className="mt-1 font-display text-2xl font-bold text-white">{inProgressCourse.title}</h2>
                                <div className="mt-4 flex items-center gap-4">
                                    <Button>Resume Course</Button>
                                    <div className="w-full max-w-xs">
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                                            <div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${inProgressCourse.progress}%` }}></div>
                                        </div>
                                        <p className="mt-1 text-xs text-white/70">{inProgressCourse.progress}% complete</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div>
                        <h2 className="font-display text-2xl font-bold">Recommended For You</h2>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {loading ? (
                                <div className="col-span-2 text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--accent)] mx-auto"></div>
                                </div>
                            ) : (
                                courses.slice(0, 2).map(course => <CourseCard key={course.id} course={course} />)
                            )}
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                     <div className="rounded-xl bg-[color:var(--surface)] p-6 shadow-soft border border-[color:var(--border)]">
                        <h3 className="font-display text-xl font-bold">Practice Streak</h3>
                        <p className="text-sm text-[color:var(--text-secondary)]">You've practiced 3 days this week!</p>
                        {/* A simple visualization of a streak */}
                        <div className="mt-4 flex justify-between gap-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                <div key={day+i} className="flex flex-col items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i < 3 ? 'bg-[color:var(--accent)] text-black' : 'bg-[color:var(--surface-alt)] text-[color:var(--text-secondary)]'}`}>
                                        <span className="text-sm font-bold">{ i < 3 ? '✓' : ''}</span>
                                    </div>
                                    <p className="text-xs text-[color:var(--muted)]">{day}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-xl bg-[color:var(--surface)] p-6 shadow-soft border border-[color:var(--border)]">
                        <h3 className="font-display text-xl font-bold">New Opportunities</h3>
                        <ul className="mt-4 space-y-3">
                            <li className="flex justify-between items-center text-sm"><span>Club Night @ Berlin</span><span className="px-2 py-0.5 text-xs rounded-full bg-[color:var(--accent)]/20 text-[color:var(--accent)]">Open</span></li>
                            <li className="flex justify-between items-center text-sm"><span>Festival Opener @ Ibiza</span><span className="px-2 py-0.5 text-xs rounded-full bg-[color:var(--accent)]/20 text-[color:var(--accent)]">Open</span></li>
                            <li className="flex justify-between items-center text-sm"><span>Radio Mix Guest</span><span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">Applied</span></li>
                        </ul>
                        <Button variant="secondary" className="mt-4 w-full">View All</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Courses Page
export const CoursesPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFreeCourse, setShowFreeCourse] = useState(false);
    
    useEffect(() => {
        // Check for free course URL path
        if (window.location.pathname === '/free_course') {
            setShowFreeCourse(true);
        }
        
        const loadCoursesWithProgress = async () => {
            try {
                const coursesData = await loadCourses();
                
                // Load progress for DJ Bookings Blueprint course (ID 1)
                if (currentUser) {
                    const { supabase } = await import('../../services/profileService');
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('user_id', currentUser.email)
                        .single();
                    
                    if (profile) {
                        const { data: progress } = await supabase
                            .from('course_progress')
                            .select('*')
                            .eq('user_id', profile.id);
                        
                        // Calculate progress for course ID 1 (DJ Bookings Blueprint)
                        const totalModules = 12; // Total modules in FreeCourseAccess
                        const completedModules = progress?.length || 0;
                        const progressPercentage = Math.round((completedModules / totalModules) * 100);
                        
                        // Update course progress
                        const updatedCourses = coursesData.map(course => 
                            course.id === 1 
                                ? { ...course, progress: progressPercentage }
                                : course
                        );
                        setCourses(updatedCourses);
                    } else {
                        setCourses(coursesData);
                    }
                } else {
                    setCourses(coursesData);
                }
            } catch (err) {
                console.error('Courses error:', err);
                setError('Failed to load courses');
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };
        
        loadCoursesWithProgress();
    }, [currentUser]);

    // Auto-open free course if URL path matches
    useEffect(() => {
        if (window.location.pathname === '/free_course' && !showFreeCourse) {
            setShowFreeCourse(true);
        }
    }, [showFreeCourse]);
    
    if (error) {
        return (
            <div className="min-h-full bg-[color:var(--bg)] text-[color:var(--text-primary)] p-6">
                <h1 className="font-display text-3xl font-bold text-[color:var(--text-primary)]">All Courses</h1>
                <div className="mt-8 text-center py-8">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[color:var(--accent)] text-black rounded">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (showFreeCourse) {
        console.log('🎯 RENDERING FREE COURSE:', { showFreeCourse, currentUser: !!currentUser, pathname: window.location.pathname });
        return (
            <div className="min-h-screen bg-gray-900 text-white" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
                <div className="p-6">
                    <button 
                        onClick={() => {
                            setShowFreeCourse(false);
                            window.history.replaceState({}, '', '/courses');
                        }}
                        className="mb-4 text-sm text-gray-400 hover:text-white flex items-center gap-2"
                    >
                        ← Back to All Courses
                    </button>
                </div>
                {currentUser ? (
                    <FreeCourseAccess />
                ) : (
                    <div className="relative">
                        <div className="opacity-70 pointer-events-none">
                            <FreeCourseAccess preview={true} />
                        </div>
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[99999]">
                            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center max-w-md mx-4">
                                <LockIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Register to Access Free Course
                                </h3>
                                <p className="text-gray-300 mb-6">
                                    Create a free account to unlock all 12 modules and start landing high-paying gigs.
                                </p>
                                <Button onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}>Create Free Account</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[color:var(--bg)] text-[color:var(--text-primary)] p-6">
            <h1 className="font-display text-3xl font-bold text-[color:var(--text-primary)]">All Courses</h1>
            <p className="mt-1 text-[color:var(--text-secondary)]">Expand your skills and master the craft.</p>
            
            {/* Free Course Card */}
            <div className="mt-8 mb-6">
                <div 
                    onClick={() => setShowFreeCourse(true)}
                    className="bg-gradient-to-r from-[color:var(--accent)]/20 to-green-500/20 rounded-xl p-6 border-2 border-[color:var(--accent)] cursor-pointer hover:scale-105 transition-transform"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[color:var(--accent)] rounded-xl flex items-center justify-center">
                            <PlayCircleIcon className="w-8 h-8 text-black" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-[color:var(--text-primary)]">DJ Bookings Blueprint - Free Course</h3>
                                <span className="bg-[color:var(--accent)] text-black px-2 py-1 rounded-full text-xs font-bold">FREE</span>
                            </div>
                            <p className="text-[color:var(--text-secondary)]">The DJ Booking Blueprint: 7 Insider Secrets to Landing Your First Paid Gigs</p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm text-[color:var(--muted)]">7 modules • 2 hours</span>
                                <span className="text-sm text-green-400">✓ Always Free</span>
                            </div>
                        </div>
                        <div className="text-[color:var(--accent)]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m9 18 6-6-6-6"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--accent)] mx-auto"></div>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                        <p className="text-[color:var(--text-secondary)]">No courses available</p>
                    </div>
                ) : (
                    courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))
                )}
            </div>
        </div>
    );
};

// Course Detail Page
export const CourseDetailPage: React.FC = () => {
    const { appState, navigate } = useContext(AppContext)!;
    
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        loadCourses().then(courses => {
            const foundCourse = courses.find(c => c.id === appState.courseId);
            setCourse(foundCourse || null);
        }).finally(() => setLoading(false));
    }, [appState.courseId]);

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--accent)] mx-auto"></div>
            </div>
        );
    }
    
    if (!course) {
        return <div className="p-8 text-center">Course not found. <button onClick={() => navigate('courses')} className="text-[color:var(--accent)]">Go back to courses</button></div>;
    }

    return (
        <div className="flex flex-col lg:flex-row h-full">
            {/* Main Content - Video Player */}
            <div className="flex-grow p-4 sm:p-6 lg:p-8">
                 <button onClick={() => navigate('courses')} className="mb-4 text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]">
                    &larr; Back to Courses
                </button>
                <div className="aspect-video w-full rounded-xl bg-[color:var(--elevated)] flex items-center justify-center relative">
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover rounded-xl"/>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center">
                        <LockIcon className="w-16 h-16 text-white mb-4" />
                        <h3 className="text-white text-xl font-bold mb-2">Course Locked</h3>
                        <p className="text-white/80 text-center max-w-sm">Upgrade to Pro to access all courses and unlock your DJ potential</p>
                        <Button className="mt-6">Upgrade to Pro</Button>
                    </div>
                </div>
                <div className="mt-6">
                    <h1 className="font-display text-3xl font-bold">{course.title}</h1>
                    <p className="mt-2 text-[color:var(--text-secondary)] font-mono">by {course.instructor}</p>
                </div>
                <div className="mt-6 border-t border-[color:var(--border)] pt-6">
                    <h2 className="font-display text-xl font-bold">About this course</h2>
                    <p className="mt-2 text-[color:var(--text-secondary)]">{course.description}</p>
                </div>
            </div>

            {/* Sidebar - Curriculum */}
            <div className="w-full lg:w-96 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-[color:var(--border)] bg-[color:var(--surface)]">
                <div className="p-6">
                    <h2 className="font-display text-xl font-bold">Course Content</h2>
                    <div className="mt-4">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--surface-alt)]">
                            <div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <p className="mt-2 text-sm text-[color:var(--muted)]">{course.progress}% complete</p>
                    </div>
                    <Button className="w-full mt-4" disabled>
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <path d="M12 3v4" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Locked - Upgrade to Pro
                        </div>
                    </Button>
                </div>
                <div className="border-t border-[color:var(--border)]">
                    <ul className="divide-y divide-[color:var(--border)]">
                        {(() => {
                            const lessonsByCourse = {
                                1: [ // DJ Fundamentals
                                    { title: "Getting Started with DJ Equipment", type: "Video", duration: "15 min" },
                                    { title: "Understanding BPM and Beat Matching", type: "Video", duration: "18 min" },
                                    { title: "Basic Mixing Techniques", type: "Reading", duration: "10 min" },
                                    { title: "Your First Mix Practice", type: "Quiz", duration: "5 min" },
                                    { title: "Reading the Crowd Basics", type: "Video", duration: "12 min" },
                                    { title: "Music Library Organization", type: "Reading", duration: "8 min" },
                                    { title: "EQ and Volume Control", type: "Video", duration: "14 min" },
                                    { title: "Final Assessment", type: "Quiz", duration: "10 min" }
                                ],
                                2: [ // Advanced Mixing
                                    { title: "Advanced Beatmatching Techniques", type: "Video", duration: "20 min" },
                                    { title: "Harmonic Mixing Theory", type: "Reading", duration: "15 min" },
                                    { title: "Creative Transition Methods", type: "Video", duration: "25 min" },
                                    { title: "Harmonic Key Knowledge Test", type: "Quiz", duration: "8 min" },
                                    { title: "Loop Rolling and Effects", type: "Video", duration: "22 min" },
                                    { title: "Advanced EQ Techniques", type: "Reading", duration: "12 min" },
                                    { title: "Live Performance Skills", type: "Video", duration: "18 min" },
                                    { title: "Master Class Assessment", type: "Quiz", duration: "15 min" }
                                ]
                            };
                            
                            const lessons = lessonsByCourse[course.id] || lessonsByCourse[1];
                            
                            return lessons.map((lesson, i) => (
                                <li key={i} className="flex items-center gap-4 p-4 hover:bg-[color:var(--surface-alt)] cursor-pointer">
                                    <div className="text-[color:var(--muted)]">
                                        {lesson.type === 'Video' ? <VideoIcon className="w-5 h-5"/> : lesson.type === 'Reading' ? <FileTextIcon className="w-5 h-5" /> : <HelpCircleIcon className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-medium text-[color:var(--text-primary)]">Lesson {i+1}: {lesson.title}</p>
                                        <p className="text-sm text-[color:var(--muted)]">{lesson.type} &bull; {lesson.duration}</p>
                                    </div>
                                     <div className={`w-5 h-5 rounded-full border-2 ${i < 3 ? 'border-[color:var(--accent)] bg-[color:var(--accent)]' : 'border-[color:var(--border)]'}`}></div>
                                </li>
                            ));
                        })()}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Community Page
export const CommunityPage: React.FC = () => {
    const [showEventCreator, setShowEventCreator] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Load events from shared database
    useEffect(() => {
        const loadEvents = async () => {
            try {
                // Test Supabase connection first
                const { testSupabaseConnection } = await import('../../services/profileService');
                const isConnected = await testSupabaseConnection();
                console.log('🔍 SUPABASE CONNECTION:', isConnected ? 'WORKING' : 'FAILED');
                
                const { fetchEvents } = await import('../../services/eventService');
                const eventData = await fetchEvents();
                console.log('🎪 EVENTS LOADED:', eventData.length, 'events');
                setEvents(eventData);
            } catch (error) {
                console.error('Failed to load events:', error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    const handleEventCreated = async (event: any) => {
        try {
            const { createEvent } = await import('../../services/eventService');
            const createdEvent = await createEvent(event);
            setEvents(prev => [createdEvent, ...prev]);
        } catch (error) {
            console.error('Failed to create event:', error);
        }
    };

    const handleApplicationSubmitted = async (application: any) => {
        try {
            const { submitApplication } = await import('../../services/eventService');
            await submitApplication(application);
            setEvents(prev => prev.map(event => 
                event.id === application.eventId 
                    ? { ...event, applications: [...(event.applications || []), application] }
                    : event
            ));
        } catch (error) {
            console.error('Failed to submit application:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-display text-3xl font-bold">Event Marketplace</h1>
                    <p className="mt-1 text-[color:var(--text-secondary)]">Create events and book DJs instantly.</p>
                </div>
                <Button 
                    onClick={() => setShowEventCreator(true)}
                    className="px-6 py-3 bg-[color:var(--accent)] text-black font-semibold"
                >
                    + Create Event
                </Button>
            </div>

            {/* Events Grid */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--accent)]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-4 flex justify-center">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-purple-500">
                                <path d="M3 21h18l-9-18-9 18z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                                <path d="M12 3v18" stroke="white" strokeWidth="2"/>
                                <path d="M8 21l4-8 4 8" stroke="white" strokeWidth="1.5" fill="none"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-[color:var(--text-secondary)] mb-2">No events yet</h3>
                        <p className="text-[color:var(--muted)] mb-6">Be the first to create an event and find amazing DJs!</p>
                        <Button onClick={() => setShowEventCreator(true)}>Create First Event</Button>
                    </div>
                ) : (
                    events.map(event => (
                        <div key={event.id} className="bg-[color:var(--surface)] rounded-xl p-6 border border-[color:var(--border)] hover:border-[color:var(--accent)] transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="font-bold text-lg text-[color:var(--text-primary)]">{event.title}</h3>
                                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">{event.status}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[color:var(--text-secondary)] mb-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-500">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="currentColor"/>
                                    <circle cx="12" cy="10" r="3" fill="white"/>
                                </svg>
                                {event.venue}
                            </div>
                            <div className="flex items-center gap-2 text-[color:var(--text-secondary)] mb-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="currentColor"/>
                                    <line x1="16" y1="2" x2="16" y2="6" stroke="white" strokeWidth="2"/>
                                    <line x1="8" y1="2" x2="8" y2="6" stroke="white" strokeWidth="2"/>
                                    <line x1="3" y1="10" x2="21" y2="10" stroke="white" strokeWidth="2"/>
                                </svg>
                                {event.date} at {event.time}
                            </div>
                            <div className="flex items-center gap-2 text-[color:var(--text-secondary)] mb-4">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-500">
                                    <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" fill="none"/>
                                </svg>
                                ${event.budget}
                            </div>
                            <div className="flex flex-wrap gap-1 mb-4">
                                {event.genres.slice(0, 3).map((genre: string) => (
                                    <span key={genre} className="text-xs bg-[color:var(--accent)]/20 text-[color:var(--accent)] px-2 py-1 rounded-full">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm text-[color:var(--text-secondary)] mb-4 line-clamp-2">{event.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[color:var(--text-secondary)]">
                                    {event.applications?.length || 0} applications
                                </span>
                                <Button 
                                    onClick={() => setSelectedEvent(event)}
                                    className="px-4 py-2"
                                >
                                    Apply as DJ
                                </Button>
                            </div>
                        </div>
                    ))
                    )}
                </div>
            )}

            {/* Event Creator Modal */}
            {showEventCreator && (
                <div className="fixed inset-0 z-50">
                    <EventCreator
                        onClose={() => setShowEventCreator(false)}
                        onEventCreated={handleEventCreated}
                    />
                </div>
            )}

            {/* DJ Application Modal */}
            {selectedEvent && (
                <DJApplicationModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onApplicationSubmitted={handleApplicationSubmitted}
                />
            )}
        </div>
    );
};

// ⚠️ CRITICAL: DO NOT MODIFY CORE SWIPING STRUCTURE BELOW
// Enhanced with real profile integration while preserving v1 backup functionality
// Only modify UI/styling, never touch: handleSwipe, triggerSwipe, card mapping logic

// DJ loading comments
const DJ_LOADING_COMMENTS = [
    "🎧 Dropping the beat... Finding your perfect mix!",
    "🔥 Spinning up some fresh connections...",
    "🎵 Beatmatching your vibe with other DJs...",
    "⚡ Syncing frequencies... Almost ready to drop!",
    "🎶 Curating the perfect playlist of DJs for you...",
    "🚀 Loading the decks... Prepare for takeoff!",
    "💫 Mixing magic in progress...",
    "🎤 Warming up the crowd... DJs incoming!"
];

// Discover Page (Tinder-like DJ matching)
export const OpportunitiesPage: React.FC = () => {
    const [view, setView] = useState<'swipe' | 'list'>('swipe');
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingComment, setLoadingComment] = useState(DJ_LOADING_COMMENTS[0]);
    const [matchResult, setMatchResult] = useState<{show: boolean, isMatch: boolean}>({show: false, isMatch: false});
    const [lastSwipedProfile, setLastSwipedProfile] = useState<Opportunity | null>(null);

    // ULTRA-FAST LOADING: Instant access with aggressive caching
    const loadProfiles = useCallback(async () => {
        try {
            // Skip profile creation - just fetch immediately
            const { fetchSwipeProfiles } = await import('../../services/profileService');
            const profiles = await fetchSwipeProfiles();
            setOpportunities(profiles);
            setLoading(false);
            
            // Background sync (non-blocking)
            requestIdleCallback(async () => {
                try {
                    const { createProfile } = await import('../../services/profileService');
                    await createProfile({dj_name: 'New DJ', bio: 'Getting started'});
                } catch (error) {
                    // Ignore errors in background tasks
                }
            });
        } catch (error) {
            setOpportunities([]);
            setLoading(false);
        }
    }, []);

    // Preload profile images for faster loading
    useProfileImagePreloader(opportunities.slice(0, 10), opportunities.length > 0);

    // Preload profiles immediately on component mount
    useEffect(() => {
        // Start loading immediately without delay
        loadProfiles();
        
        // Preload next batch in background
        const preloadTimer = setTimeout(() => {
            requestIdleCallback(async () => {
                const { fetchSwipeProfiles } = await import('../../services/profileService');
                fetchSwipeProfiles().then(profiles => {
                    // Cache next batch for instant access
                    if (profiles.length > opportunities.length) {
                        setOpportunities(prev => [...prev, ...profiles.slice(prev.length)]);
                    }
                }).catch(() => {});
            });
        }, 2000);
        
        return () => clearTimeout(preloadTimer);
    }, []);

    // GENNADY OPTIMIZATION: Optimistic updates
    const handleSwipe = useCallback(async (direction?: 'left' | 'right' | 'super') => {
        if (opportunities.length === 0 || !direction) return;
        
        const currentProfile = opportunities[0];
        setLastSwipedProfile(currentProfile);
        setOpportunities(prev => prev.slice(1));
        
        requestIdleCallback(async () => {
            try {
                const { recordSwipe } = await import('../../services/profileService');
                const result = await recordSwipe(currentProfile.id, direction);
                if (result?.match) {
                    setMatchResult({show: true, isMatch: true});
                    setTimeout(() => setMatchResult({show: false, isMatch: false}), 3000);
                }
            } catch (error: any) {
                // SILENT ERROR HANDLING: Don't disrupt UX for expected database conflicts
                const isExpectedError = 
                    error?.status === 409 || // Duplicate swipe
                    error?.status === 406 || // Not acceptable
                    error?.code === '23505' || // Unique constraint
                    error?.message?.includes('already exists') ||
                    error?.message?.includes('duplicate');
                
                if (!isExpectedError) {
                    console.warn('⚠️ SWIPE WARNING:', error?.message || 'Unknown swipe error');
                }
                // Always continue - don't break user flow
            }
        });
    }, [opportunities]);
    
    const handleUndo = async () => {
        if (lastSwipedProfile) {
            setOpportunities(prev => [lastSwipedProfile, ...prev]);
            setLastSwipedProfile(null);
            
            try {
                const { undoSwipe } = await import('../../services/profileService');
                await undoSwipe();
            } catch (error) {
                console.error('Failed to undo swipe:', error);
            }
        }
    };
    
    // ⚠️ PROTECTED: Animation trigger - DO NOT MODIFY
    const triggerSwipe = (direction: 'left' | 'right' | 'super') => {
        const topCard = document.querySelector<HTMLElement>('[data-swipe-card="true"]');
        if (topCard) {
            topCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            if (direction === 'super') {
                topCard.classList.add('swipe-out-super');
            } else {
                topCard.classList.add(direction === 'right' ? 'swipe-out-right' : 'swipe-out-left');
            }
            topCard.addEventListener('animationend', () => handleSwipe(direction), { once: true });
        }
    };

    return (
        <div className="flex flex-col h-full p-4">
            {/* Segmented Control - Moved to top */}
            <div className="flex-shrink-0 flex justify-center border-b border-[color:var(--border)] mb-2">
                <div className="flex space-x-8">
                    <button onClick={() => setView('swipe')} className={`relative py-2 px-4 font-medium transition-colors ${view === 'swipe' ? 'text-[color:var(--accent)]' : 'text-[color:var(--muted)] hover:text-[color:var(--text-primary)]'}`}>
                        Discover
                        {view === 'swipe' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[color:var(--accent)]"></span>}
                    </button>
                    <button onClick={() => setView('list')} className={`relative py-2 px-4 font-medium transition-colors ${view === 'list' ? 'text-[color:var(--accent)]' : 'text-[color:var(--muted)] hover:text-[color:var(--text-primary)]'}`}>
                        Chat
                        {view === 'list' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[color:var(--accent)]"></span>}
                    </button>
                </div>
            </div>

            {/* Match Notification */}
            {matchResult.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-8 rounded-2xl text-center text-white max-w-sm mx-4">
                        <div className="mb-4 flex justify-center">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-pink-500">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                                <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">It's a Match!</h2>
                        <p className="text-white/90">You and {opportunities[0]?.title} liked each other</p>
                        <Button className="mt-6 bg-white text-purple-600 hover:bg-gray-100">
                            Send Message
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex-grow flex items-center justify-center py-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--accent)]"></div>
                        <p className="text-[color:var(--text-secondary)] text-center max-w-xs animate-pulse">{loadingComment}</p>
                    </div>
                ) : view === 'swipe' ? (
                    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
                        <div className="relative h-[500px] w-full">
                            {opportunities.length > 0 ? (
                                // ⚠️ PROTECTED: Card mapping logic - DO NOT MODIFY array operations, zIndex, or data-swipe-card
                                opportunities.slice(0, 3).map((op, index) => (
                                    <div key={op.id} style={{ 
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        zIndex: 3 - index,
                                        transform: `scale(${1 - (Math.min(index, 2) * 0.05)}) translateY(-${Math.min(index, 2) * 10}px)`,
                                    }}>
                                        <UltraFastSwipeCard
                                            opportunity={op}
                                            onSwipe={handleSwipe}
                                            onCardLeftScreen={(id) => {
                                                setOpportunities(prev => prev.filter(opp => opp.id !== id));
                                            }}
                                        />
                                    </div>
                                )).reverse() // ⚠️ PROTECTED: .reverse() is critical for proper stacking
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full w-full rounded-xl bg-[color:var(--surface)] border-2 border-dashed border-[color:var(--border)]">
                                    <p className="text-lg font-semibold text-[color:var(--text-secondary)]">No more DJs to discover!</p>
                                    <p className="text-sm text-[color:var(--muted)] mb-4">Check back later for new profiles or invite friends to join.</p>
                                    <Button onClick={() => window.location.reload()} variant="secondary">
                                        Refresh
                                    </Button>
                                </div>
                            )}
                        </div>
                        {opportunities.length > 0 && (
                            <div className="mt-8 flex items-center gap-4">
                                <button onClick={() => triggerSwipe('left')} className="flex items-center justify-center w-14 h-14 rounded-full bg-[color:var(--surface)] text-[#EF4444] shadow-soft hover:scale-105 transition-transform">
                                    <XIcon className="w-6 h-6" />
                                </button>
                                <button onClick={() => triggerSwipe('super')} className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white shadow-soft hover:scale-105 transition-transform">
                                    <StarIcon className="w-5 h-5" fill="currentColor" />
                                </button>
                                <button onClick={() => triggerSwipe('right')} className="flex items-center justify-center w-16 h-16 rounded-full bg-[color:var(--accent)] text-black shadow-elev hover:scale-105 transition-transform">
                                    <HeartIcon className="w-8 h-8" fill="currentColor" />
                                </button>
                            </div>
                        )}
                        {lastSwipedProfile && (
                            <div className="mt-4">
                                <button onClick={handleUndo} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--surface)] text-[color:var(--accent)] shadow-soft hover:scale-105 transition-transform">
                                    <UndoIcon className="w-4 h-4" />
                                    <span className="text-sm font-medium">Undo</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <MatchesList />
                )}
            </div>
        </div>
    );
};

// Settings Page
export const SettingsPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { navigate } = useContext(AppContext)!;
    const [migrating, setMigrating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || ''
    });
    const [currentView, setCurrentView] = useState<'settings' | 'subscription' | 'billing'>('settings');
    const [showAdminTools, setShowAdminTools] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    
    const handleMigration = async () => {
        setMigrating(true);
        try {
            const { migrateDjNames } = await import('../../services/profileService');
            await migrateDjNames();
            alert('✅ Migration completed! All DJ names updated from OAuth/email.');
        } catch (error) {
            console.error('Migration error:', error);
            alert('❌ Migration failed. Check console for details.');
        }
        setMigrating(false);
    };

    const handleAdminAccess = () => {
        if (adminPassword === 'djelite999') {
            setShowAdminTools(true);
            setAdminPassword('');
        } else {
            alert('❌ Incorrect password');
            setAdminPassword('');
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const { supabase } = await import('../../services/profileService');
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                const { error } = await supabase.auth.updateUser({
                    data: { name: formData.name }
                });
                
                if (error) throw error;
                alert('✅ Profile updated successfully!');
            }
        } catch (error: any) {
            console.error('Profile update error:', error);
            alert(`❌ Failed to update profile: ${error.message}`);
        }
        setSaving(false);
    };

    if (currentView === 'subscription') {
        return (
            <div className="min-h-full bg-[color:var(--bg)] text-[color:var(--text-primary)] p-6">
                <div className="flex items-center gap-4 mb-6">
                    <button 
                        onClick={() => setCurrentView('settings')}
                        className="flex items-center gap-2 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                        Back to Settings
                    </button>
                </div>
                <h1 className="font-display text-3xl font-bold">Manage Subscription</h1>
                <p className="mt-1 text-[color:var(--text-secondary)]">Manage your subscription and billing preferences.</p>

                <div className="mt-8 max-w-2xl space-y-6">
                    <div className="rounded-xl bg-[color:var(--surface)] p-6 shadow-soft border border-[color:var(--border)]">
                        <h2 className="font-display text-xl font-bold mb-4">Current Plan</h2>
                        <div className="flex items-center justify-between p-4 bg-[color:var(--surface-alt)] rounded-lg">
                            <div>
                                <h3 className="font-semibold text-lg">{currentUser?.plan || 'Free Plan'}</h3>
                                <p className="text-[color:var(--text-secondary)]">Active since January 2024</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">$19</p>
                                <p className="text-[color:var(--text-secondary)]">per month</p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <Button>Upgrade Plan</Button>
                            <Button variant="secondary">Cancel Subscription</Button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-[color:var(--surface)] p-6 shadow-soft border border-[color:var(--border)]">
                        <h2 className="font-display text-xl font-bold mb-4">Payment Method</h2>
                        <div className="flex items-center gap-4 p-4 bg-[color:var(--surface-alt)] rounded-lg">
                            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                VISA
                            </div>
                            <div>
                                <p className="font-medium">•••• •••• •••• 4242</p>
                                <p className="text-[color:var(--text-secondary)] text-sm">Expires 12/25</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button variant="secondary">Update Payment Method</Button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-[color:var(--surface)] p-6 shadow-soft border border-[color:var(--border)]">
                        <h2 className="font-display text-xl font-bold mb-4">Billing History</h2>
                        <div className="space-y-3">
                            {[
                                { date: 'Jan 15, 2024', amount: '$19.00', status: 'Paid' },
                                { date: 'Dec 15, 2023', amount: '$19.00', status: 'Paid' },
                                { date: 'Nov 15, 2023', amount: '$19.00', status: 'Paid' }
                            ].map((invoice, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-[color:var(--surface-alt)] rounded-lg">
                                    <div>
                                        <p className="font-medium">{invoice.date}</p>
                                        <p className="text-[color:var(--text-secondary)] text-sm">Monthly subscription</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{invoice.amount}</p>
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">{invoice.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Button 
                                variant="secondary" 
                                onClick={() => setCurrentView('billing')}
                            >
                                View All Invoices
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === 'billing') {
        return (
            <div className="min-h-full bg-[color:var(--bg)] text-[color:var(--text-primary)] p-6">
                <div className="flex items-center gap-4 mb-6">
                    <button 
                        onClick={() => setCurrentView('subscription')}
                        className="flex items-center gap-2 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                        Back to Subscription
                    </button>
                </div>
                <h1 className="font-display text-3xl font-bold">Billing History</h1>
                <p className="mt-1 text-[color:var(--text-secondary)]">View and download your invoices.</p>

                <div className="mt-8 max-w-4xl">
                    <div className="rounded-xl bg-[color:var(--surface)] border border-[color:var(--border)] overflow-hidden">
                        <div className="p-6 border-b border-[color:var(--border)]">
                            <h2 className="font-display text-xl font-bold">All Invoices</h2>
                        </div>
                        <div className="divide-y divide-[color:var(--border)]">
                            {[
                                { id: 'INV-2024-001', date: 'Jan 15, 2024', amount: '$19.00', status: 'Paid', description: 'Pro Monthly Subscription' },
                                { id: 'INV-2023-012', date: 'Dec 15, 2023', amount: '$19.00', status: 'Paid', description: 'Pro Monthly Subscription' },
                                { id: 'INV-2023-011', date: 'Nov 15, 2023', amount: '$19.00', status: 'Paid', description: 'Pro Monthly Subscription' },
                                { id: 'INV-2023-010', date: 'Oct 15, 2023', amount: '$19.00', status: 'Paid', description: 'Pro Monthly Subscription' },
                                { id: 'INV-2023-009', date: 'Sep 15, 2023', amount: '$19.00', status: 'Paid', description: 'Pro Monthly Subscription' }
                            ].map((invoice) => (
                                <div key={invoice.id} className="p-6 hover:bg-[color:var(--surface-alt)] transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">{invoice.id}</h3>
                                            <p className="text-[color:var(--text-secondary)] text-sm">{invoice.description}</p>
                                            <p className="text-[color:var(--muted)] text-sm">{invoice.date}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-medium">{invoice.amount}</p>
                                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">{invoice.status}</span>
                                            </div>
                                            <Button variant="secondary" className="text-sm px-3 py-1">
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[color:var(--bg)] text-[color:var(--text-primary)] p-6">
            <h1 className="font-display text-3xl font-bold">Settings</h1>
            <p className="mt-1 text-[color:var(--text-secondary)]">Manage your account and preferences.</p>

            <div className="mt-8 max-w-2xl space-y-8">
                 <div className="rounded-xl bg-[color:var(--surface)] p-6 shadow-soft border border-[color:var(--border)]">
                    <h2 className="font-display text-xl font-bold">Profile</h2>
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-[color:var(--text-secondary)]">Full Name</label>
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="mt-1 block w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface-alt)] p-3 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)] outline-none" 
                            />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-[color:var(--text-secondary)]">Email Address</label>
                            <input 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="mt-1 block w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface-alt)] p-3 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)] outline-none" 
                            />
                        </div>
                    </div>
                     <div className="mt-6">
                        <Button 
                            onClick={handleSaveProfile}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl bg-[color:var(--surface)] p-6 shadow-soft border border-[color:var(--border)]">
                    <h2 className="font-display text-xl font-bold">Subscription</h2>
                     <p className="mt-4 text-[color:var(--text-secondary)]">You are currently on the <span className="font-semibold text-[color:var(--text-primary)]">{currentUser?.plan || 'Free'}</span> plan.</p>
                     <div className="mt-6 flex gap-4">
                         <Button onClick={() => setCurrentView('subscription')}>Manage Subscription</Button>
                         <Button 
                             variant="secondary" 
                             onClick={async () => {
                                 try {
                                     const { createPortalSession } = await import('../../services/stripeService');
                                     const portalUrl = await createPortalSession('cus_example');
                                     window.location.href = portalUrl;
                                 } catch (error) {
                                     setCurrentView('billing');
                                 }
                             }}
                         >
                             View Billing History
                         </Button>
                     </div>
                </div>
                
                {!showAdminTools ? (
                    <div className="rounded-xl bg-[color:var(--surface)] p-6 shadow-soft border border-[color:var(--border)]">
                        <h2 className="font-display text-xl font-bold">Admin Access</h2>
                        <p className="mt-4 text-[color:var(--text-secondary)]">Enter admin password to access advanced tools.</p>
                        <div className="mt-6 flex gap-4">
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAdminAccess()}
                                placeholder="Admin password"
                                className="flex-1 px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)] outline-none"
                            />
                            <Button onClick={handleAdminAccess}>Access</Button>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl bg-[color:var(--surface)] p-6 shadow-soft border border-[color:var(--border)]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-display text-xl font-bold">Admin Tools</h2>
                            <button 
                                onClick={() => setShowAdminTools(false)}
                                className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                            >
                                Hide
                            </button>
                        </div>
                        <p className="mt-4 text-[color:var(--text-secondary)]">Update all user DJ names from their OAuth providers or email addresses.</p>
                        <div className="mt-6">
                            <Button 
                                onClick={handleMigration}
                                disabled={migrating}
                                className={`${migrating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {migrating ? '⏳ Updating Names...' : '⚙️ Update All DJ Names'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Matches List Component
const MatchesList: React.FC = () => {
    const { matches, isLoading, unmatch, isUnmatching } = useMatches();
    const [selectedMatch, setSelectedMatch] = useState<any>(null);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
    const [lastMessages, setLastMessages] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [loadingComment, setLoadingComment] = useState(DJ_LOADING_COMMENTS[Math.floor(Math.random() * DJ_LOADING_COMMENTS.length)]);

    // Load unread message counts and last messages for each match
    useEffect(() => {
        const loadChatData = async () => {
            if (matches.length === 0) {
                setLoading(false);
                return;
            }

            // Cycle through loading comments
            const commentInterval = setInterval(() => {
                setLoadingComment(prev => {
                    const currentIndex = DJ_LOADING_COMMENTS.indexOf(prev);
                    return DJ_LOADING_COMMENTS[(currentIndex + 1) % DJ_LOADING_COMMENTS.length];
                });
            }, 1500);

            try {
                const { supabase } = await import('../../services/profileService');
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: userProfile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('user_id', user.id)
                    .single();

                if (!userProfile) return;

                const unreadData: Record<string, number> = {};
                const lastMessageData: Record<string, any> = {};

                for (const match of matches) {
                    // Get unread count
                    const { count } = await supabase
                        .from('messages')
                        .select('*', { count: 'exact', head: true })
                        .eq('match_id', match.match_id)
                        .neq('sender_id', userProfile.id)
                        .is('read_at', null);

                    unreadData[match.match_id] = count || 0;

                    // Get last message
                    const { data: lastMessage } = await supabase
                        .from('messages')
                        .select(`
                            *,
                            sender:profiles!messages_sender_id_fkey(dj_name, profile_image_url)
                        `)
                        .eq('match_id', match.match_id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single();

                    if (lastMessage) {
                        lastMessageData[match.match_id] = {
                            ...lastMessage,
                            sender_name: lastMessage.sender?.dj_name,
                            sender_avatar: lastMessage.sender?.profile_image_url,
                            isFromCurrentUser: lastMessage.sender_id === userProfile.id
                        };
                    }
                }

                setUnreadCounts(unreadData);
                setLastMessages(lastMessageData);
            } catch (error) {
                console.error('Failed to load chat data:', error);
            } finally {
                clearInterval(commentInterval);
                setLoading(false);
            }
        };

        loadChatData();
    }, [matches]);

    const handleDeleteMatch = async (matchId: number) => {
        try {
            console.log('🔥 UNMATCHING:', matchId);
            const { deleteMatch } = await import('../../services/profileService');
            await deleteMatch(matchId); // Assuming unmatch internally calls deleteMatch
            console.log('✅ UNMATCH SUCCESS: They won\'t appear again until you both swipe right');
        } catch (error) {
            console.error('❌ UNMATCH FAILED:', error);
        }
    };

    if (isLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--accent)]"></div>
                <p className="text-[color:var(--text-secondary)] text-center max-w-xs animate-pulse">{loadingComment}</p>
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className="text-center py-12">
                <HeartIcon className="w-16 h-16 mx-auto text-[color:var(--muted)] mb-4" />
                <h3 className="text-lg font-semibold text-[color:var(--text-secondary)] mb-2">No matches yet</h3>
                <p className="text-[color:var(--muted)]">Start swiping to find your perfect DJ connections!</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <ul className="space-y-4">
                {matches.map(match => {
                    const unreadCount = unreadCounts[match.match_id] || 0;
                    const lastMessage = lastMessages[match.match_id];
                    const isUnread = unreadCount > 0;
                    
                    return (
                        <li key={match.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg p-4 border transition-all ${
                            isUnread 
                                ? 'bg-[color:var(--accent)]/10 border-[color:var(--accent)]/50 shadow-[0_0_20px_-5px_rgba(0,245,122,0.3)]' 
                                : 'bg-[color:var(--surface)] border-[color:var(--border)]'
                        }`}>
                            <div className="relative flex-shrink-0">
                                <ProfileThumbnail 
                            src={match.images?.[0] || match.imageUrl} 
                            alt={match.dj_name} 
                            size="lg"
                        />
                                {isUnread && (
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[color:var(--accent)] text-black rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className={`font-bold truncate ${
                                        isUnread ? 'text-[color:var(--accent)]' : 'text-[color:var(--text-primary)]'
                                    }`}>{match.dj_name}</h3>
                                    {isUnread && <div className="w-2 h-2 bg-[color:var(--accent)] rounded-full animate-pulse"></div>}
                                </div>
                                <p className="text-sm text-[color:var(--text-secondary)] truncate">{match.location} • {match.age} years</p>
                                {lastMessage && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <img 
                                            src={lastMessage.isFromCurrentUser ? (match.images?.[0] || match.imageUrl) : lastMessage.sender_avatar} 
                                            alt="" 
                                            className="w-4 h-4 rounded-full object-cover"
                                        />
                                        <p className={`text-xs truncate max-w-48 ${
                                            isUnread && !lastMessage.isFromCurrentUser 
                                                ? 'text-[color:var(--accent)] font-semibold' 
                                                : 'text-[color:var(--muted)]'
                                        }`}>
                                            {lastMessage.isFromCurrentUser ? 'You: ' : ''}{lastMessage.content}
                                        </p>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {match.genres?.slice(0, 2).map((genre: string) => (
                                        <span key={genre} className="text-xs bg-[color:var(--accent)]/20 text-[color:var(--accent)] px-2 py-0.5 rounded-full">{genre}</span>
                                    ))}
                                    {match.skills?.slice(0, 2).map((skill: string) => (
                                        <span key={skill} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{skill}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <button 
                                    onClick={() => {
                                        console.log('💬 MESSAGING: Using match_id:', match.match_id, 'for profile:', match.id);
                                        setSelectedMatch({...match, id: match.match_id}); // Use match_id as the chat ID
                                    }}
                                    className={`px-3 py-1.5 text-sm rounded hover:scale-105 transition-transform font-semibold relative ${
                                        isUnread 
                                            ? 'bg-[color:var(--accent)] text-black animate-pulse' 
                                            : 'bg-[color:var(--accent)]/80 text-black'
                                    }`}
                                >
                                    Message
                                    {isUnread && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                                    )}
                                </button>
                                <button 
                                    onClick={() => {
                                        console.log('🔍 DB DEBUG: Deleting match_id:', match.match_id, 'profile_id:', match.id);
                                        handleDeleteMatch(match.match_id);
                                    }}
                                    className="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                                >
                                    Unmatch
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
            
            {selectedMatch && (
                <div className="fixed inset-0 z-50">
                    <ChatInterface
                        matchId={selectedMatch.id} // This is now the match_id
                        matchName={selectedMatch.dj_name}
                        matchAvatar={selectedMatch.images?.[0] || selectedMatch.imageUrl}
                        onClose={() => setSelectedMatch(null)}
                    />
                </div>
            )}
        </div>
    );
};

// Profile Page - Inline Profile Editor
export const ProfilePage: React.FC = () => {
    return (
        <div className="min-h-full bg-[color:var(--bg)] text-[color:var(--text-primary)] p-6">
            <h1 className="font-display text-3xl font-bold mb-6">Edit Profile</h1>
            <div className="max-w-4xl">
                <InlineProfileEditor />
            </div>
        </div>
    );
};

// Profile cache for instant loading
let profileCache: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Inline Profile Editor Component
const InlineProfileEditor: React.FC = () => {
    const [profile, setProfile] = useState<any>(profileCache || {});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(!profileCache);
    const [additionalImages, setAdditionalImages] = useState<string[]>(['', '', '']);
    const [hasAdvanced, setHasAdvanced] = useState(false);
    const [hasContact, setHasContact] = useState(false);

    useEffect(() => {
        // Load data in parallel for maximum speed
        Promise.all([
            loadProfile(),
            checkPremiumFeatures()
        ]).finally(() => setInitialLoading(false));
    }, []);
    
    const checkPremiumFeatures = async () => {
        try {
            // Use cached result if available
            const cacheKey = 'premium_features';
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const { advanced, contact } = JSON.parse(cached);
                setHasAdvanced(advanced);
                setHasContact(contact);
                return;
            }

            const { hasAdvancedProfile, hasDirectContact } = await import('../../services/subscriptionService');
            const [advanced, contact] = await Promise.all([
                hasAdvancedProfile(),
                hasDirectContact()
            ]);
            
            // Cache the result
            sessionStorage.setItem(cacheKey, JSON.stringify({ advanced, contact }));
            setHasAdvanced(advanced);
            setHasContact(contact);
        } catch (error) {
            console.error('Failed to check premium features:', error);
            // Set defaults on error
            setHasAdvanced(false);
            setHasContact(false);
        }
    };

    const loadProfile = async () => {
        try {
            // Check cache first
            const now = Date.now();
            if (profileCache && (now - cacheTimestamp) < CACHE_DURATION) {
                setProfile(profileCache);
                if (profileCache.images) {
                    setAdditionalImages(profileCache.images.slice(1, 4).concat(['', '', '']).slice(0, 3));
                }
                return;
            }

            const { getCurrentProfile } = await import('../../services/profileService');
            const currentProfile = await getCurrentProfile();
            if (currentProfile) {
                // Update cache
                profileCache = currentProfile;
                cacheTimestamp = now;
                
                setProfile(currentProfile);
                if (currentProfile.images) {
                    setAdditionalImages(currentProfile.images.slice(1, 4).concat(['', '', '']).slice(0, 3));
                }
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
            setInitialLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number = 0) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return;
        }

        setLoading(true);
        try {
            const { uploadProfileImage } = await import('../../services/profileService');
            const imageUrl = await uploadProfileImage(file);
            
            if (index === 0) {
                setProfile({...profile, profile_image_url: imageUrl});
            } else {
                const newImages = [...additionalImages];
                newImages[index - 1] = imageUrl;
                setAdditionalImages(newImages);
            }
        } catch (error: any) {
            alert(`Failed to upload image: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedProfile = {
                dj_name: profile.dj_name,
                age: profile.age,
                location: profile.location,
                bio: profile.bio,
                profile_image_url: profile.profile_image_url,
                images: [profile.profile_image_url, ...additionalImages].filter(img => img && img.trim()),
                genres: profile.genres || [],
                skills: profile.skills || [],
                venues: profile.venues || [],
                fee: profile.fee,
                website: profile.website,
                social_links: profile.social_links,
                contact_info: profile.contact_info,
                premium_badge: hasAdvanced
            };

            // Update cache immediately for instant feedback
            profileCache = { ...profile, ...updatedProfile };
            cacheTimestamp = Date.now();

            const { updateProfile } = await import('../../services/profileService');
            await updateProfile(updatedProfile);
            alert('Profile updated successfully!');
        } catch (error: any) {
            alert(`Failed to update profile: ${error.message}`);
            // Invalidate cache on error
            profileCache = null;
        } finally {
            setLoading(false);
        }
    };

    // Skeleton loading component
    const SkeletonInput = ({ width = "w-full" }: { width?: string }) => (
        <div className={`${width} h-12 bg-[color:var(--surface-alt)] rounded-xl animate-pulse flex items-center px-4`}>
            <div className="w-4 h-4 bg-[color:var(--muted)] rounded-full animate-spin mr-2"></div>
            <div className="h-2 bg-[color:var(--muted)] rounded flex-1 opacity-50"></div>
        </div>
    );

    const SkeletonTextarea = () => (
        <div className="w-full h-24 bg-[color:var(--surface-alt)] rounded-xl animate-pulse flex items-center px-4">
            <div className="w-4 h-4 bg-[color:var(--muted)] rounded-full animate-spin mr-2"></div>
            <div className="flex-1 space-y-2">
                <div className="h-2 bg-[color:var(--muted)] rounded opacity-50"></div>
                <div className="h-2 bg-[color:var(--muted)] rounded w-3/4 opacity-30"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile'}
                </Button>
            </div>

            {/* Profile Photos */}
            <div className="bg-[color:var(--surface)] rounded-xl p-6 border border-[color:var(--border)]">
                <div className="flex items-center gap-2 mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="currentColor"/>
                        <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="2" fill="none"/>
                    </svg>
                    <h3 className="text-lg font-semibold">Profile Photos</h3>
                </div>
                <p className="text-sm text-[color:var(--text-secondary)] mb-4">Upload up to 4 photos to get more matches</p>
                  
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Main profile picture */}
                    <div className="relative aspect-square">
                        {profile.profile_image_url ? (
                            <img 
                                src={profile.profile_image_url} 
                                alt="Profile" 
                                className="w-full h-full rounded-xl object-cover border-2 border-[color:var(--accent)]"
                            />
                        ) : (
                            <div className="w-full h-full rounded-xl bg-[color:var(--surface-alt)] border-2 border-[color:var(--accent)] flex items-center justify-center">
                                <svg className="w-16 h-16 text-[color:var(--text-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            </div>
                        )}
                        <label className="absolute bottom-2 right-2 w-8 h-8 bg-[color:var(--accent)] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                            <span className="text-black font-bold text-sm">+</span>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 0)} className="hidden" />
                        </label>
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">1</div>
                    </div>
                    
                    {/* Additional 3 pictures */}
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="relative aspect-square">
                            <img 
                                src={additionalImages[index - 1] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyNy42MTQgMTAwIDI1MCA4Ny42MTQyIDI1MCA2MEMyNTAgMzIuMzg1OCAyMjcuNjE0IDEwIDIwMCAxMEMxNzIuMzg2IDEwIDE1MCAzMi4zODU4IDE1MCA2MEMxNTAgODcuNjE0MiAxNzIuMzg2IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDM5MEgxMDBDMTAwIDMzMC4yIDEzOS44IDI4MCAyMDAgMjgwQzI2MC4yIDI4MCAzMDAgMzMwLjIgMzAwIDM5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'} 
                                alt={`Photo ${index + 1}`} 
                                className={`w-full h-full rounded-xl object-cover border-2 ${
                                    additionalImages[index - 1] ? 'border-[color:var(--accent)]' : 'border-dashed border-[color:var(--border)] opacity-50'
                                }`}
                            />
                            <label className="absolute bottom-2 right-2 w-8 h-8 bg-[color:var(--accent)] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                                <span className="text-black font-bold text-sm">+</span>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} className="hidden" />
                            </label>
                            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{index + 1}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Basic Info */}
            <div className="bg-[color:var(--surface)] rounded-xl p-6 border border-[color:var(--border)]">
                <div className="flex items-center gap-2 mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-500">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <circle cx="12" cy="7" r="4" fill="currentColor"/>
                    </svg>
                    <h3 className="text-lg font-semibold">Basic Info</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">DJ Name</label>
                        {initialLoading ? (
                            <SkeletonInput />
                        ) : (
                            <input
                                type="text"
                                value={profile.dj_name || ''}
                                onChange={(e) => setProfile({...profile, dj_name: e.target.value})}
                                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                                placeholder="DJ Awesome"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Age</label>
                        {initialLoading ? (
                            <SkeletonInput />
                        ) : (
                            <input
                                type="number"
                                value={profile.age || ''}
                                onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                                placeholder="25"
                            />
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Location</label>
                        {initialLoading ? (
                            <SkeletonInput />
                        ) : (
                            <input
                                type="text"
                                value={profile.location || ''}
                                onChange={(e) => setProfile({...profile, location: e.target.value})}
                                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                                placeholder="New York, NY"
                            />
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Bio</label>
                        {initialLoading ? (
                            <SkeletonTextarea />
                        ) : (
                            <textarea
                                value={profile.bio || ''}
                                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none resize-none"
                                rows={3}
                                placeholder="Tell other DJs about yourself..."
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Music Style */}
            <div className="bg-[color:var(--surface)] rounded-xl p-6 border border-[color:var(--border)]">
                <div className="flex items-center gap-2 mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-purple-500">
                        <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <circle cx="6" cy="18" r="3" fill="currentColor"/>
                        <circle cx="18" cy="16" r="3" fill="currentColor"/>
                    </svg>
                    <h3 className="text-lg font-semibold">Music Style</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Music Genres</label>
                        {initialLoading ? (
                            <SkeletonInput />
                        ) : (
                            <input
                                type="text"
                                value={profile.genres?.join(', ') || ''}
                                onChange={(e) => setProfile({...profile, genres: e.target.value.split(',').map(g => g.trim()).filter(g => g)})}
                                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                                placeholder="House, Techno, Deep House"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Skills</label>
                        {initialLoading ? (
                            <SkeletonInput />
                        ) : (
                            <input
                                type="text"
                                value={profile.skills?.join(', ') || ''}
                                onChange={(e) => setProfile({...profile, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                                placeholder="Mixing, Production, Scratching"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Venues</label>
                        <input
                            type="text"
                            value={profile.venues?.join(', ') || ''}
                            onChange={(e) => setProfile({...profile, venues: e.target.value.split(',').map(v => v.trim()).filter(v => v)})}
                            className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                            placeholder="Club XYZ, Festival ABC"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Typical Fee</label>
                        <input
                            type="text"
                            value={profile.fee || ''}
                            onChange={(e) => setProfile({...profile, fee: e.target.value})}
                            className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                            placeholder="$500-1000 or Negotiable"
                        />
                    </div>
                </div>
            </div>

            {/* Premium Features */}
            {hasAdvanced && (
                <div className="bg-[color:var(--surface)] rounded-xl p-6 border border-[color:var(--border)]">
                    <div className="flex items-center gap-2 mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                        </svg>
                        <h3 className="text-lg font-semibold">Premium Features</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Website</label>
                            <input
                                type="url"
                                value={profile.website || ''}
                                onChange={(e) => setProfile({...profile, website: e.target.value})}
                                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                                placeholder="https://your-website.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Instagram</label>
                            <input
                                type="url"
                                value={profile.social_links?.instagram || ''}
                                onChange={(e) => setProfile({...profile, social_links: {...(profile.social_links || {}), instagram: e.target.value}})}
                                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                                placeholder="Instagram URL"
                            />
                        </div>
                        {hasContact && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Contact Email</label>
                                    <input
                                        type="email"
                                        value={profile.contact_info?.email || ''}
                                        onChange={(e) => setProfile({...profile, contact_info: {...(profile.contact_info || {}), email: e.target.value}})}
                                        className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                                        placeholder="Contact Email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profile.contact_info?.phone || ''}
                                        onChange={(e) => setProfile({...profile, contact_info: {...(profile.contact_info || {}), phone: e.target.value}})}
                                        className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Referrals Page
export const ReferralsPage: React.FC = () => {
    return (
        <div className="min-h-full bg-[color:var(--bg)] text-[color:var(--text-primary)] p-6">
            <ReferralDashboard />
        </div>
    );
};

// Events Page (Locked)
export const EventsPage: React.FC = () => {
    return (
        <div className="flex flex-col h-full p-4">
            {/* Single tab - no segmented control */}
            <div className="flex-shrink-0 flex justify-center border-b border-[color:var(--border)] mb-2">
                <div className="flex">
                    <div className="relative py-2 px-4 font-medium text-[color:var(--accent)]">
                        Events
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[color:var(--accent)]"></span>
                    </div>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center py-1">
                <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto rounded-xl bg-[color:var(--surface)] border-2 border-dashed border-[color:var(--border)] p-8">
                    <div className="mb-4 flex justify-center">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-purple-500">
                            <path d="M3 21h18l-9-18-9 18z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                            <path d="M12 3v18" stroke="white" strokeWidth="2"/>
                            <path d="M8 21l4-8 4 8" stroke="white" strokeWidth="1.5" fill="none"/>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[color:var(--text-secondary)] mb-2">Events Dashboard</h3>
                    <p className="text-[color:var(--muted)] text-center mb-6">Manage your DJ events and bookings.</p>
                </div>
            </div>
        </div>
    );
};

// Free Course Page
export const FreeCoursePage: React.FC = () => {
    return (
        <div className="min-h-full bg-[color:var(--bg)] text-[color:var(--text-primary)]">
            <FreeCourseAccess />
        </div>
    );
};

// Premium Page
export const PremiumPage: React.FC = () => {
    return (
        <div className="w-full min-h-full bg-[color:var(--bg)] text-[color:var(--text-primary)]" data-page="premium">
            <div className="w-full px-6 py-6">
                <h1 className="font-display text-3xl font-bold">Premium Features</h1>
                <p className="mt-1 text-[color:var(--text-secondary)]">Unlock advanced features and boost your DJ career.</p>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Premium Feature Cards */}
                    <div className="bg-[color:var(--surface)] rounded-xl p-6 border border-[color:var(--border)] hover:border-[color:var(--accent)] transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">Premium Profile</h3>
                        </div>
                        <p className="text-[color:var(--text-secondary)] mb-4">Stand out with a premium badge, unlimited photos, and advanced profile features.</p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[color:var(--accent)] rounded-full"></span>
                                Premium badge on profile
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[color:var(--accent)] rounded-full"></span>
                                Unlimited photo uploads
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[color:var(--accent)] rounded-full"></span>
                                Advanced profile customization
                            </li>
                        </ul>
                    </div>

                    <div className="bg-[color:var(--surface)] rounded-xl p-6 border border-[color:var(--border)] hover:border-[color:var(--accent)] transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">Unlimited Matches</h3>
                        </div>
                        <p className="text-[color:var(--text-secondary)] mb-4">Connect with unlimited DJs and see who liked your profile first.</p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[color:var(--accent)] rounded-full"></span>
                                Unlimited swipes per day
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[color:var(--accent)] rounded-full"></span>
                                See who liked you
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[color:var(--accent)] rounded-full"></span>
                                Priority in discovery
                            </li>
                        </ul>
                    </div>

                    <div className="bg-[color:var(--surface)] rounded-xl p-6 border border-[color:var(--border)] hover:border-[color:var(--accent)] transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">Advanced Messaging</h3>
                        </div>
                        <p className="text-[color:var(--text-secondary)] mb-4">Enhanced messaging features to build better connections.</p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[color:var(--accent)] rounded-full"></span>
                                Read receipts
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[color:var(--accent)] rounded-full"></span>
                                Message reactions
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[color:var(--accent)] rounded-full"></span>
                                Voice messages
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="mt-12">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
                        <p className="text-[color:var(--text-secondary)]">Unlock your full potential as a DJ</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Free Plan */}
                        <div className="bg-[color:var(--surface)] rounded-xl p-6 border border-[color:var(--border)]">
                            <h3 className="text-xl font-bold mb-2">Free</h3>
                            <div className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal text-[color:var(--text-secondary)]">/month</span></div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        </svg>
                                    </span>
                                    Basic profile
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        </svg>
                                    </span>
                                    10 swipes per day
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        </svg>
                                    </span>
                                    Basic messaging
                                </li>
                            </ul>
                            <Button variant="secondary" className="w-full">Current Plan</Button>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-gradient-to-b from-[color:var(--accent)]/10 to-[color:var(--surface)] rounded-xl p-6 border-2 border-[color:var(--accent)] relative">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-[color:var(--accent)] text-black px-4 py-1 rounded-full text-sm font-bold">Most Popular</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Pro</h3>
                            <div className="text-3xl font-bold mb-4">$19<span className="text-sm font-normal text-[color:var(--text-secondary)]">/month</span></div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-[color:var(--accent)] rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-black">
                                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        </svg>
                                    </span>
                                    Premium profile badge
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-[color:var(--accent)] rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-black">
                                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        </svg>
                                    </span>
                                    Unlimited swipes
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-[color:var(--accent)] rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-black">
                                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        </svg>
                                    </span>
                                    See who liked you
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-[color:var(--accent)] rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-black">
                                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        </svg>
                                    </span>
                                    Advanced messaging
                                </li>
                            </ul>
                            <Button className="w-full">Upgrade to Pro</Button>
                        </div>

                        {/* Elite Plan */}
                        <div className="bg-[color:var(--surface)] rounded-xl p-6 border border-[color:var(--border)]">
                            <h3 className="text-xl font-bold mb-2">Elite</h3>
                            <div className="text-3xl font-bold mb-4">$39<span className="text-sm font-normal text-[color:var(--text-secondary)]">/month</span></div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        </svg>
                                    </span>
                                    Everything in Pro
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        </svg>
                                    </span>
                                    Priority support
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        </svg>
                                    </span>
                                    Exclusive events access
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        </svg>
                                    </span>
                                    Personal DJ coach
                                </li>
                            </ul>
                            <Button variant="secondary" className="w-full">Coming Soon</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};