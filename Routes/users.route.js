const { findUsers } = require('../Controllers/GET/users.controller.js');
const { createUser, verifyOTPUser } = require('../Controllers/POST/users.controller.js');
const { sessionUser } = require('../Middleware/session.middleware.js');

const express = require('express');

const router = express.Router();

router.get('/users', sessionUser, findUsers);
router.post('/create-data/user', createUser);
router.patch('/verify/user', verifyOTPUser);

module.exports = router;