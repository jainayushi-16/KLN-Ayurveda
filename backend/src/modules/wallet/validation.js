const { z } = require("zod");

const adminAdjustWalletSchema = z.object({
  body: z.object({
    amount: z
      .number({ required_error: "Amount is required" })
      .positive("Amount must be greater than zero")
      .max(100000, "Maximum adjustment amount is ₹1,00,000"),
    type: z.enum(["CREDIT", "DEBIT"], {
      required_error: "Adjustment type must be CREDIT or DEBIT",
    }),
    category: z
      .enum([
        "ADMIN_ADJUSTMENT",
        "PROMOTIONAL_CASHBACK",
        "REFUND",
        "CANCELLATION_REFUND",
        "RETURN_REFUND",
      ])
      .optional()
      .default("ADMIN_ADJUSTMENT"),
    reason: z
      .string({ required_error: "A mandatory reason must be provided" })
      .trim()
      .min(5, "Reason must be at least 5 characters long")
      .max(500, "Reason cannot exceed 500 characters"),
    expiresAt: z.string().datetime().nullable().optional(),
  }),
});

const getTransactionsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    type: z.enum(["ALL", "CREDIT", "DEBIT", "REFUND", "CASHBACK", "EXPIRED"]).optional(),
    search: z.string().optional(),
  }),
});

module.exports = {
  adminAdjustWalletSchema,
  getTransactionsQuerySchema,
};
