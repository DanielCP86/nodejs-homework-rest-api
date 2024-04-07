const nodemailer = require("nodemailer");
require("dotenv").config();
const OUTLOOK_EMAIL = process.env.OUTLOOK_EMAIL;
const OUTLOOK_PASSWORD = process.env.OUTLOOK_PASSWORD;

const nodemailerConfig = {
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: OUTLOOK_EMAIL,
    pass: OUTLOOK_PASSWORD,
  },
};
const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: process.env.OUTLOOK_EMAIL };

  await transport
    .sendMail(email)
    .then((info) => console.log(info))
    .catch((err) => console.log(err));

  return true;
};

module.exports = { sendEmail };
