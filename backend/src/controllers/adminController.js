import {
  getAdminSummary,
  getAdminUserDetail,
  getAdminUsers,
  updateAdminUserStatus,
} from "../services/adminService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

export const summary = asyncHandler(async (req, res) => {
  const data = await getAdminSummary();

  return sendSuccess(res, "Ringkasan admin berhasil diambil.", data);
});

export const listUsers = asyncHandler(async (req, res) => {
  const data = await getAdminUsers(req.query);

  return sendSuccess(res, "Daftar user berhasil diambil.", data);
});

export const showUser = asyncHandler(async (req, res) => {
  const user = await getAdminUserDetail(req.params.id);

  return sendSuccess(res, "Detail user berhasil diambil.", { user });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await updateAdminUserStatus(req.user.id, req.params.id, req.body.status);

  return sendSuccess(res, "Status user berhasil diperbarui.", { user });
});
