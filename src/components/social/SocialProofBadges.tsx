import React from 'react';
import { StarIcon, HeartIcon, UsersIcon } from '../../constants/platform';

interface SocialProofBadgesProps {
  profile: {
    matchCount?: number;
    endorsements?: number;
    mutualConnections?: number;
    isVerified?: boolean;
    isPremium?: boolean;
    recentActivity?: string;
  };
  className?: string;
}

export const SocialProofBadges: React.FC<SocialProofBadgesProps> = ({ 
  profile, 
  className = '' 
}) => {
  const badges = [];

  // Verification badge
  if (profile.isVerified) {
    badges.push(
      <div key="verified" className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-xs font-semibold">Verified</span>
      </div>
    );
  }

  // Premium badge
  if (profile.isPremium) {
    badges.push(
      <div key="premium" className="flex items-center gap-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
        <StarIcon className="w-3 h-3" fill="currentColor" />
        <span className="text-xs font-semibold">Pro</span>
      </div>
    );
  }

  // High match count (social proof)
  if (profile.matchCount && profile.matchCount > 10) {
    badges.push(
      <div key="popular" className="flex items-center gap-1 bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full">
        <HeartIcon className="w-3 h-3" fill="currentColor" />
        <span className="text-xs font-semibold">{profile.matchCount}+ matches</span>
      </div>
    );
  }

  // Mutual connections
  if (profile.mutualConnections && profile.mutualConnections > 0) {
    badges.push(
      <div key="mutual" className="flex items-center gap-1 bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
        <UsersIcon className="w-3 h-3" />
        <span className="text-xs font-semibold">{profile.mutualConnections} mutual</span>
      </div>
    );
  }

  // Recent activity indicator
  if (profile.recentActivity) {
    badges.push(
      <div key="active" className="flex items-center gap-1 bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs font-semibold">{profile.recentActivity}</span>
      </div>
    );
  }

  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {badges.slice(0, 3)}
    </div>
  );
};