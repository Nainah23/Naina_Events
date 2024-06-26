// emailService.js

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', to);
    } catch (err) {
        console.error('Error sending email:', err.message);
    }
};

module.exports = {
    sendRegistrationEmail: async (email, name) => {
        try {
            await sendEmail(
                email,
                'Welcome to Naina Events!',
                `Hello ${name},\n\nWelcome to Naina Events. We're excited to have you on board!`
            );
        } catch (err) {
            console.error('Error sending registration email:', err.message);
        }
    },

    sendEventRegistrationEmail: async (email, name, eventName) => {
        try {
            await sendEmail(
                email,
                'Event Registration Confirmation',
                `Hello ${name},\n\nYou have successfully registered for the event "${eventName}".`
            );
        } catch (err) {
            console.error('Error sending event registration email:', err.message);
        }
    },

    sendPasswordResetEmail: async (email, name, resetLink) => {
        try {
            await sendEmail(
                email,
                'Password Reset Request',
                `Hello ${name},\n\nYou have requested to reset your password. Please follow this link to reset your password: ${resetLink}`
            );
        } catch (err) {
            console.error('Error sending password reset email:', err.message);
        }
    },
    sendEventConfirmation: async (email, name) => {
        try {
            await sendEmail(
                email,
                'Event Created Successfully',
                `Hello ${name},\n\nYour event has been created successfully.`
            );
        } catch (err) {
            console.error('Error sending event confirmation email:', err.message);
        }
    },

    sendNotificationEmail: async (subject, message) => {
        try {
            // Replace 'admin@example.com' with the email address you want to send notifications to
            const adminEmail = 'admin@example.com';
            await sendEmail(
                adminEmail,
                subject,
                message
            );
        } catch (err) {
            console.error('Error sending notification email:', err.message);
        }
    }
};
