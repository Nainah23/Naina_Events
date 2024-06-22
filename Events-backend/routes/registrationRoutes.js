const express = require('express');
const router = express.Router();
const passport = require('passport');
const registrationController = require('../controllers/registrationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register/:eventId', authMiddleware, registrationController.registerForEvent);

module.exports = router;
