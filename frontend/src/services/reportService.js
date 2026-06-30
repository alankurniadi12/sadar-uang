import api from "./api";

export const reportService = {
  monthly(params) {
    return api.get("/reports/monthly", { params });
  },
  monthlyPdf(params) {
    return api.get("/reports/monthly/pdf", {
      params,
      responseType: "blob",
    });
  },
};
