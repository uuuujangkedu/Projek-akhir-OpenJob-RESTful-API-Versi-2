const pool = require('../config/db');
const { getCache, setCache, delCache } = require('../config/redis');

const getUserById = async (id) => {
  const cacheKey = `user_${id}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return { data: JSON.parse(cached), dataSource: 'cache' };
  }

  const { rows } = await pool.query('SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1', [id]);
  const user = rows[0];
  if (user) {
    await setCache(cacheKey, JSON.stringify(user), 3600);
  }
  return { data: user, dataSource: 'database' };
};

const findById = async (id) => {
  const result = await getUserById(id);
  return result.data;
};

const findByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

const createUser = async ({ name, email, password, role }) => {
  const generateId = require('../utils/id');
  const id = generateId('user');
  await pool.query(
    'INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
    [id, name, email, password, role || 'user'],
  );
  return id;
};

const updateUser = async (id, data) => {
  const { name, email, role } = data;
  const { rowCount } = await pool.query(
    'UPDATE users SET name = $1, email = $2, role = $3, updated_at = current_timestamp WHERE id = $4',
    [name, email, role, id],
  );
  if (rowCount) {
    await delCache(`user_${id}`);
  }
  return rowCount;
};

module.exports = {
  getUserById,
  findById,
  findByEmail,
  createUser,
  updateUser,
};
