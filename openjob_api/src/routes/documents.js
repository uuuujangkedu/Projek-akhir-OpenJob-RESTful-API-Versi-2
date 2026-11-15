const router = require('express').Router();
const controller = require('../controllers/documents');
const auth = require('../middlewares/auth');

router.post('/documents', auth, controller.createDocument);
router.get('/documents', controller.getDocuments);
router.get('/documents/:id', controller.getDocumentById);
router.delete('/documents/:id', auth, controller.deleteDocument);

module.exports = router;
