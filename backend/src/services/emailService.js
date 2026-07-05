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

const escapeHtml = (value) => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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
  const safeName = escapeHtml(name);
  const safeResetUrl = escapeHtml(resetUrl);

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
    html: [
      `<p>Halo ${safeName},</p>`,
      "<p>Kami menerima permintaan reset password untuk akun Sadar Uang kamu.</p>",
      `<p><a href="${safeResetUrl}">Buat password baru</a></p>`,
      `<p>Jika tombol/link tidak bisa dibuka, salin URL ini:</p>`,
      `<p>${safeResetUrl}</p>`,
      "<p>Link ini berlaku 30 menit. Abaikan email ini kalau kamu tidak meminta reset password.</p>",
    ].join(""),
  });

  return {
    delivered: true,
  };
};
