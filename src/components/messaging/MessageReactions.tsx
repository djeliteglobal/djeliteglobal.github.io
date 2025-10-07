import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageReactionsProps {
  messageId: string;
  reactions?: { [emoji: string]: number };
  onReact: (messageId: string, emoji: string) => void;
  showReactionPicker?: boolean;
  onToggleReactionPicker: () => void;
}

const QUICK_REACTIONS = ['❤️', '😂', '😮', '😢', '😡', '👍', '👎', '🔥'];

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  messageId,
  reactions = {},
  onReact,
  showReactionPicker,
  onToggleReactionPicker
}) => {
  const hasReactions = Object.keys(reactions).length > 0;

  return (
    <div className="relative">
      {/* Existing Reactions */}
      {hasReactions && (
        <div className="flex flex-wrap gap-1 mt-1">
          {Object.entries(reactions).map(([emoji, count]) => (
            <motion.button
              key={emoji}
              onClick={() => onReact(messageId, emoji)}
              className="flex items-center gap-1 bg-[color:var(--surface-alt)] hover:bg-[color:var(--border)] rounded-full px-2 py-1 text-xs transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{emoji}</span>
              <span className="text-[color:var(--text-secondary)]">{count}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Add Reaction Button */}
      <button
        onClick={onToggleReactionPicker}
        className="mt-1 w-6 h-6 bg-[color:var(--surface-alt)] hover:bg-[color:var(--border)] rounded-full flex items-center justify-center text-xs transition-colors"
      >
        +
      </button>

      {/* Reaction Picker */}
      <AnimatePresence>
        {showReactionPicker && (
          <motion.div
            className="absolute bottom-full left-0 mb-2 bg-[color:var(--surface)] border border-[color:var(--border)] rounded-lg p-2 shadow-lg z-10"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
          >
            <div className="grid grid-cols-4 gap-2">
              {QUICK_REACTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(messageId, emoji);
                    onToggleReactionPicker();
                  }}
                  className="w-8 h-8 hover:bg-[color:var(--border)] rounded flex items-center justify-center text-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ReadReceiptProps {
  isRead: boolean;
  readAt?: string;
}

export const ReadReceipt: React.FC<ReadReceiptProps> = ({ isRead, readAt }) => {
  if (!isRead) {
    return (
      <div className="flex items-center gap-1 text-xs text-[color:var(--text-secondary)]">
        <div className="w-3 h-3 border border-current rounded-full" />
        <span>Sent</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-xs text-[color:var(--accent)]">
      <div className="w-3 h-3 bg-current rounded-full" />
      <span>Read {readAt ? new Date(readAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
    </div>
  );
};
