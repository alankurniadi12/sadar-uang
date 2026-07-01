<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-ink">Admin</h1>
        <p class="mt-2 text-sm text-muted">Pantau user dan kesehatan penggunaan aplikasi.</p>
      </div>
      <button
        class="rounded-md border border-emerald-900/15 px-4 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
        type="button"
        @click="loadAdminData"
      >
        Refresh
      </button>
    </div>

    <p v-if="adminStore.error" class="rounded-md bg-orange-50 px-3 py-2 text-sm text-danger">
      {{ adminStore.error }}
    </p>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article v-for="card in summaryCards" :key="card.label" class="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
        <p class="text-sm text-muted">{{ card.label }}</p>
        <p class="mt-3 text-2xl font-bold text-ink">{{ card.value }}</p>
      </article>
    </div>

    <form class="grid gap-3 rounded-lg border border-emerald-900/10 bg-white p-4 shadow-sm md:grid-cols-[1fr_160px_160px_auto]" @submit.prevent="applyFilters">
      <input
        v-model="filters.search"
        class="rounded-md border border-emerald-900/15 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
        placeholder="Cari nama atau email"
        type="search"
      />
      <select
        v-model="filters.status"
        class="rounded-md border border-emerald-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
      >
        <option value="">Semua status</option>
        <option value="active">Aktif</option>
        <option value="inactive">Nonaktif</option>
      </select>
      <select
        v-model="filters.role"
        class="rounded-md border border-emerald-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
      >
        <option value="">Semua role</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button class="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-950" type="submit">
        Terapkan
      </button>
    </form>

    <div class="grid gap-6 xl:grid-cols-[1fr_360px]">
      <article class="overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-sm">
        <div class="border-b border-emerald-900/10 px-4 py-3">
          <h2 class="text-base font-semibold text-ink">User Terdaftar</h2>
        </div>

        <div v-if="adminStore.loading" class="p-5 text-sm text-muted">
          Data user sedang dimuat...
        </div>
        <div v-else-if="adminStore.users.length === 0" class="p-5 text-sm text-muted">
          Tidak ada user yang cocok dengan filter.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-emerald-900/10 text-left text-sm">
            <thead class="bg-emerald-50/60 text-xs uppercase text-muted">
              <tr>
                <th class="px-4 py-3 font-semibold">User</th>
                <th class="px-4 py-3 font-semibold">Role</th>
                <th class="px-4 py-3 font-semibold">Status</th>
                <th class="px-4 py-3 font-semibold">Transaksi</th>
                <th class="px-4 py-3 font-semibold">Aktivitas</th>
                <th class="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-emerald-900/10">
              <tr v-for="user in adminStore.users" :key="user.id" class="hover:bg-emerald-50/40">
                <td class="px-4 py-3">
                  <button class="text-left" type="button" @click="selectUser(user.id)">
                    <span class="block font-semibold text-ink">{{ user.name }}</span>
                    <span class="block text-xs text-muted">{{ user.email }}</span>
                  </button>
                </td>
                <td class="px-4 py-3 capitalize text-muted">{{ user.role }}</td>
                <td class="px-4 py-3">
                  <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="statusClass(user.status)">
                    {{ statusLabel(user.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-ink">{{ user.transactionCount }}</td>
                <td class="px-4 py-3 text-muted">{{ user.lastTransactionAt ? formatDate(user.lastTransactionAt) : "-" }}</td>
                <td class="px-4 py-3">
                  <button
                    class="rounded-md border border-emerald-900/15 px-3 py-2 text-xs font-semibold text-ink hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    :disabled="isCurrentUser(user)"
                    @click="toggleUserStatus(user)"
                  >
                    {{ user.status === "active" ? "Nonaktifkan" : "Aktifkan" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col gap-3 border-t border-emerald-900/10 px-4 py-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Menampilkan {{ adminStore.users.length }} dari {{ adminStore.pagination.total }} user</p>
          <div class="flex gap-2">
            <button
              class="rounded-md border border-emerald-900/15 px-3 py-2 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              :disabled="adminStore.pagination.page <= 1"
              @click="changePage(adminStore.pagination.page - 1)"
            >
              Sebelumnya
            </button>
            <button
              class="rounded-md border border-emerald-900/15 px-3 py-2 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              :disabled="adminStore.pagination.page >= adminStore.pagination.totalPages"
              @click="changePage(adminStore.pagination.page + 1)"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </article>

      <aside class="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
        <div v-if="!adminStore.selectedUser" class="text-sm text-muted">
          Pilih user dari tabel untuk melihat ringkasan akun.
        </div>
        <div v-else class="space-y-5">
          <div>
            <h2 class="text-base font-semibold text-ink">{{ adminStore.selectedUser.name }}</h2>
            <p class="mt-1 text-sm text-muted">{{ adminStore.selectedUser.email }}</p>
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-muted">Role</p>
              <p class="mt-1 font-semibold capitalize text-ink">{{ adminStore.selectedUser.role }}</p>
            </div>
            <div>
              <p class="text-muted">Status</p>
              <p class="mt-1 font-semibold text-ink">{{ statusLabel(adminStore.selectedUser.status) }}</p>
            </div>
            <div>
              <p class="text-muted">Daftar</p>
              <p class="mt-1 font-semibold text-ink">{{ formatDate(adminStore.selectedUser.createdAt) }}</p>
            </div>
            <div>
              <p class="text-muted">Transaksi</p>
              <p class="mt-1 font-semibold text-ink">{{ adminStore.selectedUser.transactionCount }}</p>
            </div>
          </div>

          <div class="space-y-3 border-t border-emerald-900/10 pt-4 text-sm">
            <div class="flex justify-between gap-3">
              <span class="text-muted">Total masuk</span>
              <span class="font-semibold text-brand">{{ formatCurrency(adminStore.selectedUser.incomeTotal) }}</span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="text-muted">Total keluar</span>
              <span class="font-semibold text-danger">{{ formatCurrency(adminStore.selectedUser.expenseTotal) }}</span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="text-muted">Saldo tercatat</span>
              <span class="font-semibold text-ink">{{ formatCurrency(adminStore.selectedUser.balance) }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive } from "vue";

import { useAdminStore } from "@/stores/adminStore";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

const adminStore = useAdminStore();
const authStore = useAuthStore();
const toastStore = useToastStore();
const filters = reactive({
  search: "",
  status: "",
  role: "",
});

const summaryCards = computed(() => {
  const summary = adminStore.summary || {
    totalUsers: 0,
    activeUsers: 0,
    activeUsersLast30Days: 0,
    newUsersThisMonth: 0,
  };

  return [
    { label: "Total User", value: String(summary.totalUsers) },
    { label: "Akun Aktif", value: String(summary.activeUsers) },
    { label: "User Baru Bulan Ini", value: String(summary.newUsersThisMonth) },
    { label: "User Aktif 30 Hari", value: String(summary.activeUsersLast30Days) },
  ];
});

const statusLabel = (status) => (status === "active" ? "Aktif" : "Nonaktif");

const statusClass = (status) => {
  return status === "active"
    ? "bg-emerald-50 text-brand"
    : "bg-orange-50 text-danger";
};

const isCurrentUser = (user) => user.id === authStore.user?.id;

const loadAdminData = async () => {
  try {
    await Promise.all([
      adminStore.fetchSummary(),
      adminStore.fetchUsers({ ...filters, page: adminStore.pagination.page || 1 }),
    ]);
  } catch (error) {
    toastStore.error(adminStore.error || "Data admin gagal dimuat.");
  }
};

const applyFilters = async () => {
  try {
    await adminStore.fetchUsers({ ...filters, page: 1 });
  } catch (error) {
    toastStore.error(adminStore.error || "Filter user gagal diterapkan.");
  }
};

const changePage = async (page) => {
  try {
    await adminStore.fetchUsers({ ...filters, page });
  } catch (error) {
    toastStore.error(adminStore.error || "Halaman user gagal dimuat.");
  }
};

const selectUser = async (id) => {
  try {
    await adminStore.fetchUser(id);
  } catch (error) {
    toastStore.error(adminStore.error || "Detail user gagal dimuat.");
  }
};

const toggleUserStatus = async (user) => {
  const nextStatus = user.status === "active" ? "inactive" : "active";

  try {
    await adminStore.updateUserStatus(user.id, nextStatus);
    await adminStore.fetchSummary();
    toastStore.success(`User berhasil ${nextStatus === "active" ? "diaktifkan" : "dinonaktifkan"}.`);
  } catch (error) {
    toastStore.error(adminStore.error || "Status user gagal diperbarui.");
  }
};

onMounted(loadAdminData);
</script>
