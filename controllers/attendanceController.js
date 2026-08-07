const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Clock In (Auto-Detect TERLAMBAT)
exports.clockIn = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.userId;

        if (!userId) {
            return res.status(400).json({ message: 'User ID tidak ditemukan. Silakan login kembali.' });
        }

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        const existing = await prisma.attendance.findFirst({
            where: { 
                userId: Number(userId), 
                date: todayStr 
            }
        });

        if (existing) {
            return res.status(400).json({ message: 'Anda sudah melakukan Clock In hari ini!' });
        }

        // Aturan jam 08:00
        const currentHour = now.getHours();
        const attendanceStatus = currentHour >= 8 ? 'TERLAMBAT' : 'HADIR';

        const attendance = await prisma.attendance.create({
            data: {
                userId: Number(userId),
                date: todayStr,
                clockIn: now,
                status: attendanceStatus
            }
        });

        res.status(201).json({
            message: attendanceStatus === 'TERLAMBAT' 
                ? 'Clock In berhasil, namun Anda dicatat TERLAMBAT.' 
                : 'Clock In berhasil Tepat Waktu!',
            data: attendance
        });
    } catch (error) {
        console.error('Error ClockIn:', error);
        res.status(500).json({ message: error.message });
    }
};

// 2. Clock Out
exports.clockOut = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.userId;
        const attendanceId = req.body?.attendanceId;
        const todayStr = new Date().toISOString().split('T')[0];

        let attendance;

        if (attendanceId) {
            attendance = await prisma.attendance.findUnique({ where: { id: Number(attendanceId) } });
        } else if (userId) {
            attendance = await prisma.attendance.findFirst({
                where: { userId: Number(userId), date: todayStr }
            });
        }

        if (!attendance) {
            return res.status(400).json({ message: 'Data absensi hari ini tidak ditemukan!' });
        }

        if (attendance.clockOut) {
            return res.status(400).json({ message: 'Anda sudah melakukan Clock Out hari ini!' });
        }

        const updated = await prisma.attendance.update({
            where: { id: attendance.id },
            data: { clockOut: new Date() }
        });

        res.json({ message: 'Clock Out berhasil!', data: updated });
    } catch (error) {
        console.error('Error ClockOut:', error);
        res.status(500).json({ message: error.message });
    }
};

// 3. Ambil Rekap Presensi
exports.getAttendanceReport = async (req, res) => {
    try {
        const attendances = await prisma.attendance.findMany({
            include: {
                user: { select: { nip: true, name: true, department: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(attendances);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data rekap presensi' });
    }
};

// 4. Auto Mark ALPHA
exports.autoMarkAlpha = async (req, res) => {
    try {
        const todayStr = new Date().toISOString().split('T')[0];

        const allEmployees = await prisma.user.findMany({ where: { role: 'EMPLOYEE' } });
        const todayAttendances = await prisma.attendance.findMany({ where: { date: todayStr } });

        const checkedUserIds = todayAttendances.map(a => a.userId);
        const absentEmployees = allEmployees.filter(emp => !checkedUserIds.includes(emp.id));

        const alphaRecords = absentEmployees.map(emp => ({
            userId: emp.id,
            date: todayStr,
            status: 'ALPHA'
        }));

        if (alphaRecords.length > 0) {
            await prisma.attendance.createMany({ data: alphaRecords });
        }

        if (res) res.json({ message: `Berhasil menandai ${alphaRecords.length} karyawan sebagai ALPHA` });
    } catch (error) {
        console.error('Error AutoMarkAlpha:', error);
        if (res) res.status(500).json({ message: error.message });
    }
};