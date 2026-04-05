const express = require('express');
const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  exportCSV
} = require('../controllers/recordController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/export', protect, authorize('ADMIN', 'ANALYST'), exportCSV);

router
  .route('/')
  .get(protect, authorize('ADMIN', 'ANALYST', 'VIEWER'), getRecords)
  .post(protect, authorize('ADMIN'), createRecord);

router
  .route('/:id')
  .get(protect, authorize('ADMIN', 'ANALYST', 'VIEWER'), getRecordById)
  .put(protect, authorize('ADMIN'), updateRecord)
  .delete(protect, authorize('ADMIN'), deleteRecord);

module.exports = router;
