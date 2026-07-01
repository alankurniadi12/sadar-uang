<template>
  <section class="w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
    <RouterLink class="text-sm font-semibold text-brand" to="/">Sadar Uang</RouterLink>
    <h1 class="mt-5 text-2xl font-bold text-ink">Reset password akunmu.</h1>
    <p class="mt-2 text-sm leading-6 text-muted">
      Masukkan email akun. Kalau email terdaftar, kami akan mengirim link untuk membuat password baru.
    </p>

    <form class="mt-6 space-y-4" @submit.prevent="submitForgotPassword">
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

      <p v-if="message" class="rounded-md bg-emerald-50 px-3 py-2 text-sm text-brand">
        {{ message }}
      </p>
      <p v-if="devResetUrl" class="break-words rounded-md bg-stone-50 px-3 py-2 text-xs text-muted">
        Link dev:
        <RouterLink class="font-semibold text-brand hover:text-emerald-800" :to="devResetPath">
          {{ devResetUrl }}
        </RouterLink>
      </p>
      <p v-if="authStore.error" class="rounded-md bg-orange-50 px-3 py-2 text-sm text-danger">
        {{ authStore.error }}
      </p>

      <button
        class="w-full rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        :disabled="authStore.loading"
      >
        {{ authStore.loading ? "Mengirim..." : "Kirim Link Reset" }}
      </button>
    </form>

    <p class="mt-5 text-center text-sm text-muted">
      Ingat password?
      <RouterLink class="font-semibold text-brand hover:text-emerald-800" to="/login">
        Masuk di sini.
      </RouterLink>
    </p>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";

const authStore = useAuthStore();
const toastStore = useToastStore();
const message = ref("");
const devResetUrl = ref("");

const form = reactive({
  email: "",
});

const devResetPath = computed(() => {
  if (!devResetUrl.value) return "/reset-password";

  return new URL(devResetUrl.value).pathname + new URL(devResetUrl.value).search;
});

const submitForgotPassword = async () => {
  try {
    const response = await authStore.forgotPassword(form);
    message.value = response.message;
    devResetUrl.value = response.data?.resetUrl || "";
    toastStore.success("Permintaan reset password diproses.");
  } catch (error) {
    toastStore.error(authStore.error || "Permintaan reset password gagal.");
  }
};
</script>
