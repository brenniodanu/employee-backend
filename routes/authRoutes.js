const express = require('express');
const jwt = require('jsonwebtoken'); // 1. Tambahkan import jsonwebtoken
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// 2. Gunakan `router.get` (bukan `app.get`)
// 3. Gunakan rute '/me' (bukan '/api/auth/me')
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Tidak ada token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_be');
    return res.json({ user: decoded });
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
});

module.exports = router;