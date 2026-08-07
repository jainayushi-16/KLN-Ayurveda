const dotenv = require("dotenv");
dotenv.config();

const { PrismaClient } = require("@prisma/client");
const logger = require("./logger");

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// Test Database Connection on Startup with Diagnostic Error Logging
prisma
  .$connect()
  .then(() => {
    logger.info("🐘 PostgreSQL Database connected successfully via Prisma ORM!");
  })
  .catch((error) => {
    logger.error("❌ Prisma Database Connection Error:");
    logger.error(`   Target URL: ${process.env.DATABASE_URL || "NOT SET"}`);
    logger.error(`   Message: ${error.message}`);
    logger.warn("💡 Tip: If using Neon, check if your Neon project is awake at console.neon.tech or verify ?sslmode=require");
  });

module.exports = prisma;
