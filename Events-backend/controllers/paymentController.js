const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const getAccessToken = async () => {
    const credentials = Buffer.from(`${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`, 'utf8').toString('base64');
    console.log('Encoded Credentials:', credentials);
    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });
        console.log('Access Token Response:', response.data);
        return response.data.access_token;
    } catch (err) {
        console.error('Error generating access token:', err.response ? err.response.data : err.message);
        throw new Error('Could not generate access token');
    }
};

exports.initiatePayment = async (req, res) => {
    const { amount, phoneNumber } = req.body;

    try {
        const accessToken = await getAccessToken();
        console.log('Access Token:', accessToken);

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

       //

        const payload = {
            BusinessShortCode: process.env.DARAJA_BUSINESS_SHORTCODE,
            Password: 'MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMTYwMjE2MTY1NjI3',
            Timestamp: '20160216165627',    
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: process.env.DARAJA_BUSINESS_SHORTCODE,
            PhoneNumber: phoneNumber,
            CallBackURL: `${process.env.BASE_URL}/api/payments/callback`,
            AccountReference: 'EventPayment',
            TransactionDesc: 'Payment for event registration'
        };

        console.log('Request Payload:', payload);

        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, { headers });
        res.json(response.data);
    } catch (err) {
        if (err.response) {
            console.error('Response Data:', err.response.data);
            console.error('Response Status:', err.response.status);
            console.error('Response Headers:', err.response.headers);
            res.status(err.response.status).json(err.response.data);
        } else if (err.request) {
            console.error('Request Data:', err.request);
            res.status(500).send('No response received from the server');
        } else {
            console.error('Error Message:', err.message);
            res.status(500).send(err.message);
        }
    }
};

exports.paymentCallback = (req, res) => {
    console.log(req.body);
    // Process payment callback and update registration status
    res.sendStatus(200);
};
