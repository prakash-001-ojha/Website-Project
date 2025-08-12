import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ImagePlaceholder from '../components/ImagePlaceholder';
import '../style/Home.css';

const Home = () => {
  const [availabilityData, setAvailabilityData] = useState({
    checkin: '',
    checkout: '',
    guests: 1
  });
  const [availabilityResult, setAvailabilityResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleAvailabilityChange = (e) => {
    setAvailabilityData({
      ...availabilityData,
      [e.target.name]: e.target.value
    });
  };

  const checkAvailability = async (e) => {
    e.preventDefault();
    if (!availabilityData.checkin || !availabilityData.checkout) {
      alert('Please select both check-in and check-out dates');
      return;
    }

    setIsChecking(true);
    
    setTimeout(() => {
      const checkin = new Date(availabilityData.checkin);
      const checkout = new Date(availabilityData.checkout);
      const daysDiff = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

      const isAvailable = daysDiff > 0 && daysDiff <= 30;
      
      setAvailabilityResult({
        available: isAvailable,
        message: isAvailable 
          ? `Available! ${daysDiff} night(s) from ${availabilityData.checkin} to ${availabilityData.checkout}`
          : 'Not available for selected dates. Please try different dates.',
        rooms: isAvailable ? [
          { type: 'Deluxe Room', price: 89, available: true },
          { type: 'Premium Suite', price: 149, available: true },
          { type: 'Family Villa', price: 199, available: true }
        ] : []
      });
      setIsChecking(false);
    }, 1500);
  };

  const RoomCard = ({ roomId, title, price, imageSrc, bgColor, textColor }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <Link to={`/booking/${roomId}`} className="room-preview clickable">
        {!imageError ? (
          <img
            src={imageSrc}
            alt={title}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '8px 8px 0 0'
            }}
          />
        ) : (
          <ImagePlaceholder 
            alt={title}
            text={title}
            height="200px"
            bgColor={bgColor}
            textColor={textColor}
          />
        )}
        <h3>{title}</h3>
        <p>Starting from ${price}/night</p>
        <div className="room-overlay">
          <span>Book Now</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="home-page">
      <HeroSection />
      
      <section className="availability-section">
        <div className="container">
          <div className="availability-card">
            <h2>Check Availability</h2>
            <p>Find your perfect stay at Nature Nest Tiger</p>
            
            <form onSubmit={checkAvailability} className="availability-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    name="checkin"
                    value={availabilityData.checkin}
                    onChange={handleAvailabilityChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    name="checkout"
                    value={availabilityData.checkout}
                    onChange={handleAvailabilityChange}
                    min={availabilityData.checkin || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Guests</label>
                  <select
                    name="guests"
                    value={availabilityData.guests}
                    onChange={handleAvailabilityChange}
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary" disabled={isChecking}>
                    {isChecking ? 'Checking...' : 'Check Availability'}
                  </button>
                </div>
              </div>
            </form>

            {availabilityResult && (
              <div className={`availability-result ${availabilityResult.available ? 'available' : 'unavailable'}`}>
                <h3>{availabilityResult.available ? '✅ Available!' : '❌ Not Available'}</h3>
                <p>{availabilityResult.message}</p>
                
                {availabilityResult.available && availabilityResult.rooms && (
                  <div className="available-rooms">
                    <h4>Available Room Types:</h4>
                    <div className="rooms-list">
                      {availabilityResult.rooms.map((room, index) => (
                        <div key={index} className="room-option">
                          <span className="room-type">{room.type}</span>
                          <span className="room-price">${room.price}/night</span>
                          <Link to={`/booking/${index + 1}`} className="btn btn-secondary btn-sm">
                            Book Now
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Nature Nest Tiger?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏔️</div>
              <h3>Prime Location</h3>
              <p>Located in the heart of Bardiya, Nepal with stunning Forest views</p>
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
              <h3>Wellness & Adventure</h3>
              <p>Yoga sessions, spa treatments, and exciting adventure activities</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rooms-preview">
        <div className="container">
          <h2>Our Luxurious Accommodations</h2>
          <p>Experience comfort and elegance in our carefully designed rooms and suites</p>
          <div className="rooms-grid">
            <RoomCard 
              roomId={1}
              title="Deluxe Room"
              price={89}
              imageSrc="/images/room1.jpg"
              bgColor="#e3f2fd"
              textColor="#1976d2"
            />
            <RoomCard 
              roomId={2}
              title="Premium Suite"
              price={149}
              imageSrc="/images/room2.jpg"
              bgColor="#f3e5f5"
              textColor="#7b1fa2"
            />
            <RoomCard 
              roomId={3}
              title="Family Villa"
              price={199}
              imageSrc="/images/room3.jpg"
              bgColor="#e8f5e8"
              textColor="#388e3c"
            />
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2>What Our Guests Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p>"Absolutely amazing experience! The wildlife sightings were incredible and the staff was incredibly friendly."</p>
              <div className="testimonial-author">
                <strong>Sarah Johnson</strong>
                <span>New York, USA</span>
              </div>
            </div>
            <div className="testimonial-card">
              <p>"The best resort we've ever stayed at. Perfect location in Bardiya, beautiful rooms, and excellent service."</p>
              <div className="testimonial-author">
                <strong>Michael Chen</strong>
                <span>Toronto, Canada</span>
              </div>
            </div>
            <div className="testimonial-card">
              <p>"A truly magical experience in the heart of Nepal. We can't wait to come back next year!"</p>
              <div className="testimonial-author">
                <strong>Emma Davis</strong>
                <span>London, UK</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
