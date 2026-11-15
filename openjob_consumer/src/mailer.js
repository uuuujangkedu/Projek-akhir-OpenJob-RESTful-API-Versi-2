const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'localhost',
  port: Number(process.env.MAIL_PORT) || 1025,
  auth: process.env.MAIL_USER
    ? { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD }
    : undefined,
});

const sendApplicationEmail = (application) => {
  const { applicant_name, applicant_email, job_title, company_name } = application;

  return transporter.sendMail({
    from: process.env.MAIL_FROM || 'no-reply@openjob.com',
    to: process.env.MAIL_TO || applicant_email,
    subject: `Lamaran ${job_title} di ${company_name} diterima`,
    text: `Halo ${applicant_name},\n\nLamaran kamu untuk posisi ${job_title} di ${company_name} sudah kami terima.\n\nTerima kasih.`,
  });
};

module.exports = { sendApplicationEmail };