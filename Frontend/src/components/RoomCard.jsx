import React from 'react';
import { Link } from 'react-router-dom';
import '../style/RoomCard.css';

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <div className="room-image">
        <img src={room.image_url || '/images/default-room.jpg'} alt={room.name} />
        <div className="room-price">
          ${room.price_per_night}/night
        </div>
      </div>
      
      <div className="room-content">
        <h3 className="room-title">{room.name}</h3>
        <p className="room-description">{room.description}</p>
        
        <div className="room-details">
          <div className="room-capacity">
            <span>👥</span> Up to {room.capacity} guests
          </div>
          <div className="room-type">
            <span>🏨</span> {room.type}
          </div>
        </div>
        
        {room.amenities && room.amenities.length > 0 && (
          <div className="room-amenities">
            <h4>Amenities:</h4>
            <div className="amenities-list">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="amenity-tag">{amenity}</span>
              ))}
              {room.amenities.length > 3 && (
                <span className="amenity-tag">+{room.amenities.length - 3} more</span>
              )}
            </div>
          </div>
        )}
        
        <div className="room-actions">
          <Link to={`/booking/${room.id}`} className="btn btn-primary">
            Book Now
          </Link>
          <button className="btn btn-secondary">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
