<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-ink">Profil & Pengaturan</h1>
      <p class="mt-2 text-sm text-muted">Kelola identitas akun dan keamanan login kamu.</p>
    </div>

    <p v-if="authStore.error" class="rounded-md bg-orange-50 px-3 py-2 text-sm text-danger">
      {{ authStore.error }}
    </p>

    <div class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <aside class="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
            {{ initials }}
          </div>
          <div class="min-w-0">
            <p class="truncate text-base font-semibold text-ink">{{ authStore.user?.name || "User" }}</p>
            <p class="truncate text-sm text-muted">{{ authStore.user?.email }}</p>
          </div>
        </div>

        <dl class="mt-6 space-y-4 text-sm">
          <div class="flex items-start justify-between gap-4 border-t border-emerald-900/10 pt-4">
            <dt class="text-muted">Role</dt>
            <dd class="font-semibold capitalize text-ink">{{ authStore.user?.role || "user" }}</dd>
          </div>
          <div class="flex items-start justify-between gap-4 border-t border-emerald-900/10 pt-4">
            <dt class="text-muted">Status</dt>
            <dd class="font-semibold capitalize text-brand">{{ authStore.user?.status || "active" }}</dd>
          </div>
          <div class="flex items-start justify-between gap-4 border-t border-emerald-900/10 pt-4">
            <dt class="text-muted">Tanggal daftar</dt>
            <dd class="text-right font-semibold text-ink">{{ registeredDate }}</dd>
          </div>
        </dl>
      </aside>

      <div class="space-y-6">
        <form class="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm" @submit.prevent="submitProfile">
          <div class="mb-5">
            <h2 class="text-base font-semibold text-ink">Data Profil</h2>
            <p class="mt-1 text-sm text-muted">Nama ini dipakai di dashboard dan laporan akun.</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="text-sm font-medium text-ink">Nama</span>
              <input
                v-model="profileForm.name"
                class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                type="text"
                autocomplete="name"
                required
                minlength="2"
              />
            </label>

            <label class="block">
              <span class="text-sm font-medium text-ink">Email</span>
              <input
                :value="authStore.user?.email"
                class="mt-2 w-full rounded-md border border-emerald-900/15 bg-surface px-3 py-3 text-sm text-muted outline-none"
                type="email"
                disabled
              />
            </label>
          </div>

          <div class="mt-5 flex justify-end">
            <button
              class="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              type="submit"
              :disabled="authStore.loading || !profileChanged"
            >
              {{ authStore.loading ? "Menyimpan..." : "Simpan Profil" }}
            </button>
          </div>
        </form>

        <form class="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm" @submit.prevent="submitPassword">
          <div class="mb-5">
            <h2 class="text-base font-semibold text-ink">Keamanan</h2>
            <p class="mt-1 text-sm text-muted">{{ securityDescription }}</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label v-if="hasPassword" class="block sm:col-span-2">
              <span class="text-sm font-medium text-ink">Password saat ini</span>
              <PasswordInput
                v-model="passwordForm.currentPassword"
                autocomplete="current-password"
                required
              />
            </label>

            <label class="block">
              <span class="text-sm font-medium text-ink">Password baru</span>
              <PasswordInput
                v-model="passwordForm.newPassword"
                autocomplete="new-password"
                required
                minlength="6"
              />
            </label>

            <label class="block">
              <span class="text-sm font-medium text-ink">Konfirmasi password baru</span>
              <PasswordInput
                v-model="passwordForm.confirmPassword"
                autocomplete="new-password"
                required
                minlength="6"
              />
            </label>
          </div>

          <p v-if="passwordError" class="mt-4 rounded-md bg-orange-50 px-3 py-2 text-sm text-danger">
            {{ passwordError }}
          </p>

          <div class="mt-5 flex justify-end">
            <button
              class="w-full rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              type="submit"
              :disabled="authStore.loading"
            >
              {{ passwordButtonText }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";

import PasswordInput from "@/components/PasswordInput.vue";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { formatDate } from "@/utils/formatDate";

const authStore = useAuthStore();
const toastStore = useToastStore();
const passwordError = ref("");
const profileForm = reactive({
  name: authStore.user?.name || "",
});
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const authProviders = computed(() => authStore.user?.authProviders || []);
const hasPassword = computed(() => authProviders.value.includes("password"));
const profileChanged = computed(() => profileForm.name.trim() !== (authStore.user?.name || ""));
const registeredDate = computed(() => formatDate(authStore.user?.createdAt) || "-");
const securityDescription = computed(() =>
  hasPassword.value
    ? "Gunakan password berbeda dari layanan lain."
    : "Buat password agar akun ini juga bisa masuk dengan email.",
);
const passwordButtonText = computed(() => {
  if (authStore.loading) return hasPassword.value ? "Memperbarui..." : "Membuat...";
  return hasPassword.value ? "Ubah Password" : "Buat Password";
});
const initials = computed(() => {
  const name = authStore.user?.name || "User";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
});

watch(
  () => authStore.user?.name,
  (name) => {
    profileForm.name = name || "";
  },
);

onMounted(() => {
  authStore.fetchMe();
});

const resetPasswordForm = () => {
  passwordForm.currentPassword = "";
  passwordForm.newPassword = "";
  passwordForm.confirmPassword = "";
};

const submitProfile = async () => {
  try {
    await authStore.updateProfile({ name: profileForm.name });
    toastStore.success("Profil berhasil diperbarui.");
  } catch (error) {
    toastStore.error(authStore.error || "Profil gagal diperbarui.");
  }
};

const submitPassword = async () => {
  passwordError.value = "";
  const isCreatingPassword = !hasPassword.value;

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = "Konfirmasi password belum sama.";
    return;
  }

  try {
    await authStore.updatePassword({
      currentPassword: hasPassword.value ? passwordForm.currentPassword : undefined,
      newPassword: passwordForm.newPassword,
    });
    resetPasswordForm();
    toastStore.success(isCreatingPassword ? "Password berhasil dibuat." : "Password berhasil diperbarui.");
  } catch (error) {
    toastStore.error(authStore.error || "Password gagal diperbarui.");
  }
};
</script>
