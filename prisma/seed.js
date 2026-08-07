// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const firstNames = [
  'Budi', 'Siti', 'Ahmad', 'Rina', 'Dewi', 'Eko', 'Rizal', 'Fitri', 'Hendra', 'Maya',
  'Doni', 'Lestari', 'Andi', 'Novi', 'Rian', 'Indah', 'Fajar', 'Dian', 'Bambang', 'Sri',
  'Agus', 'Mega', 'Rizky', 'Titi', 'Gilang', 'Putri', 'Bayu', 'Tari', 'Dimas', 'Nita'
];

const lastNames = [
  'Santoso', 'Pratama', 'Hidayat', 'Wibowo', 'Kusuma', 'Saputra', 'Nugroho', 'Siregar',
  'Setiawan', 'Utami', 'Wijaya', 'Permana', 'Gunawan', 'Suryani', 'Firmansyah', 'Puspita',
  'Wahyudi', 'Triyana', 'Kurniawan', 'Ramadhan'
];

const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales'];

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // 1. Buat / Perbarui Akun Admin Utama
  await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: { password: adminPassword },
    create: {
      nip: 'ADM001',
      name: 'Administrator',
      email: 'admin@mail.com',
      password: adminPassword,
      role: 'ADMIN',
      department: 'IT',
    },
  });

  console.log('Akun Admin berhasil disiapkan.');

  // 2. Generate 30 Data Karyawan Acak
  const totalKaryawan = 30;

  for (let i = 1; i <= totalKaryawan; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@mail.com`;
    const nip = `EMP${String(100 + i).padStart(4, '0')}`;
    const dept = departments[Math.floor(Math.random() * departments.length)];

    await prisma.user.upsert({
      where: { email: email },
      update: {},
      create: {
        nip: nip,
        name: fullName,
        email: email,
        password: userPassword,
        role: 'EMPLOYEE',
        department: dept,
      },
    });
  }

  console.log(`Berhasil menambahkan ${totalKaryawan} data karyawan acak!`);
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });