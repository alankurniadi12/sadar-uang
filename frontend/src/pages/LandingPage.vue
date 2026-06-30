<template>
  <main class="min-h-screen bg-white">
    <section class="mx-auto grid min-h-screen max-w-6xl content-center gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <p class="mb-4 text-sm font-semibold uppercase tracking-wide text-brand">
          Sadar Uang
        </p>
        <h1 class="max-w-2xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Biar Uang Tidak Hilang Tanpa Jejak.
        </h1>
        <p class="mt-5 max-w-xl text-base leading-7 text-muted">
          Catat pemasukan dan pengeluaran harianmu, lalu lihat ke mana uangmu pergi lewat dashboard yang simpel dan mudah dipahami.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink class="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800" to="/register">
            Mulai Catat Sekarang
          </RouterLink>
          <RouterLink class="rounded-md border border-emerald-900/15 px-5 py-3 text-sm font-semibold text-ink hover:border-brand hover:text-brand" to="/login">
            Masuk
          </RouterLink>
        </div>
      </div>

      <div class="rounded-lg border border-emerald-900/10 bg-surface p-5 shadow-sm">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <p class="text-sm text-muted">Ringkasan bulan ini</p>
            <p class="text-2xl font-bold text-ink">Rp1.500.000</p>
          </div>
          <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-brand">
            Positif
          </span>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between rounded-md bg-white p-3">
            <span class="text-sm text-muted">Uang Masuk</span>
            <span class="font-semibold text-brand">Rp5.000.000</span>
          </div>
          <div class="flex items-center justify-between rounded-md bg-white p-3">
            <span class="text-sm text-muted">Uang Keluar</span>
            <span class="font-semibold text-danger">Rp3.500.000</span>
          </div>
          <div class="flex items-center justify-between rounded-md bg-white p-3">
            <span class="text-sm text-muted">Pengeluaran Terbesar</span>
            <span class="font-semibold text-ink">Makan/Minum</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
