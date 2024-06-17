const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

exports.initiatePayment = async (req, res) => {
    const { amount, phoneNumber } = req.body;

    try {
        const token = Buffer.from(`${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`, 'utf8').toString('base64');

        const headers = {
            'Authorization': `Basic ${token}`,
            'Content-Type': 'application/json'
        };

        const payload = {
            BusinessShortCode: process.env.DARAJA_BUSINESS_SHORTCODE,
            Password: process.env.DARAJA_PASSWORD,
            Timestamp: '20220603152344',
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: process.env.DARAJA_BUSINESS_SHORTCODE,
            PhoneNumber: phoneNumber,
            CallBackURL: `${process.env.BASE_URL}/api/payments/callback`,
            AccountReference: 'EventPayment',
            TransactionDesc: 'Payment for event registration'
        };

        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, { headers });
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.paymentCallback = (req, res) => {
    console.log(req.body);
    // Process payment callback and update registration status
    res.sendStatus(200);
};
