# 02 - MVP Scope

## Prinsip MVP

MVP Sadar Uang harus fokus pada fungsi inti: mencatat transaksi dan memahami kondisi keuangan melalui dashboard.

Jangan menambahkan fitur besar sebelum fitur inti stabil.

## Fitur Masuk MVP

### Authentication

- Register user baru.
- Login user.
- Logout user.
- JWT token.
- Password di-hash menggunakan bcrypt.
- Middleware protected route.

### Transaction

Field transaksi:

- Tanggal
- Tipe transaksi
- Keterangan
- Kategori
- Jumlah

Tipe transaksi:

- income
- expense

User dapat:

- Membuat transaksi.
- Melihat daftar transaksi.
- Mengubah transaksi.
- Menghapus transaksi.
- Filter berdasarkan tipe, kategori, bulan, dan tahun.
- Search berdasarkan keterangan.

### Dashboard

Dashboard menampilkan:

- Total pemasukan bulan ini.
- Total pengeluaran bulan ini.
- Sisa uang bulan ini.
- Jumlah transaksi bulan ini.
- Grafik transaksi harian bulan berjalan.
- Grafik pemasukan dan pengeluaran per bulan dalam satu tahun.
- Grafik pengeluaran berdasarkan kategori.
- Riwayat transaksi terbaru.

### Report PDF

- Generate laporan berdasarkan bulan dan tahun.
- Download PDF.
- PDF menampilkan ringkasan dan daftar transaksi.

## Fitur Tidak Masuk MVP

- Multi-dompet.
- Budget planning.
- Hutang-piutang.
- Notifikasi.
- AI insight.
- Import Excel.
- Export Excel.
- Integrasi bank.
- Integrasi e-wallet.
- Payment gateway.
- Admin panel.
- Role user premium/free.

## Prioritas Development

### P0 - Wajib

- Register/login.
- CRUD transaksi.
- Dashboard summary.
- Responsive layout.

### P1 - Penting

- Filter transaksi.
- Grafik dashboard.
- Export PDF.

### P2 - Polish

- Empty state.
- Loading state.
- Error handling.
- Copywriting final.
- Format rupiah.
- Format tanggal Indonesia.

## Definisi MVP Selesai

MVP selesai jika:

1. User dapat register dan login.
2. User dapat tambah, lihat, edit, hapus transaksi.
3. User dapat melihat dashboard bulan berjalan.
4. User dapat melihat grafik kategori dan bulanan.
5. User dapat export PDF laporan bulanan.
6. Aplikasi responsif di desktop dan mobile.
