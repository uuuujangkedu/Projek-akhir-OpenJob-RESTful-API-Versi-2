const amqp = require('amqplib');

const QUEUE = 'applications_queue';
let channel = null;

const initRabbitMQ = async () => {
  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = process.env.RABBITMQ_PORT || 5672;
  const user = process.env.RABBITMQ_USER || 'guest';
  const password = process.env.RABBITMQ_PASSWORD || 'guest';
  const url = process.env.AMQP_URL || `amqp://${user}:${password}@${host}:${port}`;

  try {
    const connection = await amqp.connect(url);
    connection.on('error', (err) => console.error('RabbitMQ connection error:', err.message));
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });
    console.log('Connected to RabbitMQ');
  } catch (err) {
    console.warn('Could not connect to RabbitMQ, publishing disabled:', err.message);
  }
};

const sendToQueue = (message) => {
  if (!channel) return false;
  try {
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)), { persistent: true });
    return true;
  } catch (err) {
    console.error('Failed to publish message:', err.message);
    return false;
  }
};

module.exports = { initRabbitMQ, sendToQueue, QUEUE };