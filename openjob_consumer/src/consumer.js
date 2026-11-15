require('dotenv').config();

const amqp = require('amqplib');
const pool = require('./config/db');
const { sendApplicationEmail } = require('./mailer');

const QUEUE = 'applications_queue';

const getApplication = async (applicationId) => {
  const { rows } = await pool.query(
    `SELECT a.id AS application_id,
            u.name AS applicant_name,
            u.email AS applicant_email,
            j.title AS job_title,
            c.name AS company_name
     FROM applications a
     JOIN users u ON u.id = a.user_id
     JOIN jobs j ON j.id = a.job_id
     JOIN companies c ON c.id = j.company_id
     WHERE a.id = $1`,
    [applicationId],
  );
  return rows[0];
};

const processMessage = async ({ application_id }) => {
  if (!application_id) throw new Error('application_id is required');

  const application = await getApplication(application_id);
  if (!application) throw new Error(`Application ${application_id} not found`);

  await sendApplicationEmail(application);
  console.log(`Email sent for application ${application_id}`);
};

const main = async () => {
  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = process.env.RABBITMQ_PORT || 5672;
  const user = process.env.RABBITMQ_USER || 'guest';
  const password = process.env.RABBITMQ_PASSWORD || 'guest';
  const url = process.env.AMQP_URL || `amqp://${user}:${password}@${host}:${port}`;

  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
  channel.prefetch(1);

  console.log(`Consumer listening on ${QUEUE}`);

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    try {
      await processMessage(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    } catch (err) {
      console.error('Failed to process message:', err.message);
      channel.nack(msg, false, false);
    }
  });

  const shutdown = async () => {
    await channel.close();
    await connection.close();
    await pool.end();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

main().catch(async (err) => {
  console.error('Consumer failed to start:', err.message);
  await pool.end();
  process.exit(1);
});