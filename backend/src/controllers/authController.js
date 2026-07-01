import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import {
  getCurrentUser,
  loginWithGoogle,
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "../services/authService.js";

export const register = asyncHandler(async (req, res) => {
  const data = await registerUser(req.body);

  return sendSuccess(res, "Akun berhasil dibuat.", data, 201);
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);

  return sendSuccess(res, "Login berhasil.", data);
});

export const googleLogin = asyncHandler(async (req, res) => {
  const data = await loginWithGoogle(req.body);

  return sendSuccess(res, "Login Google berhasil.", data);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const data = await requestPasswordReset(req.body);
  const responseData = data.resetUrl ? { resetUrl: data.resetUrl } : null;

  return sendSuccess(res, data.message, responseData);
});

export const updatePasswordByReset = asyncHandler(async (req, res) => {
  const data = await resetPassword(req.body);

  return sendSuccess(res, "Password berhasil direset.", data);
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);

  return sendSuccess(res, "Data user berhasil diambil.", { user });
});
