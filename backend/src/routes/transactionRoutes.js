import { Router } from "express";

import {
  editTransaction,
  listTransactions,
  removeTransaction,
  showTransaction,
  storeTransaction,
} from "../controllers/transactionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  validateTransaction,
  validateTransactionQuery,
} from "../validators/transactionValidator.js";

const router = Router();

router.use(authMiddleware);

router.get("/", validateTransactionQuery, listTransactions);
router.post("/", validateTransaction, storeTransaction);
router.get("/:id", showTransaction);
router.put("/:id", validateTransaction, editTransaction);
router.delete("/:id", removeTransaction);

export default router;
