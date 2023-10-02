const { loginUser } = require('../Controllers/POST/auth.controller');
const express = require('express');

const router = express.Router();

router.post('/api/auth/login', loginUser);

module.exports = router;