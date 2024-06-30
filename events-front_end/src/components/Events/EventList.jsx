import React, { useEffect, useState, useContext } from 'react';
import { EventContext } from '../../context/EventContext';
import { getEvents } from '../../api/events';
import { Link } from 'react-router-dom';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const { selectedEvent, setSelectedEvent } = useContext(EventContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="event-list-container">
      <h2>Event List</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id} onClick={() => setSelectedEvent(event)} className="event-list-item">
            {event.title}
          </li>
        ))}
      </ul>
      <nav className="event-list-nav">
        <ul>
          <li>
            <Link to="/create" className="nav-link">Create Event</Link>
          </li>
          <li>
            <Link to="/user" className="nav-link">My Tickets</Link> {/* Link to /user for tickets */}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default EventList;
