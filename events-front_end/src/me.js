//context/AuthContext;
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// context/EventContext.js;
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

// Auth/Login.jsx;
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      setAuthData(data);
      console.log('Form submitted');
      navigate('/allEvents');
    } catch (err) {
      console.error('Login error', err);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;

//api/auth.js;
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

export const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  console.log('API response:', response); 
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  return response.data;
};

export const resetPassword = async (email) => {
  const response = await axios.post(API_URL + 'reset-password', { email });
  return response.data;
};

//api/events.js;
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

export const createEvent = async (eventData, config) => {
  try {
    const response = await axios.post(API_URL + 'create', eventData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

