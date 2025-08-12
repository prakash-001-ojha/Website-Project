// src/components/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../style/HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="container">
          <h1 className="hero-title">
            Welcome to Nature Nest Tiger
          </h1>
          <p className="hero-subtitle">
            Experience luxury, wildlife, and unforgettable moments in the heart of Bardiya, Nepal
          </p>
          <div className="hero-buttons">
            <Link to="/rooms" className="btn btn-primary">
              Book Your Stay
            </Link>
            <Link to="/gallery" className="btn btn-secondary">
              Explore Gallery
            </Link>
          </div>
        </div>
      </div>
      
      <div className="hero-features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <span className="feature-icon">🏔️</span>
              <span className="feature-text">Mountain Views</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🐯</span>
              <span className="feature-text">Wildlife Experience</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🍽️</span>
              <span className="feature-text">Local Cuisine</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🧘</span>
              <span className="feature-text">Wellness & Adventure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
