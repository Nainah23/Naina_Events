//middleware/authMiddleware.js;
const passport = require('passport');
require('../config/passport'); // Ensure passport strategies are configured

module.exports = passport.authenticate('jwt', { session: false });

