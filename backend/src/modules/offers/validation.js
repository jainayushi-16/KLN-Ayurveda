const { z } = require("zod");

const offerTypeEnum = ["PERCENTAGE", "FLAT", "PRODUCT_SPECIFIC", "CATEGORY_SPECIFIC", "CART_VALUE", "FREE_SHIPPING"];
const offerStatusEnum = ["DRAFT", "SCHEDULED", "ACTIVE", "INACTIVE", "EXPIRED", "EXHAUSTED"];

const createOfferSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(120),
    description: z.string().optional().nullable(),
    code: z.string().min(3, "Code must be at least 3 characters").max(30),
    type: z.enum(offerTypeEnum).default("PERCENTAGE"),
    value: z.number().min(0, "Value cannot be negative"),
    maxDiscount: z.number().min(0).optional().nullable(),
    minimumOrderValue: z.number().min(0).default(0),
    startAt: z.string().min(1, "Start date is required"),
    endAt: z.string().min(1, "End date is required"),
    status: z.enum(offerStatusEnum).default("ACTIVE"),
    usageLimit: z.number().int().positive().optional().nullable(),
    perCustomerLimit: z.number().int().positive().default(1),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    productIds: z.array(z.string()).optional().default([]),
    categoryIds: z.array(z.string()).optional().default([]),
  }),
});

const updateOfferSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(120).optional(),
    description: z.string().optional().nullable(),
    code: z.string().min(3).max(30).optional(),
    type: z.enum(offerTypeEnum).optional(),
    value: z.number().min(0).optional(),
    maxDiscount: z.number().min(0).optional().nullable(),
    minimumOrderValue: z.number().min(0).optional(),
    startAt: z.string().optional(),
    endAt: z.string().optional(),
    status: z.enum(offerStatusEnum).optional(),
    usageLimit: z.number().int().positive().optional().nullable(),
    perCustomerLimit: z.number().int().positive().optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    productIds: z.array(z.string()).optional(),
    categoryIds: z.array(z.string()).optional(),
  }),
});

const validateDiscountSchema = z.object({
  body: z.object({
    code: z.string().min(1, "Coupon code is required"),
    cartItems: z
      .array(
        z.object({
          productId: z.string().optional(),
          id: z.string().optional(),
          quantity: z.number().int().min(1),
        })
      )
      .min(1, "Cart items required"),
  }),
});

module.exports = {
  createOfferSchema,
  updateOfferSchema,
  validateDiscountSchema,
};
