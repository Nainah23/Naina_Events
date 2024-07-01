import axios from 'axios';

const API_URL = 'http://localhost:8080/api/events/';

export const getEvents = async () => {
  try {
    const response = await axios.get(API_URL + 'allEvents');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.post(API_URL + 'create', eventData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};
