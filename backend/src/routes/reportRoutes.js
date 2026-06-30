import { Router } from "express";

import {
  monthlyReport,
  monthlyReportPdf,
} from "../controllers/reportController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateDashboardMonthQuery } from "../validators/dashboardValidator.js";

const router = Router();

router.use(authMiddleware);

router.get("/monthly", validateDashboardMonthQuery, monthlyReport);
router.get("/monthly/pdf", validateDashboardMonthQuery, monthlyReportPdf);

export default router;
