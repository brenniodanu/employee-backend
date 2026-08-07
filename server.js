require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron'); // 1. Import node-cron

// Import controller untuk cron job
const { autoMarkAlpha } = require('./controllers/attendanceController'); // 2. Import autoMarkAlpha

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 3. Setup Cron Job: Jalankan otomatis setiap hari Senin - Jumat pukul 23:59 WIB
cron.schedule('59 23 * * 1-5', async () => {
  console.log('[CRON JOB] Menjalankan pengecekan otomatis Karyawan ALPHA...');
  await autoMarkAlpha();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});