const Razorpay = require("razorpay");
const logger = require("./logger");

const cleanString = (val) => (val || "").replace(/^["'\s]+|["'\s]+$/g, "").trim();

const keyId = cleanString(process.env.RAZORPAY_KEY_ID) || "rzp_test_placeholder_key_id";
const keySecret = cleanString(process.env.RAZORPAY_KEY_SECRET) || "placeholder_key_secret";

let razorpayInstance = null;

try {
  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
  logger.info("💳 Razorpay Client initialized");
} catch (err) {
  logger.error("⚠️ Failed to initialize Razorpay SDK:", err.message);
}

module.exports = {
  razorpayInstance,
  keyId,
  keySecret,
};
