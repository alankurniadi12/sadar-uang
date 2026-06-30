# 12 - Testing Checklist

## Auth Testing

- [ ] User bisa register dengan nama, email, password.
- [ ] User tidak bisa register dengan email yang sudah dipakai.
- [ ] Password disimpan sebagai hash.
- [ ] User bisa login dengan email dan password benar.
- [ ] User tidak bisa login dengan password salah.
- [ ] Protected route menolak request tanpa token.
- [ ] Protected route menerima request dengan token valid.
- [ ] GET /auth/me mengembalikan user login.

## Transaction Testing

- [ ] User bisa tambah transaksi pemasukan.
- [ ] User bisa tambah transaksi pengeluaran.
- [ ] User tidak bisa tambah transaksi tanpa tanggal.
- [ ] User tidak bisa tambah transaksi tanpa tipe.
- [ ] User tidak bisa tambah transaksi tanpa kategori.
- [ ] User tidak bisa tambah transaksi dengan amount 0.
- [ ] User bisa melihat daftar transaksi miliknya.
- [ ] User bisa edit transaksi miliknya.
- [ ] User bisa hapus transaksi miliknya.
- [ ] User tidak bisa akses transaksi user lain.
- [ ] Filter type berjalan.
- [ ] Filter kategori berjalan.
- [ ] Filter bulan/tahun berjalan.
- [ ] Search keterangan berjalan.

## Dashboard Testing

- [ ] Total pemasukan bulan ini benar.
- [ ] Total pengeluaran bulan ini benar.
- [ ] Sisa uang benar.
- [ ] Jumlah transaksi benar.
- [ ] Grafik harian menampilkan data bulan berjalan.
- [ ] Grafik bulanan menampilkan 12 bulan.
- [ ] Grafik kategori hanya menghitung pengeluaran.
- [ ] Riwayat terbaru menampilkan transaksi terbaru.
- [ ] Dashboard kosong menampilkan empty state.

## Report PDF Testing

- [ ] User bisa memilih bulan dan tahun.
- [ ] Preview laporan muncul.
- [ ] PDF bisa diunduh.
- [ ] PDF menampilkan nama user.
- [ ] PDF menampilkan periode laporan.
- [ ] PDF menampilkan total pemasukan.
- [ ] PDF menampilkan total pengeluaran.
- [ ] PDF menampilkan sisa uang.
- [ ] PDF menampilkan daftar transaksi.

## UI Testing

- [ ] Landing page tampil baik di desktop.
- [ ] Landing page tampil baik di mobile.
- [ ] Login page responsive.
- [ ] Register page responsive.
- [ ] Dashboard responsive.
- [ ] Transaction form nyaman di mobile.
- [ ] Format rupiah benar.
- [ ] Format tanggal Indonesia benar.
- [x] Toast success muncul.
- [x] Toast error muncul.
- [ ] Loading state muncul saat fetch data.
- [ ] Empty state muncul saat data kosong.

## Manual 30-Day Validation

- [ ] Input transaksi harian terasa cepat.
- [ ] Tidak ada field yang terasa mengganggu.
- [ ] Dashboard membantu memahami kondisi uang.
- [ ] PDF report berguna.
- [ ] Ada fitur yang terasa sangat kurang.
- [ ] Ada fitur yang ternyata tidak perlu.
