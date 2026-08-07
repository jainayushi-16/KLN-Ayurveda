const { z } = require("zod");

const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(5, "Message must be at least 5 characters"),
  }),
});

module.exports = {
  createContactSchema,
};
