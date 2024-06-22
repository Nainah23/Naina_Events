import axios from 'axios';

const API_URL = 'http://localhost:8080/api/registrations/';

export const registerForEvent = async (eventId, config) => {
  const response = await axios.post(API_URL + `register/${eventId}`, {}, config);
  return response.data;
};

export const getRegistrationsByUser = async (config) => {
  const response = await axios.get(API_URL + 'user', config);
  return response.data;
};
