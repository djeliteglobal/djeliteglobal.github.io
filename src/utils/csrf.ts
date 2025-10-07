// CSRF Protection utility
export const generateCSRFToken = (): string => {
  return crypto.randomUUID();
};

export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  return token === sessionToken && token.length > 0;
};

export const getCSRFHeaders = (): Record<string, string> => {
  const token = generateCSRFToken();
  sessionStorage.setItem('csrf-token', token);
  
  return {
    'X-CSRF-Token': token,
    'Content-Type': 'application/json'
  };
};
