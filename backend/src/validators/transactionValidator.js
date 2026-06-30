import {
  CATEGORY_BY_TYPE,
  TRANSACTION_TYPES,
} from "../constants/transactionConstants.js";

const sendValidationError = (res, message) => {
  return res.status(400).json({
    success: false,
    message,
  });
};

const isValidMonth = (month) => {
  const value = Number(month);
  return Number.isInteger(value) && value >= 1 && value <= 12;
};

const isValidYear = (year) => {
  const value = Number(year);
  return Number.isInteger(value) && value >= 2000 && value <= 2100;
};

const isValidDate = (date) => !Number.isNaN(new Date(date).getTime());

export const validateTransaction = (req, res, next) => {
  const { date, type, description, category, amount } = req.body;
  const parsedAmount = Number(amount);

  if (!date || !isValidDate(date)) {
    return sendValidationError(res, "Tanggal wajib diisi dengan format valid.");
  }

  if (!TRANSACTION_TYPES.includes(type)) {
    return sendValidationError(res, "Tipe transaksi tidak valid.");
  }

  if (!description || description.trim().length < 2) {
    return sendValidationError(res, "Keterangan minimal 2 karakter.");
  }

  if (!CATEGORY_BY_TYPE[type].includes(category)) {
    return sendValidationError(res, "Kategori tidak sesuai dengan tipe transaksi.");
  }

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return sendValidationError(res, "Jumlah harus lebih dari 0.");
  }

  req.body.date = new Date(date);
  req.body.description = description.trim();
  req.body.amount = parsedAmount;

  next();
};

export const validateTransactionQuery = (req, res, next) => {
  const { type, category, month, year, page, limit, search } = req.query;

  if (type && !TRANSACTION_TYPES.includes(type)) {
    return sendValidationError(res, "Filter tipe transaksi tidak valid.");
  }

  if (category && type && !CATEGORY_BY_TYPE[type].includes(category)) {
    return sendValidationError(res, "Filter kategori tidak sesuai tipe transaksi.");
  }

  if ((month && !year) || (!month && year)) {
    return sendValidationError(res, "Filter bulan dan tahun harus digunakan bersama.");
  }

  if (month && !isValidMonth(month)) {
    return sendValidationError(res, "Filter bulan harus bernilai 1 sampai 12.");
  }

  if (year && !isValidYear(year)) {
    return sendValidationError(res, "Filter tahun tidak valid.");
  }

  if (page && Number(page) < 1) {
    return sendValidationError(res, "Page minimal 1.");
  }

  if (limit && (Number(limit) < 1 || Number(limit) > 100)) {
    return sendValidationError(res, "Limit harus bernilai 1 sampai 100.");
  }

  if (search && search.trim().length < 2) {
    return sendValidationError(res, "Search minimal 2 karakter.");
  }

  req.query.search = search?.trim();

  next();
};
