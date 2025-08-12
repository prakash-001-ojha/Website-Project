import React, { useState, useEffect } from 'react';
import API from '../api';
import RoomCard from '../components/RoomCard';
import '../style/Rooms.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fallbackRooms = [
    {
      id: 1,
      name: "Deluxe Mountain View Room",
      type: "Deluxe",
      description: "Spacious room with breathtaking mountain views, private balcony, and premium amenities.",
      price_per_night: 89.99,
      capacity: 3,
      amenities: ["Mountain View", "Private Balcony", "King Bed", "Mini Bar", "Room Service", "Free WiFi"],
      image_url: "/images/room1.jpg",
      is_available: true
    },
    {
      id: 2,
      name: "Premium Wildlife Suite",
      type: "Suite",
      description: "Luxurious suite designed for wildlife enthusiasts with large windows overlooking the natural habitat.",
      price_per_night: 149.99,
      capacity: 4,
      amenities: ["Wildlife View", "Large Windows", "King Bed", "Living Area", "Free WiFi", "Guided Tours"],
      image_url: "/images/room2.jpg",
      is_available: true
    },
    {
      id: 3,
      name: "Family Villa",
      type: "Villa",
      description: "Large family villa with multiple bedrooms, kitchen, and garden. Perfect for families seeking adventure.",
      price_per_night: 199.99,
      capacity: 6,
      amenities: ["Multiple Bedrooms", "Kitchen", "Garden", "Mountain View", "Free WiFi", "Parking"],
      image_url: "/images/room3.jpg",
      is_available: true
    }
  ];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await API.get('/rooms');
      setRooms(response.data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setRooms(fallbackRooms);
      console.log('Using fallback room data');
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = filter === 'all' 
    ? rooms 
    : rooms.filter(room => room.type.toLowerCase() === filter.toLowerCase());

  const roomTypes = ['all', ...new Set(rooms.map(room => room.type))];

  if (loading) {
    return (
      <div className="rooms-page">
        <div className="rooms-hero">
          <div className="rooms-hero-content">
            <h1>Our Rooms & Suites</h1>
            <p>Choose from our selection of luxurious accommodations</p>
          </div>
        </div>
        <div className="container">
          <div className="loading">Loading rooms...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rooms-page">
      <div className="rooms-hero">
        <div className="rooms-hero-content">
          <h1>Our Rooms & Suites</h1>
          <p>Choose from our selection of luxurious accommodations</p>
        </div>
      </div>

      <div className="rooms-content">
        <div className="container">
          <div className="rooms-filters">
            <h3>Filter by Type:</h3>
            <div className="filter-buttons">
              {roomTypes.map((type) => (
                <button
                  key={type}
                  className={`filter-btn ${filter === type ? 'active' : ''}`}
                  onClick={() => setFilter(type)}
                >
                  {type === 'all' ? 'All Rooms' : type}
                </button>
              ))}
            </div>
          </div>

          <div className="rooms-grid">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))
            ) : (
              <div className="no-rooms">
                <p>No rooms available for the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
