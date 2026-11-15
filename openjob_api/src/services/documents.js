const pool = require('../config/db');
const generateId = require('../utils/id');

const createDocument = async ({ filename, originalname, mimetype, size, path }) => {
  const id = generateId('document');
  await pool.query(
    'INSERT INTO documents (id, filename, originalname, mimetype, size, path) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, filename, originalname, mimetype, size, path],
  );
  return id;
};

const getAllDocuments = async () => {
  const { rows } = await pool.query('SELECT * FROM documents ORDER BY created_at DESC');
  return rows;
};

const getDocumentById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM documents WHERE id = $1', [id]);
  return rows[0];
};

const deleteDocument = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM documents WHERE id = $1', [id]);
  return rowCount;
};

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
};
