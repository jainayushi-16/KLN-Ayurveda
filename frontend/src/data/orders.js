import { PRODUCTS } from "./products";
import { CURRENT_USER } from "./users";

export const INITIAL_ORDER = {
  orderId: "KLN-894201",
  invoiceNo: "INV-2026-9482",
  orderDate: "August 7, 2026",
  items: [
    {
      productId: "kln-hair-oil-01",
      quantity: 1,
      price: 610,
      subtotal: 610,
      name: PRODUCTS[0].name,
      category: PRODUCTS[0].category,
    },
  ],
  totals: {
    subtotal: 610,
    shipping: 0,
    tax: 30.5,
    discount: 0,
    grandTotal: 640.5,
  },
  shippingAddress: CURRENT_USER.address,
  paymentMethod: "UPI",
  paymentDetails: "UPI ID: aarav@gpay",
  paymentStatus: "PAID",
  estimatedDelivery: "3-5 Business Days",
};

export const DUMMY_ORDERS = [INITIAL_ORDER];
