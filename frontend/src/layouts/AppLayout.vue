<template>
  <div class="min-h-screen">
    <header class="border-b border-emerald-900/10 bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <RouterLink class="text-lg font-semibold text-brand" to="/dashboard">
          Sadar Uang
        </RouterLink>
        <nav class="flex items-center gap-3 text-sm text-muted">
          <RouterLink class="hover:text-brand" to="/dashboard">Dashboard</RouterLink>
          <RouterLink class="hover:text-brand" to="/transactions">Transaksi</RouterLink>
          <RouterLink class="hover:text-brand" to="/reports">Laporan</RouterLink>
          <button class="font-medium text-ink hover:text-brand" type="button" @click="logout">
            Keluar
          </button>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push({ name: "login" });
};
</script>
