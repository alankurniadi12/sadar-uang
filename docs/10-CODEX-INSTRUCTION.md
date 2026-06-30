# 10 - Codex Instruction

Gunakan instruksi ini saat memulai development di Codex.

## Role

Kamu adalah senior fullstack developer yang membantu membangun web app bernama Sadar Uang.

Sadar Uang adalah web app pencatatan cash flow pribadi untuk mencatat pemasukan dan pengeluaran, menampilkan dashboard harian/bulanan/tahunan, dan export laporan PDF bulanan.

## Tech Stack

Frontend:

- Vue 3
- Vite
- Tailwind CSS
- Vue Router
- Pinia
- Axios
- Chart.js atau ApexCharts

Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- PDFKit atau Puppeteer

## Important Rules

1. Jangan membuat fitur di luar MVP tanpa diminta.
2. Ikuti dokumen PRD dan MVP scope.
3. Gunakan struktur folder yang rapi.
4. Pisahkan controller, service, model, routes, middleware, dan utils.
5. Gunakan validasi input.
6. Gunakan error handler global.
7. Gunakan response format konsisten.
8. Jangan simpan password plain text.
9. Semua transaksi harus terkait dengan user login.
10. User tidak boleh mengakses transaksi user lain.
11. Gunakan bahasa Indonesia pada UI.
12. Tampilan harus responsif desktop dan mobile.
13. Form transaksi harus sederhana.
14. Dashboard tidak boleh terlalu ramai.
15. Gunakan format Rupiah.

## Development Order

Kerjakan secara bertahap:

1. Setup backend Express.
2. Setup MongoDB dan Mongoose.
3. Buat model User dan Transaction.
4. Buat auth register/login/me.
5. Buat middleware auth JWT.
6. Buat CRUD transaction.
7. Buat dashboard endpoints.
8. Buat report PDF endpoint.
9. Setup frontend Vue.
10. Buat auth pages.
11. Buat dashboard page.
12. Buat transaction pages.
13. Buat report page.
14. Polish responsive UI.
15. Testing.

## Response Format for API

Success:

```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Pesan error"
}
```

## MVP Features

Wajib ada:

- Register
- Login
- Logout
- Protected route
- Tambah transaksi
- Lihat transaksi
- Edit transaksi
- Hapus transaksi
- Filter transaksi
- Search transaksi
- Dashboard summary
- Grafik harian
- Grafik bulanan
- Grafik kategori
- Export PDF laporan bulanan

Tidak dikerjakan dulu:

- Multi-dompet
- Budget
- Hutang/piutang
- AI insight
- Reminder
- Payment/subscription
- Integrasi bank
- Android/iOS app

## UI Copywriting

Gunakan brand voice sederhana dan ramah.

Contoh:

- Biar Uang Tidak Hilang Tanpa Jejak.
- Mulai Catat Sekarang.
- Uang Masuk.
- Uang Keluar.
- Sisa Uang.
- Pengeluaran Terbesar.
- Catat sekarang, biar tidak jadi misteri akhir bulan.

## First Task Recommendation

Mulai dari membuat struktur monorepo:

```text
sadar-uang/
├── backend/
├── frontend/
└── docs/
```

Kemudian setup backend Express terlebih dahulu sampai health check endpoint berjalan.

Health check:

```text
GET /api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Sadar Uang API is running"
}
```
