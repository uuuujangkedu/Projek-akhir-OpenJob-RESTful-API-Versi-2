require('dotenv').config();

const app = require('./app');
const { initRedis } = require('./config/redis');
const { initRabbitMQ } = require('./config/rabbitmq');

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT) || 3000;

app.listen(port, host, () => {
  console.log(`OpenJob API berjalan di http://${host}:${port}`);
});

// ponytail: Redis/RabbitMQ opsional dan tidak boleh menahan listen — cache/publish sudah di-guard di config-nya
initRedis();
initRabbitMQ();
