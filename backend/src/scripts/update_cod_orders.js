const prisma = require("../config/prisma");

async function updateCodOrders() {
  try {
    console.log("Checking COD orders in database...");
    
    // Find all orders where paymentMethod is COD or CASH or CASH_ON_DELIVERY
    const codOrders = await prisma.order.findMany({
      where: {
        OR: [
          { paymentMethod: "COD" },
          { paymentMethod: "CASH_ON_DELIVERY" },
          { paymentMethod: { contains: "COD", mode: "insensitive" } },
          { paymentMethod: { contains: "CASH", mode: "insensitive" } },
        ],
      },
    });

    console.log(`Found ${codOrders.length} total COD orders.`);

    let updatedCount = 0;
    for (const order of codOrders) {
      // If status is not DELIVERED and paymentStatus is not PENDING, set to PENDING
      if (order.status !== "DELIVERED" && order.paymentStatus !== "PENDING") {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "PENDING" },
        });
        console.log(`Updated Order #${order.orderNumber} (${order.id}): status=${order.status}, paymentStatus set to PENDING`);
        updatedCount++;
      }
    }

    console.log(`Finished updating ${updatedCount} COD orders to PENDING.`);
  } catch (err) {
    console.error("Error updating COD orders:", err);
  } finally {
    await prisma.$disconnect();
  }
}

updateCodOrders();
