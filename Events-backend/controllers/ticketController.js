const Ticket = require('../models/Ticket');
const QRCode = require('qrcode');

exports.generateTicket = async (req, res) => {
    const { eventId, userId, type } = req.body;

    try {
        const qrCodeData = {
            eventId,
            userId,
            type,
            timestamp: Date.now()
        };

        const qrCodeText = JSON.stringify(qrCodeData);
        const qrCodeImage = await QRCode.toDataURL(qrCodeText);

        const ticket = new Ticket({
            event: eventId,
            user: userId,
            type,
            qrCode: qrCodeImage
        });

        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTicketsByUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const tickets = await Ticket.find({ user: userId }).populate('event');
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Other ticket-related operations
