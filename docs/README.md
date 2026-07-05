# Sadar Uang - Project Documentation

Sadar Uang adalah web app pencatatan cash flow pribadi yang membantu pengguna mencatat uang masuk dan uang keluar secara sederhana, lalu menampilkan kondisi keuangan dalam dashboard yang mudah dipahami.

## Tujuan Utama

Membantu pengguna lebih sadar terhadap kondisi keuangan pribadi melalui pencatatan transaksi harian dan visualisasi arus uang.

## Target Tahap Awal

- Digunakan pribadi terlebih dahulu.
- Tetap menggunakan login dan registrasi.
- Mendukung login Google, reset password, dan pengaturan profil/password.
- Web app responsif untuk desktop dan mobile.
- Belum menggunakan multi-dompet.
- Export laporan PDF bulanan tersedia dengan header brand.
- Admin panel tersedia untuk memantau user dan status akun.
- Belum fokus monetisasi, tetapi disiapkan sebagai produk personal branding.

## Status Hosting

Project sudah mendekati siap hosting, dengan syarat konfigurasi production diisi dengan benar:

- Backend wajib punya `MONGO_URI`, `JWT_SECRET`, dan `CLIENT_URL` production.
- `JWT_SECRET` production minimal 32 karakter dan tidak memakai contoh dari dokumentasi.
- Frontend wajib memakai `VITE_API_BASE_URL` yang mengarah ke URL backend production.
- File `.env` asli tidak boleh di-commit atau dibagikan.
- Artefak generated seperti PDF/PNG laporan tidak boleh masuk repository.
- SMTP Resend perlu dikonfigurasi jika fitur lupa password harus benar-benar mengirim email.

## Tech Stack Rekomendasi

### Frontend
- Vue 3
- Vite
- Tailwind CSS
- Vue Router
- Pinia
- Chart.js
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Google Auth Library
- Nodemailer
- PDFKit

## Brand Assets

Asset brand aplikasi disimpan di:

- `frontend/public/brand/sadar-uang-icon.png`
- `frontend/public/brand/sadar-uang-text.png`

Asset ini dipakai di UI dan header PDF. Saat deploy production, pastikan asset tetap tersedia untuk generator PDF backend.

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
13. `13-DEPLOYMENT-CHECKLIST.md` - Checklist hosting, security, dan go-live

## Prinsip Produk

- Sederhana lebih penting daripada lengkap.
- Input transaksi harus cepat.
- Dashboard harus membantu pengguna memahami uangnya, bukan sekadar menampilkan grafik.
- Gunakan bahasa umum, bukan bahasa akuntansi berat.
- Mobile responsive wajib.
