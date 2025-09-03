import React from 'react';
import type { Course, FaqItem, PricingPlan, User, Opportunity } from '../types/platform';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[color:var(--accent)]">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
        <span className="font-display font-bold text-lg text-[color:var(--text-primary)]">DJ Elite</span>
    </div>
);

// Icon Components
export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
export const BookOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
);
export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
export const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
export const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m4.93 19.07 1.41-1.41" /><path d="m17.66 6.34 1.41-1.41" /></svg>
);
export const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
);
export const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
export const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);
export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
export const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
);
export const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
);
export const HelpCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
export const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9" /></svg>
);
export const PlayCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
);
export const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
);
export const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

export const NAV_ITEMS = [
    { name: 'Dashboard', icon: HomeIcon, page: 'dashboard' },
    { name: 'Courses', icon: BookOpenIcon, page: 'courses' },
    { name: 'Community', icon: UsersIcon, page: 'community' },
    { name: 'Opportunities', icon: ZapIcon, page: 'opportunities' },
    { name: 'DJ Connect', icon: HeartIcon, page: 'dj_matching' },
];

export const MOCK_USER: User = {
    name: 'Alex Pro',
    email: 'alex.pro@djelite.com',
    avatarUrl: 'https://picsum.photos/seed/user/100/100',
    plan: 'Pro Annual'
};

export const COURSES: Course[] = [
    { id: 1, title: 'The Art of Transition', instructor: 'DJ Hype', duration: '5h 30m', level: 'Intermediate', category: 'Mixing', imageUrl: 'https://images.unsplash.com/photo-1641573481523-3e0447d7ba86', progress: 60, description: 'Master seamless transitions and advanced mixing techniques.', modules: [{id: 1, title: "Module 1", lessons: [{id:1, title: "Intro", duration: "5m", type: 'video'}]}] },
    { id: 2, title: 'Advanced Harmonic Mixing', instructor: 'Carl Cox', duration: '8h 15m', level: 'Advanced', category: 'Music Theory', imageUrl: 'https://images.unsplash.com/photo-1618409698993-11872c0048e3', progress: 25, description: 'Dive deep into key mixing and energy management to create unforgettable sets.', modules: [{id: 1, title: "Module 1", lessons: [{id:1, title: "Intro", duration: "5m", type: 'video'}]}] },
    { id: 3, title: 'Building Your DJ Brand', instructor: 'Nina Kraviz', duration: '4h 0m', level: 'All Levels', category: 'Career', imageUrl: 'https://plus.unsplash.com/premium_photo-1728650295285-e6d61f7900f5', progress: 95, description: 'Learn to market yourself, build a following, and get booked.', modules: [{id: 1, title: "Module 1", lessons: [{id:1, title: "Intro", duration: "5m", type: 'video'}]}] },
    { id: 4, title: 'Beatmatching Fundamentals', instructor: 'Frankie Knuckles', duration: '3h 45m', level: 'Beginner', category: 'Mixing', imageUrl: 'https://images.unsplash.com/photo-1713450604431-fcbfcb4209d3', progress: 0, description: 'The essential starting point for any aspiring DJ.', modules: [{id: 1, title: "Module 1", lessons: [{id:1, title: "Intro", duration: "5m", type: 'video'}]}] },
    { id: 5, title: 'Live Performance with Ableton', instructor: 'Richie Hawtin', duration: '12h', level: 'Advanced', category: 'Performance', imageUrl: 'https://images.unsplash.com/photo-1667830494763-621e251801c4', progress: 10, description: 'Integrate Ableton Live into your DJ sets for ultimate creativity.', modules: [{id: 1, title: "Module 1", lessons: [{id:1, title: "Intro", duration: "5m", type: 'video'}]}] },
    { id: 6, title: 'Vinyl DJing 101', instructor: 'Grandmaster Flash', duration: '6h 20m', level: 'Beginner', category: 'Turntablism', imageUrl: 'https://images.unsplash.com/photo-1713450604431-fcbfcb4209d3', progress: 0, description: 'Learn the original art form from a pioneer.', modules: [{id: 1, title: "Module 1", lessons: [{id:1, title: "Intro", duration: "5m", type: 'video'}]}] },
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
    { id: 1, title: 'Prime Time Techno', venue: 'The Warehouse', location: 'Berlin, DE', date: 'Sat, Nov 16', genres: ['Techno', 'Industrial'], fee: '$500', imageUrl: 'https://picsum.photos/seed/gig1/600/800' },
    { id: 2, title: 'Sunset House Session', venue: 'Beach Club Ibiza', location: 'Ibiza, ES', date: 'Fri, Nov 22', genres: ['Deep House', 'Balearic'], fee: '$800', imageUrl: 'https://picsum.photos/seed/gig2/600/800' },
    { id: 3, title: 'Underground Bass Night', venue: 'The Sub Club', location: 'London, UK', date: 'Thu, Nov 21', genres: ['Dubstep', 'UK Garage'], fee: '$350', imageUrl: 'https://picsum.photos/seed/gig3/600/800' },
    { id: 4, title: 'Disco Fever Rooftop Party', venue: 'Le Bain', location: 'New York, US', date: 'Sat, Nov 23', genres: ['Disco', 'Funk', 'Soul'], fee: '$600', imageUrl: 'https://picsum.photos/seed/gig4/600/800' },
    { id: 5, title: 'Opening Slot: Major Festival', venue: 'Circuit Grounds', location: 'Miami, US', date: 'Fri, Mar 28', genres: ['EDM', 'Trance'], fee: '$1,200', imageUrl: 'https://picsum.photos/seed/gig5/600/800' },
];

export const PRICING_PLANS: PricingPlan[] = [
    {
        name: 'Monthly',
        price: '$49',
        priceDetails: '/month',
        features: [
            'Access to all courses',
            'Private Community',
            'Weekly Charts & Contests',
            'Demo Submission Portal',
        ],
        isFeatured: false,
        cta: 'Start Monthly'
    },
    {
        name: 'Annual',
        price: '$497',
        priceDetails: '/year',
        features: [
            'All Monthly features',
            'Path Dashboard & Time-Tracking',
            'Downloadable Templates',
            'Shareable Artist Profile',
            '2 months free',
        ],
        isFeatured: true,
        cta: 'Go Pro Annual'
    },
    {
        name: 'Lifetime',
        price: '$997',
        priceDetails: 'one-time',
        features: [
            'All Annual features',
            'Lifetime access, no renewals',
            'Exclusive Mentor Sessions',
            'Early access to new features',
        ],
        isFeatured: false,
        cta: 'Get Lifetime Access'
    }
];

export const FAQ_ITEMS: FaqItem[] = [
    {
        question: "Is DJ Elite for me?",
        answer: "DJ Elite is designed for intermediate to advanced DJs who are serious about turning their passion into a professional career. If you're looking to get booked more often, increase your fees, and build a sustainable brand, this is the place for you."
    },
    {
        question: "What's included with my subscription?",
        answer: "Your subscription gives you unlimited access to our entire library of courses, our private Discord community, the gig opportunities board, downloadable templates (like press kits and contracts), and our advanced tools like the Path Dashboard and time-tracking."
    },
    {
        question: "Can I cancel anytime?",
        answer: "Yes, you can cancel your subscription at any time. You will retain access until the end of your current billing period. We believe in our value and don't believe in lock-in contracts."
    },
     {
        question: "Are there any requirements to follow your courses?",
        answer: "Most courses require a standard DJ setup (controllers, CDJs, or turntables) and a computer with DJ software. Specific hardware or software requirements are listed on each course's detail page."
    }
];