<template>
  <section class="mx-auto max-w-2xl space-y-6">
    <div>
      <RouterLink class="text-sm font-semibold text-brand hover:text-emerald-800" to="/transactions">
        Kembali ke transaksi
      </RouterLink>
      <h1 class="mt-4 text-2xl font-bold text-ink">{{ title }}</h1>
      <p class="mt-2 text-sm text-muted">Catat sekarang, biar tidak jadi misteri akhir bulan.</p>
    </div>

    <form class="space-y-4 rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm" @submit.prevent="submitForm">
      <label class="block" for="transaction-date">
        <span class="text-sm font-medium text-ink">Tanggal</span>
        <input
          id="transaction-date"
          v-model="form.date"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          type="date"
          required
        />
      </label>

      <label class="block" for="transaction-type">
        <span class="text-sm font-medium text-ink">Tipe Transaksi</span>
        <select
          id="transaction-type"
          v-model="form.type"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          required
          @change="form.category = ''"
        >
          <option v-for="type in TRANSACTION_TYPES" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </label>

      <label class="block" for="transaction-description">
        <span class="text-sm font-medium text-ink">Keterangan</span>
        <input
          id="transaction-description"
          v-model="form.description"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          placeholder="Contoh: Makan siang"
          type="text"
          required
          minlength="2"
        />
      </label>

      <label class="block" for="transaction-category">
        <span class="text-sm font-medium text-ink">Kategori</span>
        <select
          id="transaction-category"
          v-model="form.category"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          required
        >
          <option disabled value="">Pilih kategori</option>
          <option v-for="category in categoryOptions" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </label>

      <label class="block" for="transaction-amount">
        <span class="text-sm font-medium text-ink">Jumlah</span>
        <input
          id="transaction-amount"
          v-model.number="form.amount"
          class="mt-2 w-full rounded-md border border-emerald-900/15 px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          min="1"
          placeholder="Contoh: 25000"
          type="number"
          required
        />
      </label>

      <p v-if="transactionStore.error" class="rounded-md bg-orange-50 px-3 py-2 text-sm text-danger">
        {{ transactionStore.error }}
      </p>

      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <RouterLink class="inline-flex justify-center rounded-md border border-emerald-900/15 px-4 py-3 text-sm font-semibold text-ink hover:border-brand hover:text-brand" to="/transactions">
          Batal
        </RouterLink>
        <button
          class="rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          :disabled="transactionStore.loading"
        >
          {{ transactionStore.loading ? "Menyimpan..." : submitLabel }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useTransactionStore } from "@/stores/transactionStore";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSACTION_TYPES,
} from "@/utils/constants";

const route = useRoute();
const router = useRouter();
const transactionStore = useTransactionStore();
const today = new Date().toISOString().slice(0, 10);
const title = computed(() => (route.name === "transaction-edit" ? "Edit Transaksi" : "Tambah Transaksi"));
const submitLabel = computed(() => (isEdit.value ? "Perbarui Transaksi" : "Simpan Transaksi"));
const isEdit = computed(() => route.name === "transaction-edit");
const form = reactive({
  date: today,
  type: "expense",
  description: "",
  category: "",
  amount: null,
});
const categoryOptions = computed(() => {
  return form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
});

const toDateInputValue = (value) => new Date(value).toISOString().slice(0, 10);

const fillForm = (transaction) => {
  form.date = toDateInputValue(transaction.date);
  form.type = transaction.type;
  form.description = transaction.description;
  form.category = transaction.category;
  form.amount = transaction.amount;
};

const submitForm = async () => {
  const payload = {
    date: form.date,
    type: form.type,
    description: form.description,
    category: form.category,
    amount: form.amount,
  };

  try {
    if (isEdit.value) {
      await transactionStore.updateTransaction(route.params.id, payload);
    } else {
      await transactionStore.createTransaction(payload);
    }

    router.push({ name: "transactions" });
  } catch (error) {
    // Error message is stored in transactionStore for display.
  }
};

onMounted(async () => {
  transactionStore.clearSelectedTransaction();

  if (!isEdit.value) return;

  try {
    const transaction = await transactionStore.fetchTransaction(route.params.id);
    fillForm(transaction);
  } catch (error) {
    // Error message is stored in transactionStore for display.
  }
});
</script>
