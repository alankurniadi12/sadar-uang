import bcrypt from "bcryptjs";

import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});

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
  });

  return {
    user: toPublicUser(user),
    token: generateToken(user.id),
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const error = new Error("Email atau password belum sesuai.");
    error.statusCode = 401;
    throw error;
  }

  if (user.status !== "active") {
    const error = new Error("Akun kamu sedang dinonaktifkan.");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("Email atau password belum sesuai.");
    error.statusCode = 401;
    throw error;
  }

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
