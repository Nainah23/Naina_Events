import React, { useState, useContext } from 'react';
import { PaymentContext } from '../../context/PaymentContext';
import { initiatePayment } from '../../api/payments';

const InitiatePayment = () => {
  const [amount, setAmount] = useState('');
  const { paymentDetails, setPaymentDetails } = useContext(PaymentContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await initiatePayment({ amount, paymentDetails });
      setPaymentDetails(data);
    } catch (err) {
      console.error('Payment initiation error', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <div>
        <label>Phone Number:</label>
        <input type="number" value={paymentDetails} onChange={(e) => setPaymentDetails(e.target.value)} required />
      </div>
      <button type="submit">Initiate Payment</button>
    </form>
  );
};

export default InitiatePayment;
