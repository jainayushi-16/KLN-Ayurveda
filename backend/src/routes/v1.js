const express = require("express");
const authRoutes = require("../modules/auth/routes");
const userRoutes = require("../modules/users/routes");
const productRoutes = require("../modules/products/routes");
const categoryRoutes = require("../modules/categories/routes");
const cartRoutes = require("../modules/cart/routes");
const wishlistRoutes = require("../modules/wishlist/routes");
const orderRoutes = require("../modules/orders/routes");
const reviewRoutes = require("../modules/reviews/routes");
const blogRoutes = require("../modules/blogs/routes");
const contactRoutes = require("../modules/contact/routes");
const newsletterRoutes = require("../modules/newsletter/routes");
const faqRoutes = require("../modules/faqs/routes");
const notificationRoutes = require("../modules/notifications/routes");
const adminRoutes = require("../modules/admin/routes");
// const offerRoutes = require("../modules/offers/routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/blogs", blogRoutes);
router.use("/contact", contactRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/faqs", faqRoutes);
router.use("/notifications", notificationRoutes);
router.use("/admin", adminRoutes);
// router.use("/offers", offerRoutes);

module.exports = router;

