import React from 'react';
import '../style/About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About Nature Nest Tiger</h1>
          <p>Discover luxury, wildlife, and unforgettable experiences in Bardiya, Nepal</p>
        </div>
      </div>

      <div className="about-content">
        <div className="container">
          <div className="about-section">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2015, Nature Nest Tiger has been providing exceptional hospitality 
                services to guests from around the world. Our commitment to sustainable tourism 
                and wildlife conservation has made us one of the most sought-after destinations 
                for travelers seeking adventure and luxury in the heart of Nepal.
              </p>
              <p>
                Nestled in the beautiful Bardiya region, our resort offers a perfect 
                blend of modern amenities and natural beauty. Whether you're here for 
                wildlife viewing, adventure activities, or simply to relax in the mountains, 
                we ensure every moment of your stay is memorable.
              </p>
            </div>
            <div className="about-image">
              <img src="/images/hero.jpg" alt="Nature Nest Tiger Resort" />
            </div>
          </div>

          <div className="features-section">
            <h2>Why Choose Nature Nest Tiger?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🏔️</div>
                <h3>Prime Location</h3>
                <p>Located in the heart of Bardiya with stunning mountain views and wildlife</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🐯</div>
                <h3>Wildlife Experience</h3>
                <p>Experience the beauty of nature and wildlife in their natural habitat</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🍽️</div>
                <h3>Local Cuisine</h3>
                <p>Authentic Nepali cuisine and international dishes prepared with local ingredients</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🧘</div>
                <h3>Adventure Activities</h3>
                <p>Hiking, wildlife safaris, yoga sessions, and cultural experiences</p>
              </div>
            </div>
          </div>

          <div className="team-section">
            <h2>Our Team</h2>
            <p>
              Our dedicated team of professionals is committed to providing you with 
              the best possible experience. From our knowledgeable guides to our hospitality 
              staff, everyone at Nature Nest Tiger is trained to exceed your expectations 
              and help you discover the beauty of Bardiya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 

// helllo
