# 12 - Testing Checklist

## Auth Testing

- [x] User bisa register dengan nama, email, password.
- [x] User tidak bisa register dengan email yang sudah dipakai.
- [x] Password disimpan sebagai hash.
- [x] User bisa login dengan email dan password benar.
- [x] User tidak bisa login dengan password salah.
- [x] Protected route menolak request tanpa token.
- [x] Protected route menerima request dengan token valid.
- [x] GET /auth/me mengembalikan user login.

## Transaction Testing

- [x] User bisa tambah transaksi pemasukan.
- [x] User bisa tambah transaksi pengeluaran.
- [x] User tidak bisa tambah transaksi tanpa tanggal.
- [x] User tidak bisa tambah transaksi tanpa tipe.
- [x] User tidak bisa tambah transaksi tanpa kategori.
- [x] User tidak bisa tambah transaksi dengan amount 0.
- [x] User bisa melihat daftar transaksi miliknya.
- [x] User bisa edit transaksi miliknya.
- [x] User bisa hapus transaksi miliknya.
- [x] User tidak bisa akses transaksi user lain.
- [x] Filter type berjalan.
- [x] Filter kategori berjalan.
- [x] Filter bulan/tahun berjalan.
- [x] Search keterangan berjalan.

## Dashboard Testing

- [x] Total pemasukan bulan ini benar.
- [x] Total pengeluaran bulan ini benar.
- [x] Sisa uang benar.
- [x] Jumlah transaksi benar.
- [x] Grafik harian menampilkan data bulan berjalan.
- [x] Grafik bulanan menampilkan 12 bulan.
- [x] Grafik kategori hanya menghitung pengeluaran.
- [x] Riwayat terbaru menampilkan transaksi terbaru.
- [x] Dashboard kosong menampilkan empty state.

## Report PDF Testing

- [x] User bisa memilih bulan dan tahun.
- [x] Preview laporan muncul.
- [x] PDF bisa diunduh.
- [x] PDF menampilkan nama user.
- [x] PDF menampilkan periode laporan.
- [x] PDF menampilkan total pemasukan.
- [x] PDF menampilkan total pengeluaran.
- [x] PDF menampilkan sisa uang.
- [x] PDF menampilkan daftar transaksi.

## UI Testing

- [x] Landing page tampil baik di desktop.
- [x] Landing page tampil baik di mobile.
- [x] Login page responsive.
- [x] Register page responsive.
- [x] Dashboard responsive.
- [x] Transaction form nyaman di mobile.
- [x] Format rupiah benar.
- [x] Format tanggal Indonesia benar.
- [x] Toast success muncul.
- [x] Toast error muncul.
- [x] Loading state muncul saat fetch data.
- [x] Empty state muncul saat data kosong.

## Manual 30-Day Validation

- [ ] Input transaksi harian terasa cepat.
- [ ] Tidak ada field yang terasa mengganggu.
- [ ] Dashboard membantu memahami kondisi uang.
- [ ] PDF report berguna.
- [ ] Ada fitur yang terasa sangat kurang.
- [ ] Ada fitur yang ternyata tidak perlu.
