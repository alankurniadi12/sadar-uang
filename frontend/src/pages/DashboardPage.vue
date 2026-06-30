<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-ink">Ringkasan Uangmu</h1>
        <p class="mt-2 text-sm text-muted">Lihat kondisi pemasukan dan pengeluaranmu bulan ini.</p>
      </div>

      <form class="flex gap-2" @submit.prevent="loadDashboard">
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
          Lihat
        </button>
      </form>
    </div>

    <p v-if="dashboardStore.error" class="rounded-md bg-orange-50 px-3 py-2 text-sm text-danger">
      {{ dashboardStore.error }}
    </p>

    <div v-if="dashboardStore.loading" class="rounded-lg border border-emerald-900/10 bg-white p-6 text-sm text-muted shadow-sm">
      Dashboard sedang dimuat...
    </div>

    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article v-for="card in summaryCards" :key="card.label" class="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
          <p class="text-sm text-muted">{{ card.label }}</p>
          <p class="mt-3 text-2xl font-bold" :class="card.className">{{ card.value }}</p>
        </article>
      </div>

      <div v-if="!hasTransactions" class="rounded-lg border border-emerald-900/10 bg-white p-6 text-sm text-muted shadow-sm">
        Belum ada transaksi. Catat transaksi pertamamu hari ini dan mulai lihat ke mana uangmu pergi.
      </div>

      <div class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article class="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
          <div class="mb-4">
            <h2 class="text-base font-semibold text-ink">Grafik Harian</h2>
            <p class="mt-1 text-sm text-muted">Uang masuk dan keluar per hari bulan ini.</p>
          </div>
          <div class="h-72">
            <Bar :data="dailyChartData" :options="chartOptions" />
          </div>
        </article>

        <article class="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
          <div class="mb-4">
            <h2 class="text-base font-semibold text-ink">Pengeluaran Terbesar</h2>
            <p class="mt-1 text-sm text-muted">Kategori yang paling banyak menguras uangmu.</p>
          </div>
          <div v-if="dashboardStore.categoryData.length === 0" class="flex h-72 items-center text-sm text-muted">
            Belum ada pengeluaran pada periode ini.
          </div>
          <div v-else class="h-72">
            <Doughnut :data="categoryChartData" :options="doughnutOptions" />
          </div>
        </article>
      </div>

      <div class="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <article class="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
          <div class="mb-4">
            <h2 class="text-base font-semibold text-ink">Tren Bulanan</h2>
            <p class="mt-1 text-sm text-muted">Perbandingan uang masuk dan keluar selama satu tahun.</p>
          </div>
          <div class="h-72">
            <Line :data="monthlyChartData" :options="chartOptions" />
          </div>
        </article>

        <article class="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-semibold text-ink">Transaksi Terbaru</h2>
              <p class="mt-1 text-sm text-muted">Catatan terakhir yang kamu input.</p>
            </div>
            <RouterLink class="text-sm font-semibold text-brand hover:text-emerald-800" to="/transactions">
              Lihat semua
            </RouterLink>
          </div>

          <div v-if="dashboardStore.recentTransactions.length === 0" class="text-sm text-muted">
            Belum ada catatan uang. Mulai dari satu transaksi kecil dulu.
          </div>

          <div v-else class="divide-y divide-emerald-900/10">
            <div v-for="transaction in dashboardStore.recentTransactions" :key="transaction.id" class="flex items-center justify-between gap-4 py-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-ink">{{ transaction.description }}</p>
                <p class="mt-1 text-xs text-muted">{{ transaction.category }} · {{ formatDate(transaction.date) }}</p>
              </div>
              <p class="whitespace-nowrap text-sm font-bold" :class="transaction.type === 'income' ? 'text-brand' : 'text-danger'">
                {{ transaction.type === "income" ? "+" : "-" }} {{ formatCurrency(transaction.amount) }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </template>
  </section>
</template>

<script setup>
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { computed, onMounted, reactive } from "vue";
import { Bar, Doughnut, Line } from "vue-chartjs";

import { useDashboardStore } from "@/stores/dashboardStore";
import { useToastStore } from "@/stores/toastStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
);

const dashboardStore = useDashboardStore();
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
const monthLabels = months.map((month) => month.label);
const hasTransactions = computed(() => (dashboardStore.summary?.transactionCount || 0) > 0);
const summaryCards = computed(() => {
  const summary = dashboardStore.summary || {
    incomeTotal: 0,
    expenseTotal: 0,
    balance: 0,
    transactionCount: 0,
  };

  return [
    {
      label: "Uang Masuk",
      value: formatCurrency(summary.incomeTotal),
      className: "text-brand",
    },
    {
      label: "Uang Keluar",
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
const dailyChartData = computed(() => ({
  labels: dashboardStore.dailyData.map((item) => item.date.slice(-2)),
  datasets: [
    {
      label: "Uang Masuk",
      data: dashboardStore.dailyData.map((item) => item.income),
      backgroundColor: "#1f7a4d",
      borderRadius: 4,
    },
    {
      label: "Uang Keluar",
      data: dashboardStore.dailyData.map((item) => item.expense),
      backgroundColor: "#c2410c",
      borderRadius: 4,
    },
  ],
}));
const monthlyChartData = computed(() => ({
  labels: monthLabels,
  datasets: [
    {
      label: "Uang Masuk",
      data: dashboardStore.monthlyData.map((item) => item.income),
      borderColor: "#1f7a4d",
      backgroundColor: "rgba(31, 122, 77, 0.12)",
      fill: true,
      tension: 0.35,
    },
    {
      label: "Uang Keluar",
      data: dashboardStore.monthlyData.map((item) => item.expense),
      borderColor: "#c2410c",
      backgroundColor: "rgba(194, 65, 12, 0.12)",
      fill: true,
      tension: 0.35,
    },
  ],
}));
const categoryChartData = computed(() => ({
  labels: dashboardStore.categoryData.map((item) => item.category),
  datasets: [
    {
      data: dashboardStore.categoryData.map((item) => item.total),
      backgroundColor: [
        "#1f7a4d",
        "#c2410c",
        "#2563eb",
        "#9333ea",
        "#ca8a04",
        "#0f766e",
        "#be123c",
      ],
      borderWidth: 0,
    },
  ],
}));
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => formatCurrency(value),
      },
    },
  },
};
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${formatCurrency(context.raw)}`,
      },
    },
  },
};

const loadDashboard = async () => {
  try {
    await dashboardStore.fetchDashboard({
      month: period.month,
      year: period.year,
    });
  } catch (error) {
    toastStore.error(dashboardStore.error || "Dashboard gagal dimuat.");
    // Error message is stored in dashboardStore for display.
  }
};

onMounted(loadDashboard);
</script>
