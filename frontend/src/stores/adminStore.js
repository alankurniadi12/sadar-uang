import { defineStore } from "pinia";

import { adminService } from "@/services/adminService";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    summary: null,
    users: [],
    selectedUser: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
    filters: {
      search: "",
      status: "",
      role: "",
      sortBy: "activity",
      sortDirection: "desc",
      page: 1,
      limit: 20,
    },
    loading: false,
    error: null,
  }),
  actions: {
    async fetchSummary() {
      this.error = null;
      const response = await adminService.summary();
      this.summary = response.data.data;
    },
    async fetchUsers(params = this.filters) {
      this.loading = true;
      this.error = null;
      try {
        this.filters = { ...this.filters, ...params };
        const response = await adminService.users(this.filters);
        this.users = response.data.data.items;
        this.pagination = response.data.data.pagination;
      } catch (error) {
        this.error = error.response?.data?.message || "Daftar user gagal dimuat.";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchUser(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminService.user(id);
        this.selectedUser = response.data.data.user;
        return this.selectedUser;
      } catch (error) {
        this.error = error.response?.data?.message || "Detail user gagal dimuat.";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateUserStatus(id, status) {
      this.error = null;
      try {
        const response = await adminService.updateUserStatus(id, status);
        const updatedUser = response.data.data.user;
        this.users = this.users.map((user) => (user.id === id ? updatedUser : user));

        if (this.selectedUser?.id === id) {
          this.selectedUser = updatedUser;
        }

        return updatedUser;
      } catch (error) {
        this.error = error.response?.data?.message || "Status user gagal diperbarui.";
        throw error;
      }
    },
  },
});
