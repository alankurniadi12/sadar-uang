# 11 - Environment Configuration

## Backend .env.example

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sadar_uang
JWT_SECRET=replace_with_minimum_32_random_characters
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
MAIL_FROM="Sadar Uang <no-reply@your-domain.com>"
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=
GOOGLE_CLIENT_ID=
```

## Frontend .env.example

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=
```

## Notes

- Jangan commit file `.env` asli.
- Commit hanya `.env.example`.
- Jangan tulis credential asli di dokumentasi, issue tracker, screenshot, atau chat publik.
- `JWT_SECRET` wajib diganti saat production, minimal 32 karakter acak.
- `MONGO_URI` production wajib memakai database production, bukan localhost.
- `CLIENT_URL` digunakan untuk CORS dan wajib sama dengan URL frontend production.
- SMTP wajib dikonfigurasi di production agar forgot password benar-benar mengirim email.
- Untuk Resend SMTP, gunakan `SMTP_HOST=smtp.resend.com`, `SMTP_USER=resend`, dan `SMTP_PASS` berisi Resend API key.
- `MAIL_FROM` wajib memakai domain yang sudah diverifikasi di Resend untuk production.
- GOOGLE_CLIENT_ID backend dipakai untuk verifikasi credential Google.
- VITE_GOOGLE_CLIENT_ID frontend dipakai untuk menampilkan tombol Google Auth.
- Asset brand PDF berada di `frontend/public/brand`; pastikan tersedia saat backend production generate PDF.
- PDF/PNG laporan yang dihasilkan aplikasi tidak boleh di-commit karena bisa berisi data transaksi.

## Local Development Ports

- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- MongoDB: mongodb://127.0.0.1:27017/sadar_uang

## Production Required Variables

Backend:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=<production-mongodb-uri>
JWT_SECRET=<minimum-32-random-characters>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-domain.com
MAIL_FROM="Sadar Uang <no-reply@your-domain.com>"
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=<resend-api-key>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

## Resend Setup

Checklist Resend untuk reset password:

- Buat API key di Resend dan simpan sebagai `SMTP_PASS`.
- Jangan commit atau kirim API key ke chat, docs, screenshot, atau GitHub.
- Verifikasi domain pengirim di Resend.
- Tambahkan DNS record yang diminta Resend di DNS provider domain.
- Gunakan sender sesuai domain verified, misalnya `Sadar Uang <no-reply@your-domain.com>`.
- Untuk testing awal tanpa domain final, gunakan mode/testing sender Resend hanya jika akun dan tujuan email mengizinkan.
- Setelah env berubah di VPS, restart backend lewat PM2.
- Test fitur lupa password dari frontend production dan pastikan email diterima.

Frontend:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

## Production Guard

Saat `NODE_ENV=production`, backend akan gagal start jika:

- `MONGO_URI`, `JWT_SECRET`, atau `CLIENT_URL` kosong.
- `JWT_SECRET` masih memakai contoh atau kurang dari 32 karakter.
- `CLIENT_URL` masih mengarah ke localhost.
- `MONGO_URI` masih mengarah ke localhost.
