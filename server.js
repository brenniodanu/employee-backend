require('dotenv').config();
const express = require('express');
const cors = require('cors');

// node-cron dimatikan karena Vercel Serverless Function tidak mendukung background process terus-menerus
// const cron = require('node-cron');
// const { autoMarkAlpha } = require('./controllers/attendanceController');

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

app.options('*', cors());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/dashboard', dashboardRoutes);

/* 
// Cron Job dimatikan untuk Vercel:
cron.schedule('59 23 * * 1-5', async () => {
  console.log('[CRON JOB] Menjalankan pengecekan otomatis Karyawan ALPHA...');
  await autoMarkAlpha();
});
*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

module.exports = app; 