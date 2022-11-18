const express = require('express');
const router = express.Router();

const limiter = require('../middleware/express-rate-limit');
const userCtrl = require('../controllers/user');
const passwordValidator = require('../middleware/password-validator');

router.post('/signup', passwordValidator, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

module.exports = router;