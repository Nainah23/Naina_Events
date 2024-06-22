// components/Events/CreateEvent.jsx
import React, { useState } from 'react';
import { createEvent } from '../../api/events';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [capacity, setCapacity] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');

  const navigate = useNavigate();

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
    formData.append('ticketPrice', ticketPrice);

    try {
      await createEvent(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Redirect to /allEvents upon successful event creation
      navigate('/allEvents');
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
        <div className="form-group">
          <label>Ticket Price:</label>
          <input type="number" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} required />
        </div>
        <button type="submit" className="create-event-button">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
