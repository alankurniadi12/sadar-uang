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
    async fetchTransaction(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await transactionService.detail(id);
        this.selectedTransaction = response.data.data.transaction;
        return this.selectedTransaction;
      } catch (error) {
        this.error = error.response?.data?.message || "Detail transaksi gagal dimuat.";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async createTransaction(payload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await transactionService.create(payload);
        return response.data.data.transaction;
      } catch (error) {
        this.error = error.response?.data?.message || "Transaksi gagal disimpan.";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateTransaction(id, payload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await transactionService.update(id, payload);
        this.selectedTransaction = response.data.data.transaction;
        return this.selectedTransaction;
      } catch (error) {
        this.error = error.response?.data?.message || "Transaksi gagal diperbarui.";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteTransaction(id) {
      this.loading = true;
      this.error = null;
      try {
        await transactionService.remove(id);
        this.transactions = this.transactions.filter((transaction) => transaction.id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || "Transaksi gagal dihapus.";
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
    clearSelectedTransaction() {
      this.selectedTransaction = null;
    },
  },
});
