import api from "./api";

export const transactionService = {
  list(params) {
    return api.get("/transactions", { params });
  },
  create(payload) {
    return api.post("/transactions", payload);
  },
  detail(id) {
    return api.get(`/transactions/${id}`);
  },
  update(id, payload) {
    return api.put(`/transactions/${id}`, payload);
  },
  remove(id) {
    return api.delete(`/transactions/${id}`);
  },
};
