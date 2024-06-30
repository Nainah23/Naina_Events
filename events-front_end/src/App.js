import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import EventProvider from './context/EventContext';
import PaymentProvider from './context/PaymentContext';
import Home from './components/Pages/Home'; // Corrected import path
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EventList from './components/Events/EventList';
import EventDetails from './components/Events/EventDetails';
import CreateEvent from './components/Events/CreateEvent';
import InitiatePayment from './components/Payments/InitiatePayment';
import PaymentCallback from './components/Payments/PaymentCallback';
import RegisterForEvent from './components/Registrations/RegisterForEvent';
import TicketsByUser from './components/Tickets/GenerateTicket';

const App = () => {
  return (
    <AuthProvider>
      <EventProvider>
        <PaymentProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/allEvents" element={<EventList />} />
              <Route path="/event-details" element={<EventDetails />} />
              <Route path="/create" element={<CreateEvent />} />
              <Route path="/initiate" element={<InitiatePayment />} />
              <Route path="/callback" element={<PaymentCallback />} />
              <Route path="/register/:eventId" element={<RegisterForEvent />} />
              <Route path="/user" element={<TicketsByUser />} /> 
            </Routes>
          </Router>
        </PaymentProvider>
      </EventProvider>
    </AuthProvider>
  );
};

export default App;
