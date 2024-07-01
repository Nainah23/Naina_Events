import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

export const register = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'register', userData);
    const token = response.data.token;
    localStorage.setItem('token', token); // Store token in local storage
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'login', userData);
    const token = response.data.token;
    localStorage.setItem('token', token); // Store token in local storage
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await axios.post(API_URL + 'reset-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};
