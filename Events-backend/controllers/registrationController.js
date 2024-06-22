const { getDB } = require('../config/db');
const emailService = require('../utils/email'); // Import email service
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

exports.registerForEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;

    try {
        const db = getDB();
        const eventsCollection = db.collection('events');
        const registrationsCollection = db.collection('registrations');

        const event = await eventsCollection.findOne({ _id: eventId });
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        if (event.capacity <= 0) {
            return res.status(400).json({ msg: 'Event is full' });
        }

        const existingRegistration = await registrationsCollection.findOne({ event: eventId, user: userId });
        if (existingRegistration) {
            return res.status(400).json({ msg: 'Already registered for this event' });
        }

        const registration = {
            event: eventId,
            user: userId,
            status: 'Pending'
        };

        // Process payment (assuming you integrate this in paymentController.js)
        const paymentPayload = {
            amount: event.ticketPrice, // or any other logic for calculating amount
            phoneNumber: req.user.phoneNumber // assuming user's phone number is available
        };

        const paymentResponse = await axios.post('/api/payment/initiate', paymentPayload);

        // Assuming successful payment, you can proceed with registration
        await registrationsCollection.insertOne(registration);

        // Decrease event capacity
        await eventsCollection.updateOne({ _id: eventId }, { $inc: { capacity: -1 } });

        // Send event registration email
        await emailService.sendEventRegistrationEmail(req.user.email, event.title);

        res.json(registration);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getRegistrationsByUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const db = getDB();
        const registrationsCollection = db.collection('registrations');
        const registrations = await registrationsCollection.find({ user: userId }).toArray();
        res.json(registrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
