<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-30 border-b border-emerald-900/10 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div class="flex items-center justify-between gap-3">
          <RouterLink class="inline-flex min-w-0 items-center gap-2" to="/dashboard" @click="closeMenu">
            <img class="h-10 w-auto shrink-0 sm:h-11" src="/brand/sadar-uang-icon.png" alt="" />
            <img class="h-6 w-auto max-w-[150px] sm:h-7 sm:max-w-none" src="/brand/sadar-uang-text.png" alt="Sadar Uang" />
          </RouterLink>
          <button
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-emerald-900/10 text-ink transition hover:border-brand hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/30 sm:hidden"
            type="button"
            :aria-expanded="mobileMenuOpen"
            aria-controls="primary-navigation"
            :aria-label="mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'"
            @click="toggleMenu"
          >
            <span class="sr-only">Menu</span>
            <svg v-if="!mobileMenuOpen" class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <nav
          id="primary-navigation"
          :class="[
            'mt-3 flex flex-col gap-1 border-t border-emerald-900/10 pt-3 text-sm text-muted sm:mt-0 sm:flex sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-1 sm:border-0 sm:pt-0',
            mobileMenuOpen ? 'flex' : 'hidden',
          ]"
        >
          <RouterLink class="rounded-md px-3 py-2 font-medium hover:bg-emerald-50 hover:text-brand" to="/dashboard" @click="closeMenu">Dashboard</RouterLink>
          <RouterLink class="rounded-md px-3 py-2 font-medium hover:bg-emerald-50 hover:text-brand" to="/transactions" @click="closeMenu">Transaksi</RouterLink>
          <RouterLink class="rounded-md px-3 py-2 font-medium hover:bg-emerald-50 hover:text-brand" to="/reports" @click="closeMenu">Laporan</RouterLink>
          <RouterLink v-if="authStore.isAdmin" class="rounded-md px-3 py-2 font-medium hover:bg-emerald-50 hover:text-brand" to="/admin" @click="closeMenu">Admin</RouterLink>
          <RouterLink class="rounded-md px-3 py-2 font-medium hover:bg-emerald-50 hover:text-brand" to="/settings" @click="closeMenu">Pengaturan</RouterLink>
          <button class="rounded-md px-3 py-2 text-left font-semibold text-ink hover:bg-emerald-50 hover:text-brand sm:text-center" type="button" @click="logout">
            Keluar
          </button>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";

const authStore = useAuthStore();
const toastStore = useToastStore();
const router = useRouter();
const mobileMenuOpen = ref(false);

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMenu = () => {
  mobileMenuOpen.value = false;
};

const logout = () => {
  closeMenu();
  authStore.logout();
  toastStore.success("Kamu sudah keluar dari akun.");
  router.push({ name: "login" });
};
</script>
