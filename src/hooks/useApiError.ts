import { useState, useCallback } from 'react';

export class ApiError extends Error {
  statusCode?: number;
  isTimeout: boolean;
  isNetworkError: boolean;

  constructor(message: string, options?: { statusCode?: number; isTimeout?: boolean; isNetworkError?: boolean }) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = options?.statusCode;
    this.isTimeout = options?.isTimeout || false;
    this.isNetworkError = options?.isNetworkError || false;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

interface UseApiErrorResult {
  error: ApiError | null;
  setError: (err: unknown) => void;
  clearError: () => void;
  handleApiCall: <T>(apiCall: () => Promise<T>) => Promise<T | undefined>;
}

export const useApiError = (): UseApiErrorResult => {
  const [error, setInternalError] = useState<ApiError | null>(null);

  const clearError = useCallback(() => {
    setInternalError(null);
  }, []);

  const setError = useCallback((err: unknown) => {
    if (err instanceof ApiError) {
      setInternalError(err);
    } else if (err instanceof Error) {
      // Attempt to parse common network/timeout errors
      if (err.message.includes('timeout') || err.message.includes('aborted')) {
        setInternalError(new ApiError('The request timed out. Please try again.', { isTimeout: true }));
      } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        setInternalError(new ApiError('Network error. Please check your internet connection.', { isNetworkError: true }));
      } else {
        setInternalError(new ApiError(`An unexpected error occurred: ${err.message}`));
      }
    } else {
      setInternalError(new ApiError('An unknown error occurred.'));
    }
  }, []);

  const handleApiCall = useCallback(async <T>(apiCall: () => Promise<T>): Promise<T | undefined> => {
    clearError(); // Clear previous errors before a new attempt
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err);
      return undefined;
    }
  }, [clearError, setError]);

  return { error, setError, clearError, handleApiCall };
};
