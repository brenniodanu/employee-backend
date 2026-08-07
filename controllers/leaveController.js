const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get Semua Cuti beserta Nama User
exports.getLeaves = async (req, res) => {
  try {
    const leaves = await prisma.leave.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Mengurutkan dari pengajuan paling baru
      },
    });
    res.json(leaves);
  } catch (error) {
    console.error('Error GET /leave:', error);
    res.status(500).json({ message: 'Gagal mengambil data cuti', error: error.message });
  }
};

// Buat Pengajuan Cuti Baru
exports.createLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Sesi login tidak valid. Silakan login ulang.' });
    }

    const newLeave = await prisma.leave.create({
      data: {
        userId: Number(userId), // Dikonversi ke Number (Int) agar sesuai Prisma schema
        type: type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason: reason,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json(newLeave);
  } catch (error) {
    console.error('Error POST /leave:', error);
    res.status(500).json({ message: 'Gagal menyimpan pengajuan cuti: ' + error.message });
  }
};

// Update Status (Approve/Reject)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedLeave = await prisma.leave.update({
      where: { 
        id: Number(id) // Dikonversi dari string req.params ke Int
      },
      data: { status },
      include: {
        user: {
          select: { name: true }
        }
      }
    });

    res.json(updatedLeave);
  } catch (error) {
    console.error('Error PATCH /leave:', error);
    res.status(500).json({ message: 'Gagal memperbarui status cuti', error: error.message });
  }
};