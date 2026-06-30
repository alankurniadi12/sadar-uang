import { Router } from "express";

import { login, me, register } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateLogin, validateRegister } from "../validators/authValidator.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", authMiddleware, me);

export default router;
