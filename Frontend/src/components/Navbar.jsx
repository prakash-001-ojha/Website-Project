import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Nature Nest Tiger
        </Link>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link to="/services" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Services
          </Link>
          <Link to="/gallery" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Gallery
          </Link>
          <Link to="/rooms" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Rooms
          </Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/dashboard" className="nav-link dashboard-btn" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-user"></i>
                {user?.name}
              </Link>
            </div>
          ) : (
            <Link to="/login" className="nav-link login-btn" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
        
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
