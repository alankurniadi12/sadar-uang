<template>
  <div class="min-h-screen">
    <header class="border-b border-emerald-900/10 bg-white">
      <div class="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <RouterLink class="inline-flex items-center gap-2" to="/dashboard">
          <img class="h-11 w-auto shrink-0" src="/brand/sadar-uang-icon.png" alt="" />
          <img class="h-7 w-auto" src="/brand/sadar-uang-text.png" alt="Sadar Uang" />
        </RouterLink>
        <nav class="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted sm:w-auto sm:justify-end">
          <RouterLink class="hover:text-brand" to="/dashboard">Dashboard</RouterLink>
          <RouterLink class="hover:text-brand" to="/transactions">Transaksi</RouterLink>
          <RouterLink class="hover:text-brand" to="/reports">Laporan</RouterLink>
          <RouterLink v-if="authStore.isAdmin" class="hover:text-brand" to="/admin">Admin</RouterLink>
          <RouterLink class="hover:text-brand" to="/settings">Pengaturan</RouterLink>
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
import { useToastStore } from "@/stores/toastStore";

const authStore = useAuthStore();
const toastStore = useToastStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  toastStore.success("Kamu sudah keluar dari akun.");
  router.push({ name: "login" });
};
</script>
