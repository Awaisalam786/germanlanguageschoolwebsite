/**
 * Validates and normalizes phone numbers for customer inquiries and orders.
 * Accepts local Pakistani and international formats with optional leading '+',
 * spaces, hyphens, and parentheses.
 * 
 * @param {string} phone 
 * @returns {{ isValid: boolean, normalized: string, digitsOnly: string, error?: string }}
 */
export function validateAndNormalizePhone(phone) {
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return {
      isValid: false,
      normalized: '',
      digitsOnly: '',
      error: 'Please enter a phone or WhatsApp number.'
    };
  }

  const trimmed = phone.trim();

  // Allow only digits, whitespace, optional leading +, hyphens, dots, and parentheses
  // Reject any letters or invalid punctuation characters immediately
  const allowedCharsRegex = /^\+?[0-9\s\-().]{7,30}$/;
  if (!allowedCharsRegex.test(trimmed)) {
    return {
      isValid: false,
      normalized: trimmed,
      digitsOnly: '',
      error: 'Please provide a valid phone or WhatsApp number using numbers and standard formatting (+, -, spaces).'
    };
  }

  // Extract pure digits
  const digitsOnly = trimmed.replace(/[^0-9]/g, '');

  // International standard minimum is 7 digits, maximum 15 standard digits (25 max boundary)
  if (digitsOnly.length < 7 || digitsOnly.length > 25) {
    return {
      isValid: false,
      normalized: trimmed,
      digitsOnly,
      error: 'Phone number must contain between 7 and 25 digits.'
    };
  }

  // Normalize formatting:
  // If user entered "+92 300 1234567", preserve "+92..."
  // If user entered "0300 1234567", store cleanly
  let normalized = trimmed.startsWith('+')
    ? '+' + digitsOnly
    : digitsOnly;

  return {
    isValid: true,
    normalized,
    digitsOnly,
    error: null
  };
}
