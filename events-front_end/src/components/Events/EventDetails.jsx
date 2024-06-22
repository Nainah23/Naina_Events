import React, { useContext } from 'react';
import { EventContext } from '../../context/EventContext';

const EventDetails = () => {
  const { selectedEvent } = useContext(EventContext);

  if (!selectedEvent) return <div>Select an event to see details</div>;

  return (
    <div>
      <h2>{selectedEvent.title}</h2>
      <p>{selectedEvent.description}</p>
      <p>Date: {selectedEvent.date}</p>
      <p>Time: {selectedEvent.time}</p>
      <p>Location: {selectedEvent.location}</p>
      <p>Price: {selectedEvent.ticketPrice}</p>
      <p>Capacity: {selectedEvent.capacity}</p>
    </div>
  );
};

export default EventDetails;
