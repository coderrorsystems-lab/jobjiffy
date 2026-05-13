import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

const otpStore = new Map();

const OTP_EXPIRY = 15 * 60 * 1000;

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOTP = (email, otp) => {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY
  });
};

export const verifyOTP = (email, otp) => {
  const record = otpStore.get(email);
  if (!record) {
    return { valid: false, error: 'OTP not found or expired' };
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return { valid: false, error: 'OTP expired' };
  }
  if (record.otp !== otp) {
    return { valid: false, error: 'Invalid OTP' };
  }
  otpStore.delete(email);
  return { valid: true };
};

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: Number(config.smtp.port),
      secure: Number(config.smtp.port) === 465, // true for 465, false for other ports
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
      }
    });

    const mailOptions = {
      from: `"Jobjiffy" <${config.smtp.user}>`,
      to: email,
      subject: 'Your Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Your OTP for email verification is:</p>
          <h1 style="background: #f5f5f5; padding: 15px; text-align: center; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[OTP] Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('[OTP] Failed to send email:', error);
    throw error;
  }
};