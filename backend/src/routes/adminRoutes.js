import { Router } from "express";

import {
  listUsers,
  showUser,
  summary,
  updateUserStatus,
} from "../controllers/adminController.js";
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";
import {
  validateAdminUsersQuery,
  validateUserStatus,
} from "../validators/adminValidator.js";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/summary", summary);
router.get("/users", validateAdminUsersQuery, listUsers);
router.get("/users/:id", showUser);
router.patch("/users/:id/status", validateUserStatus, updateUserStatus);

export default router;
