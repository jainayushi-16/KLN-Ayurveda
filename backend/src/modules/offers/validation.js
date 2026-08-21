const Joi = require("joi");

const offerTypeEnum = ["PERCENTAGE", "FLAT", "PRODUCT_SPECIFIC", "CATEGORY_SPECIFIC", "CART_VALUE", "FREE_SHIPPING"];
const offerStatusEnum = ["DRAFT", "SCHEDULED", "ACTIVE", "INACTIVE", "EXPIRED", "EXHAUSTED"];

const createOfferSchema = Joi.object({
  name: Joi.string().required().trim().max(120),
  description: Joi.string().allow("", null).max(500),
  code: Joi.string().required().trim().uppercase().alphanum().min(3).max(30),
  type: Joi.string().valid(...offerTypeEnum).default("PERCENTAGE"),
  value: Joi.number().min(0).required(),
  maxDiscount: Joi.number().min(0).allow(null, 0),
  minimumOrderValue: Joi.number().min(0).default(0),
  startAt: Joi.date().iso().required(),
  endAt: Joi.date().iso().greater(Joi.ref("startAt")).required(),
  status: Joi.string().valid(...offerStatusEnum).default("ACTIVE"),
  usageLimit: Joi.number().integer().min(1).allow(null),
  perCustomerLimit: Joi.number().integer().min(1).default(1),
  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false),
  productIds: Joi.array().items(Joi.string()).default([]),
  categoryIds: Joi.array().items(Joi.string()).default([]),
});

const updateOfferSchema = Joi.object({
  name: Joi.string().trim().max(120),
  description: Joi.string().allow("", null).max(500),
  code: Joi.string().trim().uppercase().alphanum().min(3).max(30),
  type: Joi.string().valid(...offerTypeEnum),
  value: Joi.number().min(0),
  maxDiscount: Joi.number().min(0).allow(null, 0),
  minimumOrderValue: Joi.number().min(0),
  startAt: Joi.date().iso(),
  endAt: Joi.date().iso(),
  status: Joi.string().valid(...offerStatusEnum),
  usageLimit: Joi.number().integer().min(1).allow(null),
  perCustomerLimit: Joi.number().integer().min(1),
  isActive: Joi.boolean(),
  isFeatured: Joi.boolean(),
  productIds: Joi.array().items(Joi.string()),
  categoryIds: Joi.array().items(Joi.string()),
});

const validateDiscountSchema = Joi.object({
  code: Joi.string().required().trim().uppercase(),
  cartItems: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string(),
        id: Joi.string(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

module.exports = {
  createOfferSchema,
  updateOfferSchema,
  validateDiscountSchema,
};
