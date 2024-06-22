import React, { createContext, useState } from 'react';

export const EventContext = createContext();

const EventProvider = ({ children }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <EventContext.Provider value={{ selectedEvent, setSelectedEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
