// utils/nodemailer.ts

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Example using Gmail
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // sender address
      to, // recipient address
      subject: "Your OTP for Removal Request", // subject line
      text: `Your OTP for email verification is: ${otp}`, // plain text body
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
