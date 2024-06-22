import axios from 'axios';

const API_URL = 'http://localhost:8080/api/events/';

export const getEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createEvent = async (eventData, config) => {
  const response = await axios.post(API_URL + 'create', eventData, config);
  return response.data;
};

export const deleteEvent = async (eventId, config) => {
  const response = await axios.delete(API_URL + eventId, config);
  return response.data;
};
