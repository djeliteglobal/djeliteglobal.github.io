import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
    return (
        <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)]">
            <header className="fixed top-0 z-50 w-full bg-[color:var(--bg)]/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4">
                    <div className="text-2xl font-bold font-display">DJ Elite</div>
                    <div>
                        <Link to="/funnel" className="mr-2 px-4 py-2 rounded bg-[color:var(--surface)] text-[color:var(--text-primary)] hover:bg-[color:var(--surface-alt)]">
                            Sales Funnel
                        </Link>
                    </div>
                </div>
            </header>
            
            <main>
                <section className="relative flex min-h-screen items-center justify-center pt-20">
                    <div className="absolute inset-0 bg-black/50">
                        <img src="https://images.unsplash.com/photo-1517814761483-6769dab4e9c0" alt="DJ performing" className="h-full w-full object-cover opacity-30"/>
                    </div>
                    <div className="relative z-10 text-center text-white p-4">
                        <h1 className="font-display text-4xl font-bold md:text-7xl">Book More Gigs.</h1>
                        <h1 className="font-display text-4xl font-bold md:text-7xl text-[color:var(--accent)]">Get Paid Like a Pro.</h1>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-[color:var(--text-secondary)]">
                            Learn, build your brand, and connect with real promoters. All in one place.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="px-6 py-3 bg-[color:var(--accent)] text-black rounded font-semibold hover:bg-[color:var(--accent-muted)]">
                                Start Your Journey
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export const Dashboard: React.FC = () => (
    <div className="p-8">
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-4">Welcome to your DJ Elite dashboard!</p>
    </div>
);

export const CoursesPage: React.FC = () => (
    <div className="p-8">
        <h1 className="font-display text-3xl font-bold">Courses</h1>
        <p className="mt-4">Explore our course library.</p>
    </div>
);

export const CourseDetailPage: React.FC = () => (
    <div className="p-8">
        <h1 className="font-display text-3xl font-bold">Course Detail</h1>
        <p className="mt-4">Course content goes here.</p>
    </div>
);

export const CommunityPage: React.FC = () => (
    <div className="p-8">
        <h1 className="font-display text-3xl font-bold">Community</h1>
        <p className="mt-4">Connect with other DJs.</p>
    </div>
);

export const OpportunitiesPage: React.FC = () => (
    <div className="p-8">
        <h1 className="font-display text-3xl font-bold">Opportunities</h1>
        <p className="mt-4">Find your next gig.</p>
    </div>
);

export const SettingsPage: React.FC = () => (
    <div className="p-8">
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="mt-4">Manage your account.</p>
    </div>
);