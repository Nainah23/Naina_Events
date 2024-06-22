import React, { useState } from 'react';
import { paymentCallback } from '../../api/payments';

const PaymentCallback = () => {
  const [callbackData, setCallbackData] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await paymentCallback(callbackData);
      // Handle successful callback processing
    } catch (err) {
      console.error('Payment callback error', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Callback Data:</label>
        <textarea value={callbackData} onChange={(e) => setCallbackData(e.target.value)} required />
      </div>
      <button type="submit">Submit Callback</button>
    </form>
  );
};

export default PaymentCallback;
