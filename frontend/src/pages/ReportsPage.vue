<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-ink">Laporan Bulanan</h1>
        <p class="mt-2 text-sm text-muted">Lihat rangkuman uangmu dalam satu laporan yang rapi.</p>
      </div>

      <form class="flex gap-2" @submit.prevent="loadReport">
        <select
          v-model="period.month"
          class="rounded-md border border-emerald-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
        >
          <option v-for="month in months" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
        <input
          v-model="period.year"
          class="w-24 rounded-md border border-emerald-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          type="number"
          min="2000"
          max="2100"
        />
        <button class="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-950" type="submit">
          Preview
        </button>
      </form>
    </div>

    <p v-if="error" class="rounded-md bg-orange-50 px-3 py-2 text-sm text-danger">
      {{ error }}
    </p>

    <div v-if="loading" class="rounded-lg border border-emerald-900/10 bg-white p-6 text-sm text-muted shadow-sm">
      Laporan sedang dimuat...
    </div>

    <template v-else-if="report">
      <article class="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-sm text-muted">Periode laporan</p>
            <h2 class="mt-1 text-xl font-bold text-ink">{{ report.period.label }}</h2>
            <p class="mt-1 text-sm text-muted">{{ report.user.name }} · {{ report.user.email }}</p>
          </div>
          <button
            class="rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
            type="button"
            :disabled="downloading"
            @click="downloadPdf"
          >
            {{ downloading ? "Menyiapkan PDF..." : "Download PDF" }}
          </button>
        </div>
      </article>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article v-for="card in summaryCards" :key="card.label" class="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
          <p class="text-sm text-muted">{{ card.label }}</p>
          <p class="mt-3 text-2xl font-bold" :class="card.className">{{ card.value }}</p>
        </article>
      </div>

      <div class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <article class="min-w-0 rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
          <h2 class="text-base font-semibold text-ink">Pengeluaran Berdasarkan Kategori</h2>
          <div v-if="report.categorySummary.length === 0" class="mt-4 text-sm text-muted">
            Belum ada pengeluaran pada periode ini.
          </div>
          <div v-else class="mt-4 space-y-3">
            <div v-for="item in report.categorySummary" :key="item.category">
              <div class="flex items-center justify-between gap-3 text-sm">
                <span class="font-medium text-ink">{{ item.category }}</span>
                <span class="font-semibold text-danger">{{ formatCurrency(item.total) }}</span>
              </div>
              <div class="mt-2 h-2 overflow-hidden rounded-full bg-orange-100">
                <div class="h-full rounded-full bg-danger" :style="{ width: `${categoryWidth(item.total)}%` }"></div>
              </div>
            </div>
          </div>
        </article>

        <article class="min-w-0 rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
          <div class="mb-4">
            <h2 class="text-base font-semibold text-ink">Daftar Transaksi</h2>
            <p class="mt-1 text-sm text-muted">Semua transaksi pada periode laporan.</p>
          </div>

          <div v-if="report.transactions.length === 0" class="text-sm text-muted">
            Belum ada transaksi pada periode ini.
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-emerald-900/10 text-sm">
              <thead class="bg-surface text-left text-xs font-semibold uppercase text-muted">
                <tr>
                  <th class="px-4 py-3">Tanggal</th>
                  <th class="px-4 py-3">Keterangan</th>
                  <th class="px-4 py-3">Kategori</th>
                  <th class="px-4 py-3 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-emerald-900/10">
                <tr v-for="transaction in report.transactions" :key="transaction.id">
                  <td class="whitespace-nowrap px-4 py-3 text-muted">{{ formatDate(transaction.date) }}</td>
                  <td class="px-4 py-3 font-medium text-ink">{{ transaction.description }}</td>
                  <td class="whitespace-nowrap px-4 py-3 text-muted">{{ transaction.category }}</td>
                  <td class="whitespace-nowrap px-4 py-3 text-right font-semibold" :class="transaction.type === 'income' ? 'text-brand' : 'text-danger'">
                    {{ transaction.type === "income" ? "+" : "-" }} {{ formatCurrency(transaction.amount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";

import { reportService } from "@/services/reportService";
import { useToastStore } from "@/stores/toastStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

const toastStore = useToastStore();
const now = new Date();
const period = reactive({
  month: String(now.getMonth() + 1),
  year: String(now.getFullYear()),
});
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
const report = ref(null);
const loading = ref(false);
const downloading = ref(false);
const error = ref(null);
const summaryCards = computed(() => {
  const summary = report.value?.summary || {
    incomeTotal: 0,
    expenseTotal: 0,
    balance: 0,
    transactionCount: 0,
  };

  return [
    {
      label: "Total Pemasukan",
      value: formatCurrency(summary.incomeTotal),
      className: "text-brand",
    },
    {
      label: "Total Pengeluaran",
      value: formatCurrency(summary.expenseTotal),
      className: "text-danger",
    },
    {
      label: "Sisa Uang",
      value: formatCurrency(summary.balance),
      className: summary.balance >= 0 ? "text-brand" : "text-danger",
    },
    {
      label: "Total Transaksi",
      value: String(summary.transactionCount),
      className: "text-ink",
    },
  ];
});
const maxCategoryTotal = computed(() => {
  return Math.max(...(report.value?.categorySummary || []).map((item) => item.total), 1);
});

const params = () => ({
  month: period.month,
  year: period.year,
});

const loadReport = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await reportService.monthly(params());
    report.value = response.data.data;
  } catch (err) {
    error.value = err.response?.data?.message || "Laporan gagal dimuat.";
    toastStore.error(error.value);
  } finally {
    loading.value = false;
  }
};

const categoryWidth = (total) => Math.max((total / maxCategoryTotal.value) * 100, 4);

const downloadPdf = async () => {
  downloading.value = true;
  error.value = null;

  try {
    const response = await reportService.monthlyPdf(params());
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `sadar-uang-${period.year}-${String(period.month).padStart(2, "0")}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toastStore.success("PDF laporan berhasil diunduh.");
  } catch (err) {
    error.value = err.response?.data?.message || "Laporan PDF gagal diunduh.";
    toastStore.error(error.value);
  } finally {
    downloading.value = false;
  }
};

onMounted(loadReport);
</script>
