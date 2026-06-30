import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
} from "../services/transactionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

export const listTransactions = asyncHandler(async (req, res) => {
  const data = await getTransactions(req.user.id, req.query);

  return sendSuccess(res, "Data transaksi berhasil diambil.", data);
});

export const storeTransaction = asyncHandler(async (req, res) => {
  const transaction = await createTransaction(req.user.id, req.body);

  return sendSuccess(
    res,
    "Transaksi berhasil dicatat.",
    { transaction },
    201,
  );
});

export const showTransaction = asyncHandler(async (req, res) => {
  const transaction = await getTransactionById(req.user.id, req.params.id);

  return sendSuccess(res, "Detail transaksi berhasil diambil.", {
    transaction,
  });
});

export const editTransaction = asyncHandler(async (req, res) => {
  const transaction = await updateTransaction(req.user.id, req.params.id, req.body);

  return sendSuccess(res, "Transaksi berhasil diperbarui.", { transaction });
});

export const removeTransaction = asyncHandler(async (req, res) => {
  await deleteTransaction(req.user.id, req.params.id);

  return sendSuccess(res, "Transaksi berhasil dihapus.");
});
