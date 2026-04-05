const express = require('express');
const { getAuditLogs } = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Only ADMIN can access Audit Logs
router.get('/', protect, authorize('ADMIN'), getAuditLogs);

module.exports = router;
