// Security utility for input sanitization
export const sanitizeForLog = (input: any): string => {
  if (typeof input !== 'string') {
    input = String(input);
  }
  
  return input
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[<>]/g, '')
    .substring(0, 1000); // Limit length
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim().replace(/[^\w@.-]/g, '');
};

export const validateInput = (input: any, maxLength = 1000): boolean => {
  if (!input) return false;
  if (typeof input !== 'string') return false;
  if (input.length > maxLength) return false;
  return true;
};