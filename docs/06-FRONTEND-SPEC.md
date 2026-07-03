# 06 - Frontend Specification

Frontend menggunakan Vue 3, Vite, Tailwind CSS, Vue Router, Pinia, Axios, dan Chart.js.

## Tujuan Frontend

Menyediakan interface yang sederhana, responsif, dan mudah digunakan untuk mencatat transaksi dan melihat dashboard cash flow.

## Struktur Folder Rekomendasi

```text
frontend/
├── public/
│   └── brand/
│       ├── sadar-uang-icon.png
│       └── sadar-uang-text.png
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
│   │   ├── ForgotPasswordPage.vue
│   │   ├── ResetPasswordPage.vue
│   │   ├── DashboardPage.vue
│   │   ├── TransactionsPage.vue
│   │   ├── TransactionFormPage.vue
│   │   ├── ReportsPage.vue
│   │   ├── ProfileSettingsPage.vue
│   │   ├── AdminPage.vue
│   │   └── NotFoundPage.vue
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   ├── authStore.js
│   │   ├── transactionStore.js
│   │   ├── dashboardStore.js
│   │   ├── adminStore.js
│   │   └── toastStore.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── transactionService.js
│   │   ├── dashboardService.js
│   │   ├── reportService.js
│   │   └── adminService.js
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
- Password dengan tombol Lihat/Sembunyikan

Action:
- Login
- Login Google jika `VITE_GOOGLE_CLIENT_ID` tersedia
- Redirect ke dashboard jika berhasil

### RegisterPage.vue

Field:
- Nama
- Email
- Password dengan tombol Lihat/Sembunyikan

Action:
- Register
- Register/Login Google jika `VITE_GOOGLE_CLIENT_ID` tersedia
- Redirect ke dashboard jika berhasil

### ForgotPasswordPage.vue

Field:
- Email

Action:
- Kirim permintaan reset password
- Pada development, tampilkan link reset jika backend mengembalikan `resetUrl`

### ResetPasswordPage.vue

Field:
- Password baru dengan tombol Lihat/Sembunyikan
- Konfirmasi password dengan tombol Lihat/Sembunyikan

Action:
- Reset password memakai token dari query string

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

### ProfileSettingsPage.vue

Komponen:
- Ringkasan profil user
- Form update nama
- Form update/buat password dengan tombol Lihat/Sembunyikan

### AdminPage.vue

Komponen:
- Summary cards admin
- Filter user berdasarkan search, status, role
- Sort user berdasarkan nama atau aktivitas
- Tabel user dengan pagination
- Panel detail user
- Toggle status aktif/nonaktif

## Components

### Common

- Button
- Input
- PasswordInput
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
- loginWithGoogle
- forgotPassword
- resetPassword
- logout
- fetchMe
- updateProfile
- updatePassword

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

### adminStore

State:
- summary
- users
- selectedUser
- pagination
- filters
- loading
- error

Actions:
- fetchSummary
- fetchUsers
- fetchUser
- updateUserStatus

### toastStore

State:
- toasts

Actions:
- success
- error
- remove

## Route List

```text
/                 Landing Page
/login            Login Page
/register         Register Page
/forgot-password  Forgot Password Page
/reset-password   Reset Password Page
/dashboard        Dashboard Page
/transactions     Transactions Page
/transactions/new Add Transaction Page
/transactions/:id/edit Edit Transaction Page
/reports          Reports Page
/settings         Profile Settings Page
/admin            Admin Page
/:pathMatch(.*)*  Not Found Page
```

## Protected Routes

Protected:
- /dashboard
- /transactions
- /transactions/new
- /transactions/:id/edit
- /reports
- /settings
- /admin

Public:
- /
- /login
- /register
- /forgot-password
- /reset-password

Admin only:
- /admin

## UI Rules

- Gunakan bahasa Indonesia.
- Format rupiah: Rp25.000
- Format tanggal: Selasa, 30 Jun 2026
- Mobile-first responsive.
- Form transaksi harus pendek.
- Tombol tambah transaksi harus mudah ditemukan.
- Jangan tampilkan terlalu banyak grafik di satu layar mobile.
- Header app di mobile memakai tombol menu dan menu vertikal.
- Semua field password memakai kontrol Lihat/Sembunyikan.
- Tombol utama, filter, dan pagination harus tetap nyaman disentuh di mobile.
- Asset brand memakai file PNG di `frontend/public/brand`.

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
