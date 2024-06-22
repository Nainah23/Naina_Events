import { Link } from 'react-router-dom';
import './Home.css'; // Import custom CSS for styling

const Home = () => {
    return (
        <div className="home-container">
            <nav className="navbar">
                <ul className="nav-links">
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </ul>
            </nav>
            <div className="content">
                <h1 className="heading">Welcome to the Event Management System</h1>
                <p className="description">
                    Discover and manage your events with ease. Whether you're organizing an
                    exciting concert, a corporate gathering, or a community fundraiser, our
                    platform simplifies every step from planning to execution.
                </p>
            </div>
        </div>
    );
};

export default Home;
