const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// GET semua karyawan
const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, nip: true, name: true, email: true, role: true, position: true, department: true, createdAt: true },
    });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data karyawan', error: error.message });
  }
};

// GET detail 1 karyawan
const getEmployeeById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'ID tidak valid' });

  try {
    const employee = await prisma.user.findUnique({ where: { id } });
    if (!employee) return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data karyawan' });
  }
};

// POST tambah karyawan baru
const createEmployee = async (req, res) => {
  try {
    const { nip, name, email, password, role, position, department } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password || '123456', 10);

    const newEmployee = await prisma.user.create({
      data: {
        nip,
        name,
        email,
        password: hashedPassword,
        role: role || 'EMPLOYEE',
        position,
        department: department || 'IT',
      },
    });

    res.status(201).json({ message: 'Karyawan berhasil ditambahkan', data: newEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambah karyawan', error: error.message });
  }
};

// PUT update karyawan
const updateEmployee = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'ID tidak valid' });

  const { nip, name, email, department, position, role } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { nip, name, email, department, position, role },
    });
    res.json({ message: 'Data karyawan berhasil diperbarui', data: updated });
  } catch (error) {
    res.status(400).json({ message: 'Gagal memperbarui data karyawan' });
  }
};

// DELETE hapus karyawan
const deleteEmployee = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'ID tidak valid' });

  try {
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: 'Karyawan berhasil dihapus' });
  } catch (error) {
    res.status(400).json({ message: 'Gagal menghapus karyawan' });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};