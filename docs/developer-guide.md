# Developer Guide Sadar Uang

Dokumen ini dibuat untuk siapa pun yang baru masuk ke project Sadar Uang, dengan asumsi sudah pernah menulis kode dasar. Bahasanya sengaja dibuat ringan supaya pembaca bisa memahami gambaran project tanpa harus langsung membaca semua file satu per satu.

Tujuan dokumen ini bukan menjelaskan detail setiap baris kode. Tujuannya adalah memberi gambaran: project ini apa, teknologinya apa, cara menjalankannya bagaimana, bagian pentingnya di mana, dan apa saja yang harus dijaga saat maintenance.

## 1. Project Ini Apa?

Sadar Uang adalah web app untuk mencatat cash flow pribadi. Pengguna bisa mencatat uang masuk dan uang keluar, melihat ringkasan keuangan di dashboard, mengelola transaksi, mengunduh laporan PDF, login dengan email/password atau Google, reset password lewat email, dan ada admin panel untuk memantau user.

Secara sederhana:

- User membuka website Sadar Uang.
- User register atau login.
- User mencatat transaksi pemasukan/pengeluaran.
- Dashboard menampilkan kondisi keuangan.
- User bisa download laporan PDF bulanan.
- Admin bisa melihat data user dan status akun.

Project ini dibuat sebagai aplikasi full-stack:

- Frontend: tampilan website yang dilihat user.
- Backend: API, authentication, database logic, PDF, email reset password.
- Database: tempat menyimpan user dan transaksi.
- Deployment: frontend dan backend dipublish di tempat yang berbeda.

## 2. Gambaran Stack Production

Stack production yang dipakai:

| Bagian | Teknologi/Layanan | Fungsi |
| --- | --- | --- |
| Frontend | Vue 3 + Vite | Membuat tampilan website |
| Styling | Tailwind CSS | Membuat UI responsive |
| State management | Pinia | Menyimpan state user, transaksi, dashboard |
| Routing | Vue Router | Mengatur halaman frontend |
| HTTP client | Axios | Mengirim request dari frontend ke backend |
| Backend | Node.js + Express.js | Menyediakan REST API |
| Database ORM | Mongoose | Menghubungkan backend ke MongoDB |
| Database production | MongoDB Atlas Cluster | Menyimpan data user dan transaksi |
| Auth | JWT + bcrypt | Login, session token, hash password |
| Google login | Google Auth Library | Verifikasi login Google |
| Email reset password | Resend SMTP via Nodemailer | Mengirim email lupa password |
| PDF report | PDFKit | Generate laporan PDF |
| Frontend hosting | Vercel | Hosting web frontend |
| Backend hosting | VPS | Menjalankan API backend |
| Reverse proxy | Nginx | Menghubungkan domain API ke backend Node |
| Process manager | PM2 | Menjaga backend tetap hidup |
| API domain | `https://api.sadaruang.com` | Domain backend production |

## 3. Struktur Project

Struktur besar repository:

```text
sadar-uang/
├── backend/
├── frontend/
├── docs/
└── README.md
```

### Backend

Folder `backend/` berisi API server.

```text
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── validators/
├── .env.example
└── package.json
```

Penjelasan singkat:

- `src/server.js`: titik start backend.
- `src/app.js`: setup Express, CORS, middleware, dan route API.
- `src/config/`: konfigurasi environment dan koneksi database.
- `src/routes/`: daftar endpoint API.
- `src/controllers/`: menerima request dan mengirim response.
- `src/services/`: logic utama aplikasi.
- `src/models/`: schema MongoDB, misalnya User dan Transaction.
- `src/middlewares/`: auth, error handler, not found handler.
- `src/utils/`: helper umum seperti format tanggal, token, PDF.
- `src/validators/`: validasi input request.

Route backend utama:

- `/api/health`: cek backend hidup atau tidak.
- `/api/auth`: register, login, Google login, forgot password, reset password.
- `/api/transactions`: CRUD transaksi.
- `/api/dashboard`: ringkasan dashboard.
- `/api/reports`: laporan PDF.
- `/api/admin`: fitur admin.

### Frontend

Folder `frontend/` berisi aplikasi Vue.

```text
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── router/
│   ├── services/
│   ├── stores/
│   ├── utils/
│   ├── App.vue
│   └── main.js
├── public/
├── .env.example
├── vercel.json
└── package.json
```

Penjelasan singkat:

- `src/main.js`: titik start aplikasi Vue.
- `src/App.vue`: root component.
- `src/router/index.js`: daftar halaman dan proteksi route.
- `src/pages/`: halaman utama seperti dashboard, login, transaksi, laporan.
- `src/layouts/`: layout untuk halaman auth dan halaman aplikasi.
- `src/components/`: komponen kecil yang dipakai ulang.
- `src/services/`: fungsi untuk memanggil backend API.
- `src/stores/`: state management Pinia.
- `src/utils/`: helper frontend.
- `public/brand/`: asset brand untuk logo/icon.
- `vercel.json`: konfigurasi SPA routing di Vercel.

Halaman frontend utama:

- `/`: landing page.
- `/login`: login.
- `/register`: register.
- `/forgot-password`: request reset password.
- `/reset-password`: ubah password dari link email.
- `/dashboard`: dashboard setelah login.
- `/transactions`: daftar transaksi.
- `/transactions/new`: tambah transaksi.
- `/transactions/:id/edit`: edit transaksi.
- `/reports`: laporan.
- `/settings`: pengaturan profil.
- `/admin`: admin panel, hanya untuk user role admin.

## 4. Yang Perlu Disiapkan Sebelum Clone

Minimal yang perlu ada di laptop:

- Git.
- Node.js LTS.
- npm.
- MongoDB lokal, atau akses ke MongoDB Atlas khusus development.
- Code editor, misalnya VS Code.
- Terminal yang nyaman dipakai.

Kalau mau menjalankan fitur email reset password, butuh:

- Akun Resend.
- Domain pengirim yang sudah diverifikasi di Resend.
- API key Resend.

Kalau mau menjalankan Google login, butuh:

- Google OAuth Client ID.
- Domain/origin frontend yang sudah didaftarkan di Google Cloud Console.

## 5. Cara Clone dan Jalankan Lokal

Clone repository:

```bash
git clone <url-repository>
cd sadar-uang
```

Setup backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Default backend lokal:

```text
http://localhost:5000
```

Endpoint health check:

```text
http://localhost:5000/api/health
```

Setup frontend di terminal lain:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Default frontend lokal:

```text
http://localhost:5173
```

Saat development lokal, biasanya flow-nya:

- Backend jalan di `localhost:5000`.
- Frontend jalan di `localhost:5173`.
- Frontend memanggil backend lewat `VITE_API_BASE_URL=http://localhost:5000/api`.
- Backend mengizinkan request frontend lewat `CLIENT_URL=http://localhost:5173`.

## 6. Environment Variable

File `.env` asli tidak boleh masuk Git. Yang boleh masuk Git hanya `.env.example`.

### Backend `.env`

Contoh lokal:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sadar_uang
JWT_SECRET=replace_with_minimum_32_random_characters
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLIENT_URLS=
GOOGLE_CLIENT_ID=
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=
MAIL_FROM="Sadar Uang <no-reply@your-domain.com>"
```

Yang penting dipahami:

- `MONGO_URI`: alamat database MongoDB.
- `JWT_SECRET`: secret untuk token login. Production wajib kuat dan rahasia.
- `CLIENT_URL`: URL frontend utama, dipakai untuk CORS dan link reset password.
- `CLIENT_URLS`: tambahan origin frontend, misalnya domain `www`.
- `GOOGLE_CLIENT_ID`: dipakai backend untuk verifikasi Google login.
- `SMTP_*`: dipakai untuk kirim email reset password lewat Resend.
- `MAIL_FROM`: alamat pengirim email, harus sesuai domain yang sudah verified di Resend.

### Frontend `.env`

Contoh lokal:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=
```

Yang penting dipahami:

