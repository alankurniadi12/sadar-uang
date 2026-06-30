import { Router } from "express";

import {
  categories,
  daily,
  monthly,
  recent,
  summary,
} from "../controllers/dashboardController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  validateDashboardMonthQuery,
  validateDashboardYearQuery,
} from "../validators/dashboardValidator.js";

const router = Router();

router.use(authMiddleware);

router.get("/summary", validateDashboardMonthQuery, summary);
router.get("/daily", validateDashboardMonthQuery, daily);
router.get("/monthly", validateDashboardYearQuery, monthly);
router.get("/categories", validateDashboardMonthQuery, categories);
router.get("/recent", recent);

export default router;
