const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
  try {
    const todayString = new Date().toISOString().split('T')[0];

    // Total karyawan
    const totalEmployees = await prisma.user.count({
      where: { role: 'EMPLOYEE' },
    });

    // Total presensi hari ini
    const todayAttendance = await prisma.attendance.count({
      where: { date: todayString },
    });

    // Total pengajuan cuti status PENDING
    const pendingLeaves = await prisma.leave.count({
      where: { status: 'PENDING' },
    });

    // Rincian status presensi hari ini
    const attendancesToday = await prisma.attendance.findMany({
      where: { date: todayString },
    });

    const totalHadir = attendancesToday.filter((a) => a.status === 'HADIR').length;
    const totalTerlambat = attendancesToday.filter((a) => a.status === 'TERLAMBAT').length;

    res.json({
      totalEmployees,
      todayAttendance,
      pendingLeaves,
      todayDetails: {
        hadir: totalHadir,
        terlambat: totalTerlambat,
      },
    });
  } catch (error) {
    console.error('Error Dashboard Stats:', error);
    res.status(500).json({ message: 'Gagal mengambil data statistik', error: error.message });
  }
};

module.exports = { getDashboardStats };