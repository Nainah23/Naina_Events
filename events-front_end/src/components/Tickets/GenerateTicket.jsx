import React, { useState, useEffect } from 'react';
import { getTicketsByUser } from '../../api/tickets';
import './GenerateTicket.css';

const TicketsByUser = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const fetchedTickets = await getTicketsByUser();
        setTickets(fetchedTickets);
      } catch (err) {
        setError('Failed to fetch tickets');
        console.error('Failed to fetch tickets', err);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="tickets-container">
      <h2>Your Tickets</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="tickets-list">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="ticket-card">
            <p>Event ID: {ticket.event}</p>
            <p>Type: {ticket.type}</p>
            <img src={ticket.qrCode} alt="QR Code" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketsByUser;
