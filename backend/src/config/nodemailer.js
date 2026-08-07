const nodemailer = require("nodemailer");
const env = require("./env");

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

module.exports = transporter;
