require('dotenv').config();

const app = require('./app');
const { initRedis } = require('./config/redis');
const { initRabbitMQ } = require('./config/rabbitmq');

const host = process.env.HOST || 'localhost';
const port = Number(process.env.PORT) || 3000;

const start = async () => {
  await Promise.all([initRedis(), initRabbitMQ()]);
  app.listen(port, host, () => {
    console.log(`OpenJob API berjalan di http://${host}:${port}`);
  });
};

start();