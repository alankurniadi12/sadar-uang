<template>
  <section class="w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
    <RouterLink class="text-sm font-semibold text-brand" to="/">Sadar Uang</RouterLink>
    <h1 class="mt-5 text-2xl font-bold text-ink">Buat password baru.</h1>
    <p class="mt-2 text-sm leading-6 text-muted">
      Gunakan password baru yang mudah kamu ingat, tapi tidak mudah ditebak orang lain.
    </p>

    <form class="mt-6 space-y-4" @submit.prevent="submitResetPassword">
      <label class="block">
        <span class="text-sm font-medium text-ink">Password baru</span>
        <input
          v-model="form.password"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          placeholder="Minimal 6 karakter"
          type="password"
          autocomplete="new-password"
          required
          minlength="6"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink">Konfirmasi password</span>
        <input
          v-model="form.passwordConfirmation"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          placeholder="Ulangi password baru"
          type="password"
          autocomplete="new-password"
          required
          minlength="6"
        />
      </label>

      <p v-if="localError" class="rounded-md bg-orange-50 px-3 py-2 text-sm text-danger">
        {{ localError }}
      </p>
      <p v-if="authStore.error" class="rounded-md bg-orange-50 px-3 py-2 text-sm text-danger">
        {{ authStore.error }}
      </p>

      <button
        class="w-full rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        :disabled="authStore.loading || !token"
      >
        {{ authStore.loading ? "Menyimpan..." : "Reset Password" }}
      </button>
    </form>

    <p v-if="!token" class="mt-5 rounded-md bg-orange-50 px-3 py-2 text-sm text-danger">
      Link reset password tidak lengkap. Minta link baru dari halaman lupa password.
    </p>

    <p class="mt-5 text-center text-sm text-muted">
      Butuh link baru?
      <RouterLink class="font-semibold text-brand hover:text-emerald-800" to="/forgot-password">
        Kirim ulang.
      </RouterLink>
    </p>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";

const authStore = useAuthStore();
const toastStore = useToastStore();
const route = useRoute();
const router = useRouter();
const localError = ref("");

const token = computed(() => String(route.query.token || ""));

const form = reactive({
  password: "",
  passwordConfirmation: "",
});

const submitResetPassword = async () => {
  localError.value = "";

  if (form.password !== form.passwordConfirmation) {
    localError.value = "Konfirmasi password belum sama.";
    return;
  }

  try {
    await authStore.resetPassword({
      token: token.value,
      password: form.password,
    });
    toastStore.success("Password berhasil direset. Kamu sudah masuk kembali.");
    router.push({ name: "dashboard" });
  } catch (error) {
    toastStore.error(authStore.error || "Password gagal direset.");
  }
};
</script>