- `VITE_API_BASE_URL`: alamat API backend.
- `VITE_GOOGLE_CLIENT_ID`: client ID Google untuk tombol Google login.

## 7. Alur Kerja Development

Urutan kerja yang disarankan:

1. Baca `README.md`.
2. Baca dokumen ini.
3. Jalankan backend lokal.
4. Jalankan frontend lokal.
5. Test register dan login.
6. Tambah beberapa transaksi dummy.
7. Cek dashboard dan laporan.
8. Baru mulai pegang task kecil.

Kalau ingin menambah fitur, urutan berpikirnya:

1. Tentukan fiturnya muncul di halaman mana.
2. Cek apakah frontend butuh halaman, komponen, service, atau store baru.
3. Cek apakah backend butuh route, controller, service, model, atau validator baru.
4. Cek apakah database schema perlu berubah.
5. Cek apakah env perlu ditambah.
6. Test lokal.
7. Build frontend.
8. Test smoke flow utama.


## 8. Cek Sebelum Publish

Sebelum publish atau merge perubahan, minimal cek:

- Backend bisa start tanpa error.
- Endpoint `/api/health` berhasil.
- Frontend bisa build.
- Login masih jalan.
- Tambah/edit/hapus transaksi masih jalan.
- Dashboard masih tampil.
- Download PDF masih jalan.
- Admin route masih terlindungi.
- Tidak ada `.env` asli atau credential yang ikut commit.

## 9. Gambaran Publish Production

Production project ini dibagi menjadi beberapa bagian:

- Database ada di MongoDB Atlas.
- Backend jalan di VPS.
- Frontend jalan di Vercel.
- Reset password pakai Resend SMTP.
- API production memakai domain `https://api.sadaruang.com`.

### 9.1 Database MongoDB Atlas

MongoDB Atlas dipakai sebagai database production.

Yang perlu disiapkan:

- Project/cluster MongoDB Atlas.
- Database user khusus aplikasi.
- Connection string `MONGO_URI`.
- Network Access yang mengizinkan VPS mengakses database.

Catatan penting:

- Jangan pakai database lokal untuk production.
- Jangan tulis `MONGO_URI` asli di dokumentasi, Git, screenshot, atau chat publik.
- Kalau IP VPS stabil, batasi akses Atlas hanya dari IP VPS.

### 9.2 Backend di VPS

Backend Express dijalankan di VPS, biasanya dengan:

- Node.js LTS.
- PM2 untuk menjaga proses backend tetap hidup.
- Nginx sebagai reverse proxy.
- SSL/HTTPS untuk domain API.

Gambaran alurnya:

```text
User/Frontend -> https://api.sadaruang.com -> Nginx -> Node.js backend -> MongoDB Atlas
```

Env backend production minimal:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=<mongodb-atlas-uri>
JWT_SECRET=<minimum-32-random-characters>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://sadaruang.com
CLIENT_URLS=https://www.sadaruang.com
```

Env backend untuk email dan Google:

```env
GOOGLE_CLIENT_ID=<google-oauth-client-id>
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=<resend-api-key>
MAIL_FROM="Sadar Uang <no-reply@sadaruang.com>"
```

Production guard di backend akan menolak start kalau:

- `MONGO_URI`, `JWT_SECRET`, atau `CLIENT_URL` kosong.
- `JWT_SECRET` terlalu pendek atau masih contoh.
- `CLIENT_URL` masih localhost.
- `CLIENT_URLS` berisi localhost.
- `MONGO_URI` masih mengarah ke localhost.

Ini bagus, karena mencegah backend production jalan dengan konfigurasi berbahaya.

### 9.3 Frontend di Vercel

Frontend Vue dipublish ke Vercel.

Konfigurasi utama:

- Root directory: `frontend`.
- Build command: `npm run build`.
- Output directory: `dist`.
- Environment variable:

```env
VITE_API_BASE_URL=https://api.sadaruang.com/api
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

File `frontend/vercel.json` dipakai agar routing SPA tetap jalan saat user refresh halaman seperti `/dashboard` atau `/transactions`.

