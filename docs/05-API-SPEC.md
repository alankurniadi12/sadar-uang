# 05 - API Specification

Base URL:

```text
/api
```

Authentication menggunakan JWT Bearer Token.

Header protected route:

```text
Authorization: Bearer <token>
```

## Standard Response

### Success

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error message"
}
```

---

# Auth Endpoints

## POST /auth/register

Register user baru.

### Body

```json
{
  "name": "Alan",
  "email": "alan@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "message": "Akun berhasil dibuat.",
  "data": {
    "user": {
      "id": "userId",
      "name": "Alan",
      "email": "alan@example.com"
    },
    "token": "jwtToken"
  }
}
```

## POST /auth/login

Login user.

### Body

```json
{
  "email": "alan@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "user": {
      "id": "userId",
      "name": "Alan",
      "email": "alan@example.com"
    },
    "token": "jwtToken"
  }
}
```

## GET /auth/me

Mengambil data user login.

Protected: Yes

---

# Transaction Endpoints

## GET /transactions

Mengambil daftar transaksi user login.

Protected: Yes

### Query Params

| Param | Example | Description |
|---|---|---|
| type | expense | income atau expense |
| category | Makan/Minum | Filter kategori |
| month | 6 | Bulan 1-12 |
| year | 2026 | Tahun |
| search | makan | Search keterangan |
| page | 1 | Pagination |
| limit | 20 | Jumlah data |

### Response

```json
{
  "success": true,
  "message": "Data transaksi berhasil diambil.",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

## POST /transactions

Membuat transaksi baru.

Protected: Yes

### Body

```json
{
  "date": "2026-06-30",
  "type": "expense",
  "description": "Makan siang",
  "category": "Makan/Minum",
  "amount": 25000
}
```

## GET /transactions/:id

Mengambil detail transaksi.

Protected: Yes

## PUT /transactions/:id

Mengubah transaksi.

Protected: Yes

## DELETE /transactions/:id

Menghapus transaksi.

Protected: Yes

---

# Dashboard Endpoints

## GET /dashboard/summary

Protected: Yes

### Query Params

| Param | Example |
|---|---|
| month | 6 |
| year | 2026 |

### Response Data

```json
{
  "incomeTotal": 5000000,
  "expenseTotal": 3500000,
  "balance": 1500000,
  "transactionCount": 45
}
```

## GET /dashboard/daily

Data grafik harian bulan berjalan.

Query:

```text
?month=6&year=2026
```

Response data:

```json
[
  {
    "date": "2026-06-01",
    "income": 0,
    "expense": 50000,
    "balance": -50000
  }
]
```

## GET /dashboard/monthly

Data grafik bulanan dalam satu tahun.

Query:

```text
?year=2026
```

Response data:

```json
[
  {
    "month": 1,
    "income": 5000000,
    "expense": 4000000,
    "balance": 1000000
  }
]
```

## GET /dashboard/categories

Data pengeluaran berdasarkan kategori.

Query:

```text
?month=6&year=2026
```

Response data:

```json
[
  {
    "category": "Makan/Minum",
    "total": 1200000
  }
]
```

---

# Report Endpoints

## GET /reports/monthly

Preview laporan bulanan.

Protected: Yes

Query:

```text
?month=6&year=2026
```

## GET /reports/monthly/pdf

Download laporan PDF bulanan.

Protected: Yes

Query:

```text
?month=6&year=2026
```

Response:

```text
application/pdf
```
