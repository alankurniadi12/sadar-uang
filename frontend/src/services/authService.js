import api from "./api";

export const authService = {
  register(payload) {
    return api.post("/auth/register", payload);
  },
  login(payload) {
    return api.post("/auth/login", payload);
  },
  loginWithGoogle(payload) {
    return api.post("/auth/google", payload);
  },
  forgotPassword(payload) {
    return api.post("/auth/forgot-password", payload);
  },
  resetPassword(payload) {
    return api.post("/auth/reset-password", payload);
  },
  me() {
    return api.get("/auth/me");
  },
};
