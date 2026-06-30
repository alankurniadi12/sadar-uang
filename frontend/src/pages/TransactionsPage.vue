<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-ink">Catatan Transaksi</h1>
        <p class="mt-2 text-sm text-muted">Semua uang masuk dan keluar tersimpan di sini.</p>
      </div>

      <RouterLink
        class="inline-flex items-center justify-center rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        to="/transactions/new"
      >
        Tambah Transaksi
      </RouterLink>
    </div>

    <form class="grid gap-3 rounded-lg border border-emerald-900/10 bg-white p-4 shadow-sm md:grid-cols-[1.3fr_0.9fr_0.9fr_0.7fr_0.7fr_auto]" @submit.prevent="applyFilters">
      <label class="block" for="transaction-search">
        <span class="text-xs font-semibold uppercase text-muted">Cari</span>
        <input
          id="transaction-search"
          v-model="filters.search"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          placeholder="Cari keterangan transaksi..."
          type="search"
        />
      </label>

      <label class="block" for="transaction-type-filter">
        <span class="text-xs font-semibold uppercase text-muted">Tipe</span>
        <select
          id="transaction-type-filter"
          v-model="filters.type"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          @change="filters.category = ''"
        >
          <option value="">Semua</option>
          <option v-for="type in TRANSACTION_TYPES" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </label>

      <label class="block" for="transaction-category-filter">
        <span class="text-xs font-semibold uppercase text-muted">Kategori</span>
        <select
          id="transaction-category-filter"
          v-model="filters.category"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          :disabled="!filters.type"
        >
          <option value="">Semua</option>
          <option v-for="category in categoryOptions" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </label>

      <label class="block" for="transaction-month-filter">
        <span class="text-xs font-semibold uppercase text-muted">Bulan</span>
        <select
          id="transaction-month-filter"
          v-model="filters.month"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
        >
          <option v-for="month in months" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
      </label>

      <label class="block" for="transaction-year-filter">
        <span class="text-xs font-semibold uppercase text-muted">Tahun</span>
        <input
          id="transaction-year-filter"
          v-model="filters.year"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          min="2000"
          max="2100"
          type="number"
        />
      </label>

      <div class="flex items-end gap-2">
        <button class="rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-950" type="submit">
          Terapkan
        </button>
        <button class="rounded-md border border-emerald-900/15 px-4 py-2.5 text-sm font-semibold text-ink hover:border-brand hover:text-brand" type="button" @click="resetFilters">
          Reset
        </button>
      </div>
    </form>

    <p v-if="transactionStore.error" class="rounded-md bg-orange-50 px-3 py-2 text-sm text-danger">
      {{ transactionStore.error }}
    </p>

    <div class="overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-sm">
      <div v-if="transactionStore.loading" class="p-6 text-sm text-muted">
        Data transaksi sedang dimuat...
      </div>

      <div v-else-if="transactionStore.transactions.length === 0" class="p-6 text-sm text-muted">
        Belum ada catatan uang. Mulai dari satu transaksi kecil dulu.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-emerald-900/10 text-sm">
          <thead class="bg-surface text-left text-xs font-semibold uppercase text-muted">
            <tr>
              <th class="px-4 py-3">Tanggal</th>
              <th class="px-4 py-3">Keterangan</th>
              <th class="px-4 py-3">Kategori</th>
              <th class="px-4 py-3">Tipe</th>
              <th class="px-4 py-3 text-right">Jumlah</th>
              <th class="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-emerald-900/10">
            <tr v-for="transaction in transactionStore.transactions" :key="transaction.id">
              <td class="whitespace-nowrap px-4 py-3 text-muted">{{ formatDate(transaction.date) }}</td>
              <td class="px-4 py-3 font-medium text-ink">{{ transaction.description }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-muted">{{ transaction.category }}</td>
              <td class="whitespace-nowrap px-4 py-3">
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="transaction.type === 'income' ? 'bg-emerald-100 text-brand' : 'bg-orange-100 text-danger'"
                >
                  {{ transaction.type === "income" ? "Uang Masuk" : "Uang Keluar" }}
                </span>
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-right font-semibold" :class="transaction.type === 'income' ? 'text-brand' : 'text-danger'">
                {{ formatCurrency(transaction.amount) }}
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-right">
                <RouterLink class="font-semibold text-brand hover:text-emerald-800" :to="`/transactions/${transaction.id}/edit`">
                  Edit
                </RouterLink>
                <button class="ml-4 font-semibold text-danger hover:text-orange-700" type="button" @click="confirmDelete(transaction)">
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="transactionStore.pagination.totalPages > 1" class="flex items-center justify-between gap-3">
      <p class="text-sm text-muted">
        Halaman {{ transactionStore.pagination.page }} dari {{ transactionStore.pagination.totalPages }}
      </p>
      <div class="flex gap-2">
        <button
          class="rounded-md border border-emerald-900/15 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          :disabled="transactionStore.pagination.page <= 1 || transactionStore.loading"
          @click="changePage(transactionStore.pagination.page - 1)"
        >
          Sebelumnya
        </button>
        <button
          class="rounded-md border border-emerald-900/15 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          :disabled="transactionStore.pagination.page >= transactionStore.pagination.totalPages || transactionStore.loading"
          @click="changePage(transactionStore.pagination.page + 1)"
        >
          Berikutnya
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive } from "vue";

