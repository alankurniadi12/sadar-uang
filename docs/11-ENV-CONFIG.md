# 11 - Environment Configuration

## Backend .env.example

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sadar_uang
JWT_SECRET=change_this_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## Frontend .env.example

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Notes

- Jangan commit file `.env` asli.
- Commit hanya `.env.example`.
- JWT_SECRET wajib diganti saat production.
- CLIENT_URL digunakan untuk CORS.

## Local Development Ports

- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- MongoDB: mongodb://127.0.0.1:27017/sadar_uang
