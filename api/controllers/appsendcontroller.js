const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const crypto = require('crypto');
require('dotenv').config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

const sendOTP = async (req, res) => {
    const { GEmail } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });

    const otpNumber = Math.floor(100000 + Math.random() * 900000);

    const mailGenerator = new Mailgen({
        theme: "cerberus",
        product: {
            logo: "https://i.ibb.co/vYXnyF9/logo.png",
            name: "UTILITY STALLS IN ZONE 3 CAINTA GREENPARK VILLAGE",
            link: 'https://zone-3-stalls-tenant.netlify.app/'
        }
    });

    const response = {
        body: {
            name: "Good day",
            intro: "Stall tenant",
            table: {
                data: [
                    {
                        otpnumber: otpNumber,
                    }
                ]
            },
            outro: "To help keep your account safe, Utility Stalls Zone-3 System wants to make sure It's really you trying to login.",
        }
    };

    const mail = mailGenerator.generate(response);

    const message = {
        from: EMAIL,
        to: GEmail,
        subject: "OTP Verification",
        html: mail
    };

    try {
        await transporter.sendMail(message);
        res.status(201).json({
            msg: "OTP has been successfully sent. Check your email now."
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

module.exports = {
    sendOTP,
};