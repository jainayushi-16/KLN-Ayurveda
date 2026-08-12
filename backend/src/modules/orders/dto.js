class OrderDTO {
  static toResponse(order) {
    const createdAtDate = new Date(order.createdAt || Date.now());
    const orderDateStr = createdAtDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const status = order.status || "PENDING";
    const carrier = "BlueDart Express";
    const trackingNumber = `TRK-${(order.orderNumber || "KLN-000000").replace(/[^0-9]/g, "") || "90812344"}`;

    const estDeliveryDate = new Date(createdAtDate.getTime() + 4 * 24 * 60 * 60 * 1000);
    const estimatedDelivery = estDeliveryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const isProcessing = ["PROCESSING", "SHIPPED", "DELIVERED"].includes(status);
    const isShipped = ["SHIPPED", "DELIVERED"].includes(status);
    const isDelivered = status === "DELIVERED";

    const trackingSteps = [
      {
        label: "Order Placed & Confirmed",
        date: `${orderDateStr}, ${createdAtDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
        completed: true,
      },
      {
        label: "Herbal Formulation & Quality Check",
        date: isProcessing ? "Batch Verified" : "In Progress",
        completed: isProcessing,
      },
      {
        label: `Handed over to ${carrier}`,
        date: isShipped ? "Dispatched" : "Pending Dispatch",
        completed: isShipped,
      },
      {
        label: "Out for Delivery",
        date: isDelivered ? "Delivered" : isShipped ? "In Transit to Destination" : "Pending",
        completed: isDelivered,
      },
      {
        label: "Delivered to Customer",
        date: isDelivered ? estimatedDelivery : "Expected " + estimatedDelivery,
        completed: isDelivered,
      },
    ];

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      invoiceNo: `INV-${(order.orderNumber || "").replace("KLN-", "")}`,
      status,
      deliveryStatus: status === "DELIVERED" ? "Delivered" : status === "SHIPPED" ? "In Transit" : "Processing",
      paymentStatus: order.paymentStatus || "PAID",
      paymentMethod: order.paymentMethod || "CREDIT_CARD",
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      tax: order.tax,
      discount: order.discount,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      carrier,
      trackingNumber,
      estimatedDelivery,
      trackingSteps,
      items: (order.items || []).map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product ? item.product.name : "Ayurvedic Formulation",
        category: item.product?.category?.name || "Herbal Care",
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        image: item.product && item.product.images && item.product.images[0] ? item.product.images[0].url : "/images/products/hairoil/oilf.jpeg",
      })),
      orderDate: orderDateStr,
      createdAt: order.createdAt,
    };
  }
}

module.exports = OrderDTO;
