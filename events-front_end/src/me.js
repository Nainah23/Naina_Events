These are my relevant backend files;
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


These are my relevant frontend files;
// components/Events/CreateEvent.jsx
import React, { useState } from 'react';
import { createEvent } from '../../api/events';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [capacity, setCapacity] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('location', location);
    formData.append('image', image);
    formData.append('capacity', capacity);
    formData.append('ticketPrice', ticketPrice);

    try {
      await createEvent(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Redirect to /allEvents upon successful event creation
      navigate('/allEvents');
    } catch (err) {
      console.error('Event creation error', err);
    }
  };

  return (
    <div className="create-event-container">
      <form onSubmit={handleSubmit} className="create-event-form">
        <h2>Create Event</h2>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Image:</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
        </div>
        <div className="form-group">
          <label>Capacity:</label>
          <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Ticket Price:</label>
          <input type="number" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} required />
        </div>
        <button type="submit" className="create-event-button">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;

src/components/Events/EventList.jsx;
import React, { useEffect, useState, useContext } from 'react';
import { EventContext } from '../../context/EventContext';
import { getEvents } from '../../api/events';
import { Link } from 'react-router-dom';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const { selectedEvent, setSelectedEvent } = useContext(EventContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="event-list-container">
      <h2>Event List</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id} onClick={() => setSelectedEvent(event)} className="event-list-item">
            {event.title}
          </li>
        ))}
      </ul>
      <nav className="event-list-nav">
        <ul>
          <li>
            <Link to="/create-event" className="nav-link">Create Event</Link>
          </li>
          <li>
            <Link to="/user" className="nav-link">My Tickets</Link> {/* Link to /user for tickets */}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default EventList;

src/components/Auth/Login.jsx;
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      setAuthData(data);
      console.log('Form submitted');
      navigate('/events'); // Redirect to /events after successful login
    } catch (err) {
      console.error('Login error', err);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;


src/api/auth.js;
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

export const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  console.log('API response:', response); 
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  return response.data;
};

export const resetPassword = async (email) => {
  const response = await axios.post(API_URL + 'reset-password', { email });
  return response.data;
};

src/api/events.js;
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/events/';

export const getEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createEvent = async (eventData, config) => {
  const response = await axios.post(API_URL + 'create', eventData, config);
  return response.data;
};

export const deleteEvent = async (eventId, config) => {
  const response = await axios.delete(API_URL + eventId, config);
  return response.data;
};

src/components/context/AuthContext.js;
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

App.js;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import EventProvider from './context/EventContext';
import PaymentProvider from './context/PaymentContext';
import Home from './components/Pages/Home'; // Corrected import path
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EventList from './components/Events/EventList';
import EventDetails from './components/Events/EventDetails';
import CreateEvent from './components/Events/CreateEvent';
import InitiatePayment from './components/Payments/InitiatePayment';
import PaymentCallback from './components/Payments/PaymentCallback';
import RegisterForEvent from './components/Registrations/RegisterForEvent';
import GenerateTicket from './components/Tickets/GenerateTicket';

const App = () => {
  return (
    <AuthProvider>
      <EventProvider>
        <PaymentProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/allEvents" element={<EventList />} />
              <Route path="/event-details" element={<EventDetails />} />
              <Route path="/create" element={<CreateEvent />} />
              <Route path="/initiate" element={<InitiatePayment />} />
              <Route path="/callback" element={<PaymentCallback />} />
              <Route path="/register/:eventId" element={<RegisterForEvent />} />
              <Route path="/user" element={<GenerateTicket />} /> {/* Use GenerateTicket for /user route */}
            </Routes>
          </Router>
        </PaymentProvider>
      </EventProvider>
    </AuthProvider>
  );
};

export default App;
