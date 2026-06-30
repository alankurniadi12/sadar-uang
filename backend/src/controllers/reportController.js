import {
  getMonthlyReport,
  getMonthlyReportPdf,
} from "../services/reportService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

export const monthlyReport = asyncHandler(async (req, res) => {
  const report = await getMonthlyReport(req.user, req.query);

  return sendSuccess(res, "Preview laporan bulanan berhasil diambil.", report);
});

export const monthlyReportPdf = asyncHandler(async (req, res) => {
  const { filename, buffer } = await getMonthlyReportPdf(req.user, req.query);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  return res.send(buffer);
});
