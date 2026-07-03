# 11 - Environment Configuration

## Backend .env.example

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sadar_uang
JWT_SECRET=change_this_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
MAIL_FROM="Sadar Uang <no-reply@sadaruang.local>"
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
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
- JWT_SECRET wajib diganti saat production.
- CLIENT_URL digunakan untuk CORS.
- SMTP wajib dikonfigurasi di production agar forgot password benar-benar mengirim email.
- GOOGLE_CLIENT_ID backend dipakai untuk verifikasi credential Google.
- VITE_GOOGLE_CLIENT_ID frontend dipakai untuk menampilkan tombol Google Auth.
- Asset brand PDF berada di `frontend/public/brand`; pastikan tersedia saat backend production generate PDF.

## Local Development Ports

- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- MongoDB: mongodb://127.0.0.1:27017/sadar_uang
