const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// 1. GET: Ambil Daftar Slip Gaji Seluruh Karyawan
router.get('/', async (req, res) => {
  try {
    const payrolls = await prisma.payroll.findMany({
      include: {
        user: { select: { nip: true, name: true, department: true, position: true } },
      },
      orderBy: { id: 'desc' },
    });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data penggajian' });
  }
});

// 2. POST: Buat Slip Gaji Baru
router.post('/', async (req, res) => {
  const { userId, month, year, baseSalary, allowances, deductions } = req.body;

  const base = parseFloat(baseSalary) || 0;
  const allow = parseFloat(allowances) || 0;
  const deduct = parseFloat(deductions) || 0;
  const netSalary = base + allow - deduct; // Perhitungan Gaji Bersih

  try {
    const newPayroll = await prisma.payroll.create({
      data: {
        userId: parseInt(userId),
        month: parseInt(month),
        year: parseInt(year),
        baseSalary: base,
        allowances: allow,
        deductions: deduct,
        netSalary,
      },
    });
    res.status(201).json(newPayroll);
  } catch (error) {
    res.status(400).json({ message: 'Gagal membuat slip gaji' });
  }
});

module.exports = router;