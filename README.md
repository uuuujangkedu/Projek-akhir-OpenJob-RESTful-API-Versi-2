# OpenJob Submission

Dua project independen:

- `openjob_api` — RESTful API OpenJob (Express, PostgreSQL, JWT, Redis, RabbitMQ publisher).
- `openjob_consumer` — consumer RabbitMQ yang mengirim email notifikasi lamaran.

## Menjalankan

```bash
# API
cd openjob_api
cp .env.example .env
npm install
npm run migrate:up
npm start

# Consumer (terminal terpisah)
cd openjob_consumer
cp .env.example .env
npm install
npm start
```

Dua-duanya membaca environment variable `HOST` dan `PORT`. Default API `0.0.0.0:3000`,
consumer `0.0.0.0:3001` — set `PORT` berbeda kalau dijalankan bersamaan.

```bash
HOST=0.0.0.0 PORT=3000 npm start   # di openjob_api
HOST=0.0.0.0 PORT=3001 npm start   # di openjob_consumer
```

Butuh PostgreSQL, Redis, RabbitMQ, dan SMTP server. Lihat README masing-masing project.