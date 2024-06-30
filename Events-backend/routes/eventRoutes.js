const express = require('express');
const router = express.Router();
const passport = require('passport');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, eventController.createEvent);
router.get('/allEvents', eventController.getEvents);

module.exports = router;
