import React, { useContext } from 'react';
import { EventContext } from '../../context/EventContext';
import { registerForEvent } from '../../api/registrations';
import { generateTicket } from '../../api/tickets';
import './RegisterForEvent.css';

const RegisterForEvent = () => {
  const { selectedEvent } = useContext(EventContext);

  const handleRegister = async () => {
    if (!selectedEvent) return;

    try {
      await registerForEvent(selectedEvent._id);
      await generateTicket({ eventId: selectedEvent._id }); // Generate ticket after registration
      // Handle successful registration and ticket generation
    } catch (err) {
      console.error('Event registration error', err);
    }
  };

  return (
    <div className="register-event-container">
      <button onClick={handleRegister} disabled={!selectedEvent} className="register-event-button">
        Register for Event
      </button>
    </div>
  );
};

export default RegisterForEvent;
