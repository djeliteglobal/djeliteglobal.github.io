import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../../pages/HomePage';
import { useAuth } from '../../contexts/AuthContext';
import { NAV_ITEMS, SunIcon, MoonIcon, SearchIcon, MenuIcon, CheckCircleIcon, ChevronDownIcon, Logo } from '../../constants/platform';
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
    secondary: 'bg-[color:var(--surface-alt)] text-[color:var(--text-primary)] hover:bg-[color:var(--elevated)] border border-[color:var(--border)]',
    ghost: 'bg-transparent text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--text-primary)]',
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const TopBar: React.FC = () => {
    const { appState, setAppState } = useContext(AppContext)!;
    const { currentUser } = useAuth();
    
    const toggleTheme = () => {
        setAppState(prev => ({...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
    };

    const toggleSidebar = () => {
        setAppState(prev => ({...prev, isSidebarOpen: !prev.isSidebarOpen }));
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[color:var(--border)] bg-[color:var(--surface)]/80 px-4 backdrop-blur-sm md:px-8">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="md:hidden text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]">
                    <MenuIcon className="h-6 w-6" />
                </button>
                 <div className="hidden md:block">
                    <Logo />
                </div>
            </div>
            <div className="flex flex-1 items-center justify-end gap-4">
                <div className="relative hidden sm:block w-full max-w-xs">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[color:var(--muted)]" />
                    <input
                        type="search"
                        placeholder="Search courses, opportunities..."
                        className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-alt)] py-2 pl-10 pr-4 text-[color:var(--text-primary)] placeholder-[color:var(--muted)] focus:border-[color:var(--accent)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent)]"
                    />
                </div>
                <button onClick={toggleTheme} className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface-alt)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]">
                    {appState.theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>
                <div className="h-10 w-10 rounded-full">
                    <img src={currentUser?.avatarUrl} alt={currentUser?.name} className="h-full w-full rounded-full object-cover" />
                </div>
            </div>
        </header>
    );
};

export const SideNav: React.FC = () => {
    const { appState, navigate } = useContext(AppContext)!;
    const { currentUser, logout } = useAuth();
    
    return (
        <nav className={`fixed z-40 md:z-auto md:relative inset-y-0 left-0 w-64 border-r border-[color:var(--border)] bg-[color:var(--surface)] transition-transform duration-300 ease-in-out ${appState.isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="flex h-16 items-center border-b border-[color:var(--border)] px-6 md:hidden">
                 <Logo />
            </div>
            <div className="flex flex-col p-4">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => navigate(item.page as any)}
                        className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                            appState.page === item.page
                                ? 'bg-[color:var(--accent)] text-[#0B0D10]'
                                : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--text-primary)]'
                        }`}
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                    </button>
                ))}
            </div>
             <div className="absolute bottom-0 left-0 w-full p-4 space-y-2">
                <button 
                  onClick={() => navigate('settings')}
                  className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    appState.page === 'settings' 
                        ? 'bg-[color:var(--surface-alt)] text-[color:var(--text-primary)]' 
                        : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--text-primary)]'
                  }`}>
                    <img src={currentUser?.avatarUrl} alt={currentUser?.name} className="h-8 w-8 rounded-full object-cover" />
                    <div className="text-left">
                        <p className="font-semibold text-[color:var(--text-primary)]">{currentUser?.name}</p>
                        <p className="text-xs text-[color:var(--muted)]">{currentUser?.plan}</p>
                    </div>
                </button>
                <button 
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-[color:var(--text-secondary)] hover:text-red-500 transition-all duration-200 active:scale-95 active:bg-red-500/10 rounded-md">
                    Sign Out
                </button>
             </div>
        </nav>
    );
};

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const { navigate } = useContext(AppContext)!;

  return (
    <div onClick={() => navigate('course_detail', course.id)} className="group cursor-pointer overflow-hidden rounded-xl bg-[color:var(--surface)] shadow-soft transition-all duration-300 hover:shadow-elev hover:-translate-y-1 border border-[color:var(--border)]">
      <div className="relative">
        <img src={course.imageUrl} alt={course.title} className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute top-3 left-3 rounded-full bg-[color:var(--surface)]/80 px-3 py-1 text-xs font-semibold text-[color:var(--text-primary)] backdrop-blur-sm">{course.level}</div>
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-[color:var(--accent)]">{course.category.toUpperCase()}</p>
        <h3 className="mt-1 font-display text-lg font-bold text-[color:var(--text-primary)]">{course.title}</h3>
        <p className="mt-1 text-sm text-[color:var(--muted)]">by {course.instructor}</p>
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
    return (
        <div className={`flex flex-col rounded-xl p-8 transition-all duration-300 ${plan.isFeatured ? 'bg-[color:var(--elevated)] border-2 border-[color:var(--accent)] scale-105' : 'bg-[color:var(--surface)] border border-[color:var(--border)]'}`}>
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
            <Button variant={plan.isFeatured ? 'primary' : 'secondary'} className="mt-10 w-full">
                {plan.cta}
            </Button>
        </div>
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

export const OpportunitySwipeCard: React.FC<{ opportunity: Opportunity; onSwipe: (direction: 'left' | 'right') => void; isTop: boolean; style?: React.CSSProperties; }> = ({ opportunity, onSwipe, isTop, style }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentX = useRef(0);

    const handleDragStart = (clientX: number) => {
        if (!isTop) return;
        isDragging.current = true;
        startX.current = clientX;
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging.current || !isTop) return;
        currentX.current = clientX - startX.current;
        if (cardRef.current) {
            const rotate = currentX.current / 20;
            cardRef.current.style.transform = `translateX(${currentX.current}px) rotate(${rotate}deg)`;
        }
    };

    const handleDragEnd = () => {
        if (!isDragging.current || !isTop) return;
        isDragging.current = false;
        
        const swipeThreshold = 100;
        if (Math.abs(currentX.current) > swipeThreshold) {
            const direction = currentX.current > 0 ? 'right' : 'left';
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
        >
            <div className="relative h-full w-full select-none overflow-hidden rounded-xl bg-[color:var(--surface)] shadow-elev border border-[color:var(--border)]">
                <img src={opportunity.imageUrl} alt={opportunity.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                    <h3 className="font-display text-3xl font-bold">{opportunity.title}</h3>
                    <p className="mt-1 text-lg text-white/90">{opportunity.venue} - {opportunity.location}</p>
                    <p className="mt-1 text-sm text-white/70">{opportunity.date}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {opportunity.genres.map(genre => (
                            <span key={genre} className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">{genre}</span>
                        ))}
                        <span className="rounded-full bg-[color:var(--accent)]/30 px-3 py-1 text-xs font-semibold text-[color:var(--accent)] backdrop-blur-sm">{opportunity.fee}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};