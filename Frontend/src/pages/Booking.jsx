import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-hot-toast';
import '../style/Booking.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    checkin: '',
    checkout: '',
    room_type: '',
    guests: 1,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const response = await API.get(`/rooms/${id}`);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
      // Use fallback room data
      setRoom({
        id: id,
        name: "Deluxe Mountain View Room",
        type: "Deluxe",
        description: "Spacious room with breathtaking mountain views, private balcony, and premium amenities.",
        price_per_night: 89.99,
        capacity: 3,
        amenities: ["Mountain View", "Private Balcony", "King Bed", "Mini Bar", "Room Service", "Free WiFi"],
        image_url: "/images/room1.jpg",
        is_available: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value
    });

    // Check availability when dates change
    if ((name === 'checkin' || name === 'checkout') && bookingData.checkin && bookingData.checkout) {
      checkAvailability();
    }
  };

  const checkAvailability = async () => {
    if (!bookingData.checkin || !bookingData.checkout) return;

    setAvailabilityLoading(true);
    try {
      const response = await API.post('/rooms/check-availability', {
        room_id: id,
        checkin: bookingData.checkin,
        checkout: bookingData.checkout
      });
      setIsAvailable(response.data.available);
    } catch (error) {
      console.error('Error checking availability:', error);
      // Assume available if check fails
      setIsAvailable(true);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const calculateNights = () => {
    if (!bookingData.checkin || !bookingData.checkout) return 0;
    const checkin = new Date(bookingData.checkin);
    const checkout = new Date(bookingData.checkout);
    const diffTime = checkout - checkin;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateTotal = () => {
    if (!room) return 0;
    const nights = calculateNights();
    return nights * room.price_per_night;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAvailable) {
      toast.error('Selected dates are not available. Please choose different dates.');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingPayload = {
        ...bookingData,
        room_type: room.type,
        total_price: calculateTotal()
      };

      const response = await API.post('/bookings', bookingPayload);
      
      if (response.data) {
        toast.success('Booking submitted successfully!');
        navigate('/rooms');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="loading">Loading room details...</div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="error">Room not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-hero">
        <div className="booking-hero-content">
          <h1>Book Your Stay</h1>
          <p>Complete your reservation for {room.name}</p>
        </div>
      </div>

      <div className="booking-content">
        <div className="container">
          <div className="booking-grid">
            <div className="room-details">
              <h2>Room Details</h2>
              <div className="room-info">
                <img src={room.image_url || '/images/default-room.jpg'} alt={room.name} />
                <div className="room-info-content">
                  <h3>{room.name}</h3>
                  <p>{room.description}</p>
                  <div className="room-specs">
                    <span>👥 Capacity: {room.capacity} guests</span>
                    <span>🏨 Type: {room.type}</span>
                    <span>💰 ${room.price_per_night}/night</span>
                  </div>
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="room-amenities">
                      <h4>Amenities:</h4>
                      <div className="amenities-list">
                        {room.amenities.map((amenity, index) => (
                          <span key={index} className="amenity-tag">{amenity}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="booking-form-container">
              <form className="booking-form" onSubmit={handleSubmit}>
                <h2>Booking Information</h2>
                
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={bookingData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="checkin">Check-in Date *</label>
                    <input
                      type="date"
                      id="checkin"
                      name="checkin"
                      value={bookingData.checkin}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="checkout">Check-out Date *</label>
                    <input
                      type="date"
                      id="checkout"
                      name="checkout"
                      value={bookingData.checkout}
                      onChange={handleChange}
                      min={bookingData.checkin || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                {/* Availability Status */}
                {bookingData.checkin && bookingData.checkout && (
                  <div className="availability-status">
                    {availabilityLoading ? (
                      <div className="availability-loading">Checking availability...</div>
                    ) : (
                      <div className={`availability-indicator ${isAvailable ? 'available' : 'unavailable'}`}>
                        {isAvailable ? '✅ Available for selected dates' : '❌ Not available for selected dates'}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="guests">Number of Guests *</label>
                  <select
                    id="guests"
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleChange}
                    required
                  >
                    {[...Array(room.capacity)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Special Requests</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={bookingData.message}
                    onChange={handleChange}
                    placeholder="Any special requests or preferences..."
                  ></textarea>
                </div>

                <div className="booking-summary">
                  <h3>Booking Summary</h3>
                  <div className="summary-item">
                    <span>Nights:</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="summary-item">
                    <span>Price per night:</span>
                    <span>${room.price_per_night}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting || !isAvailable}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
