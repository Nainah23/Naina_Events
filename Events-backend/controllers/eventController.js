const Event = require('../models/Event');
const multer = require('multer');
const path = require('path');

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

exports.createEvent = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        } else {
            const { title, description, date, time, location, capacity } = req.body;

            try {
                const event = new Event({
                    title,
                    description,
                    date,
                    time,
                    location,
                    image: req.file.path,
                    capacity,
                    organizer: req.user.id
                });

                await event.save();
                res.json(event);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        }
    });
};

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', ['name', 'email']);
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Other CRUD operations for events
