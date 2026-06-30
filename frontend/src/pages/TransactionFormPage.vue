<template>
  <section>
    <h1 class="text-2xl font-bold text-ink">{{ title }}</h1>
    <p class="mt-2 text-sm text-muted">Catat sekarang, biar tidak jadi misteri akhir bulan.</p>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const title = computed(() => (route.name === "transaction-edit" ? "Edit Transaksi" : "Tambah Transaksi"));
</script>
