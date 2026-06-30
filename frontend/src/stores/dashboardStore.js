import { defineStore } from "pinia";

import { dashboardService } from "@/services/dashboardService";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    summary: null,
    dailyData: [],
    monthlyData: [],
    categoryData: [],
    recentTransactions: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchDashboard(params) {
      this.loading = true;
      this.error = null;
      try {
        const [summary, daily, monthly, categories, recent] = await Promise.all([
          dashboardService.summary(params),
          dashboardService.daily(params),
          dashboardService.monthly({ year: params?.year }),
          dashboardService.categories(params),
          dashboardService.recent(),
        ]);

        this.summary = summary.data.data;
        this.dailyData = daily.data.data;
        this.monthlyData = monthly.data.data;
        this.categoryData = categories.data.data;
        this.recentTransactions = recent.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Dashboard gagal dimuat.";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
