/**
 * Shared form validation utilities for email and phone numbers.
 */

export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { isValid: false, error: "Email address is required" };
  }
  const cleanEmail = email.trim();
  // Standard email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, error: "Please enter a valid email address (e.g. name@domain.com)" };
  }
  return { isValid: true, error: null };
}

export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: "Phone number is required" };
  }
  // Strip spaces, dashes, parentheses, leading country code +91
  const digitsOnly = phone.replace(/[\s\-\(\)]/g, "").replace(/^\+91/, "");
  
  // Valid Indian mobile number format (10 digits, starting with 6-9) or standard 10-15 digit phone
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(digitsOnly)) {
    return { isValid: false, error: "Please enter a valid 10-digit mobile number (e.g. 9876543210)" };
  }
  return { isValid: true, error: null };
}
