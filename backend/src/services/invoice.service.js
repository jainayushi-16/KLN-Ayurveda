/**
 * Invoice Service for KLN Ayurveda
 * Generates formatted HTML / PDF Invoice Documents for Orders
 */

class InvoiceService {
  generateInvoiceHtml(order, user) {
    const invoiceNo = order.invoiceNo || `INV-${(order.orderNumber || order.id || "").replace(/^KLN-/, "")}`;
    const orderDate = order.orderDate || new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
    const items = order.items || [];
    const customerName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.fullName || "Valued Customer" : "Valued Customer";
    const customerEmail = user?.email || "";
    const customerPhone = user?.phone || "";

    const shippingAddr = order.shippingAddress || {};
    const formattedShipping = `${shippingAddr.street || ""}, ${shippingAddr.city || ""}, ${shippingAddr.state || ""} ${shippingAddr.postalCode || shippingAddr.pincode || ""}, ${shippingAddr.country || "India"}`;

    const itemsRows = items.map((item, idx) => `
      <tr style="border-bottom: 1px solid #eeeeee;">
        <td style="padding: 12px; font-size: 13px; color: #222123;">${idx + 1}</td>
        <td style="padding: 12px; font-size: 13px; font-weight: bold; color: #222123;">${item.name || item.product?.name || "Ayurvedic Formulation"}</td>
        <td style="padding: 12px; font-size: 13px; color: #555; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 12px; font-size: 13px; color: #555; text-align: right;">₹${Number(item.price || item.product?.price || 0).toFixed(2)}</td>
        <td style="padding: 12px; font-size: 13px; font-weight: bold; color: #2F5D34; text-align: right;">₹${(Number(item.price || item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
      </tr>
    `).join("");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice - ${invoiceNo}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 20px; color: #222123; background-color: #fff; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2F5D34; padding-bottom: 20px; margin-bottom: 25px; }
          .logo { font-size: 24px; font-weight: 900; color: #2F5D34; text-transform: uppercase; letter-spacing: 1px; }
          .tagline { font-size: 11px; color: #5B7C3A; font-weight: bold; text-transform: uppercase; }
          .invoice-details { text-align: right; }
          .invoice-title { font-size: 20px; font-weight: bold; color: #2F5D34; margin: 0; }
          .meta-info { display: flex; justify-content: space-between; margin-bottom: 30px; background-color: #F7F4EC; padding: 15px 20px; rounded: 12px; }
          .meta-col { width: 48%; font-size: 12px; line-height: 1.6; }
          .meta-col h4 { margin: 0 0 6px 0; color: #2F5D34; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          th { background-color: #2F5D34; color: #ffffff; padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          th.text-right { text-align: right; }
          th.text-center { text-align: center; }
          .totals-table { width: 320px; margin-left: auto; margin-bottom: 30px; }
          .totals-table td { padding: 6px 12px; font-size: 13px; }
          .totals-table tr.grand-total { border-top: 2px solid #2F5D34; font-weight: bold; font-size: 16px; color: #2F5D34; }
          .footer-note { text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #718096; }
          @media print {
            body { padding: 0; }
            .invoice-box { border: none; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="logo">🌿 KLN AYURVEDA</div>
              <div class="tagline">100% Authentic Kshirapaka Formulations</div>
            </div>
            <div class="invoice-details">
              <h2 class="invoice-title">TAX INVOICE</h2>
              <p style="margin: 4px 0; font-size: 12px; font-weight: bold; color: #4a5568;">${invoiceNo}</p>
              <p style="margin: 0; font-size: 12px; color: #718096;">Date: ${orderDate}</p>
            </div>
          </div>

          <div class="meta-info">
            <div class="meta-col">
              <h4>Billed & Shipped To</h4>
              <strong>${customerName}</strong><br />
              ${formattedShipping}<br />
              Phone: ${customerPhone || "N/A"}<br />
              Email: ${customerEmail || "N/A"}
            </div>
            <div class="meta-col" style="text-align: right;">
              <h4>Order Metadata</h4>
              <strong>Order Number: #${order.orderNumber || order.id}</strong><br />
              Payment Status: <span style="color: #2e7d32; font-weight: bold;">${(order.paymentStatus || "PAID").toUpperCase()}</span><br />
              Payment Method: ${order.paymentMethod || "ONLINE"}<br />
              Carrier: ${order.carrier || "Express Courier"}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>Product Description</th>
                <th class="text-center" style="width: 60px;">Qty</th>
                <th class="text-right" style="width: 100px;">Rate</th>
                <th class="text-right" style="width: 110px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td>Subtotal:</td>
              <td style="text-align: right; font-weight: bold;">₹${Number(order.subtotal || order.totalAmount || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td>GST Tax (5% Included):</td>
              <td style="text-align: right;">₹${Number(order.tax || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Shipping Fee:</td>
              <td style="text-align: right; color: #2E7D32;">${order.shippingFee === 0 || !order.shippingFee ? "FREE" : "₹" + Number(order.shippingFee).toFixed(2)}</td>
            </tr>
            ${order.discount ? `
            <tr style="color: #2e7d32;">
              <td>Discount:</td>
              <td style="text-align: right; font-weight: bold;">-₹${Number(order.discount).toFixed(2)}</td>
            </tr>
            ` : ""}
            <tr class="grand-total">
              <td>Grand Total:</td>
              <td style="text-align: right;">₹${Number(order.totalAmount || 0).toFixed(2)}</td>
            </tr>
          </table>

          <div class="footer-note">
            <p>Thank you for choosing KLN Ayurveda! This is a computer-generated invoice requiring no physical signature.</p>
            <p style="margin-top: 4px;">KLN Ayurveda Pvt. Ltd. • 160/2, Niranjan Ward, Kareli, MP 487221 • Support: 7725820320</p>
          </div>
        </div>

        <script>
          // Auto-print prompt when opened in print view window
          if (window.location.search.includes('print=true')) {
            window.onload = function() { window.print(); };
          }
        </script>
      </body>
      </html>
    `;
  }
}

module.exports = new InvoiceService();
