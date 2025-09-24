import React, { useState, useContext, useRef, useEffect, memo } from 'react';
import { AppContext } from '../../pages/HomePage';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { TinderStyleProfileEditor } from '../profile/TinderStyleProfileEditor';
import { useMatchStore } from '../../stores/matchStore';
import { getUserPlan } from '../../services/subscriptionService';
import { NAV_ITEMS, SunIcon, MoonIcon, SearchIcon, MenuIcon, CheckCircleIcon, ChevronDownIcon, Logo, LockIcon, StarIcon } from '../../constants/platform';
import { supabase } from '../../config/supabase';
import { loadCourses } from '../../constants/platform';
import type { Course, FaqItem, PricingPlan, Opportunity } from '../../types/platform';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseClasses = 'px-6 py-3 rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[color:var(--bg)] focus:ring-[color:var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    primary: 'bg-[color:var(--accent)] text-black hover:bg-[color:var(--accent-muted)]',
    secondary: 'bg-[color:var(--surface-alt)] text-[color:var(--text-primary)] hover:bg-[color:var(--surface)] border border-[color:var(--border)]',
    ghost: 'bg-transparent text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--text-primary)]',
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const SearchComponent: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const { navigate } = useContext(AppContext)!;
    
    const searchDatabase = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }
        
        setIsSearching(true);
        try {
            const [courses, opportunities] = await Promise.all([
                loadCourses(),
                supabase.from('profiles').select('*').ilike('dj_name', `%${query}%`).limit(5)
            ]);
            
            const courseResults = courses.filter(course => 
                course.title.toLowerCase().includes(query.toLowerCase()) ||
                course.instructor.toLowerCase().includes(query.toLowerCase()) ||
                course.description?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 3);
            
            const profileResults = opportunities.data?.map(profile => ({
                ...profile,
                type: 'profile'
            })) || [];
            
            setSearchResults([
                ...courseResults.map(course => ({ ...course, type: 'course' })),
                ...profileResults
            ]);
            setShowResults(true);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };
    
    useEffect(() => {
        const debounce = setTimeout(() => {
            searchDatabase(searchQuery);
        }, 300);
        
        return () => clearTimeout(debounce);
    }, [searchQuery]);
    
    const handleResultClick = (result: any) => {
        if (result.type === 'course') {
            navigate('course_detail', result.id);
        } else {
            navigate('opportunities');
        }
        setShowResults(false);
        setSearchQuery('');
    };
    
    return (
        <div className="relative hidden sm:block w-full max-w-xs">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[color:var(--muted)]" />
            <input
                type="search"
                placeholder="Search courses, DJs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-alt)] py-2 pl-10 pr-4 text-[color:var(--text-primary)] placeholder-[color:var(--muted)] focus:border-[color:var(--accent)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent)]"
            />
            
            {showResults && (searchResults.length > 0 || isSearching) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[color:var(--surface)] border border-[color:var(--border)] rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {isSearching ? (
                        <div className="p-4 text-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[color:var(--accent)] mx-auto"></div>
                        </div>
                    ) : (
                        searchResults.map((result, index) => (
                            <div
                                key={`${result.type}-${result.id}`}
                                onClick={() => handleResultClick(result)}
                                className="p-3 hover:bg-[color:var(--surface-alt)] cursor-pointer border-b border-[color:var(--border)] last:border-b-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                        result.type === 'course' ? 'bg-blue-500' : 'bg-green-500'
                                    }`}></div>
                                    <div className="flex-1">
                                        <p className="font-medium text-[color:var(--text-primary)]">
                                            {result.type === 'course' ? result.title : result.dj_name}
                                        </p>
                                        <p className="text-sm text-[color:var(--text-secondary)]">
                                            {result.type === 'course' ? `Course by ${result.instructor}` : `DJ • ${result.location || 'Location not set'}`}
                                        </p>
                                    </div>
                                    <span className="text-xs bg-[color:var(--accent)]/20 text-[color:var(--accent)] px-2 py-1 rounded-full">
                                        {result.type === 'course' ? 'Course' : 'DJ'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export const TopBar: React.FC = () => {
    const { appState, setAppState, navigate } = useContext(AppContext)!;
    const { currentUser } = useAuth();
    
    const toggleTheme = () => {
        setAppState(prev => ({...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
    };



    return (
        <>
        <header className="flex h-16 items-center justify-between border-b border-[color:var(--border)] bg-[color:var(--surface)] px-4 md:px-8">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => (window as any).toggleMobileSidebar?.()}
                    data-mobile-toggle
                    className="md:hidden p-2 rounded-lg hover:bg-[color:var(--surface-alt)] text-[color:var(--text-secondary)]"
                >
                    <MenuIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="flex flex-1 items-center justify-end gap-4">
                <SearchComponent />
                <button onClick={toggleTheme} className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface-alt)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]">
                    {appState.theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>
                <LanguageSwitcher inline={true} />
                <button onClick={() => navigate('profile')} className="h-10 w-10 rounded-full hover:ring-2 hover:ring-[color:var(--accent)] transition-all overflow-hidden">
                    {currentUser?.profile_image_url ? (
                        <img src={currentUser.profile_image_url} alt={currentUser?.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                        <div className="h-full w-full rounded-full bg-[color:var(--surface-alt)] flex items-center justify-center">
                            <svg className="w-5 h-5 text-[color:var(--text-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                    )}
                </button>
            </div>
        </header>
        </>
    );
};

export const SideNav: React.FC = () => {
    const { appState, navigate } = useContext(AppContext)!;
    const { currentUser, logout } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const [userPlan, setUserPlan] = useState('free');
    const { connectionLimit } = useMatchStore();
    
    useEffect(() => {
        getUserPlan().then(setUserPlan);
        // Expose toggle function globally
        (window as any).toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
        
        // Close sidebar when clicking outside on mobile
        const handleClickOutside = (event: MouseEvent) => {
            if (isMobileOpen && !event.target?.closest('nav') && !event.target?.closest('button[data-mobile-toggle]')) {
                setIsMobileOpen(false);
            }
        };
        
        if (isMobileOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isMobileOpen]);
    
    return (
        <>

        
        <nav className={`w-64 border-r border-[color:var(--border)] bg-[color:var(--surface)] flex-shrink-0 z-40 transition-transform duration-300 ${
            isMobileOpen ? 'fixed left-0 top-0 h-full transform translate-x-0' : 'fixed left-0 top-0 h-full transform -translate-x-full'
        } md:relative md:translate-x-0 md:block`}>
            <div className="flex h-16 items-center border-b border-[color:var(--border)] px-6">
                 <Logo />
            </div>
            <div className="flex flex-col p-4">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => {
                            navigate(item.page as any);
                            setIsMobileOpen(false);
                        }}
                        className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                            appState.page === item.page
                                ? 'bg-[color:var(--accent)] text-black'
                                : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--text-primary)]'
                        }`}
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                    </button>
                ))}
                
                {/* Agency Signup Button */}
                <a
                    href="/agency-signup"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--text-primary)]"
                >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>DJ Agency</span>
                </a>
            </div>
             <div className="absolute bottom-0 left-0 w-full p-4 space-y-2 z-10">
                <button 
                  onClick={() => navigate('profile')}
                  className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--text-primary)] text-[color:var(--text-secondary)]`}>
                    {currentUser?.profile_image_url ? (
                        <img src={currentUser.profile_image_url} alt={currentUser?.name} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-[color:var(--surface-alt)] flex items-center justify-center">
                            <svg className="w-4 h-4 text-[color:var(--text-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                    )}
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-[color:var(--text-primary)]">{currentUser?.name}</p>
                            {userPlan !== 'free' && (
                                <span className="bg-gray-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                    {userPlan.toUpperCase()}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-[color:var(--muted)]">
                            {connectionLimit?.remaining === -1 ? 'Unlimited connections' : `${connectionLimit?.remaining || 0} connections left`}
                        </p>
                    </div>
                </button>
                <button 
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-[color:var(--text-secondary)] hover:text-red-500 transition-all duration-200 active:scale-95 active:bg-red-500/10 rounded-md">
                    Sign Out
                </button>
             </div>
        </nav>
        </>
    );
};

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const { navigate } = useContext(AppContext)!;

  return (
    <div onClick={() => course.id === 1 ? navigate('free_course_access') : navigate('course_detail', course.id)} className="group cursor-pointer overflow-hidden rounded-xl bg-[color:var(--surface)] shadow-soft transition-all duration-300 hover:shadow-elev hover:-translate-y-1 border border-[color:var(--border)]">
      <div className="relative">
        <img src={course.imageUrl} alt={course.title} className="h-48 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute top-3 left-3 rounded-full bg-[color:var(--surface)]/80 px-3 py-1 text-xs font-semibold text-[color:var(--text-primary)] backdrop-blur-sm">{course.level}</div>
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
          {course.id === 1 ? (
            <StarIcon className="w-3 h-3 text-yellow-400" />
          ) : (
            <LockIcon className="w-3 h-3 text-white" />
          )}
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-[color:var(--accent)]">{(course.category || 'COURSE').toUpperCase()}</p>
        <h3 className="mt-1 font-display text-lg font-bold text-[color:var(--text-primary)]">{course.title}</h3>
        <p className="mt-1 text-sm text-[color:var(--muted)] font-mono">by {course.instructor}</p>
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--surface-alt)]">
            <div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${course.progress}%` }}></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-[color:var(--muted)]">
            <span>{course.progress > 0 ? `${course.progress}% complete` : 'Not started'}</span>
            <span>{course.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PricingCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => {
    const [showCheckout, setShowCheckout] = useState(false);

    const handleUpgrade = () => {
        if (plan.name === 'Free') {
            window.location.href = '/';
        } else {
            setShowCheckout(true);
        }
    };

    return (
        <>
            <div className={`flex flex-col rounded-xl p-8 transition-all duration-300 ${plan.isFeatured ? 'bg-[color:var(--surface)] border-2 border-[color:var(--accent)] scale-105' : 'bg-[color:var(--surface-alt)] border border-[color:var(--border)]'}`}>
                {plan.isFeatured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--accent)] px-4 py-1 text-sm font-semibold text-black">BEST VALUE</div>
                )}
                <h3 className="font-display text-2xl font-bold text-center text-[color:var(--text-primary)]">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center">
                    <span className="font-display text-5xl font-extrabold tracking-tight text-[color:var(--text-primary)]">{plan.price}</span>
                    <span className="ml-1 text-xl font-semibold text-[color:var(--muted)]">{plan.priceDetails}</span>
                </div>
                <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-[color:var(--success)]" />
                            <span className="ml-3 text-[color:var(--text-secondary)]">{feature}</span>
                        </li>
                    ))}
                </ul>
                <Button 
                    variant={plan.isFeatured ? 'primary' : 'secondary'} 
                    className="mt-10 w-full"
                    onClick={handleUpgrade}
                >
                    {plan.cta}
                </Button>
            </div>

            {showCheckout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[color:var(--bg)] border border-[color:var(--border)] rounded-xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-[color:var(--text-primary)]">
                                Upgrade to {plan.name}
                            </h2>
                            <button
                                onClick={() => setShowCheckout(false)}
                                className="text-[color:var(--muted)] hover:text-[color:var(--text-primary)] transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold text-[color:var(--accent)] mb-2">Coming Soon!</h3>
                            <p className="text-[color:var(--text-secondary)] mb-4">Premium subscriptions will be available soon.</p>
                            <Button onClick={() => setShowCheckout(false)}>Got it</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export const FaqItemComponent: React.FC<{ item: FaqItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-[color:var(--border)]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-6 text-left"
            >
                <span className="font-display text-lg font-medium text-[color:var(--text-primary)]">{item.question}</span>
                <ChevronDownIcon className={`h-6 w-6 flex-shrink-0 text-[color:var(--muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="pb-6 text-[color:var(--text-secondary)]">{item.answer}</p>
            </div>
        </div>
    );
};

// ⚠️ CRITICAL SWIPE COMPONENT - DO NOT MODIFY CORE FUNCTIONALITY
// Enhanced with Tinder-like image navigation
// Only modify: colors, text, images - NEVER touch drag/touch handlers or animations
export const OpportunitySwipeCard: React.FC<{ opportunity: Opportunity; onSwipe: (direction: 'left' | 'right') => void; isTop: boolean; style?: React.CSSProperties; 'data-swipe-card'?: boolean; }> = ({ opportunity, onSwipe, isTop, style, ...props }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentX = useRef(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const { connectionLimit, checkCanConnect } = useMatchStore();

    // Tinder-like: Multiple images support
    const images = opportunity.images || [opportunity.imageUrl];
    const totalImages = images.length;

    // ⚠️ PROTECTED: Drag handlers - DO NOT MODIFY
    const handleDragStart = (clientX: number) => {
        if (!isTop) return;
        isDragging.current = true;
        startX.current = clientX;
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
    };

    // ⚠️ PROTECTED: Drag movement - DO NOT MODIFY
    const handleDragMove = (clientX: number) => {
        if (!isDragging.current || !isTop) return;
        currentX.current = clientX - startX.current;
        if (cardRef.current) {
            const rotate = currentX.current / 20;
            cardRef.current.style.transform = `translateX(${currentX.current}px) rotate(${rotate}deg)`;
        }
    };

    // ⚠️ PROTECTED: Drag end logic - DO NOT MODIFY
    const handleDragEnd = async () => {
        if (!isDragging.current || !isTop) return;
        isDragging.current = false;
        
        const swipeThreshold = 100;
        if (Math.abs(currentX.current) > swipeThreshold) {
            const direction = currentX.current > 0 ? 'right' : 'left';
            
            // Check connection limit for right swipes
            if (direction === 'right') {
                const canConnect = await checkCanConnect();
                if (!canConnect) {
                    // Bounce back if limit reached
                    if (cardRef.current) {
                        cardRef.current.style.transition = 'transform 0.3s ease';
                        cardRef.current.style.transform = '';
                    }
                    currentX.current = 0;
                    return;
                }
            }
            
            if (cardRef.current) {
                cardRef.current.classList.add(direction === 'right' ? 'swipe-out-right' : 'swipe-out-left');
                cardRef.current.addEventListener('animationend', () => onSwipe(direction), { once: true });
            }
        } else {
            if (cardRef.current) {
                cardRef.current.style.transition = 'transform 0.3s ease';
                cardRef.current.style.transform = '';
            }
        }
        currentX.current = 0;
    };

    // Tinder-like: Image navigation on tap
    const handleImageTap = (e: React.MouseEvent) => {
        if (!isTop || isDragging.current) return;
        e.stopPropagation();
        
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const tapX = e.clientX - rect.left;
        const cardWidth = rect.width;
        
        if (tapX < cardWidth / 2) {
            // Left tap - previous image
            setCurrentImageIndex(prev => prev > 0 ? prev - 1 : totalImages - 1);
        } else {
            // Right tap - next image
            setCurrentImageIndex(prev => prev < totalImages - 1 ? prev + 1 : 0);
        }
    };

    // ⚠️ PROTECTED: Event handlers - DO NOT MODIFY
    const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
    const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
    const onMouseUp = () => handleDragEnd();
    const onMouseLeave = () => handleDragEnd();

    const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
    const onTouchEnd = () => handleDragEnd();

    return (
        <div
            ref={cardRef}
            className="absolute h-full w-full cursor-grab active:cursor-grabbing"
            style={style}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            {...props}
        >
            <div className="relative h-full w-full select-none overflow-hidden rounded-xl bg-[color:var(--surface)] shadow-elev border border-[color:var(--border)]">
                {/* Image with tap navigation */}
                <div className="relative h-full w-full" onClick={handleImageTap}>
                    <img 
                        src={images[currentImageIndex]} 
                        alt={`${opportunity.title} - ${currentImageIndex + 1}`} 
                        className="h-full w-full object-cover transition-opacity duration-300" 
                    />
                    
                    {/* Image indicators (Tinder-style) */}
                    {totalImages > 1 && (
                        <div className="absolute top-4 left-4 right-4 flex gap-1">
                            {images.map((_, index) => (
                                <div 
                                    key={index}
                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                        index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* Invisible tap zones for navigation */}
                    <div className="absolute inset-0 flex">
                        <div className="w-1/2 h-full" /> {/* Left tap zone */}
                        <div className="w-1/2 h-full" /> {/* Right tap zone */}
                    </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none"></div>
                
                {/* Connection limit warning */}
                {connectionLimit && !connectionLimit.canConnect && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                        <div className="bg-red-500 text-white p-6 rounded-lg text-center max-w-sm mx-4">
                            <h3 className="text-xl font-bold mb-2">🚫 Connection Limit Reached</h3>
                            <p className="mb-4">You've reached your free plan limit of 5 connections.</p>
                            <button className="bg-white text-red-500 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
                                Upgrade to Pro
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Profile info */}
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                    <div className="flex items-end justify-between">
                        <div className="flex-1">
                            <h3 className="font-display text-3xl font-bold">{opportunity.title}</h3>
                            <p className="mt-1 text-lg text-white/90">{opportunity.venue} - {opportunity.location}</p>
                            <p className="mt-1 text-sm text-white/70">{opportunity.date}</p>
                            
                            {showDetails && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-white/80">{opportunity.bio || 'Passionate DJ looking to connect and collaborate with fellow artists.'}</p>
                                </div>
                            )}
                            
                            <div className="mt-4 flex flex-wrap gap-2">
                                {opportunity.genres.map(genre => (
                                    <span key={genre} className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">{genre}</span>
                                ))}
                                {opportunity.skills?.map(skill => (
                                    <span key={skill} className="rounded-full bg-[color:var(--accent)]/30 px-3 py-1 text-xs font-semibold text-[color:var(--accent)] backdrop-blur-sm">{skill}</span>
                                ))}
                                <span className="rounded-full bg-[color:var(--accent)]/30 px-3 py-1 text-xs font-semibold text-[color:var(--accent)] backdrop-blur-sm">{opportunity.fee}</span>
                            </div>
                        </div>
                        
                        {/* Info button */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDetails(!showDetails);
                            }}
                            className="ml-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <span className="text-sm font-bold">i</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};