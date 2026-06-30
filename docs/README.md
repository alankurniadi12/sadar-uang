# Sadar Uang - Project Documentation

Sadar Uang adalah web app pencatatan cash flow pribadi yang membantu pengguna mencatat uang masuk dan uang keluar secara sederhana, lalu menampilkan kondisi keuangan dalam dashboard yang mudah dipahami.

## Tujuan Utama

Membantu pengguna lebih sadar terhadap kondisi keuangan pribadi melalui pencatatan transaksi harian dan visualisasi arus uang.

## Target Tahap Awal

- Digunakan pribadi terlebih dahulu.
- Tetap menggunakan login dan registrasi.
- Web app responsif untuk desktop dan mobile.
- Belum menggunakan multi-dompet.
- Export laporan PDF bulanan tersedia.
- Belum fokus monetisasi, tetapi disiapkan sebagai produk personal branding.

## Tech Stack Rekomendasi

### Frontend
- Vue 3
- Vite
- Tailwind CSS
- Vue Router
- Pinia
- Chart.js atau ApexCharts
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- PDFKit atau Puppeteer

## Daftar Dokumen

1. `01-PRD.md` - Product Requirements Document
2. `02-MVP-SCOPE.md` - Scope MVP dan batasan fitur
3. `03-USER-FLOW.md` - Alur pengguna
4. `04-DATABASE-SCHEMA.md` - Struktur database MongoDB
5. `05-API-SPEC.md` - Spesifikasi endpoint backend
6. `06-FRONTEND-SPEC.md` - Struktur frontend Vue
7. `07-BACKEND-SPEC.md` - Struktur backend Express
8. `08-UI-COPYWRITING.md` - Copywriting aplikasi
9. `09-ROADMAP.md` - Roadmap development
10. `10-CODEX-INSTRUCTION.md` - Instruksi kerja untuk Codex
11. `11-ENV-CONFIG.md` - Environment variable
12. `12-TESTING-CHECKLIST.md` - Checklist testing

## Prinsip Produk

- Sederhana lebih penting daripada lengkap.
- Input transaksi harus cepat.
- Dashboard harus membantu pengguna memahami uangnya, bukan sekadar menampilkan grafik.
- Gunakan bahasa umum, bukan bahasa akuntansi berat.
- Mobile responsive wajib.
