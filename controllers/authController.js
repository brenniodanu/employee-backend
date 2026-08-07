const prisma = require('../prisma/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTRASI USER (Untuk testing buat Admin pertama kali)
const register = async (req, res) => {
  try {
    const { nip, name, email, password, role } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email sudah digunakan" });

    // Hash password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const user = await prisma.user.create({
      data: {
        nip, name, email, role,
        password: hashedPassword,
      }
    });

    res.status(201).json({ message: "User berhasil didaftarkan", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN USER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    // Cocokkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Password salah" });

    // Buat Token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } // Token berlaku 1 hari
    );

    // Kirim response
    res.status(200).json({
      message: "Login sukses",
      token,
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };