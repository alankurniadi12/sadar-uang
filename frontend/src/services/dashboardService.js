import api from "./api";

export const dashboardService = {
  summary(params) {
    return api.get("/dashboard/summary", { params });
  },
  daily(params) {
    return api.get("/dashboard/daily", { params });
  },
  monthly(params) {
    return api.get("/dashboard/monthly", { params });
  },
  categories(params) {
    return api.get("/dashboard/categories", { params });
  },
  recent() {
    return api.get("/dashboard/recent");
  },
};
