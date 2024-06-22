import axios from 'axios';

const API_URL = 'http://localhost:8080/api/payments/';

export const initiatePayment = async (paymentData, config) => {
  const response = await axios.post(API_URL + 'initiate', paymentData, config);
  return response.data;
};

export const paymentCallback = async (callbackData) => {
  const response = await axios.post(API_URL + 'callback', callbackData);
  return response.data;
};
