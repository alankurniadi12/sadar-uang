# 03 - User Flow

## Flow Utama Pengguna Baru

1. User membuka landing page.
2. User membaca manfaat aplikasi.
3. User klik tombol "Mulai Catat Sekarang".
4. User masuk ke halaman register.
5. User mengisi nama, email, password atau memakai Google login.
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
3. User mengisi email dan password atau memakai Google login.
4. Sistem validasi login.
5. Jika berhasil, user diarahkan ke dashboard.
6. Jika gagal, tampilkan pesan error.

Catatan:

- Field password menyediakan tombol "Lihat/Sembunyikan" agar user bisa memeriksa ketikan.

## Flow Reset Password

1. User membuka halaman login.
2. User klik "Lupa password?".
3. User mengisi email.
4. Sistem memproses permintaan reset password.
5. Jika email valid dan aktif, sistem mengirim link reset password.
6. User membuka link reset password.
7. User mengisi password baru dan konfirmasi password.
8. Sistem validasi token dan password baru.
9. Jika berhasil, user otomatis mendapat sesi login dan diarahkan ke dashboard.

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
5. Sistem generate PDF dengan header brand Sadar Uang.
6. File PDF terunduh.

## Flow Pengaturan Profil

1. User membuka halaman pengaturan.
2. User melihat ringkasan profil akun.
3. User dapat mengubah nama.
4. User dapat membuat atau mengubah password.
5. Sistem menyimpan perubahan dan menampilkan toast.

## Flow Admin

1. Admin membuka halaman admin.
2. Sistem menampilkan summary user.
3. Admin dapat search, filter, sort, dan pindah halaman daftar user.
4. Admin memilih user untuk melihat detail.
5. Admin dapat mengubah status user active/inactive.

## Flow Mobile Navigation

1. User membuka aplikasi dari layar mobile.
2. Header menampilkan logo dan tombol menu.
3. User membuka tombol menu untuk melihat navigasi.
4. Setelah user memilih menu atau logout, menu otomatis tertutup.
