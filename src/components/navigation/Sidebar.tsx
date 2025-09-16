import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { currentUser } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'discover', icon: '⚡', label: 'Discover', count: null },
    { id: 'matches', icon: '💬', label: 'Matches', count: 3 },
    { id: 'referrals', icon: '🎁', label: 'Referrals', count: null },
    { id: 'premium', icon: '👑', label: 'Premium', count: null },
    { id: 'profile', icon: '👤', label: 'Profile', count: null },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-[color:var(--surface)] border-r border-[color:var(--border)] transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-[color:var(--border)]">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-[var(--accent)] to-pink-500 bg-clip-text text-transparent">
                🎧 DJ Elite
              </h1>
              <p className="text-xs text-[color:var(--text-secondary)]">
                Hey {currentUser?.name || 'DJ'}!
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-[color:var(--surface-alt)] rounded-lg transition-colors"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeSection === item.id
                ? 'bg-[color:var(--accent)] text-black'
                : 'hover:bg-[color:var(--surface-alt)] text-[color:var(--text-secondary)]'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && (
              <>
                <span className="font-medium">{item.label}</span>
                {item.count && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-purple-300">
              <span className="text-lg">🚀</span>
              <div>
                <p className="text-sm font-semibold">Upgrade to Premium</p>
                <p className="text-xs">Unlock all features</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};