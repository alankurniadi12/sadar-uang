import { Router } from "express";

import {
  forgotPassword,
  googleLogin,
  login,
  me,
  register,
  updatePasswordByReset,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  validateForgotPassword,
  validateGoogleLogin,
  validateLogin,
  validateRegister,
  validateResetPassword,
} from "../validators/authValidator.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/google", validateGoogleLogin, googleLogin);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", validateResetPassword, updatePasswordByReset);
router.get("/me", authMiddleware, me);

export default router;
