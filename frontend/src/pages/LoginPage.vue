<template>
  <section class="w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
    <RouterLink class="text-sm font-semibold text-brand" to="/">Sadar Uang</RouterLink>
    <h1 class="mt-5 text-2xl font-bold text-ink">Masuk dan lihat kondisi uangmu hari ini.</h1>
    <p class="mt-2 text-sm leading-6 text-muted">
      Lanjutkan kebiasaan kecil yang bisa membuat uangmu lebih terarah.
    </p>

    <form class="mt-6 space-y-4" @submit.prevent="submitLogin">
      <label class="block">
        <span class="text-sm font-medium text-ink">Email</span>
        <input
          v-model="form.email"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          placeholder="nama@email.com"
          type="email"
          autocomplete="email"
          required
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink">Password</span>
        <input
          v-model="form.password"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          placeholder="Masukkan password"
          type="password"
          autocomplete="current-password"
          required
        />
      </label>

      <p v-if="authStore.error" class="rounded-md bg-orange-50 px-3 py-2 text-sm text-danger">
        {{ authStore.error }}
      </p>

      <button
        class="w-full rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        :disabled="authStore.loading"
      >
        {{ authStore.loading ? "Memproses..." : "Masuk" }}
      </button>
    </form>

    <p class="mt-5 text-center text-sm text-muted">
      Belum punya akun?
      <RouterLink class="font-semibold text-brand hover:text-emerald-800" to="/register">
        Daftar dulu.
      </RouterLink>
    </p>
  </section>
</template>

<script setup>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const form = reactive({
  email: "",
  password: "",
});

const submitLogin = async () => {
  try {
    await authStore.login(form);
    router.push(route.query.redirect || { name: "dashboard" });
  } catch (error) {
    // Error message is already stored in authStore for display.
  }
};
</script>
