import React, { useContext, useMemo, useState, useCallback, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../pages/HomePage';
import { useAuth } from '../../contexts/AuthContext';
import { Button, CourseCard, FaqItemComponent, PricingCard, OpportunitySwipeCard } from '../platform';
import { COURSES, FAQ_ITEMS, PRICING_PLANS, PlayCircleIcon, VideoIcon, FileTextIcon, HelpCircleIcon, XIcon, HeartIcon, StarIcon, UndoIcon, LockIcon, MOCK_OPPORTUNITIES } from '../../constants/platform';
import { fetchSwipeProfiles, recordSwipe, undoSwipe, fetchMatches, deleteMatch, createProfile } from '../../services/profileService';
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
                                src="/Swipe Right.png" 
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
                            alert('📧 Subscribed! You\'ll get weekly DJ tips and insights.');
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
    const inProgressCourse = COURSES.find(c => c.progress > 0 && c.progress < 100);
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="font-display text-3xl font-bold">Welcome back, {currentUser?.name.split(' ')[0]}!</h1>
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
                            {COURSES.slice(0, 2).map(course => <CourseCard key={course.id} course={course} />)}
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
    return (
         <div className="p-4 sm:p-6 md:p-8">
            <h1 className="font-display text-3xl font-bold">All Courses</h1>
            <p className="mt-1 text-[color:var(--text-secondary)]">Expand your skills and master the craft.</p>
            {/* Filters would go here */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {COURSES.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

// Course Detail Page
export const CourseDetailPage: React.FC = () => {
    const { appState, navigate } = useContext(AppContext)!;
    
    const course = useMemo(() => {
        return COURSES.find(c => c.id === appState.courseId);
    }, [appState.courseId]);

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
                        🔒 Locked - Upgrade to Pro
                    </Button>
                </div>
                <div className="border-t border-[color:var(--border)]">
                    <ul className="divide-y divide-[color:var(--border)]">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <li key={i} className="flex items-center gap-4 p-4 hover:bg-[color:var(--surface-alt)] cursor-pointer">
                                <div className="text-[color:var(--muted)]">
                                    {i % 3 === 0 ? <VideoIcon className="w-5 h-5"/> : i % 3 === 1 ? <FileTextIcon className="w-5 h-5" /> : <HelpCircleIcon className="w-5 h-5" />}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-medium text-[color:var(--text-primary)]">Lesson {i+1}: Introduction to Music Theory</p>
                                    <p className="text-sm text-[color:var(--muted)]">{i % 3 === 0 ? 'Video' : i % 3 === 1 ? 'Reading' : 'Quiz'} &bull; 12 min</p>
                                </div>
                                 <div className={`w-5 h-5 rounded-full border-2 ${i < 3 ? 'border-[color:var(--accent)] bg-[color:var(--accent)]' : 'border-[color:var(--border)]'}`}></div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Community Page
export const CommunityPage: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="font-display text-3xl font-bold">Community Hub</h1>
            <p className="mt-1 text-[color:var(--text-secondary)]">Connect, collaborate, and grow with fellow DJs.</p>

            {/* Mock Discord Embed */}
            <div className="mt-8 flex h-[70vh] w-full rounded-xl overflow-hidden border border-[color:var(--border)] bg-[color:var(--surface)]">
                {/* Channels */}
                <div className="w-60 flex-shrink-0 bg-[color:var(--surface-alt)] p-4">
                    <h2 className="font-bold text-sm text-[color:var(--muted)] mb-2">TEXT CHANNELS</h2>
                    <ul className="space-y-1">
                        <li className="p-2 rounded bg-[color:var(--elevated)] text-[color:var(--text-primary)] font-semibold"># general</li>
                        <li className="p-2 rounded hover:bg-[color:var(--elevated)] text-[color:var(--text-secondary)]"># feedback</li>
                        <li className="p-2 rounded hover:bg-[color:var(--elevated)] text-[color:var(--text-secondary)]"># gig-opportunities</li>
                        <li className="p-2 rounded hover:bg-[color:var(--elevated)] text-[color:var(--text-secondary)]"># music-production</li>
                    </ul>
                </div>
                {/* Main Chat */}
                <div className="flex flex-col flex-grow">
                    <div className="flex-grow p-4 space-y-4">
                        <div className="flex items-start gap-3">
                            <img src="https://picsum.photos/seed/chat1/40/40" className="w-10 h-10 rounded-full" alt="avatar" />
                            <div>
                                <p className="font-semibold text-[color:var(--text-primary)]">DJ Hype <span className="text-xs text-[color:var(--muted)] font-normal">Today at 2:30 PM</span></p>
                                <p>Welcome to the community everyone! Post your latest mix in #feedback for a listen.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <img src="https://picsum.photos/seed/chat2/40/40" className="w-10 h-10 rounded-full" alt="avatar" />
                            <div>
                                <p className="font-semibold text-[color:var(--text-primary)]">Alex Pro <span className="text-xs text-[color:var(--muted)] font-normal">Today at 2:32 PM</span></p>
                                <p>Awesome! Just dropped my new techno mix. Would love some thoughts on the transitions around 30min.</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="w-full rounded-lg bg-[color:var(--surface-alt)] px-4 py-2 text-[color:var(--text-secondary)]">
                            Message #general
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ⚠️ CRITICAL: DO NOT MODIFY CORE SWIPING STRUCTURE BELOW
// Enhanced with real profile integration while preserving v1 backup functionality
// Only modify UI/styling, never touch: handleSwipe, triggerSwipe, card mapping logic

// Discover Page (Tinder-like DJ matching)
export const OpportunitiesPage: React.FC = () => {
    const [view, setView] = useState<'swipe' | 'list'>('swipe');
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [matchResult, setMatchResult] = useState<{show: boolean, isMatch: boolean}>({show: false, isMatch: false});
    const [lastSwipedProfile, setLastSwipedProfile] = useState<Opportunity | null>(null);

    // GENNADY OPTIMIZATION: Parallel loading
    const loadProfiles = useCallback(async () => {
        try {
            const [_, profiles] = await Promise.all([
                createProfile({dj_name: 'New DJ', bio: 'Getting started'}),
                fetchSwipeProfiles()
            ]);
            setOpportunities(profiles);
        } catch (error) {
            setOpportunities([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfiles();
    }, [loadProfiles]);

    // GENNADY OPTIMIZATION: Optimistic updates
    const handleSwipe = useCallback(async (direction?: 'left' | 'right' | 'super') => {
        if (opportunities.length === 0 || !direction) return;
        
        const currentProfile = opportunities[0];
        setLastSwipedProfile(currentProfile);
        setOpportunities(prev => prev.slice(1));
        
        requestIdleCallback(async () => {
            try {
                const result = await recordSwipe(currentProfile.id, direction);
                if (result.match) {
                    setMatchResult({show: true, isMatch: true});
                    setTimeout(() => setMatchResult({show: false, isMatch: false}), 3000);
                }
            } catch (error: any) {
                // Ignore duplicate swipe errors (409)
                if (error.code !== '23505') {
                    console.error('Failed to record swipe:', error);
                }
            }
        });
    }, [opportunities]);
    
    const handleUndo = async () => {
        if (lastSwipedProfile) {
            setOpportunities(prev => [lastSwipedProfile, ...prev]);
            setLastSwipedProfile(null);
            
            try {
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
        <div className="flex flex-col h-full p-2 sm:p-4">
            {/* Segmented Control - Moved to top */}
            <div className="flex-shrink-0 flex justify-center border-b border-[color:var(--border)] mb-2">
                <div className="flex space-x-8">
                    <button onClick={() => setView('swipe')} className={`relative py-2 px-4 font-medium transition-colors ${view === 'swipe' ? 'text-[color:var(--accent)]' : 'text-[color:var(--muted)] hover:text-[color:var(--text-primary)]'}`}>
                        Discover
                        {view === 'swipe' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[color:var(--accent)]"></span>}
                    </button>
                    <button onClick={() => setView('list')} className={`relative py-2 px-4 font-medium transition-colors ${view === 'list' ? 'text-[color:var(--accent)]' : 'text-[color:var(--muted)] hover:text-[color:var(--text-primary)]'}`}>
                        Browse
                        {view === 'list' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[color:var(--accent)]"></span>}
                    </button>
                </div>
            </div>

            {/* Match Notification */}
            {matchResult.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-8 rounded-2xl text-center text-white max-w-sm mx-4">
                        <div className="text-6xl mb-4">🎉</div>
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
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--accent)]"></div>
                    </div>
                ) : view === 'swipe' ? (
                    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
                        <div className="relative h-[500px] w-full">
                            {opportunities.length > 0 ? (
                                // ⚠️ PROTECTED: Card mapping logic - DO NOT MODIFY array operations, zIndex, or data-swipe-card
                                opportunities.slice(0, 3).map((op, index) => (
                                    <OpportunitySwipeCard
                                        key={op.id}
                                        opportunity={op}
                                        onSwipe={handleSwipe}
                                        isTop={index === 0}
                                        style={{ 
                                            zIndex: 3 - index,
                                            transform: `scale(${1 - (Math.min(index, 2) * 0.05)}) translateY(-${Math.min(index, 2) * 10}px)`,
                                        }}
                                        data-swipe-card={index === 0}
                                    />
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
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="font-display text-3xl font-bold">Settings</h1>
            <p className="mt-1 text-[color:var(--text-secondary)]">Manage your account and preferences.</p>

            <div className="mt-8 max-w-2xl space-y-8">
                 <div className="rounded-xl bg-[color:var(--surface)] p-6 shadow-soft border border-[color:var(--border)]">
                    <h2 className="font-display text-xl font-bold">Profile</h2>
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-[color:var(--text-secondary)]">Full Name</label>
                            <input type="text" defaultValue={currentUser?.name} className="mt-1 block w-full rounded-md border-[color:var(--border)] bg-[color:var(--surface-alt)] p-2 focus:border-[color:var(--accent)] focus:ring-[color:var(--accent)]" />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-[color:var(--text-secondary)]">Email Address</label>
                            <input type="email" defaultValue={currentUser?.email} className="mt-1 block w-full rounded-md border-[color:var(--border)] bg-[color:var(--surface-alt)] p-2 focus:border-[color:var(--accent)] focus:ring-[color:var(--accent)]" />
                        </div>
                    </div>
                     <div className="mt-6">
                        <Button>Save Changes</Button>
                    </div>
                </div>

                <div className="rounded-xl bg-[color:var(--surface)] p-6 shadow-soft border border-[color:var(--border)]">
                    <h2 className="font-display text-xl font-bold">Subscription</h2>
                     <p className="mt-4 text-[color:var(--text-secondary)]">You are currently on the <span className="font-semibold text-[color:var(--text-primary)]">{currentUser?.plan}</span> plan.</p>
                     <div className="mt-6 flex gap-4">
                         <Button>Manage Subscription</Button>
                         <Button variant="secondary">View Billing History</Button>
                     </div>
                </div>
            </div>
        </div>
    );
};

// Matches List Component
const MatchesList: React.FC = () => {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMatches = async () => {
            try {
                const matchData = await fetchMatches();
                setMatches(matchData);
            } catch (error) {
                console.error('Failed to load matches:', error);
            } finally {
                setLoading(false);
            }
        };
        loadMatches();
    }, []);

    const handleDeleteMatch = async (matchId: number) => {
        try {
            await deleteMatch(matchId);
            setMatches(prev => prev.filter(m => m.match_id !== matchId));
        } catch (error) {
            console.error('Failed to delete match:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--accent)]"></div></div>;
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
        <div className="w-full max-w-4xl mx-auto">
            <ul className="space-y-4">
                {matches.map(match => (
                    <li key={match.id} className="flex items-center gap-4 rounded-lg bg-[color:var(--surface)] p-4 border border-[color:var(--border)]">
                        <img src={match.images?.[0] || match.imageUrl} alt={match.dj_name} className="w-16 h-16 rounded-full object-cover"/>
                        <div className="flex-grow">
                            <h3 className="font-bold text-[color:var(--text-primary)]">{match.dj_name}</h3>
                            <p className="text-sm text-[color:var(--text-secondary)]">{match.location} • {match.age} years</p>
                            <div className="flex gap-1 mt-1">
                                {match.genres?.slice(0, 2).map((genre: string) => (
                                    <span key={genre} className="text-xs bg-[color:var(--accent)]/20 text-[color:var(--accent)] px-2 py-0.5 rounded-full">{genre}</span>
                                ))}
                                {match.skills?.slice(0, 2).map((skill: string) => (
                                    <span key={skill} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{skill}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex-shrink-0 flex gap-2">
                            <Button variant="secondary" className="px-3 py-1.5 text-sm">Message</Button>
                            <button 
                                onClick={() => handleDeleteMatch(match.match_id)}
                                className="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Events Page (Locked)
export const EventsPage: React.FC = () => {
    return (
        <div className="flex flex-col h-full p-2 sm:p-4">
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
                    <LockIcon className="w-16 h-16 text-[color:var(--muted)] mb-4" />
                    <h3 className="text-xl font-bold text-[color:var(--text-secondary)] mb-2">Events Coming Soon</h3>
                    <p className="text-[color:var(--muted)] text-center mb-6">Discover exclusive DJ events, club bookings, and festival opportunities.</p>
                    <Button className="px-6 py-3">
                        🚀 Upgrade to Pro
                    </Button>
                </div>
            </div>
        </div>
    );
};