export const DUMMY_PAYMENT_METHODS = [
  {
    id: "pay-1",
    type: "Visa",
    cardNumber: "•••• •••• •••• 4242",
    cardHolder: "KLN Customer",
    expiry: "08/28",
    isDefault: true,
    badgeColor: "from-blue-600 to-indigo-800",
  },
  {
    id: "pay-2",
    type: "UPI",
    upiId: "customer@gpay",
    provider: "Google Pay / BHIM UPI",
    isDefault: false,
    badgeColor: "from-emerald-600 to-teal-800",
  },
];

export const DUMMY_NOTIFICATION_SETTINGS = {
  emailNotifications: true,
  promotionalOffers: true,
  orderUpdates: true,
  newsletter: false,
};

export const DUMMY_HELP_FAQS = [
  {
    q: "How can I view my order status?",
    a: "You can view your order details under 'My Orders' in your profile menu or check order updates sent directly to your email.",
  },
  {
    q: "What is the expected delivery timeline?",
    a: "Standard metro orders arrive within 2 to 4 business days. Regional areas take 4 to 6 business days via fast air express shipping.",
  },
  {
    q: "What is KLN Ayurveda's Return Policy?",
    a: "We accept returns for unopened, sealed products within 15 days of delivery. Free return pickups can be scheduled through support.",
  },
  {
    q: "Are all KLN Ayurveda products 100% natural?",
    a: "Yes! Every single product is 100% certified Ayurvedic, mineral-oil free, cruelty-free, and crafted with cold-pressed herbal extractions.",
  },
];
