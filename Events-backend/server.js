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
app.use('/api/test', testRoutes)
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
