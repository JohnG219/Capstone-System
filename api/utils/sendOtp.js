import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

const sendOtp = async (recipientEmail, otp) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: PASSWORD
      }
    });

    let mailGenerator = new Mailgen({
      theme: "cerberus",
      product: {
        logo: "https://i.ibb.co/vYXnyF9/logo.png",
        name: "UTILITY STALLS IN ZONE 3 CAINTA GREENPARK VILLAGE",
        link: 'https://zone-3-stalls-tenant.netlify.app/'
      }
    });

    let response = {
      body: {
        name: "Good day",
        intro: "Stall tenant",
        table: {
          data: [
            {
              "otp number": `<span style="font-size: 24px;">${otp}</span>`,
            }
          ]
        },
        outro: "To help keep your account safe, Utility Stalls Zone-3 System wants to make sure It's really you trying to login.",
      }
    };

    let mail = mailGenerator.generate(response);

    let message = {
      from: EMAIL,
      to: recipientEmail,
      subject: "OTP Verification",
      html: mail
    };

    await transporter.sendMail(message);
    console.log("OTP sent successfully.");
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

export { sendOtp };