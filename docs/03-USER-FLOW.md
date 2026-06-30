# 03 - User Flow

## Flow Utama Pengguna Baru

1. User membuka landing page.
2. User membaca manfaat aplikasi.
3. User klik tombol "Mulai Catat Sekarang".
4. User masuk ke halaman register.
5. User mengisi nama, email, password.
6. Sistem membuat akun.
7. User diarahkan ke dashboard.
8. Dashboard menampilkan empty state karena belum ada transaksi.
9. User klik "Tambah Transaksi".
10. User mengisi transaksi pertama.
11. Sistem menyimpan transaksi.
12. Dashboard diperbarui.

## Flow Login Pengguna Lama

1. User membuka aplikasi.
2. User masuk ke halaman login.
3. User mengisi email dan password.
4. Sistem validasi login.
5. Jika berhasil, user diarahkan ke dashboard.
6. Jika gagal, tampilkan pesan error.

## Flow Tambah Transaksi

1. User klik tombol "Tambah Transaksi".
2. User memilih tanggal.
3. User memilih tipe transaksi: Pemasukan/Pengeluaran.
4. User mengisi keterangan.
5. User memilih kategori.
6. User mengisi jumlah.
7. User klik simpan.
8. Sistem validasi input.
9. Sistem menyimpan transaksi.
10. User kembali ke dashboard atau halaman transaksi.

## Flow Edit Transaksi

1. User membuka daftar transaksi.
2. User memilih transaksi.
3. User klik edit.
4. Form terisi data lama.
5. User mengubah data.
6. User klik simpan.
7. Sistem memperbarui transaksi.

## Flow Hapus Transaksi

1. User membuka daftar transaksi.
2. User memilih transaksi.
3. User klik hapus.
4. Sistem menampilkan konfirmasi.
5. User menyetujui.
6. Sistem menghapus transaksi.

## Flow Dashboard

1. User membuka dashboard.
2. Sistem mengambil data ringkasan bulan berjalan.
3. Sistem mengambil data grafik harian.
4. Sistem mengambil data grafik bulanan tahun berjalan.
5. Sistem mengambil data kategori pengeluaran.
6. Sistem mengambil transaksi terbaru.
7. Dashboard ditampilkan.

## Flow Export PDF

1. User membuka halaman laporan.
2. User memilih bulan dan tahun.
3. Sistem menampilkan preview ringkasan.
4. User klik "Download PDF".
5. Sistem generate PDF.
6. File PDF terunduh.
