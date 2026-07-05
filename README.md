# Sadar Uang

Sadar Uang adalah web app pencatatan cash flow pribadi dengan dashboard, manajemen transaksi, laporan PDF bulanan, login email/password, Google login, reset password, dan admin panel.

## Struktur Project

- `frontend/` - Vue 3, Vite, Tailwind CSS, Pinia, Vue Router.
- `backend/` - Node.js, Express.js, MongoDB, JWT, Nodemailer, PDFKit.
- `docs/` - PRD, spesifikasi teknis, environment config, testing, dan deployment checklist.

## Quick Start Lokal

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Dokumentasi

Mulai dari `docs/README.md`.

Dokumen penting sebelum hosting:

- `docs/11-ENV-CONFIG.md`
- `docs/12-TESTING-CHECKLIST.md`
- `docs/13-DEPLOYMENT-CHECKLIST.md`

## Catatan Security

- Jangan commit file `.env` asli.
- Jangan commit PDF/PNG laporan generated karena bisa berisi data transaksi.
- Gunakan `JWT_SECRET` production minimal 32 karakter acak.
- Pastikan `CLIENT_URL` backend sama dengan domain frontend production.
- Pastikan `VITE_API_BASE_URL` frontend mengarah ke backend production.
