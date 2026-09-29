const prisma = require("../config/prisma");

async function main() {
  try {
    console.log("Testing Prisma Settings table...");
    const s = await prisma.settings.findMany();
    console.log("Existing Settings:", s);

    const testUpsert = await prisma.settings.upsert({
      where: { key: "siteName" },
      update: { value: "KLN Ayurveda", description: "Store Title" },
      create: { key: "siteName", value: "KLN Ayurveda", description: "Store Title" },
    });
    console.log("Upsert result:", testUpsert);
  } catch (err) {
    console.error("Prisma Settings test error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
