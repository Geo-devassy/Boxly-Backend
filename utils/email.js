const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Boxly Warehouse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Boxly OTP Verification",
      html: `
        <h2>Welcome to Boxly</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      `,
    });

    console.log("EMAIL SENT:", info.response);
  } catch (err) {
    console.error("EMAIL ERROR:", err);
  }
};

module.exports = sendOTPEmail;