import { useTransactionStore } from "@/stores/transactionStore";
import { useToastStore } from "@/stores/toastStore";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSACTION_TYPES,
} from "@/utils/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

const transactionStore = useTransactionStore();
const toastStore = useToastStore();
const now = new Date();
const months = [
  { value: "1", label: "Jan" },
  { value: "2", label: "Feb" },
  { value: "3", label: "Mar" },
  { value: "4", label: "Apr" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Jun" },
  { value: "7", label: "Jul" },
  { value: "8", label: "Agu" },
  { value: "9", label: "Sep" },
  { value: "10", label: "Okt" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Des" },
];
const filters = reactive({
  search: "",
  type: "",
  category: "",
  month: String(now.getMonth() + 1),
  year: String(now.getFullYear()),
  page: 1,
  limit: 20,
});
const categoryOptions = computed(() => {
  if (filters.type === "income") return INCOME_CATEGORIES;
  if (filters.type === "expense") return EXPENSE_CATEGORIES;
  return [];
});

const buildParams = () => {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== "" && value !== null),
  );
};

const loadTransactions = async () => {
  transactionStore.setFilters(buildParams());
  try {
    await transactionStore.fetchTransactions();
  } catch (error) {
    toastStore.error(transactionStore.error || "Data transaksi gagal dimuat.");
    // Error message is stored in transactionStore for display.
  }
};

const applyFilters = async () => {
  filters.page = 1;
  await loadTransactions();
  if (!transactionStore.error) {
    toastStore.success("Filter transaksi diterapkan.");
  }
};

const resetFilters = async () => {
  filters.search = "";
  filters.type = "";
  filters.category = "";
  filters.month = String(now.getMonth() + 1);
  filters.year = String(now.getFullYear());
  filters.page = 1;
  await loadTransactions();
  if (!transactionStore.error) {
    toastStore.success("Filter transaksi direset.");
  }
};

const changePage = async (page) => {
  filters.page = page;
  await loadTransactions();
};

const confirmDelete = async (transaction) => {
  const confirmed = window.confirm(`Hapus transaksi "${transaction.description}"?`);

  if (!confirmed) return;

  try {
    await transactionStore.deleteTransaction(transaction.id);
    await loadTransactions();
    toastStore.success("Transaksi berhasil dihapus.");
  } catch (error) {
    toastStore.error(transactionStore.error || "Transaksi gagal dihapus.");
    // Error message is stored in transactionStore for display.
  }
};

onMounted(loadTransactions);
</script>
