const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Confirmed', 'Pending'], default: 'Pending' }
});

module.exports = mongoose.model('Registration', RegistrationSchema);
