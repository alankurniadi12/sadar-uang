const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const sendValidationError = (res, message) => {
  return res.status(400).json({
    success: false,
    message,
  });
};

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2) {
    return sendValidationError(res, "Nama minimal 2 karakter.");
  }

  if (!email || !isEmail(email)) {
    return sendValidationError(res, "Email tidak valid.");
  }

  if (!password || password.length < 6) {
    return sendValidationError(res, "Password minimal 6 karakter.");
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !isEmail(email)) {
    return sendValidationError(res, "Email tidak valid.");
  }

  if (!password) {
    return sendValidationError(res, "Password wajib diisi.");
  }

  req.body.email = email.trim().toLowerCase();

  next();
};

export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email || !isEmail(email)) {
    return sendValidationError(res, "Email tidak valid.");
  }

  req.body.email = email.trim().toLowerCase();

  next();
};

export const validateResetPassword = (req, res, next) => {
  const { token, password } = req.body;

  if (!token || typeof token !== "string" || token.trim().length < 32) {
    return sendValidationError(res, "Token reset password tidak valid.");
  }

  if (!password || password.length < 6) {
    return sendValidationError(res, "Password minimal 6 karakter.");
  }

  req.body.token = token.trim();

  next();
};
