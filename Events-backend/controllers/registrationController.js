const Registration = require('../models/Registration');
const Event = require('../models/Event');

exports.registerForEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        if (event.capacity <= 0) {
            return res.status(400).json({ msg: 'Event is full' });
        }

        const existingRegistration = await Registration.findOne({ event: eventId, user: userId });
        if (existingRegistration) {
            return res.status(400).json({ msg: 'Already registered for this event' });
        }

        const registration = new Registration({
            event: eventId,
            user: userId,
            status: 'Pending'
        });

        await registration.save();

        // Decrease event capacity
        event.capacity -= 1;
        await event.save();

        res.json(registration);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getRegistrationsByUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const registrations = await Registration.find({ user: userId }).populate('event');
        res.json(registrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Other registration-related operations
