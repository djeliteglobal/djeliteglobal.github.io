import React from 'react';

interface ConnectionLimitWarningProps {
  remaining: number;
  canConnect: boolean;
}

export const ConnectionLimitWarning: React.FC<ConnectionLimitWarningProps> = ({ remaining, canConnect }) => {
  if (remaining === -1) return null; // Unlimited connections

  if (!canConnect) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Connection Limit Reached
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>You've reached your free plan limit of 5 connections. Upgrade to Pro for unlimited connections!</p>
            </div>
            <div className="mt-4">
              <div className="flex space-x-2">
                <button className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (remaining <= 2) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Almost at your connection limit
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>You have {remaining} connection{remaining !== 1 ? 's' : ''} remaining on your free plan.</p>
            </div>
            <div className="mt-4">
              <div className="flex space-x-2">
                <button className="bg-yellow-100 px-3 py-2 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200">
                  Upgrade for Unlimited
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};