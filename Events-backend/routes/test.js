// routes/test.js
const express = require('express');
const router = express.Router();
const emailService = require('../utils/email');

router.get('/send-test-email', async (req, res) => {
    try {
        await emailService.sendRegistrationEmail('mukamiwaite68@gmail.com', 'Test User');
        res.send('Test email sent successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error sending test email');
    }
});

module.exports = router;
