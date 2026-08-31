const enMessages = {
  "auth.loginSuccess": "Signed in successfully",
  "auth.unauthorized": "Authentication required. Please sign in.",
  "cart.empty": "Your cart is empty. Please select products to continue.",
  "cart.updated": "Cart updated successfully",
  "order.created": "Order placed successfully",
  "order.notFound": "Order not found",
  "offer.invalid": "Invalid or expired promo code",
  "offer.applied": "Coupon applied successfully",
  "product.notFound": "Product not found",
  "review.created": "Review submitted successfully",
  "server.error": "Internal server error occurred",
};

const hiMessages = {
  "auth.loginSuccess": "सफलतापूर्वक साइन इन किया गया",
  "auth.unauthorized": "प्रमाणीकरण आवश्यक है। कृपया साइन इन करें।",
  "cart.empty": "आपकी कार्ट खाली है। कृपया जारी रखने के लिए उत्पाद चुनें।",
  "cart.updated": "कार्ट सफलतापूर्वक अपडेट की गई",
  "order.created": "ऑर्डर सफलतापूर्वक प्राप्त हुआ",
  "order.notFound": "ऑर्डर नहीं मिला",
  "offer.invalid": "अमान्य या समाप्त प्रोमो कोड",
  "offer.applied": "कूपन सफलतापूर्वक लागू किया गया",
  "product.notFound": "उत्पाद नहीं मिला",
  "review.created": "समीक्षा सफलतापूर्वक सबमिट की गई",
  "server.error": "आंतरिक सर्वर त्रुटि हुई",
};

const i18nMiddleware = (req, res, next) => {
  const headerLang = req.headers["accept-language"] || req.query.lang || "en-IN";
  const lang = headerLang.toLowerCase().includes("hi") ? "hi-IN" : "en-IN";

  req.lang = lang;
  req.t = (key, fallbackMessage) => {
    const dict = lang === "hi-IN" ? hiMessages : enMessages;
    return dict[key] || fallbackMessage || key;
  };

  next();
};

module.exports = i18nMiddleware;
