/**
 * Card Payment Validation Utility Module for KLN Ayurveda
 * Provides Luhn algorithm check, Card Type Detection, Expiry Date & CVV checks.
 */

// Detect Card Brand / Type
export function detectCardType(numberStr = "") {
  const cleanNumber = numberStr.replace(/\D/g, "");
  if (/^4/.test(cleanNumber)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(cleanNumber)) return "Mastercard";
  if (/^3[47]/.test(cleanNumber)) return "Amex";
  if (/^(60|65|2211|2212)/.test(cleanNumber)) return "RuPay";
  if (/^6(?:011|5[0-9]{2})/.test(cleanNumber)) return "Discover";
  return "Card";
}

// Luhn Algorithm Checksum
export function luhnCheck(numberStr = "") {
  const cleanNumber = numberStr.replace(/\D/g, "");
  if (!cleanNumber || cleanNumber.length < 13 || cleanNumber.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// Validate Card Number
export function validateCardNumber(numberStr = "") {
  const cleanNumber = numberStr.replace(/\D/g, "");

  if (!cleanNumber) {
    return { isValid: false, cardType: "Card", error: "Card number is required" };
  }

  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return { isValid: false, cardType: detectCardType(cleanNumber), error: "Card number must be 13 to 19 digits long" };
  }

  const isValidLuhn = luhnCheck(cleanNumber);
  const cardType = detectCardType(cleanNumber);

  if (!isValidLuhn) {
    return { isValid: false, cardType, error: "Invalid card number. Please check digit details." };
  }

  return { isValid: true, cardType, error: null };
}

// Format Card Number into 4-digit blocks
export function formatCardNumber(val = "") {
  const clean = val.replace(/\D/g, "").slice(0, 19);
  const groups = clean.match(/.{1,4}/g);
  return groups ? groups.join(" ") : clean;
}

// Format Expiry Date (MM/YY)
export function formatExpiry(val = "") {
  const clean = val.replace(/\D/g, "").slice(0, 4);
  if (clean.length >= 3) {
    return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  }
  return clean;
}

// Validate Expiry Date
export function validateExpiry(expiryStr = "") {
  if (!expiryStr || !expiryStr.trim()) {
    return { isValid: false, error: "Expiry date is required" };
  }

  const parts = expiryStr.replace(/\s+/g, "").split("/");
  if (parts.length !== 2) {
    return { isValid: false, error: "Expiry must be in MM/YY format" };
  }

  const expMonth = parseInt(parts[0], 10);
  let expYear = parseInt(parts[1], 10);

  if (isNaN(expMonth) || expMonth < 1 || expMonth > 12) {
    return { isValid: false, error: "Invalid month (must be 01 to 12)" };
  }

  if (isNaN(expYear)) {
    return { isValid: false, error: "Invalid expiry year" };
  }

  if (expYear < 100) {
    expYear += 2000;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return { isValid: false, error: "Card expiry date cannot be in the past" };
  }

  if (expYear > currentYear + 25) {
    return { isValid: false, error: "Invalid expiry year" };
  }

  return { isValid: true, error: null };
}

// Validate CVV Code
export function validateCvv(cvvStr = "", cardType = "Card") {
  const cleanCvv = cvvStr.replace(/\D/g, "");
  const requiredLength = cardType === "Amex" ? 4 : 3;

  if (!cleanCvv) {
    return { isValid: false, error: "CVV code is required" };
  }

  if (cleanCvv.length !== requiredLength) {
    return { isValid: false, error: `CVV code must be ${requiredLength} digits` };
  }

  return { isValid: true, error: null };
}
