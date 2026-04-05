const express = require('express');
const { getDashboardSummary, getTrends } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', protect, authorize('ADMIN', 'ANALYST', 'VIEWER'), getDashboardSummary);
router.get('/trends', protect, authorize('ADMIN', 'ANALYST', 'VIEWER'), getTrends);

module.exports = router;
