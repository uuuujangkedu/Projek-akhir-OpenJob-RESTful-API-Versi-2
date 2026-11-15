const pool = require('../config/db');
const generateId = require('../utils/id');
const { sendToQueue } = require('../config/rabbitmq');
const { getCache, setCache, delCache } = require('../config/redis');

const createApplication = async ({ user_id, job_id, status }) => {
  const id = generateId('application');
  await pool.query(
    'INSERT INTO applications (id, user_id, job_id, status) VALUES ($1, $2, $3, $4)',
    [id, user_id, job_id, status],
  );

  sendToQueue({ application_id: id });

  // Invalidate cache
  await delCache(`applications_user_${user_id}`);
  await delCache(`applications_job_${job_id}`);

  return id;
};

const getAllApplications = async () => {
  const { rows } = await pool.query('SELECT * FROM applications ORDER BY created_at DESC');
  return rows;
};

const getApplicationById = async (id) => {
  const cacheKey = `application_${id}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return { data: JSON.parse(cached), dataSource: 'cache' };
  }

  const { rows } = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
  const application = rows[0];
  if (application) {
    await setCache(cacheKey, JSON.stringify(application), 3600);
  }
  return { data: application, dataSource: 'database' };
};

const getApplicationsByUser = async (userId) => {
  const cacheKey = `applications_user_${userId}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return { data: JSON.parse(cached), dataSource: 'cache' };
  }

  const { rows } = await pool.query('SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  await setCache(cacheKey, JSON.stringify(rows), 3600);
  return { data: rows, dataSource: 'database' };
};

const getApplicationsByJob = async (jobId) => {
  const cacheKey = `applications_job_${jobId}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return { data: JSON.parse(cached), dataSource: 'cache' };
  }

  const { rows } = await pool.query('SELECT * FROM applications WHERE job_id = $1 ORDER BY created_at DESC', [jobId]);
  await setCache(cacheKey, JSON.stringify(rows), 3600);
  return { data: rows, dataSource: 'database' };
};

const findByUserAndJob = async (userId, jobId) => {
  const { rows } = await pool.query(
    'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
    [userId, jobId],
  );
  return rows[0];
};

const updateApplication = async (id, { status }) => {
  const app = await pool.query('SELECT user_id, job_id FROM applications WHERE id = $1', [id]);
  const { rowCount } = await pool.query(
    'UPDATE applications SET status = $1, updated_at = current_timestamp WHERE id = $2',
    [status, id],
  );

  if (rowCount && app.rows[0]) {
    const { user_id, job_id } = app.rows[0];
    await delCache(`application_${id}`);
    await delCache(`applications_user_${user_id}`);
    await delCache(`applications_job_${job_id}`);
  }

  return rowCount;
};

const deleteApplication = async (id) => {
  const app = await pool.query('SELECT user_id, job_id FROM applications WHERE id = $1', [id]);
  const { rowCount } = await pool.query('DELETE FROM applications WHERE id = $1', [id]);

  if (rowCount && app.rows[0]) {
    const { user_id, job_id } = app.rows[0];
    await delCache(`application_${id}`);
    await delCache(`applications_user_${user_id}`);
    await delCache(`applications_job_${job_id}`);
  }

  return rowCount;
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  getApplicationsByUser,
  getApplicationsByJob,
  findByUserAndJob,
  updateApplication,
  deleteApplication,
};
