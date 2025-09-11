import React, { memo } from 'react';
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

// Base SVG props for consistency
const baseSVGProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const
};

// Icon Components - Memoized for performance
export const HomeIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
));
export const BookOpenIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
));
export const UsersIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
));
export const ZapIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
));
export const SettingsIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
));
export const SunIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m4.93 19.07 1.41-1.41" /><path d="m17.66 6.34 1.41-1.41" /></svg>
));
export const MoonIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
));
export const SearchIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
));
export const MenuIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
));
export const CheckCircleIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
));
export const VideoIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
));
export const FileTextIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
));
export const HelpCircleIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
));
export const ChevronDownIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><polyline points="6 9 12 15 18 9" /></svg>
));
export const PlayCircleIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
));
export const HeartIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
));
export const XIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
));
export const StarIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
));
export const UndoIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><path d="M3 7v6h6" /><path d="m21 17a9 9 0 00-9-9 9 9 0 00-6 2.3l-3 2.7" /></svg>
));
export const LockIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseSVGProps} {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><circle cx="12" cy="7" r="4" /><path d="M12 3v4" /></svg>
));

export const NAV_ITEMS = [
    { name: 'Dashboard', icon: HomeIcon, page: 'dashboard' },
    { name: 'Courses', icon: BookOpenIcon, page: 'courses' },
    { name: 'Events', icon: UsersIcon, page: 'events' },
    { name: 'Discover', icon: ZapIcon, page: 'opportunities' },
    { name: 'Events', icon: HeartIcon, page: 'community' },
];

export const MOCK_USER: User = {
    name: 'Alex Pro',
    email: 'alex.pro@djelite.com',
    avatarUrl: 'https://picsum.photos/seed/user/100/100',
    plan: 'Pro Annual'
};

// Lazy load courses data
export const loadCourses = async (): Promise<Course[]> => {
  try {
    const { courses } = await import('../data/constants.json');
    return (courses || []).map((course: any) => ({
      id: course.id || 0,
      title: course.title || 'Untitled Course',
      description: course.description || 'No description available',
      duration: course.duration || '1 week',
      level: course.level || 'Beginner',
      instructor: course.instructor || 'DJ Elite Team',
      imageUrl: course.imageUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      progress: course.progress || 0,
      isLocked: course.isLocked !== false
    }));
  } catch (error) {
    console.error('Failed to load courses:', error);
    return [];
  }
};

// Lazy load opportunities data
export const loadOpportunities = async (): Promise<Opportunity[]> => {
  try {
    const { mockOpportunities } = await import('../data/constants.json');
    return (mockOpportunities || []).map((opp: any) => ({
      id: opp.id || 0,
      title: opp.title || 'Untitled Opportunity',
      venue: opp.venue || 'Unknown Venue',
      location: opp.location || 'Unknown Location',
      fee: opp.fee || '$0',
      type: opp.type || 'Gig',
      imageUrl: opp.imageUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      description: opp.description || 'No description available'
    }));
  } catch (error) {
    console.error('Failed to load opportunities:', error);
    return [];
  }
};

export const PRICING_PLANS: PricingPlan[] = [
    {
        name: 'Free',
        price: '$0',
        priceDetails: '/forever',
        features: [
            'DJ Profile & Portfolio',
            'Swipe & Match with DJs',
            'Basic Community Access',
            'Limited Gig Opportunities',
            'Connect with 10 DJs/month',
        ],
        isFeatured: false,
        cta: 'Start Free'
    },
    {
        name: 'Pro',
        price: '$19',
        priceDetails: '/month',
        features: [
            'Everything in Free',
            'Unlimited DJ Connections',
            'Priority Gig Matching',
            'Advanced Profile Features',
            'Direct Promoter Contact',
            'Community Events Access',
        ],
        isFeatured: true,
        cta: 'Go Pro'
    },
    {
        name: 'Elite',
        price: '$49',
        priceDetails: '/month',
        features: [
            'Everything in Pro',
            'Exclusive High-Paying Gigs',
            'Personal Brand Manager',
            'Industry Mentor Sessions',
            'Featured Profile Placement',
            'Early Access to New Features',
        ],
        isFeatured: false,
        cta: 'Join Elite'
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