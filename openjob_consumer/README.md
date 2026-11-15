# OpenJob Consumer

Consumer RabbitMQ independen untuk mengirim email notifikasi lamaran.

## Setup

```bash
cp .env.example .env
npm install
npm start
```

Consumer mendengarkan queue `applications_queue`. Setiap pesan `{ "application_id": "..." }`
membaca detail lamaran dari PostgreSQL lalu mengirim email ke pelamar.

`MAIL_TO` opsional untuk mengarahkan email ke alamat lain (mis. Mailtrap inbox).