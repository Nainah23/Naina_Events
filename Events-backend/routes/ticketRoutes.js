const express = require('express');
const router = express.Router();
const passport = require('passport');
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');

// router.post('/generate', authMiddleware, ticketController.generateTicket);
router.get('/user', authMiddleware, ticketController.getTicketsByUser);

module.exports = router;
