import { defineStore } from "pinia";

import { transactionService } from "@/services/transactionService";

export const useTransactionStore = defineStore("transactions", {
  state: () => ({
    transactions: [],
    selectedTransaction: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
    loading: false,
    error: null,
    filters: {},
  }),
  actions: {
    async fetchTransactions(params = this.filters) {
      this.loading = true;
      this.error = null;
      try {
        const response = await transactionService.list(params);
        this.transactions = response.data.data.items;
        this.pagination = response.data.data.pagination;
      } catch (error) {
        this.error = error.response?.data?.message || "Data transaksi gagal dimuat.";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },
    resetFilters() {
      this.filters = {};
    },
  },
});
