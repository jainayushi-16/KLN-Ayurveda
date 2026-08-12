const dotenv = require("dotenv");
dotenv.config();

const { PrismaClient } = require("@prisma/client");
const logger = require("./logger");

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// Test Database Connection on Startup with Retry Logic (Handles Neon Cold Starts)
const connectWithRetry = async (retries = 3, delay = 2500) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$connect();
      logger.info("🐘 PostgreSQL Database connected successfully via Prisma ORM!");
      return;
    } catch (error) {
      if (attempt === retries) {
        logger.error("❌ Prisma Database Connection Error:");
        logger.error(`   Target URL: ${process.env.DATABASE_URL || "NOT SET"}`);
        logger.error(`   Message: ${error.message}`);
        logger.warn("💡 Tip: If using Neon, check if your Neon project is awake at console.neon.tech or verify internet connectivity.");
      } else {
        logger.warn(`⏳ Connecting to database... Attempt ${attempt}/${retries} failed (Neon cold start). Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
};

connectWithRetry();

module.exports = prisma;
