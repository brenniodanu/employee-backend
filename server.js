require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// --- Konfigurasi CORS ---
app.use(cors({
  origin: [
    'https://employee-frontend-seven-topaz.vercel.app',
    'https://employee-frontend-qccf.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// FIX ERROR BINTANG: Ubah '*' menjadi '/*' untuk Express V5
app.options('/*', cors());

app.use(express.json());

// Rute utama agar Vercel mendeteksi server hidup (Health Check)
app.get('/', (req, res) => {
  res.send('Server Employee Backend Berhasil Berjalan!');
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/dashboard', dashboardRoutes);

// WAJIB UNTUK VERCEL: Ekspor app
module.exports = app;

// Jalankan app.listen HANYA di komputer lokal, matikan di Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}