# 04 - Database Schema

Database menggunakan MongoDB dengan Mongoose.

## Collection: users

### Field

| Field | Type | Required | Description |
|---|---|---:|---|
| name | String | Yes | Nama pengguna |
| email | String | Yes | Email unik pengguna |
| passwordHash | String | Yes | Password yang sudah di-hash |
| createdAt | Date | Auto | Tanggal dibuat |
| updatedAt | Date | Auto | Tanggal diperbarui |

### Rules

- Email harus unik.
- Password tidak boleh disimpan dalam bentuk plain text.
- Gunakan bcrypt untuk hashing password.

### Example

```json
{
  "name": "Alan",
  "email": "alan@example.com",
  "passwordHash": "$2b$10$examplehash",
  "createdAt": "2026-06-30T10:00:00.000Z",
  "updatedAt": "2026-06-30T10:00:00.000Z"
}
```

## Collection: transactions

### Field

| Field | Type | Required | Description |
|---|---|---:|---|
| user | ObjectId | Yes | Reference ke users |
| date | Date | Yes | Tanggal transaksi |
| type | String | Yes | income atau expense |
| description | String | Yes | Keterangan transaksi |
| category | String | Yes | Kategori transaksi |
| amount | Number | Yes | Jumlah uang |
| createdAt | Date | Auto | Tanggal dibuat |
| updatedAt | Date | Auto | Tanggal diperbarui |

### Type Enum

```js
["income", "expense"]
```

### Income Categories

```js
[
  "Gaji",
  "Bonus",
  "Affiliate",
  "Freelance",
  "Usaha",
  "Investasi",
  "Lainnya"
]
```

### Expense Categories

```js
[
  "Makan/Minum",
  "Transportasi",
  "Belanja",
  "Tagihan",
  "Keluarga",
  "Hiburan",
  "Kesehatan",
  "Pendidikan",
  "Sedekah",
  "Cicilan",
  "Bisnis",
  "Iklan",
  "Lainnya"
]
```

### Validation Rules

- amount harus lebih dari 0.
- type wajib income atau expense.
- category harus sesuai dengan type transaksi.
- description minimal 2 karakter.
- date wajib valid date.
- user wajib sesuai dengan user login.

### Example Income

```json
{
  "user": "667xxxxx",
  "date": "2026-06-30T00:00:00.000Z",
  "type": "income",
  "description": "Gaji bulanan",
  "category": "Gaji",
  "amount": 5000000
}
```

### Example Expense

```json
{
  "user": "667xxxxx",
  "date": "2026-06-30T00:00:00.000Z",
  "type": "expense",
  "description": "Makan siang",
  "category": "Makan/Minum",
  "amount": 25000
}
```

## Index Recommendation

```js
transactions.createIndex({ user: 1, date: -1 });
transactions.createIndex({ user: 1, type: 1 });
transactions.createIndex({ user: 1, category: 1 });
users.createIndex({ email: 1 }, { unique: true });
```
