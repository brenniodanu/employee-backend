// routes/reportRoutes.js
const express = require('express');
const { getAttendanceReport, getLeaveReport } = require('../controllers/reportController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/attendance', verifyToken, verifyRole(['ADMIN', 'HR']), getAttendanceReport);
router.get('/leave', verifyToken, verifyRole(['ADMIN', 'HR']), getLeaveReport);

module.exports = router;