### 9.4 Reset Password dengan Resend

Reset password dikirim lewat email menggunakan Nodemailer dengan SMTP Resend.

Yang harus benar:

- Domain pengirim sudah diverifikasi di Resend.
- DNS record dari Resend sudah dipasang.
- `SMTP_PASS` berisi API key Resend.
- `MAIL_FROM` memakai domain yang sudah verified.
- `CLIENT_URL` backend mengarah ke domain frontend production, supaya link reset password tidak mengarah ke localhost.

## 10. Akun Admin

User biasa tidak otomatis menjadi admin. Untuk menjadikan user sebagai admin, jalankan script backend:

```bash
cd backend
npm run make:admin -- email@domain.com
```

Biasanya alurnya:

1. Register user lewat frontend production.
2. Masuk ke VPS.
3. Jalankan script `make:admin`.
4. Login ulang.
5. Buka `/admin`.

## 11. Maintenance Rutin

Yang perlu dicek secara berkala:

- Backend masih hidup di PM2.
- Log backend tidak berisi error berulang.
- VPS tidak kehabisan CPU, RAM, atau storage.
- MongoDB Atlas masih aktif dan backup aman.
- Vercel deploy terakhir berhasil.
- Domain dan SSL masih aktif.
- Email reset password masih terkirim.
- Tidak ada credential bocor di repository.
- Dependency tidak terlalu lama ditinggal tanpa update.

Command umum di VPS biasanya:

```bash
pm2 status
pm2 logs
pm2 restart <nama-app>
```

Untuk rollback:

- Backend: kembali ke commit stabil, install dependency jika perlu, lalu restart PM2.
- Frontend: gunakan fitur rollback deployment di Vercel.
- Database: hati-hati. Jangan ubah data production tanpa backup.

## 12. Hal yang Tidak Boleh Dilakukan

Ini penting untuk developer:

- Jangan commit file `.env`.
- Jangan share password, token, API key, atau connection string asli.
- Jangan pakai database production untuk coba-coba fitur.
- Jangan hapus data production tanpa backup dan persetujuan.
- Jangan expose port backend Node.js langsung ke publik.
- Jangan menaruh generated PDF/PNG laporan ke Git.
- Jangan mengganti env production tanpa mencatat perubahan.
- Jangan deploy kalau build lokal saja belum lolos.

## 13. Dokumen Lanjutan

Kalau butuh detail lebih dalam, baca dokumen ini:

- `docs/01-PRD.md`: gambaran produk.
- `docs/04-DATABASE-SCHEMA.md`: struktur database.
- `docs/05-API-SPEC.md`: daftar endpoint API.
- `docs/06-FRONTEND-SPEC.md`: struktur frontend.
- `docs/07-BACKEND-SPEC.md`: struktur backend.
- `docs/11-ENV-CONFIG.md`: daftar environment variable.
- `docs/12-TESTING-CHECKLIST.md`: checklist testing.
- `docs/13-DEPLOYMENT-CHECKLIST.md`: checklist deployment production.

## 14. Checklist Onboarding Developer

Checklist pertama yang harus diselesaikan:

- [ ] Bisa clone repository.
- [ ] Bisa install dependency backend.
- [ ] Bisa install dependency frontend.
- [ ] Bisa membuat `.env` lokal dari `.env.example`.
- [ ] Backend lokal bisa jalan.
- [ ] Frontend lokal bisa jalan.
- [ ] Bisa register user lokal.
- [ ] Bisa login.
- [ ] Bisa tambah transaksi.
- [ ] Bisa melihat dashboard.
- [ ] Bisa membaca struktur folder backend.
- [ ] Bisa membaca struktur folder frontend.
- [ ] Paham bahwa secret tidak boleh masuk Git.
- [ ] Paham alur production: Vercel, VPS, MongoDB Atlas, Resend.

Kalau checklist ini sudah selesai, pembaca sudah cukup siap untuk mengerjakan task kecil seperti memperbaiki UI, menambah validasi, memperbaiki copywriting, atau membantu testing.
