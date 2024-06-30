// authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');
const emailService = require('../utils/email');
const dotenv = require('dotenv');
dotenv.config();

exports.register = async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;

    try {
        const db = getDB();
        const userCollection = db.collection('users');

        let user = await userCollection.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        user = {
            name,
            email,
            password: hashedPassword,
            phoneNumber
        };

        await userCollection.insertOne(user);

        // Send registration email
        await emailService.sendRegistrationEmail(email, name);

        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = getDB();
        const userCollection = db.collection('users');

        const user = await userCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const db = getDB();
        const userCollection = db.collection('users');

        const user = await userCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Generate password reset token (you may want to store and validate it)
        const resetToken = jwt.sign(
            { user: user._id },
            process.env.JWT_RESET_SECRET,
            { expiresIn: '1h' }
        );

        // Example of password reset link (you would send this via email)
        const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;

        // Send password reset email
        await emailService.sendPasswordResetEmail(email, resetLink);

        res.json({ msg: 'Password reset email sent' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

eventController.js
const { getDB } = require('../config/db');
const multer = require('multer');
const path = require('path');
const emailService = require('../utils/email');

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
            const { title, description, date, time, location, capacity, ticketPrice } = req.body;

            try {
                const db = getDB();
                const eventsCollection = db.collection('allEvents');

                const event = {
                    title,
                    description,
                    date,
                    time,
                    location,
                    image: req.file ? req.file.path : null,
                    ticketPrice,
                    capacity,
                    organizer: req.user.id
                };

                await eventsCollection.insertOne(event);

                // Send confirmation email
                await emailService.sendEventConfirmation(req.user.email, req.user.name);

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
        const db = getDB();
        const eventsCollection = db.collection('events');
        const events = await eventsCollection.find().toArray();
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};



// authRoutes.js;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.get('/register', authController.register);
router.post('/login', authController.login);
router.get('/login', authController.login);
router.post('/reset-passwd', authController.resetPassword);
router.get('/reset-passwd', authController.resetPassword);

module.exports = router;

// eventRoutes.js;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', eventController.createEvent);
router.get('/allEvents', eventController.getEvents);

module.exports = router;

// server.js;
// server.js
const express = require('express');
const { connectDB } = require('./config/db'); // Import connectDB correctly
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const testRoutes = require('./routes/test');

const app = express();
// Handle CORS
app.use(cors({
    origin: '*'
  }));

// Middleware
app.use(express.json());
app.use(passport.initialize());
require('./config/passport')(passport);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/test', testRoutes);
app.get('/set-cookies', (req, res) => {
    res.cookie('username', 'John Doe');
    res.cookie('isAuthenticated', true, { httpOnly: true });
    res.send('Cookies are set');
});
app.get('/read-cookies', (req, res) => {
    const cookies = req.cookies;
    res.json(cookies);
});
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});
