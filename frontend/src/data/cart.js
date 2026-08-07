import { PRODUCTS } from "./products";

export const INITIAL_CART_ITEMS = [
  {
    id: "cart-item-101",
    productId: "kln-hair-oil-01",
    name: PRODUCTS[0].name,
    slug: "intensive-hair-growth-oil",
    price: PRODUCTS[0].price,
    quantity: 1,
    subtotal: PRODUCTS[0].price,
    image: PRODUCTS[0].images[0],
    category: PRODUCTS[0].category,
  },
];

export const INITIAL_CART = {
  items: INITIAL_CART_ITEMS,
  totalItems: 1,
  subtotal: PRODUCTS[0].price,
  totalAmount: PRODUCTS[0].price,
};
