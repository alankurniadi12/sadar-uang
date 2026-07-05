# 13 - Deployment Checklist

Stack production yang dipakai:

- Database: MongoDB Atlas
- Backend: VPS Hosting
- Frontend: Vercel

Gunakan checklist ini sebagai urutan kerja bertahap. Jangan lanjut ke tahap berikutnya kalau tahap sebelumnya belum lolos.

## Tahap 0 - Audit Repository

- [ ] `frontend` berhasil build dengan `npm run build`.
- [ ] Backend berhasil start lokal dengan `npm start`.
- [ ] Endpoint lokal `/api/health` bisa diakses.
- [ ] File `.env` asli tidak masuk Git.
- [ ] Folder `tmp/`, `output/`, `dist/`, `build/`, dan `node_modules/` tidak masuk Git.
- [ ] PDF/PNG laporan generated tidak masuk Git.
- [ ] Tidak ada credential asli di docs, source code, commit message, issue, atau screenshot.

Output tahap ini:

- Repository aman untuk di-push.
- Build lokal sudah terbukti jalan.

## Tahap 1 - MongoDB Atlas

- [ ] Buat project MongoDB Atlas untuk Sadar Uang.
- [ ] Buat cluster production.
- [ ] Buat database user khusus aplikasi, bukan user personal.
- [ ] Gunakan password database yang kuat dan simpan di password manager.
- [ ] Set Network Access sesuai kebutuhan VPS.
- [ ] Ambil connection string `MONGO_URI`.
- [ ] Pastikan nama database jelas, misalnya `sadar_uang_prod`.
- [ ] Jangan masukkan `MONGO_URI` ke Git, docs publik, atau screenshot.

Catatan:

- Untuk awal, Atlas Network Access bisa dibuka sementara sesuai kebutuhan deploy, tetapi target akhirnya batasi ke IP VPS.
- Jangan memakai database lokal untuk production.

Output tahap ini:

- `MONGO_URI` production siap dipakai backend.

## Tahap 2 - Persiapan VPS

- [ ] Pilih VPS provider dan region.
- [ ] Pakai Ubuntu LTS.
- [ ] Buat SSH key login.
- [ ] Disable password login SSH jika memungkinkan.
- [ ] Update package server.
- [ ] Buat user non-root untuk deploy.
- [ ] Install Node.js LTS.
- [ ] Install Git.
- [ ] Install process manager, direkomendasikan PM2.
- [ ] Install Nginx sebagai reverse proxy.
- [ ] Aktifkan firewall.
- [ ] Buka port `22`, `80`, dan `443`.
- [ ] Jangan expose port backend Node.js langsung ke publik.

Output tahap ini:

- VPS siap menjalankan backend lewat Nginx + PM2.

## Tahap 3 - Deploy Backend ke VPS

- [ ] Clone repository ke VPS.
- [ ] Masuk ke folder `backend`.
- [ ] Jalankan `npm install --omit=dev`.
- [ ] Buat file `.env` production di server, bukan di Git.
- [ ] Isi env backend production.
- [ ] Jalankan backend dengan PM2.
- [ ] Pastikan PM2 auto-start setelah reboot.
- [ ] Konfigurasi Nginx reverse proxy dari domain/subdomain API ke port backend.
- [ ] Pasang SSL HTTPS.
- [ ] Test `https://api-domain.com/api/health`.

Backend env wajib:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=<mongodb-atlas-uri>
JWT_SECRET=<minimum-32-random-characters>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-domain.com
```

Backend env opsional tapi direkomendasikan:

```env
GOOGLE_CLIENT_ID=<google-oauth-client-id>
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=<resend-api-key>
MAIL_FROM="Sadar Uang <no-reply@your-domain.com>"
```

Output tahap ini:

- Backend production hidup di HTTPS.
- `/api/health` berhasil.
- Backend berhasil konek ke MongoDB Atlas.

## Tahap 4 - Deploy Frontend ke Vercel

- [ ] Import repository ke Vercel.
- [ ] Set root directory ke `frontend`.
- [ ] Build command: `npm run build`.
- [ ] Output directory: `dist`.
- [ ] Isi environment variable frontend.
- [ ] Deploy frontend.
- [ ] Test halaman utama frontend.
- [ ] Test request frontend ke backend.

Frontend env wajib:

```env
VITE_API_BASE_URL=https://api-domain.com/api
```

Frontend env opsional:

```env
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

Output tahap ini:

- Frontend production hidup di Vercel.
- Frontend bisa memanggil backend production.

## Tahap 5 - Domain, CORS, dan Integrasi

- [ ] Tentukan domain frontend, misalnya `https://sadaruang.com`.
- [ ] Tentukan domain API, misalnya `https://api.sadaruang.com`.
- [ ] Update `CLIENT_URL` backend agar sama persis dengan URL frontend production.
- [ ] Redeploy/restart backend setelah `CLIENT_URL` berubah.
- [ ] Update `VITE_API_BASE_URL` frontend jika domain API berubah.
- [ ] Redeploy frontend setelah env frontend berubah.
- [ ] Jika Google login aktif, tambahkan domain frontend ke OAuth allowed origins.
- [ ] Jika forgot password aktif, pastikan Resend SMTP sudah benar dan email terkirim.

Output tahap ini:

- CORS tidak error.
- Google login dan reset password siap dites di production.

## Tahap 5.5 - Resend Email Reset

- [ ] Verifikasi domain pengirim di Resend.
- [ ] Tambahkan DNS record Resend di DNS provider domain.
- [ ] Tunggu status domain Resend menjadi verified.
- [ ] Buat Resend API key khusus production.
- [ ] Simpan API key di password manager.
- [ ] Isi env backend di VPS:

```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=<resend-api-key>
MAIL_FROM="Sadar Uang <no-reply@your-domain.com>"
```

- [ ] Restart backend dengan PM2.
- [ ] Request reset password dari frontend production.
- [ ] Pastikan email masuk ke inbox.
- [ ] Pastikan link reset mengarah ke domain frontend production.

Output tahap ini:

- Email reset password production terkirim lewat Resend.
- Link reset password memakai domain frontend yang benar.

## Tahap 6 - Admin Production

- [ ] Register akun owner/admin lewat frontend production.
- [ ] Jalankan script backend di VPS untuk mengubah role akun menjadi admin.
- [ ] Login ulang sebagai admin.
- [ ] Pastikan halaman admin bisa dibuka.
- [ ] Pastikan user biasa tidak bisa membuka route admin.

Command:

```bash
npm run make:admin -- email@domain.com
```

Output tahap ini:

- Akun admin production siap.
- Akses admin tidak terbuka untuk user biasa.

## Tahap 7 - Go-Live Smoke Test

- [ ] Register user baru.
- [ ] Login email/password.
- [ ] Login Google jika diaktifkan.
- [ ] Request reset password dan pastikan email diterima.
- [ ] Reset password dari link email.
- [ ] Tambah transaksi pemasukan.
- [ ] Tambah transaksi pengeluaran.
- [ ] Edit transaksi.
- [ ] Hapus transaksi.
- [ ] Cek dashboard.
- [ ] Download PDF laporan.
- [ ] Login admin dan cek daftar user.
- [ ] Cek tampilan mobile.

Output tahap ini:

- Aplikasi siap dipakai terbatas.

## Tahap 8 - Security Final

- [ ] Pastikan `JWT_SECRET` production tidak sama dengan lokal.
- [ ] Pastikan `.env` hanya ada di server/Vercel env, bukan repository.
- [ ] Pastikan log production tidak menampilkan token, password, reset link, atau credential.
- [ ] Batasi MongoDB Atlas Network Access ke IP VPS jika IP VPS stabil.
- [ ] Pastikan Nginx hanya expose HTTP/HTTPS publik.
- [ ] Pastikan backend Node.js port tidak terbuka langsung.
- [ ] Pastikan HTTPS aktif untuk frontend dan API.
- [ ] Simpan credential di password manager.

Output tahap ini:

- Risiko kebocoran data jauh lebih rendah.

## Tahap 9 - Rollback dan Maintenance

- [ ] Simpan commit hash terakhir yang stabil.
- [ ] Catat env production yang dipakai tanpa menulis secret value.
- [ ] Siapkan cara restart backend lewat PM2.
- [ ] Siapkan cara rollback deploy Vercel.
- [ ] Aktifkan backup MongoDB Atlas.
- [ ] Cek storage, CPU, RAM, dan log VPS secara berkala.

Output tahap ini:

- Kalau deploy bermasalah, aplikasi bisa dipulihkan lebih cepat.
