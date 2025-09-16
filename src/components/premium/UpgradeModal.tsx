import React from 'react';
import { XIcon } from '../../constants/platform';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[color:var(--bg)] border border-[color:var(--border)] rounded-xl p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-[color:var(--text-primary)] mb-2">
            Connection Limit Reached
          </h2>
          <p className="text-[color:var(--text-secondary)] mb-6">
            You've reached your free plan limit of <strong>5 connections per day</strong>. 
            Upgrade to Pro for unlimited connections and premium features!
          </p>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 mb-6 border border-purple-500/30">
            <h3 className="text-lg font-bold text-[color:var(--accent)] mb-2">✨ Pro Benefits</h3>
            <ul className="text-sm text-[color:var(--text-secondary)] space-y-1">
              <li>• Unlimited DJ connections</li>
              <li>• Priority gig matching</li>
              <li>• Advanced profile features</li>
              <li>• Direct promoter contact</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[color:var(--border)] rounded-lg text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-alt)] transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={onUpgrade}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};