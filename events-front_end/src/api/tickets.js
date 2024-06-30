import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tickets/';

export const getTicketsByUser = async (config) => {
  const response = await axios.get(API_URL + 'user', config);
  return response.data;
};

export const generateTicket = async (ticketData, config) => {
  const response = await axios.post(API_URL + 'generate', ticketData, config);
  return response.data;
};
