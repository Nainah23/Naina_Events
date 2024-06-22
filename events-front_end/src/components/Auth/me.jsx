// components/Events/CreateEvents.jsx;
import React, { useState } from 'react';
import { createEvent } from '../../api/events';
import './CreateEvent.css';

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [capacity, setCapacity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('location', location);
    formData.append('image', image);
    formData.append('capacity', capacity);

    try {
      await createEvent(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Handle successful event creation
    } catch (err) {
      console.error('Event creation error', err);
    }
  };

  return (
    <div className="create-event-container">
      <form onSubmit={handleSubmit} className="create-event-form">
        <h2>Create Event</h2>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Image:</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
        </div>
        <div className="form-group">
          <label>Capacity:</label>
          <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
        </div>
        <button type="submit" className="create-event-button">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;


// components/Events/EventList.jsx;
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
            <Link to="/create-event" className="nav-link">Create Event</Link>
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
