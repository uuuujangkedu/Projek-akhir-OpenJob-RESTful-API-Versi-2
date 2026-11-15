const multer = require('multer');
const path = require('path');
const fs = require('fs');
const service = require('../services/documents');
const { InvariantError, NotFoundError } = require('../exceptions');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') return cb(new InvariantError('File is required and must be a PDF'));
    cb(null, true);
  },
}).single('document');

const createDocument = (req, res, next) => {
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        throw new InvariantError('File size must not exceed 5 MB');
      }
      if (err) throw err;
      if (!req.file) throw new InvariantError('File is required');

      const { filename, mimetype, size, path: filePath } = req.file;
      const originalname = path.basename(req.file.originalname).replace(/["\r\n]/g, '');
      const id = await service.createDocument({ filename, originalname, mimetype, size, path: filePath });

      res.status(201).json({
        status: 'success',
        data: { documentId: id, filename, originalName: originalname, size },
      });
    } catch (error) {
      next(error);
    }
  });
};

const getDocuments = async (req, res) => {
  const documents = await service.getAllDocuments();
  res.status(200).json({ status: 'success', data: { documents } });
};

const getDocumentById = async (req, res) => {
  const document = await service.getDocumentById(req.params.id);
  if (!document) throw new NotFoundError('Document tidak ditemukan');

  if (!fs.existsSync(document.path)) throw new NotFoundError('File tidak ditemukan');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${document.originalname}"`);
  res.sendFile(document.path);
};

const deleteDocument = async (req, res) => {
  const document = await service.getDocumentById(req.params.id);
  if (!document) throw new NotFoundError('Document tidak ditemukan');

  await service.deleteDocument(req.params.id);
  if (fs.existsSync(document.path)) fs.unlinkSync(document.path);

  res.status(200).json({ status: 'success', message: 'Document berhasil dihapus' });
};

module.exports = { createDocument, getDocuments, getDocumentById, deleteDocument };