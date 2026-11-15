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

Butuh PostgreSQL, Redis, RabbitMQ, dan SMTP server. Lihat README masing-masing project.