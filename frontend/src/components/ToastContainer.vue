<template>
  <div
    v-if="toastStore.items.length > 0"
    class="fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
    aria-live="polite"
  >
    <div
      v-for="toast in toastStore.items"
      :key="toast.id"
      class="flex w-full max-w-sm items-start justify-between gap-3 rounded-md border bg-white px-4 py-3 text-sm shadow-lg"
      :class="toast.type === 'error' ? 'border-orange-200 text-danger' : 'border-emerald-200 text-brand'"
      role="status"
    >
      <p class="leading-5">{{ toast.message }}</p>
      <button
        class="rounded-sm px-1 font-bold text-muted hover:text-ink"
        type="button"
        aria-label="Tutup notifikasi"
        @click="toastStore.dismiss(toast.id)"
      >
        x
      </button>
    </div>
  </div>
</template>

<script setup>
import { useToastStore } from "@/stores/toastStore";

const toastStore = useToastStore();
</script>
