import nodemailer from 'nodemailer';
import { getEnvVar } from '../utils/getEnvVar.js';

function createTransporter() {
  const host = getEnvVar('SMTP_HOST');
  const port = Number(getEnvVar('SMTP_PORT'));
  const user = getEnvVar('SMTP_USER');
  const pass = getEnvVar('SMTP_PASSWORD');
  const from = getEnvVar('SMTP_FROM');

  console.log('Nodemailer config (from getEnvVar):', {
    SMTP_HOST: host,
    SMTP_PORT: port,
    SMTP_USER: user,
    SMTP_PASSWORD: pass,
    SMTP_FROM: from,
  });

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: {
      user,
      pass,
    },
  });
}

const transporter = createTransporter();

export async function sendResetEmail(email, resetUrl) {
  const from = getEnvVar('SMTP_FROM');

  console.log('sendResetEmail: відправляємо листа на', email);
  console.log('resetUrl =', resetUrl);

  try {
    const info = await transporter.sendMail({
      from,
      to: email,
      subject: 'Reset your password',
      html: `
        <p>Hello,</p>
        <p>You requested a password reset. Click the link below to reset:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please ignore.</p>
      `,
    });

    console.log('Email sent! info.messageId =', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
