// controllers/reportController.js
const prisma = require('../prisma/prismaClient');

const getAttendanceReport = async (req, res) => {
  try {
    const report = await prisma.attendance.findMany({
      include: { user: { select: { name: true, nip: true, department: true } } },
      orderBy: { date: 'desc' },
    });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeaveReport = async (req, res) => {
  try {
    const report = await prisma.leaveRequest.findMany({
      include: { user: { select: { name: true, nip: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAttendanceReport, getLeaveReport };