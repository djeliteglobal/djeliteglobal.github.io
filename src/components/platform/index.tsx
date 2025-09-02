import React, { useContext } from 'react';
import { AppContext } from '../../pages/HomePage';
import { MOCK_USER, NAV_ITEMS, SunIcon, MoonIcon, SearchIcon, MenuIcon, Logo } from '../../constants/platform';

export const TopBar: React.FC = () => {
    const { appState, setAppState } = useContext(AppContext)!;
    
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
                    <img src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} className="h-full w-full rounded-full object-cover" />
                </div>
            </div>
        </header>
    );
};

export const SideNav: React.FC = () => {
    const { appState, navigate } = useContext(AppContext)!;
    
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
             <div className="absolute bottom-0 left-0 w-full p-4">
                <button 
                  onClick={() => navigate('settings')}
                  className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    appState.page === 'settings' 
                        ? 'bg-[color:var(--surface-alt)] text-[color:var(--text-primary)]' 
                        : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--text-primary)]'
                  }`}>
                    <img src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} className="h-8 w-8 rounded-full object-cover" />
                    <div className="text-left">
                        <p className="font-semibold text-[color:var(--text-primary)]">{MOCK_USER.name}</p>
                        <p className="text-xs text-[color:var(--muted)]">{MOCK_USER.plan}</p>
                    </div>
                </button>
             </div>
        </nav>
    );
};