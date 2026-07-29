import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Learnix LMS'} <${process.env.FROM_EMAIL || 'noreply@learnix.com'}>`,
    to,
    subject,
    text: text || html.replace(/<[^>]*>?/gm, ''),
    html,
  };

  const info = await transporter.sendMail(message);
  console.log(`[Email Sent]: Message ID ${info.messageId} to ${to}`);
  return info;
};

export default sendEmail;
