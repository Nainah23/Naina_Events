const QRCode = require('qrcode');
const { getDB } = require('../config/db');

exports.generateTicket = async (req, res) => {
    const { eventId, userId, type } = req.body;

    try {
        const db = getDB();
        const ticketsCollection = db.collection('tickets');

        const qrCodeData = {
            eventId,
            userId,
            type,
            timestamp: Date.now()
        };

        const qrCodeText = JSON.stringify(qrCodeData);
        const qrCodeImage = await QRCode.toDataURL(qrCodeText);

        const ticket = {
            event: eventId,
            user: userId,
            type,
            qrCode: qrCodeImage
        };

        await ticketsCollection.insertOne(ticket);
        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTicketsByUser = async (req, res) => {
    const userId = req.user.id; // Assuming req.user.id is set by your authentication middleware

    try {
        const db = getDB();
        const ticketsCollection = db.collection('tickets');
        const tickets = await ticketsCollection.find({ user: userId }).toArray();
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


