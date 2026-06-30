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

export const validateDashboardMonthQuery = (req, res, next) => {
  const now = new Date();
  const month = req.query.month || String(now.getMonth() + 1);
  const year = req.query.year || String(now.getFullYear());

  if (!isValidMonth(month)) {
    return sendValidationError(res, "Bulan harus bernilai 1 sampai 12.");
  }

  if (!isValidYear(year)) {
    return sendValidationError(res, "Tahun tidak valid.");
  }

  req.query.month = month;
  req.query.year = year;

  next();
};

export const validateDashboardYearQuery = (req, res, next) => {
  const year = req.query.year || String(new Date().getFullYear());

  if (!isValidYear(year)) {
    return sendValidationError(res, "Tahun tidak valid.");
  }

  req.query.year = year;

  next();
};
