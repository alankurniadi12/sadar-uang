import { defineStore } from "pinia";

import { authService } from "@/services/authService";

const TOKEN_KEY = "sadar_uang_token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    loading: false,
    error: null,
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    setSession(data) {
      this.user = data.user;
      this.token = data.token;
      localStorage.setItem(TOKEN_KEY, data.token);
    },
    async register(payload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.register(payload);
        this.setSession(response.data.data);
      } catch (error) {
        this.error = error.response?.data?.message || "Akun gagal dibuat.";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async login(payload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.login(payload);
        this.setSession(response.data.data);
      } catch (error) {
        this.error = error.response?.data?.message || "Login gagal.";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      if (!this.token) return;

      try {
        const response = await authService.me();
        this.user = response.data.data.user;
      } catch (error) {
        this.logout();
        throw error;
      } finally {
        this.initialized = true;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.error = null;
      this.initialized = false;
      localStorage.removeItem(TOKEN_KEY);
    },
  },
});
