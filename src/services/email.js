import nodemailer from 'nodemailer';

function createTransporter() {
  console.log('Nodemailer config (from env):', {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM: process.env.SMTP_FROM,
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter;
}

const transporter = createTransporter();

export async function sendResetEmail(email, resetUrl) {
  console.log('sendResetEmail: відправляємо листа на', email);
  console.log('resetUrl =', resetUrl);

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
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
