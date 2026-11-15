# OpenJob Consumer

Consumer RabbitMQ independen untuk mengirim email notifikasi lamaran.

## Setup

```bash
cp .env.example .env
npm install
npm start
```

Server membaca `HOST` dan `PORT` (default `0.0.0.0:3001`) lalu membuka HTTP health check:

```bash
curl http://localhost:3001/
# {"status":"ok","queue":"applications_queue","rabbitmq":true}
```

`PORT` consumer harus beda dari `PORT` API agar tidak bentrok.

Consumer mendengarkan queue `applications_queue`. Setiap pesan `{ "application_id": "..." }`
membaca detail lamaran dari PostgreSQL lalu mengirim email ke pelamar. Kalau RabbitMQ belum
siap, consumer tetap hidup dan mencoba menyambung ulang tiap 5 detik.

`MAIL_TO` opsional untuk mengarahkan email ke alamat lain (mis. Mailtrap inbox).