const { z } = require("zod");

const subscribeSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
  }),
});

module.exports = {
  subscribeSchema,
};
