# 12 - Testing Checklist

## Auth Testing

- [x] User bisa register dengan nama, email, password.
- [x] User tidak bisa register dengan email yang sudah dipakai.
- [x] Password disimpan sebagai hash.
- [x] User bisa login dengan email dan password benar.
- [x] User tidak bisa login dengan password salah.
- [x] User bisa login/daftar dengan Google jika `VITE_GOOGLE_CLIENT_ID` tersedia.
- [x] User bisa meminta reset password.
- [x] User bisa reset password dengan token valid.
- [x] User bisa update nama profil.
- [x] User bisa update atau membuat password dari halaman pengaturan.
- [x] Field password bisa toggle Lihat/Sembunyikan.
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
- [x] PDF menampilkan header brand dengan icon dan teks Sadar Uang.
- [x] PDF tetap bisa dibuat dengan fallback teks jika asset brand tidak tersedia.

## Admin Testing

- [x] Admin bisa melihat summary user.
- [x] Admin bisa melihat daftar user.
- [x] Admin bisa search user berdasarkan nama/email.
- [x] Admin bisa filter user berdasarkan role/status.
- [x] Admin bisa sort user berdasarkan nama/aktivitas.
- [x] Admin bisa melihat detail user.
- [x] Admin bisa mengubah status user.
- [x] User non-admin tidak bisa akses route admin.

## UI Testing

- [x] Landing page tampil baik di desktop.
- [x] Landing page tampil baik di mobile.
- [x] Login page responsive.
- [x] Register page responsive.
- [x] Dashboard responsive.
- [x] Transaction form nyaman di mobile.
- [x] Header app mobile memakai tombol menu dan tidak berantakan.
- [x] Filter dashboard/laporan/transaksi nyaman di mobile.
- [x] Pagination transaksi/admin rapi di mobile.
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

## Go Public Readiness

- [ ] Pastikan asset brand untuk header PDF (`frontend/public/brand/sadar-uang-icon.png` dan `frontend/public/brand/sadar-uang-text.png`) ikut tersedia di environment production.
- [ ] Jika backend dan frontend dideploy terpisah, pindahkan atau copy asset brand PDF ke folder backend agar generator PDF tidak bergantung pada struktur folder frontend.
