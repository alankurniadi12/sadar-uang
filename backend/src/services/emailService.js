import nodemailer from "nodemailer";

import { env } from "../config/env.js";

const hasSmtpConfig = () => Boolean(env.smtpHost && env.smtpUser && env.smtpPass);

const createTransporter = () => {
  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
};

export const sendPasswordResetEmail = async ({ email, name, resetUrl }) => {
  if (!hasSmtpConfig()) {
    console.info(`[Sadar Uang] Password reset untuk ${email} (${name}): ${resetUrl}`);

    return {
      delivered: false,
      resetUrl: env.nodeEnv === "development" ? resetUrl : undefined,
    };
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: env.mailFrom,
    to: email,
    subject: "Reset password Sadar Uang",
    text: [
      `Halo ${name},`,
      "",
      "Kami menerima permintaan reset password untuk akun Sadar Uang kamu.",
      `Buka link berikut untuk membuat password baru: ${resetUrl}`,
      "",
      "Link ini berlaku 30 menit. Abaikan email ini kalau kamu tidak meminta reset password.",
    ].join("\n"),
  });

  return {
    delivered: true,
  };
};
