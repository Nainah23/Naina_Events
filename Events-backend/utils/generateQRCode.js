const QRCode = require('qrcode');

const generateQRCode = async (data) => {
    try {
        const qrCode = await QRCode.toDataURL(data);
        return qrCode;
    } catch (err) {
        console.error(err.message);
        return null;
    }
};

module.exports = generateQRCode;
