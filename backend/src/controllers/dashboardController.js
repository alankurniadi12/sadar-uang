import {
  getCategoryData,
  getDailyData,
  getDashboardSummary,
  getMonthlyData,
  getRecentTransactions,
} from "../services/dashboardService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

export const summary = asyncHandler(async (req, res) => {
  const data = await getDashboardSummary(req.user.id, req.query);

  return sendSuccess(res, "Ringkasan dashboard berhasil diambil.", data);
});

export const daily = asyncHandler(async (req, res) => {
  const data = await getDailyData(req.user.id, req.query);

  return sendSuccess(res, "Data harian berhasil diambil.", data);
});

export const monthly = asyncHandler(async (req, res) => {
  const data = await getMonthlyData(req.user.id, req.query);

  return sendSuccess(res, "Data bulanan berhasil diambil.", data);
});

export const categories = asyncHandler(async (req, res) => {
  const data = await getCategoryData(req.user.id, req.query);

  return sendSuccess(res, "Data kategori berhasil diambil.", data);
});

export const recent = asyncHandler(async (req, res) => {
  const data = await getRecentTransactions(req.user.id);

  return sendSuccess(res, "Transaksi terbaru berhasil diambil.", data);
});
