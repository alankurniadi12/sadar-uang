# 06 - Frontend Specification

Frontend menggunakan Vue 3, Vite, Tailwind CSS, Vue Router, Pinia, Axios, dan library chart.

## Tujuan Frontend

Menyediakan interface yang sederhana, responsif, dan mudah digunakan untuk mencatat transaksi dan melihat dashboard cash flow.

## Struktur Folder Rekomendasi

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── forms/
│   │   └── transactions/
│   ├── layouts/
│   │   ├── AuthLayout.vue
│   │   └── AppLayout.vue
│   ├── pages/
│   │   ├── LandingPage.vue
│   │   ├── LoginPage.vue
│   │   ├── RegisterPage.vue
│   │   ├── DashboardPage.vue
│   │   ├── TransactionsPage.vue
│   │   ├── TransactionFormPage.vue
│   │   ├── ReportsPage.vue
│   │   └── NotFoundPage.vue
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   ├── authStore.js
│   │   ├── transactionStore.js
│   │   └── dashboardStore.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── transactionService.js
│   │   ├── dashboardService.js
│   │   └── reportService.js
│   ├── utils/
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   └── constants.js
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js
```

## Pages

### LandingPage.vue

Isi:
- Hero section
- Problem section
- Solution section
- Feature section
- CTA

CTA utama:
- Mulai Catat Sekarang

### LoginPage.vue

Field:
- Email
- Password

Action:
- Login
- Redirect ke dashboard jika berhasil

### RegisterPage.vue

Field:
- Nama
- Email
- Password

Action:
- Register
- Redirect ke dashboard jika berhasil

### DashboardPage.vue

Komponen:
- SummaryCards
- DailyChart
- MonthlyChart
- CategoryChart
- RecentTransactions

### TransactionsPage.vue

Komponen:
- Filter bar
- Search input
- Transaction list/table
- Pagination
- Button tambah transaksi

### TransactionFormPage.vue

Digunakan untuk tambah dan edit transaksi.

Field:
- date
- type
- description
- category
- amount

### ReportsPage.vue

Field:
- Bulan
- Tahun

Action:
- Preview laporan
- Download PDF

## Components

### Common

- Button
- Input
- Select
- Card
- Modal
- LoadingSpinner
- EmptyState
- ErrorMessage

### Dashboard

- SummaryCard
- SummaryCards
- DailyChart
- MonthlyChart
- CategoryChart
- RecentTransactions

### Transactions

- TransactionItem
- TransactionTable
- TransactionFilter
- TransactionSearch
- TransactionForm

## State Management

### authStore

State:
- user
- token
- isAuthenticated
- loading
- error

Actions:
- register
- login
- logout
- fetchMe

### transactionStore

State:
- transactions
- selectedTransaction
- pagination
- loading
- error
- filters

Actions:
- fetchTransactions
- createTransaction
- updateTransaction
- deleteTransaction
- setFilters
- resetFilters

### dashboardStore

State:
- summary
- dailyData
- monthlyData
- categoryData
- recentTransactions
- loading
- error

Actions:
- fetchSummary
- fetchDailyData
- fetchMonthlyData
- fetchCategoryData
- fetchDashboard

## Route List

```text
/                 Landing Page
/login            Login Page
/register         Register Page
/dashboard        Dashboard Page
/transactions     Transactions Page
/transactions/new Add Transaction Page
/transactions/:id/edit Edit Transaction Page
/reports          Reports Page
/:pathMatch(.*)*  Not Found Page
```

## Protected Routes

Protected:
- /dashboard
- /transactions
- /transactions/new
- /transactions/:id/edit
- /reports

Public:
- /
- /login
- /register

## UI Rules

- Gunakan bahasa Indonesia.
- Format rupiah: Rp25.000
- Format tanggal: Selasa, 30 Jun 2026
- Mobile-first responsive.
- Form transaksi harus pendek.
- Tombol tambah transaksi harus mudah ditemukan.
- Jangan tampilkan terlalu banyak grafik di satu layar mobile.

## Suggested Chart Types

- Daily chart: Line chart atau bar chart.
- Monthly chart: Line chart.
- Category chart: Donut chart atau bar chart.

## Error State

Contoh pesan:

- "Email atau password belum sesuai."
- "Transaksi gagal disimpan. Coba lagi sebentar."
- "Data belum bisa dimuat. Periksa koneksi internetmu."

## Empty State

Dashboard tanpa transaksi:

> Belum ada transaksi. Catat transaksi pertamamu hari ini dan mulai lihat ke mana uangmu pergi.

Transactions page kosong:

> Belum ada catatan uang. Mulai dari satu transaksi kecil dulu.
