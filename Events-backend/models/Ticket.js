const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['VIP', 'Regular'], required: true },
    qrCode: { type: String, required: true }
});

module.exports = mongoose.model('Ticket', TicketSchema);
