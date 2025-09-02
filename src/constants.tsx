import React from 'react';
import type { Testimonial, CurriculumModule, ValueStackItem, BonusItem, FaqItem } from './types';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`font-display font-bold text-xl text-[color:var(--text-primary)] ${className}`}>
        DJ ELITE
    </div>
);

export const SOCIAL_PROOF_STATS = [
    { number: '50+', label: 'DJs Trained' },
    { number: 'Growing', label: 'Network Opportunities' },
    { number: '10+', label: 'Years of Experience' },
    { number: '89%', label: 'Success Rate' },
];

export const VENUE_LOGOS = [
    { name: 'Ultra Music Festival', src: 'https://logos-world.net/wp-content/uploads/2021/02/Ultra-Music-Festival-Logo.png' },
    { name: 'Tomorrowland', src: 'https://logos-world.net/wp-content/uploads/2021/02/Tomorrowland-Logo.png' },
    { name: 'Electric Daisy Carnival', src: 'https://logos-world.net/wp-content/uploads/2021/02/Electric-Daisy-Carnival-Logo.png' },
    { name: 'Coachella', src: 'https://logos-world.net/wp-content/uploads/2020/12/Coachella-Logo.png' },
    { name: 'Fabric London', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Fabric_club_logo.svg/320px-Fabric_club_logo.svg.png' },
    { name: 'Berghain Berlin', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Berghain_logo.svg/320px-Berghain_logo.svg.png' },
    { name: 'Privilege Ibiza', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Ultra_Music_Festival_logo.svg/320px-Ultra_Music_Festival_logo.svg.png' },
    { name: 'Ministry of Sound', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Fabric_club_logo.svg/320px-Fabric_club_logo.svg.png' },
    { name: 'Burning Man', src: 'https://logos-world.net/wp-content/uploads/2021/02/Burning-Man-Logo.png' },
    { name: 'Creamfields', src: 'https://logos-world.net/wp-content/uploads/2021/02/Creamfields-Logo.png' },
];

export const PAIN_POINTS = [
    { icon: '😤', title: "Stuck playing in your bedroom while others get the gigs", description: "You've got the skills, but somehow you're still mixing for an audience of zero while watching other DJs land the spots you dream of." },
    { icon: '🤷‍♂️', title: "No idea how to break into the professional scene", description: "The industry feels like a closed club. You don't know who to contact, where to start, or how to even get your foot in the door." },
    { icon: '😔', title: "Watching other DJs succeed while you struggle", description: "Every week you see DJs with less talent than you booking major gigs. It's frustrating and makes you question if you'll ever make it." },
    { icon: '💔', title: "Feeling like you'll never make it as a professional", description: "Maybe you're starting to think this is just a hobby. That professional DJing is for 'other people' and you should give up the dream." },
];

export const METHOD_STEPS = [
    { number: 1, icon: '🧠', title: "Elite Mindset", description: "Transform from hobbyist to professional thinking. Overcome stage fright and build your DJ persona." },
    { number: 2, icon: '🎛️', title: "Technical Mastery", description: "Master mixing fundamentals, advanced techniques, and equipment to sound like a pro." },
    { number: 3, icon: '🎵', title: "Music Selection", description: "Learn to read crowds, build your signature sound, and source tracks like industry veterans." },
    { number: 4, icon: '⚡', title: "Performance Psychology", description: "Develop stage presence, crowd control techniques, and energy management skills." },
    { number: 5, icon: '💼', title: "Business Foundation", description: "Master contracts, pricing, personal marketing, and brand building strategies." },
    { number: 6, icon: '🤝', title: "Elite Networking", description: "Build industry connections, leverage social media, and create collaboration opportunities." },
    { number: 7, icon: '🚀', title: "Scaling Your Career", description: "Work with agents, secure international bookings, and diversify your revenue streams." },
];

export const TESTIMONIALS: Testimonial[] = [
    {
        quote: "I landed my first gig at Privilege Ibiza 30 days after completing the course. The networking module alone was worth the entire investment.",
        name: "Maria S.",
        description: "First professional gig at world-famous venue",
        avatarUrl: "https://i.pravatar.cc/100?u=maria",
        videoPosterUrl: "https://picsum.photos/seed/maria-poster/1280/720",
        videoSrcUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
    },
    {
        quote: "I went from $0 to $5,000/month as a DJ in just 4 months. The business foundation module taught me how to price myself properly and market my services.",
        name: "Carlos R.",
        description: "$5K monthly income transformation",
        avatarUrl: "https://i.pravatar.cc/100?u=carlos",
        videoPosterUrl: "https://picsum.photos/seed/carlos-poster/1280/720",
        videoSrcUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
    },
    {
        quote: "The networking module connected me with my current manager. I'm now playing at festivals across Europe. This course changed my life.",
        name: "David L.",
        description: "Found professional representation",
        avatarUrl: "https://i.pravatar.cc/100?u=david",
        videoPosterUrl: "https://picsum.photos/seed/david-poster/1280/720",
        videoSrcUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
    }
];

export const INSTRUCTOR_CREDENTIALS = [
    { title: "🌍 Club Headliner", description: "Played at Tulum, Ibiza, Panama, Colombia, Spain best clubs" },
    { title: "📺 Media Features", description: "Featured in Argentina national TV channels, Panama newspapers, Netherlands DJ Network" },
    { title: "👥 Proven Mentor", description: "Trained dozens of DJs across 10 countries" },
    { title: "🤝 Industry Leader", description: "Former Representative of the biggest Dutch DJ Social Platform OTGS.io" },
];

export const CURRICULUM_MODULES: CurriculumModule[] = [
    { title: "Module 1: Elite Mindset", lessons: ["From hobbyist to professional thinking", "Overcoming stage fright and performance anxiety", "Building your unique DJ persona and brand"] },
    { title: "Module 2: Technical Mastery", lessons: ["Mixing fundamentals that separate pros from amateurs", "Advanced techniques for seamless transitions", "Equipment mastery and setup optimization"] },
    { title: "Module 3: Music Selection", lessons: ["Reading the crowd and adapting in real-time", "Building your signature sound and style", "Track sourcing strategies and music discovery"] },
    { title: "Module 4: Performance Psychology", lessons: ["Stage presence mastery and commanding attention", "Crowd control techniques for any venue", "Energy management throughout your set"] },
    { title: "Module 5: Business Foundation", lessons: ["Contracts and pricing strategies that get you paid", "Personal marketing and social media mastery", "Brand building strategies for long-term success"] },
    { title: "Module 6: Elite Networking", lessons: ["Building industry connections that matter", "Social media strategy for maximum reach", "Collaboration tactics with other artists"] },
    { title: "Module 7: Scaling Your Career", lessons: ["Working with agents and management", "Securing international bookings and tours", "Revenue diversification and passive income"] },
];

export const VALUE_STACK_ITEMS: ValueStackItem[] = [
    { icon: '📚', title: "Complete DJ Elite Course (7 modules)", description: "Step-by-step video training covering every aspect of professional DJing", value: "$997" },
    { icon: '🎵', title: "Exclusive 500 Track Package", description: "Curated collection of professional-grade tracks across all genres", value: "$297" },
    { icon: '📱', title: "DJ Elite App Early Access (coming soon)", description: "Connect with clubs and events, learn anywhere with our custom mobile app.", value: "$197" },
    { icon: '👥', title: "10 Group Coaching Sessions", description: "Live Q&A sessions with direct access to your mentor", value: "$797" },
    { icon: '🏆', title: "VIP Elite Community Access (6 months)", description: "Network oportunitties with successful DJs and events, get ongoing support", value: "$582" },
    { icon: '📄', title: "Professional Contract Templates", description: "Legal templates to protect yourself and get paid properly", value: "$197" },
    { icon: '📈', title: "Personal Marketing Strategies", description: "Proven marketing playbooks to build your brand and attract bookings", value: "$297" },
];

export const BONUSES: BonusItem[] = [
    { icon: '🎁', title: "BONUS #1: Events Booking Blueprint", description: "The exact strategy I used to land my first big gigs, including email templates and contact lists.", value: "Value: $497" },
    { icon: '🎁', title: "BONUS #2: Social Media Mastery Course", description: "Complete guide to building a massive following and converting fans into bookings.", value: "Value: $297" },
    { icon: '🎁', title: "BONUS #3: Equipment Buying Guide", description: "Never waste money on gear again with our comprehensive equipment recommendations.", value: "Value: $197" },
    { icon: '🎁', title: "BONUS #4: Lifetime Updates", description: "Get all future course updates and new modules added to the program at no extra cost.", value: "Value: Priceless" },
];

export const FAQS: FaqItem[] = [
    { question: "I don't have natural talent. Will this work for me?", answer: "Talent is a myth. DJing is a skill that can be learned by anyone willing to put in the work. This course focuses on technique, strategy, and mindset - all learnable skills. Many of our most successful students started with zero experience." },
    { question: "It's too expensive. Is it really worth the investment?", answer: "What's the cost of NOT taking action? One professional gig pays for the entire course. Our students average $2,000+ per gig after completing the program. This is an investment in your future, not an expense." },
    { question: "Will this work for my music genre?", answer: "Absolutely. The principles taught in DJ Elite work across all genres - house, techno, hip-hop, EDM, and more. The networking strategies, business skills, and performance techniques are universal to professional DJing." },
    { question: "I don't have time to dedicate to this.", answer: "The program is designed for busy people. Just 30 minutes a day for 90 days is all you need. The mobile app lets you practice anywhere, and the modules are bite-sized for easy consumption. If you have time to scroll social media, you have time to transform your DJ career." },
    { question: "What if I don't get results?", answer: "That's impossible if you follow the system. But if for any reason you don't land your first professional gig within 90 days, I'll refund every penny. No questions asked. The risk is entirely on me." },
    { question: "How is this different from YouTube tutorials?", answer: "YouTube gives you random tips. DJ Elite gives you a complete system. It's the difference between scattered puzzle pieces and a complete roadmap. Plus, you get personal mentorship, a community of peers, and proven strategies that actually work in the real world." },
];