import React, { createContext, useState } from 'react';

export const PaymentContext = createContext();

const PaymentProvider = ({ children }) => {
  const [paymentDetails, setPaymentDetails] = useState(null);

  return (
    <PaymentContext.Provider value={{ paymentDetails, setPaymentDetails }}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentProvider;
