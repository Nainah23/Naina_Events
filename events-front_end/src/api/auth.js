import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

export const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  console.log('API response:', response); 
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  return response.data;
};

export const resetPassword = async (email) => {
  const response = await axios.post(API_URL + 'reset-password', { email });
  return response.data;
};
