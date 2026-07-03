# 07 - Backend Specification

Backend menggunakan Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Google Auth Library, Nodemailer, dan PDFKit.

## Tujuan Backend

Menyediakan API untuk autentikasi, transaksi, dashboard, dan laporan PDF.

## Struktur Folder Rekomendasi

```text
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   ├── dashboardController.js
│   │   ├── reportController.js
│   │   ├── adminController.js
│   │   └── healthController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── notFoundMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── adminRoutes.js
│   │   └── healthRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── transactionService.js
│   │   ├── dashboardService.js
│   │   ├── reportService.js
│   │   ├── adminService.js
│   │   └── emailService.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── generateToken.js
│   │   ├── response.js
│   │   ├── dateRange.js
│   │   ├── pdfGenerator.js
│   │   ├── formatRupiah.js
│   │   └── formatDate.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── transactionValidator.js
│   │   ├── dashboardValidator.js
│   │   └── adminValidator.js
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Core Middleware

- express.json()
- cors()
- helmet()
- morgan() untuk development
- authMiddleware untuk route protected
- errorMiddleware global

## Auth Rules

- Register harus validasi nama, email, password.
- Email harus unik.
- Password minimal 6 karakter.
- Password disimpan sebagai hash.
- Login mengembalikan JWT.
- JWT menyimpan user id.
- Google login menerima credential dari frontend dan membuat/menautkan user.
- Forgot password membuat token reset dan mengirim link melalui email service.
- Reset password menerima token dan password baru.
- Update profil hanya mengubah nama user.
- Update password mendukung akun password dan akun Google yang ingin membuat password.
- User memiliki role `user` atau `admin`.
- User memiliki status `active` atau `inactive`.

## Transaction Rules

- Semua transaksi wajib milik user login.
- User tidak boleh melihat/mengubah/menghapus transaksi user lain.
- Amount harus number dan lebih dari 0.
- Type hanya income atau expense.
- Category harus valid sesuai type.
- Date harus valid.

## Dashboard Rules

Dashboard hanya menghitung data milik user login.

### Summary

- incomeTotal: total type income pada bulan/tahun terpilih.
- expenseTotal: total type expense pada bulan/tahun terpilih.
- balance: incomeTotal - expenseTotal.
- transactionCount: jumlah transaksi bulan/tahun terpilih.

### Daily Data

Untuk bulan tertentu:
- Group by tanggal.
- Hitung income dan expense per hari.
- balance = income - expense.

### Monthly Data

Untuk tahun tertentu:
- Group by bulan.
- Hitung income dan expense per bulan.
- balance = income - expense.

### Category Data

Untuk bulan/tahun tertentu:
- Filter type expense.
- Group by category.
- Sort total terbesar.

## PDF Report Rules

Laporan PDF bulanan berisi:

- Header brand memakai icon dan teks Sadar Uang
- Nama pengguna
- Email pengguna
- Periode laporan
- Total pemasukan
- Total pengeluaran
- Sisa uang
- Pengeluaran berdasarkan kategori
- Daftar transaksi
- Tanggal cetak laporan

Catatan deploy:

- Generator PDF membaca asset brand dari `frontend/public/brand`.
- Jika backend dan frontend dideploy terpisah, copy asset brand ke lokasi yang tetap bisa dibaca backend atau sesuaikan path generator.

## Admin Rules

- Semua route admin wajib auth JWT dan role admin.
- Admin dapat melihat summary user.
- Admin dapat mencari user berdasarkan nama/email.
- Admin dapat filter role/status, sort nama/aktivitas, dan pagination.
- Admin dapat melihat detail user beserta metrik transaksi.
- Admin dapat mengubah status user active/inactive.
- Admin tidak boleh menonaktifkan akunnya sendiri dari UI.

## Error Handling

Gunakan format error konsisten:

```json
{
  "success": false,
  "message": "Pesan error"
}
```

## Success Response Helper

Gunakan format sukses konsisten:

```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": {}
}
```

## Security Notes

- Jangan kirim passwordHash ke frontend.
- Jangan kirim googleId, passwordResetTokenHash, atau passwordResetExpiresAt ke frontend.
- Gunakan JWT secret dari environment variable.
- Batasi CORS sesuai kebutuhan deployment.
- Validasi semua input.
- Pastikan query transaksi selalu include user id.
