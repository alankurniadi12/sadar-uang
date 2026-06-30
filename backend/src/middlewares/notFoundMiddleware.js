export const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} tidak ditemukan.`);
  error.statusCode = 404;
  next(error);
};
