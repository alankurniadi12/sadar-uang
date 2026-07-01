import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/authStore";
import AppLayout from "@/layouts/AppLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import AdminPage from "@/pages/AdminPage.vue";
import DashboardPage from "@/pages/DashboardPage.vue";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage.vue";
import LandingPage from "@/pages/LandingPage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import NotFoundPage from "@/pages/NotFoundPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";
import ResetPasswordPage from "@/pages/ResetPasswordPage.vue";
import ReportsPage from "@/pages/ReportsPage.vue";
import TransactionFormPage from "@/pages/TransactionFormPage.vue";
import TransactionsPage from "@/pages/TransactionsPage.vue";

const routes = [
  {
    path: "/",
    name: "landing",
    component: LandingPage,
    meta: { public: true },
  },
  {
    path: "/",
    component: AuthLayout,
    meta: { public: true },
    children: [
      {
        path: "login",
        name: "login",
        component: LoginPage,
      },
      {
        path: "register",
        name: "register",
        component: RegisterPage,
      },
      {
        path: "forgot-password",
        name: "forgot-password",
        component: ForgotPasswordPage,
      },
      {
        path: "reset-password",
        name: "reset-password",
        component: ResetPasswordPage,
      },
    ],
  },
  {
    path: "/",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: DashboardPage,
      },
      {
        path: "transactions",
        name: "transactions",
        component: TransactionsPage,
      },
      {
        path: "transactions/new",
        name: "transaction-new",
        component: TransactionFormPage,
      },
      {
        path: "transactions/:id/edit",
        name: "transaction-edit",
        component: TransactionFormPage,
      },
      {
        path: "reports",
        name: "reports",
        component: ReportsPage,
      },
      {
        path: "admin",
        name: "admin",
        component: AdminPage,
        meta: { requiresAdmin: true },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundPage,
    meta: { public: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (authStore.token && !authStore.user && !authStore.initialized) {
    try {
      await authStore.fetchMe();
    } catch (error) {
      if (to.meta.requiresAuth) {
        return { name: "login", query: { redirect: to.fullPath } };
      }
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.meta.requiresAdmin && authStore.user?.role !== "admin") {
    return { name: "dashboard" };
  }

  if (
    (to.name === "login" || to.name === "register" || to.name === "forgot-password") &&
    authStore.isAuthenticated
  ) {
    return { name: "dashboard" };
  }

  return true;
});

export default router;
