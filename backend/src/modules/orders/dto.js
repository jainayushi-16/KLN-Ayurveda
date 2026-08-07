class OrderDTO {
  static toResponse(order) {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      tax: order.tax,
      discount: order.discount,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product ? item.product.name : "Product",
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        image: item.product && item.product.images && item.product.images[0] ? item.product.images[0].url : null,
      })),
      createdAt: order.createdAt,
    };
  }
}

module.exports = OrderDTO;
