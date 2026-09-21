const KNOWN_HANDLES = {
  okicici: "Google Pay (ICICI)",
  okhdfcbank: "Google Pay (HDFC)",
  okaxis: "Google Pay (Axis)",
  oksbi: "Google Pay (SBI)",
  ybl: "PhonePe (YES Bank)",
  ibl: "PhonePe (ICICI)",
  axl: "PhonePe (Axis)",
  paytm: "Paytm Payments Bank",
  apl: "Amazon Pay",
  upi: "BHIM / NPCI",
  sbi: "State Bank of India",
  icici: "ICICI Bank",
  hdfcbank: "HDFC Bank",
  axisbank: "Axis Bank",
  kotak: "Kotak Mahindra Bank",
  barodampay: "Bank of Baroda",
  postbank: "India Post Payments Bank",
  dbs: "DBS Digibank",
  kvb: "Karur Vysya Bank",
  indus: "IndusInd Bank",
  federal: "Federal Bank",
  rbl: "RBL Bank",
};

export function validateUpiId(upiStr = "") {
  const trimmed = upiStr.trim();

  if (!trimmed) {
    return { isValid: false, error: "Please enter your UPI Virtual Payment Address (VPA)." };
  }

  if (trimmed.includes(" ")) {
    return { isValid: false, error: "UPI ID cannot contain spaces." };
  }

  const atCount = (trimmed.match(/@/g) || []).length;
  if (atCount !== 1) {
    return { isValid: false, error: "UPI ID must contain exactly one '@' symbol (e.g. mobile@apl or username@okicici)." };
  }

  const [username, handleRaw] = trimmed.split("@");
  const handle = (handleRaw || "").toLowerCase();

  if (!username || username.length < 2) {
    return { isValid: false, error: "Username portion of UPI ID must be at least 2 characters." };
  }

  if (!handle || handle.length < 2) {
    return { isValid: false, error: "Bank handle portion of UPI ID is missing (e.g. @okicici, @paytm, @ybl)." };
  }

  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9.\-_]{2,64}$/;
  if (!upiRegex.test(trimmed)) {
    return { isValid: false, error: "UPI ID format is invalid. Use format: mobile/username@bankhandle" };
  }

  const provider = KNOWN_HANDLES[handle] || "UPI Payment Network";

  return {
    isValid: true,
    error: null,
    normalized: trimmed.toLowerCase(),
    provider,
    handle: `@${handle}`,
  };
}
