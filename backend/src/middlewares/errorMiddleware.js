export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Terjadi kesalahan pada server.";

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
