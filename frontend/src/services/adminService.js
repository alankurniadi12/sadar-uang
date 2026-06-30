import api from "./api";

export const adminService = {
  summary() {
    return api.get("/admin/summary");
  },
  users(params = {}) {
    return api.get("/admin/users", { params });
  },
  user(id) {
    return api.get(`/admin/users/${id}`);
  },
  updateUserStatus(id, status) {
    return api.patch(`/admin/users/${id}/status`, { status });
  },
};
