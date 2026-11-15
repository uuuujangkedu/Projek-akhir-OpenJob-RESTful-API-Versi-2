# OpenJob RESTful API

RESTful API aplikasi rekrutmen **OpenJob** (Node.js + Express + PostgreSQL + JWT Bearer).
Project ini independen dari `openjob_consumer`; keduanya berkomunikasi lewat RabbitMQ.

## Setup

1. **PostgreSQL** — sediakan database `openjob` (user/password `postgres`):

   ```bash
   docker run --name openjob-pg -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_USER=postgres -e POSTGRES_DB=openjob -p 5432:5432 -d postgres:16
   ```

2. **Redis** (caching):

   ```bash
   docker run --name openjob-redis -p 6379:6379 -d redis:alpine
   ```

3. **RabbitMQ** (message queue):

   ```bash
   docker run --name openjob-rabbit -p 5672:5672 -p 15672:15672 -d rabbitmq:management-alpine
   ```

4. **Env** — salin `.env.example` menjadi `.env`, sesuaikan `PG*`, `HOST`, `PORT`, `ACCESS_TOKEN_KEY`, `REFRESH_TOKEN_KEY`, `REDIS_*`, `RABBITMQ_*`.

5. **Dependency** — `npm install`

6. **Migrasi** — `npm run migrate:up` (reversibel: `npm run migrate:down` lalu up lagi)

7. **Jalankan** — `npm run start:dev` (server di `http://HOST:PORT`)

## Fitur submission

- **Upload PDF** — `POST /documents` (field `document`, maks 5 MB), lihat/unduh lewat `GET /documents/:id`.
- **Caching** — Redis pada detail company/user/application, list application/bookmark; response memuat header `X-Data-Source: cache|database`; cache dihapus saat data berubah.
- **Message queue** — `POST /applications` mem-publish `{ application_id }` ke queue `applications_queue`. Email dikirim oleh project `openjob_consumer`.

## Scripts

| Script | Fungsi |
|---|---|
| `npm start` | jalankan server |
| `npm run start:dev` | jalankan server (nodemon) |
| `npm run migrate:up` | terapkan semua migrasi |
| `npm run migrate:down` | rollback semua migrasi |
| `npm run db:reset` | reset DB (down + up) sebelum run Newman |
| `npm run smoke` | uji end-to-end cepat (butuh DB + migrasi) |
| `npm run test:postman` | jalankan koleksi Postman V2 via Newman |

## Uji

```bash
npm run migrate:down && npm run migrate:up
npm run start:dev            # terminal terpisah
npm run test:postman
```

## Autentikasi

JWT Bearer (bukan session/cookie). Access token `exp - iat = 10800` (3 jam), payload `{ id }`. Refresh token ditandatangani `REFRESH_TOKEN_KEY` dan disimpan di tabel `authentications`, dengan `jti` acak agar login berulang dalam detik sama tidak bentrok `UNIQUE(token)`.

## Struktur

```
src/
  server.js app.js config/ exceptions/ middlewares/ validators/
  routes/ controllers/ services/ utils/
migrations/            # node-pg-migrate (timestamp)
docs/erd.mmd           # sumber ERD
ERD-OpenJob-versi-1.png
```