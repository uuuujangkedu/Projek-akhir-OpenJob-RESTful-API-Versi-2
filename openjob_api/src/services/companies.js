const pool = require('../config/db');
const generateId = require('../utils/id');
const { getCache, setCache, delCache } = require('../config/redis');

const createCompany = async ({ name, location, description }) => {
  const id = generateId('company');
  await pool.query(
    'INSERT INTO companies (id, name, location, description) VALUES ($1, $2, $3, $4)',
    [id, name, location, description || null],
  );
  return id;
};

const getAllCompanies = async () => {
  const { rows } = await pool.query('SELECT * FROM companies ORDER BY created_at DESC');
  return rows;
};

const getCompanyById = async (id) => {
  const cacheKey = `company_${id}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return { data: JSON.parse(cached), dataSource: 'cache' };
  }

  const { rows } = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
  const company = rows[0];
  if (company) {
    await setCache(cacheKey, JSON.stringify(company), 3600);
  }
  return { data: company, dataSource: 'database' };
};

const updateCompany = async (id, { name, location, description }) => {
  const { rowCount } = await pool.query(
    'UPDATE companies SET name = $1, location = $2, description = $3, updated_at = current_timestamp WHERE id = $4',
    [name, location, description || null, id],
  );
  if (rowCount) {
    await delCache(`company_${id}`);
  }
  return rowCount;
};

const deleteCompany = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM companies WHERE id = $1', [id]);
  if (rowCount) {
    await delCache(`company_${id}`);
  }
  return rowCount;
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
