const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ROUTE CEK PRESENSI HARI INI
router.get('/today/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Ambil rentang waktu awal & akhir hari ini
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Kirim data jika ada, atau null jika belum absen
    return res.json(attendance || null);
  } catch (error) {
    console.error('Error fetch today attendance:', error);
    return res.status(500).json({ message: 'Gagal memuat status presensi' });
  }
});

// Route lainnya...
router.get('/', attendanceController.getAttendanceReport);
router.post('/clock-in', attendanceController.clockIn);
router.post('/clock-out', attendanceController.clockOut);

module.exports = router;