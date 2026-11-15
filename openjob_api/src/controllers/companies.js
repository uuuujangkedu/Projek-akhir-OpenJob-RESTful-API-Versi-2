const service = require('../services/companies');
const { NotFoundError } = require('../exceptions');

const createCompany = async (req, res) => {
  const id = await service.createCompany(req.body);
  res.status(201).json({ status: 'success', data: { id } });
};

const getCompanies = async (req, res) => {
  const companies = await service.getAllCompanies();
  res.status(200).json({ status: 'success', data: { companies } });
};

const getCompanyById = async (req, res) => {
  const result = await service.getCompanyById(req.params.id);
  if (!result.data) throw new NotFoundError('Company tidak ditemukan');

  res.setHeader('X-Data-Source', result.dataSource);
  res.status(200).json({ status: 'success', data: result.data });
};

const updateCompany = async (req, res) => {
  const rowCount = await service.updateCompany(req.params.id, req.body);
  if (!rowCount) throw new NotFoundError('Company tidak ditemukan');

  res.status(200).json({ status: 'success', message: 'Company berhasil diperbarui' });
};

const deleteCompany = async (req, res) => {
  const rowCount = await service.deleteCompany(req.params.id);
  if (!rowCount) throw new NotFoundError('Company tidak ditemukan');

  res.status(200).json({ status: 'success', message: 'Company berhasil dihapus' });
};

module.exports = { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany };
