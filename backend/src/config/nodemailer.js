const mailService = require("../services/mail.service");

module.exports = {
  sendMail: (options) => mailService.sendEmail(options),
  getTransporter: () => mailService.getTransporter(),
  getSmtpConfig: async () => mailService.getSmtpConfig(),
  reloadTransporter: async () => mailService.getTransporter(),
  verifyTransporter: async () => {
    const res = await mailService.verifySmtpConnection();
    return res.success;
  },
  verifyAndSendTestEmail: async (payload) => {
    const to = typeof payload === "string" ? payload : payload.to;
    return mailService.sendEmail({
      to,
      subject: "KLN Ayurveda - SMTP Test Email",
      text: "Test email from KLN Ayurveda SMTP service.",
      html: "<p>Test email from KLN Ayurveda SMTP service.</p>",
    });
  },
};
