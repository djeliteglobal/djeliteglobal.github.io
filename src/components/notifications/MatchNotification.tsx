import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchNotificationProps {
  isVisible: boolean;
  matchName: string;
  matchAvatar: string;
  onClose: () => void;
  onSendMessage: () => void;
  onKeepSwiping: () => void;
}

export const MatchNotification: React.FC<MatchNotificationProps> = ({
  isVisible,
  matchName,
  matchAvatar,
  onClose,
  onSendMessage,
  onKeepSwiping
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl p-8 max-w-sm w-full text-center text-white shadow-2xl"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
          >
            <h1 className="text-4xl font-bold mb-2">IT'S A MATCH! 🎉</h1>
            <p className="text-pink-100 mb-6">You and {matchName} liked each other</p>

            <div className="flex justify-center mb-6">
              <img
                src={matchAvatar}
                alt={matchName}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={onSendMessage}
                className="w-full bg-white text-purple-600 py-3 px-6 rounded-full font-bold hover:bg-gray-100 transition-colors"
              >
                💬 Send Message
              </button>
              <button
                onClick={onKeepSwiping}
                className="w-full bg-transparent border-2 border-white text-white py-3 px-6 rounded-full font-bold hover:bg-white/10 transition-colors"
              >
                Keep Swiping
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};