const prisma = require('./src/config/prisma');

async function cleanDbSmtp() {
  console.log("=== CLEANING DB SMTP OVERRIDES ===");
  try {
    // Delete stale smtpPass row from Settings table so it defaults to process.env.SMTP_PASS or fresh setting
    const deleted = await prisma.settings.deleteMany({
      where: {
        key: {
          in: ["smtpPass", "smtpUser", "smtpHost", "smtpPort"]
        }
      }
    });
    console.log(`✅ Deleted ${deleted.count} stale SMTP database override rows.`);
    console.log("Now getSmtpConfig() will cleanly use process.env.SMTP_USER and process.env.SMTP_PASS from Render/environment variables!");
  } catch (err) {
    console.error("DB cleanup error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDbSmtp();
