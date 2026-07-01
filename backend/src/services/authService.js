import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

import User from "../models/User.js";
import { env } from "../config/env.js";
import { sendPasswordResetEmail } from "./emailService.js";
import { generateToken } from "../utils/generateToken.js";

const RESET_PASSWORD_EXPIRES_IN_MINUTES = 30;
const RESET_PASSWORD_SUCCESS_MESSAGE =
  "Jika email terdaftar, link reset password akan dikirim.";
const googleClient = new OAuth2Client(env.googleClientId);

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  authProviders: user.authProviders || ["password"],
});

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const ensureGoogleConfigured = () => {
  if (!env.googleClientId) {
    const error = new Error("Google login belum dikonfigurasi.");
    error.statusCode = 503;
    throw error;
  }
};

const verifyGoogleCredential = async (credential) => {
  ensureGoogleConfigured();

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId,
  });
  const payload = ticket.getPayload();

  if (!payload?.email || !payload?.sub || !payload.email_verified) {
    const error = new Error("Akun Google belum bisa diverifikasi.");
    error.statusCode = 401;
    throw error;
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name || payload.email.split("@")[0],
    emailVerifiedAt: new Date(),
  };
};

const ensureActiveUser = (user) => {
  if (user.status !== "active") {
    const error = new Error("Akun kamu sedang dinonaktifkan.");
    error.statusCode = 403;
    throw error;
  }
};

const addAuthProvider = (user, provider) => {
  const providers = new Set(user.authProviders || []);
  providers.add(provider);
  user.authProviders = [...providers];
};

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error("Email sudah digunakan.");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: normalizedEmail,
    passwordHash,
    authProviders: ["password"],
  });

  return {
    user: toPublicUser(user),
    token: generateToken(user.id),
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

  if (!user) {
    const error = new Error("Email atau password belum sesuai.");
    error.statusCode = 401;
    throw error;
  }

  ensureActiveUser(user);

  if (!user.passwordHash) {
    const error = new Error("Akun ini terdaftar lewat Google. Masuk dengan Google.");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("Email atau password belum sesuai.");
    error.statusCode = 401;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: toPublicUser(user),
    token: generateToken(user.id),
  };
};

export const loginWithGoogle = async ({ credential }) => {
  const googleProfile = await verifyGoogleCredential(credential);
  let user = await User.findOne({ googleId: googleProfile.googleId }).select("+googleId");

  if (!user) {
    user = await User.findOne({ email: googleProfile.email }).select("+googleId");
  }

  if (user) {
    ensureActiveUser(user);

    if (user.googleId && user.googleId !== googleProfile.googleId) {
      const error = new Error("Email ini sudah terhubung dengan akun Google lain.");
      error.statusCode = 409;
      throw error;
    }

    user.googleId = googleProfile.googleId;
    user.emailVerifiedAt = user.emailVerifiedAt || googleProfile.emailVerifiedAt;
    addAuthProvider(user, "google");
    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: toPublicUser(user),
      token: generateToken(user.id),
    };
  }

  user = await User.create({
    name: googleProfile.name,
    email: googleProfile.email,
    googleId: googleProfile.googleId,
    authProviders: ["google"],
    emailVerifiedAt: googleProfile.emailVerifiedAt,
    lastLoginAt: new Date(),
  });

  return {
    user: toPublicUser(user),
    token: generateToken(user.id),
  };
};

export const requestPasswordReset = async ({ email }) => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+passwordResetTokenHash +passwordResetExpiresAt",
  );

  if (!user || user.status !== "active") {
    return {
      message: RESET_PASSWORD_SUCCESS_MESSAGE,
    };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetTokenHash = hashToken(rawToken);
  user.passwordResetExpiresAt = new Date(
    Date.now() + RESET_PASSWORD_EXPIRES_IN_MINUTES * 60 * 1000,
  );
  await user.save();

  const resetUrl = `${env.clientUrl}/reset-password?token=${rawToken}`;
  const delivery = await sendPasswordResetEmail({
    email: user.email,
    name: user.name,
    resetUrl,
  });

  return {
    message: RESET_PASSWORD_SUCCESS_MESSAGE,
    resetUrl: delivery.resetUrl,
  };
};

export const resetPassword = async ({ token, password }) => {
  const tokenHash = hashToken(token);
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpiresAt: { $gt: new Date() },
  }).select("+passwordResetTokenHash +passwordResetExpiresAt");

  if (!user) {
    const error = new Error("Link reset password tidak valid atau sudah kedaluwarsa.");
    error.statusCode = 400;
    throw error;
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  user.passwordResetTokenHash = null;
  user.passwordResetExpiresAt = null;
  await user.save();

  return {
    user: toPublicUser(user),
    token: generateToken(user.id),
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-passwordHash");

  if (!user) {
    const error = new Error("User tidak ditemukan.");
    error.statusCode = 404;
    throw error;
  }

  return toPublicUser(user);
};
