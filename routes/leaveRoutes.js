const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Middleware JWT Anda

router.get('/', verifyToken, leaveController.getLeaves);
router.post('/', verifyToken, leaveController.createLeave);
router.patch('/:id', verifyToken, leaveController.updateLeaveStatus);

module.exports = router;