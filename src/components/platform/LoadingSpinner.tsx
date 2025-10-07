import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <motion.div
        className="w-16 h-16 border-4 border-[color:var(--accent)] border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export const LoadingCard: React.FC = () => {
  return (
    <motion.div
      className="w-full h-96 bg-[color:var(--surface)] rounded-xl border border-[color:var(--border)] p-6"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    >
      <div className="animate-pulse">
        <div className="h-48 bg-[color:var(--surface-alt)] rounded-lg mb-4"></div>
        <div className="h-6 bg-[color:var(--surface-alt)] rounded mb-2"></div>
        <div className="h-4 bg-[color:var(--surface-alt)] rounded w-3/4 mb-2"></div>
        <div className="flex gap-2 mt-4">
          <div className="h-6 bg-[color:var(--surface-alt)] rounded-full w-16"></div>
          <div className="h-6 bg-[color:var(--surface-alt)] rounded-full w-20"></div>
        </div>
      </div>
    </motion.div>
  );
};
