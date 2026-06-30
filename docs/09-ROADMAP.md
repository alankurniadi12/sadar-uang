# 09 - Development Roadmap

## Phase 0 - Persiapan

Tujuan: Menyiapkan struktur proyek dan dokumen.

Task:

- Finalisasi dokumen PRD.
- Finalisasi MVP scope.
- Finalisasi database schema.
- Finalisasi API spec.
- Buat repository.
- Setup struktur folder frontend dan backend.

Output:

- Project siap dikembangkan.

## Phase 1 - Backend Foundation

Tujuan: Backend dasar berjalan.

Task:

- Setup Express.js.
- Setup MongoDB connection.
- Setup environment variable.
- Setup global error handler.
- Setup response helper.
- Setup auth model.
- Setup transaction model.

Output:

- Server backend berjalan.
- Database terkoneksi.

## Phase 2 - Authentication

Tujuan: User bisa register dan login.

Task:

- Register endpoint.
- Login endpoint.
- JWT generation.
- Auth middleware.
- GET /auth/me.
- Password hashing.

Output:

- User bisa register/login.
- Route protected berjalan.

## Phase 3 - Transaction API

Tujuan: CRUD transaksi berjalan.

Task:

- Create transaction.
- Get transactions.
- Get transaction detail.
- Update transaction.
- Delete transaction.
- Filter by type/category/month/year.
- Search by description.
- Pagination.

Output:

- API transaksi lengkap untuk MVP.

## Phase 4 - Dashboard API

Tujuan: Data dashboard tersedia.

Task:

- Summary endpoint.
- Daily chart endpoint.
- Monthly chart endpoint.
- Category chart endpoint.
- Recent transactions.

Output:

- Backend siap menyuplai dashboard.

## Phase 5 - Report PDF API

Tujuan: User bisa export laporan PDF bulanan.

Task:

- Monthly report preview endpoint.
- Monthly PDF generator.
- Format rupiah.
- Format tanggal Indonesia.
- Download PDF response.

Output:

- Laporan PDF bulanan bisa diunduh.

## Phase 6 - Frontend Foundation

Tujuan: Frontend dasar berjalan.

Task:

- Setup Vue 3 + Vite.
- Setup Tailwind CSS.
- Setup Vue Router.
- Setup Pinia.
- Setup Axios service.
- Setup layout auth dan app.

Output:

- Frontend siap dikembangkan.

## Phase 7 - Frontend Auth

Tujuan: Login/register di frontend berjalan.

Task:

- Register page.
- Login page.
- Auth store.
- Save token.
- Protected route.
- Logout.

Output:

- User bisa login dari frontend.

## Phase 8 - Frontend Transactions

Tujuan: User bisa mengelola transaksi dari UI.

Task:

- Transaction form.
- Transaction list.
- Edit transaction.
- Delete transaction.
- Filter.
- Search.
- Loading/error state.

Output:

- CRUD transaksi lengkap dari frontend.

## Phase 9 - Frontend Dashboard

Tujuan: Dashboard tampil rapi.

Task:

- Summary cards.
- Daily chart.
- Monthly chart.
- Category chart.
- Recent transactions.
- Empty state.

Output:

- Dashboard MVP siap digunakan.

## Phase 10 - Frontend Reports

Tujuan: User bisa download laporan.

Task:

- Reports page.
- Select month/year.
- Preview summary.
- Download PDF.

Output:

- Laporan PDF bisa diunduh dari frontend.

## Phase 11 - Polish & Testing

Tujuan: Aplikasi nyaman digunakan.

Task:

- Responsive mobile.
- Format rupiah.
- Format tanggal Indonesia.
- Toast notification.
- Empty state.
- Error state.
- Manual testing.
- Perbaikan bug.

Output:

- MVP siap dipakai harian.

## Phase 12 - Personal Use Validation

Tujuan: Menguji apakah aplikasi nyaman dipakai selama 30 hari.

Task:

- Gunakan aplikasi setiap hari.
- Catat hambatan penggunaan.
- Evaluasi input transaksi.
- Evaluasi dashboard.
- Evaluasi fitur PDF.

Output:

- Keputusan lanjut ke versi publik atau revisi besar.
