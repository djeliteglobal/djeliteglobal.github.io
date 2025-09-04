import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../pages/HomePage';
import { useAuth } from '../../contexts/AuthContext';
import { Button, CourseCard, FaqItemComponent, PricingCard, OpportunitySwipeCard } from '../platform';
import { COURSES, FAQ_ITEMS, PRICING_PLANS, PlayCircleIcon, VideoIcon, FileTextIcon, HelpCircleIcon, XIcon, HeartIcon, MOCK_OPPORTUNITIES } from '../../constants/platform';
import type { Course, Opportunity } from '../../types/platform';
import { DJMatchingPage } from './DJMatchingPage';

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
                        <Button onClick={() => navigate('dashboard')}>Get Started</Button>
                    </div>
                </div>
            </header>
            
            <main>
                {/* Hero Section */}
                <section className="relative flex min-h-screen items-center justify-center pt-8 md:pt-20">
                    <div className="absolute inset-0 bg-black/50">
                        <img src="https://images.unsplash.com/photo-1517814761483-6769dab4e9c0" alt="DJ performing" className="h-full w-full object-cover opacity-30"/>
                    </div>
                    <div className="relative z-10 text-center text-white p-4 -mt-16 md:mt-0">
                        {/* Problem Statement */}
                        <p className="text-lg md:text-xl text-red-400 font-semibold mb-4">
                            Tired of playing empty rooms while other DJs get the best gigs?
                        </p>
                        
                        <h1 className="font-display text-4xl font-bold md:text-7xl">You're One Gig Away</h1>
                        <h1 className="font-display text-4xl font-bold md:text-7xl text-[color:var(--accent)]">From Going Pro</h1>
                        
                        {/* Authority Statement */}
                        <p className="mt-4 text-sm md:text-base text-white/80 font-medium">
                            We've helped 10,000+ DJs get booked at premium venues
                        </p>
                        
                        {/* Success Vision */}
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-[color:var(--text-secondary)]">
                            Imagine getting paid $500+ every weekend doing what you love. Connect with promoters, match with venues, and build your music career.
                        </p>
                        
                        {/* Clear Plan */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm md:text-base">
                            <div className="flex items-center gap-2 text-white/90">
                                <span className="bg-[color:var(--accent)] text-black rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">1</span>
                                Create Profile
                            </div>
                            <span className="hidden sm:block text-white/50">→</span>
                            <div className="flex items-center gap-2 text-white/90">
                                <span className="bg-[color:var(--accent)] text-black rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">2</span>
                                Match with Promoters
                            </div>
                            <span className="hidden sm:block text-white/50">→</span>
                            <div className="flex items-center gap-2 text-white/90">
                                <span className="bg-[color:var(--accent)] text-black rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">3</span>
                                Get Booked
                            </div>
                        </div>
                        
                        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                            <Button className="px-8 py-4 text-lg font-bold" onClick={() => navigate('dashboard')}>Find Your Next Gig</Button>
                            <Button variant="ghost" className="px-6 py-4 text-white border border-white/30 hover:bg-white/10">
                                See How It Works
                            </Button>
                        </div>
                        
                        {/* Stakes */}
                        <p className="mt-6 text-sm text-red-300 font-medium">
                            Don't let another weekend pass playing to empty rooms
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
                            <li className="flex justify-between items-center text-sm"><span>Club Night @ Berlin</span><span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">Open</span></li>
                            <li className="flex justify-between items-center text-sm"><span>Festival Opener @ Ibiza</span><span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">Open</span></li>
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
                <div className="aspect-video w-full rounded-xl bg-[color:var(--elevated)] flex items-center justify-center">
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover rounded-xl"/>
                </div>
                <div className="mt-6">
                    <h1 className="font-display text-3xl font-bold">{course.title}</h1>
                    <p className="mt-2 text-[color:var(--text-secondary)]">by {course.instructor}</p>
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
                    <Button className="w-full mt-4">
                        {course.progress > 0 ? 'Resume Learning' : 'Start Course'}
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

// Opportunities Page
export const OpportunitiesPage: React.FC = () => {
    const [view, setView] = useState<'swipe' | 'list'>('swipe');
    const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);

    const handleSwipe = () => {
        setOpportunities(prev => prev.slice(1));
    };
    
    const triggerSwipe = (direction: 'left' | 'right') => {
        const topCard = document.querySelector<HTMLElement>('[data-swipe-card="true"]');
        if (topCard) {
            topCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            topCard.classList.add(direction === 'right' ? 'swipe-out-right' : 'swipe-out-left');
            topCard.addEventListener('animationend', handleSwipe, { once: true });
        }
    };

    return (
        <div className="flex flex-col h-full p-4 sm:p-6 md:p-8">
            <div className="flex-shrink-0">
                <h1 className="font-display text-3xl font-bold">Find Your Next Gig</h1>
                <p className="mt-1 text-[color:var(--text-secondary)]">Discover and apply to exclusive opportunities.</p>
                
                {/* Segmented Control */}
                <div className="mt-6 flex justify-center border-b border-[color:var(--border)]">
                    <div className="flex space-x-8">
                        <button onClick={() => setView('swipe')} className={`relative py-3 px-4 font-medium transition-colors ${view === 'swipe' ? 'text-[color:var(--accent)]' : 'text-[color:var(--muted)] hover:text-[color:var(--text-primary)]'}`}>
                            Swipe
                            {view === 'swipe' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[color:var(--accent)]"></span>}
                        </button>
                        <button onClick={() => setView('list')} className={`relative py-3 px-4 font-medium transition-colors ${view === 'list' ? 'text-[color:var(--accent)]' : 'text-[color:var(--muted)] hover:text-[color:var(--text-primary)]'}`}>
                            List
                            {view === 'list' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[color:var(--accent)]"></span>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center py-6">
                {view === 'swipe' ? (
                    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
                        <div className="relative h-[500px] w-full">
                            {opportunities.length > 0 ? (
                                opportunities.map((op, index) => (
                                    <OpportunitySwipeCard
                                        key={op.id}
                                        opportunity={op}
                                        onSwipe={handleSwipe}
                                        isTop={index === 0}
                                        style={{ 
                                            zIndex: opportunities.length - index,
                                            transform: `scale(${1 - (Math.min(index, 2) * 0.05)}) translateY(-${Math.min(index, 2) * 10}px)`,
                                        }}
                                    />
                                )).reverse()
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full w-full rounded-xl bg-[color:var(--surface)] border-2 border-dashed border-[color:var(--border)]">
                                    <p className="text-lg font-semibold text-[color:var(--text-secondary)]">No more gigs for now!</p>
                                    <p className="text-sm text-[color:var(--muted)]">Check back later for new opportunities.</p>
                                </div>
                            )}
                        </div>
                        {opportunities.length > 0 && (
                            <div className="mt-8 flex items-center gap-6">
                                <button onClick={() => triggerSwipe('left')} className="flex items-center justify-center w-16 h-16 rounded-full bg-[color:var(--surface)] text-[#EF4444] shadow-soft hover:scale-105 transition-transform">
                                    <XIcon className="w-8 h-8" />
                                </button>
                                <button onClick={() => triggerSwipe('right')} className="flex items-center justify-center w-20 h-20 rounded-full bg-[color:var(--accent)] text-black shadow-elev hover:scale-105 transition-transform">
                                    <HeartIcon className="w-10 h-10" fill="currentColor" />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full max-w-4xl mx-auto">
                        <ul className="space-y-4">
                            {MOCK_OPPORTUNITIES.map(op => (
                                <li key={op.id} className="flex items-center gap-4 rounded-lg bg-[color:var(--surface)] p-4 border border-[color:var(--border)]">
                                    <img src={op.imageUrl} alt={op.title} className="w-20 h-20 rounded-md object-cover"/>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-[color:var(--text-primary)]">{op.title}</h3>
                                        <p className="text-sm text-[color:var(--text-secondary)]">{op.venue}, {op.location}</p>
                                        <p className="text-xs text-[color:var(--muted)]">{op.date}</p>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <p className="font-semibold text-[color:var(--accent)]">{op.fee}</p>
                                        <Button variant="secondary" className="mt-2 px-4 py-1.5 text-sm">Details</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
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

// DJ Matching Page Export
export { DJMatchingPage };