const express = require('express');
const router = express.Router();
const passport = require('passport');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/initiate', authMiddleware, paymentController.initiatePayment);
router.post('/callback', paymentController.paymentCallback);

module.exports = router;
