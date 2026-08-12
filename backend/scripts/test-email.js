/**
 * CLI Script to Test SMTP Email Delivery to Real Addresses
 * Usage: node scripts/test-email.js <recipient-email-address>
 * Example: node scripts/test-email.js testuser@gmail.com
 */

const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { verifyTransporter } = require("../src/config/nodemailer");
const sendEmail = require("../src/utils/sendEmail");

async function main() {
  const recipient = process.argv[2];

  console.log("==========================================");
  console.log(" 📧 KLN SMTP Email Diagnostic Tester");
  console.log("==========================================");

  console.log("Checking SMTP connection...");
  const isConnected = await verifyTransporter();

  if (!isConnected) {
    console.error("❌ Could not connect to SMTP server. Please check your .env SMTP credentials.");
    process.exit(1);
  }

  if (!recipient) {
    console.log("✅ SMTP Transporter connected successfully!");
    console.log("\n💡 To test sending an email, pass a recipient email address:");
    console.log("   node scripts/test-email.js yourname@gmail.com");
    process.exit(0);
  }

  console.log(`\nSending test email to: ${recipient}...`);
  const result = await sendEmail({
    to: recipient,
    subject: "KLN Ayurveda - Real SMTP Test Email",
    text: "Congratulations! Your SMTP email server configuration is working perfectly for sending real emails.",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #222;">
        <h2 style="color: #2e7d32;">🎉 SMTP Email Connection Successful!</h2>
        <p>This is a test email sent from <strong>KLN Ayurveda Backend Server</strong>.</p>
        <p>If you are reading this email in your inbox, your SMTP configuration is successfully sending to real email addresses!</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="font-size: 12px; color: #777;">Sent at ${new Date().toLocaleString()}</p>
      </div>
    `,
  });

  if (result) {
    console.log(`\n🎉 SUCCESS! Email delivered to ${recipient}. Message ID: ${result.messageId}`);
  } else {
    console.error(`\n❌ FAILED to deliver email to ${recipient}. Check logs for details.`);
  }

  process.exit(0);
}

main();
