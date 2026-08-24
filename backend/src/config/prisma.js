const dotenv = require("dotenv");
dotenv.config();

const { PrismaClient } = require("@prisma/client");
const logger = require("./logger");

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// Middleware to handle Neon Serverless PostgreSQL connection drops, pool timeouts & E57P01 terminations
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error) {
    const errorMsg = error ? error.message || JSON.stringify(error) : "";
    const isConnDrop =
      errorMsg.includes("57P01") ||
      errorMsg.includes("terminating connection") ||
      errorMsg.includes("Closed connection") ||
      errorMsg.includes("ConnectionReset") ||
      errorMsg.includes("10054") ||
      errorMsg.includes("connection pool") ||
      errorMsg.includes("P2024") ||
      errorMsg.includes("P1001") ||
      errorMsg.includes("P1017") ||
      errorMsg.includes("ProcessInterrupts");

    if (isConnDrop) {
      logger.warn(`🔄 Neon DB connection dropped or timed out (${params.model ? params.model + '.' : ''}${params.action}). Re-establishing connection pool...`);
      try {
        await prisma.$disconnect().catch(() => {});
        await prisma.$connect();
        return await next(params);
      } catch (retryErr) {
        logger.error(`❌ Prisma auto-reconnect retry failed: ${retryErr.message}`);
        throw retryErr;
      }
    }
    throw error;
  }
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
        logger.warn("💡 Tip: Check Neon PostgreSQL project status or database credentials.");
      } else {
        logger.warn(`⏳ Connecting to database... Attempt ${attempt}/${retries} failed (Neon cold start). Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
};

connectWithRetry();

module.exports = prisma;
