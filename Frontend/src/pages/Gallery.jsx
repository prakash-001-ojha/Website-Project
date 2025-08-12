import React, { useState } from 'react';
import GalleryImage from '../components/GalleryImage';
import ImagePlaceholder from '../components/ImagePlaceholder';
import '../style/Gallery.css';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    {
      id: 1,
      src: "/images/gallery1.jpg",
      alt: "Resort Exterior",
      category: "exterior",
      placeholder: {
        text: "Resort Exterior",
        bgColor: "#e3f2fd",
        textColor: "#1976d2"
      }
    },
    {
      id: 2,
      src: "/images/gallery2.jpg",
      alt: "Swimming Pool",
      category: "amenities",
      placeholder: {
        text: "Swimming Pool",
        bgColor: "#e8f5e8",
        textColor: "#388e3c"
      }
    },
    {
      id: 3,
      src: "/images/gallery3.jpg",
      alt: "Fine Dining Restaurant",
      category: "dining",
      placeholder: {
        text: "Fine Dining",
        bgColor: "#fff3e0",
        textColor: "#f57c00"
      }
    },
    {
      id: 4,
      src: "/images/gallery4.jpg",
      alt: "Wildlife Viewing",
      category: "nature",
      placeholder: {
        text: "Wildlife Viewing",
        bgColor: "#f3e5f5",
        textColor: "#7b1fa2"
      }
    },
    {
      id: 5,
      src: "/images/gallery5.jpg",
      alt: "Spa & Wellness",
      category: "wellness",
      placeholder: {
        text: "Spa & Wellness",
        bgColor: "#fce4ec",
        textColor: "#c2185b"
      }
    },
    {
      id: 6,
      src: "/images/gallery6.jpg",
      alt: "Adventure Activities",
      category: "adventure",
      placeholder: {
        text: "Adventure Activities",
        bgColor: "#e0f2f1",
        textColor: "#00695c"
      }
    },
    {
      id: 7,
      src: "/images/gallery7.jpg",
      alt: "Mountain View Terrace",
      category: "terrace",
      placeholder: {
        text: "Mountain View Terrace",
        bgColor: "#fff8e1",
        textColor: "#f57f17"
      }
    },
    {
      id: 8,
      src: "/images/gallery8.jpg",
      alt: "Conference Room",
      category: "business",
      placeholder: {
        text: "Conference Room",
        bgColor: "#f1f8e9",
        textColor: "#689f38"
      }
    },
    {
      id: 9,
      src: "/images/gallery9.jpg",
      alt: "Garden Wedding Venue",
      category: "events",
      placeholder: {
        text: "Garden Wedding Venue",
        bgColor: "#fce4ec",
        textColor: "#c2185b"
      }
    },
    {
      id: 10,
      src: "/images/gallery10.jpg",
      alt: "Yoga Studio",
      category: "wellness",
      placeholder: {
        text: "Yoga Studio",
        bgColor: "#e8f5e8",
        textColor: "#388e3c"
      }
    },
    {
      id: 11,
      src: "/images/gallery11.jpg",
      alt: "Bar & Lounge",
      category: "entertainment",
      placeholder: {
        text: "Bar & Lounge",
        bgColor: "#fff3e0",
        textColor: "#f57c00"
      }
    },
    {
      id: 12,
      src: "/images/gallery12.jpg",
      alt: "Sunset View",
      category: "nature",
      placeholder: {
        text: "Sunset View",
        bgColor: "#ffebee",
        textColor: "#d32f2f"
      }
    },
    {
      id: 13,
      src: "/images/room1.jpg",
      alt: "Deluxe Room",
      category: "rooms",
      placeholder: {
        text: "Deluxe Room",
        bgColor: "#e3f2fd",
        textColor: "#1976d2"
      }
    },
    {
      id: 14,
      src: "/images/room2.jpg",
      alt: "Premium Suite",
      category: "rooms",
      placeholder: {
        text: "Premium Suite",
        bgColor: "#f3e5f5",
        textColor: "#7b1fa2"
      }
    },
    {
      id: 15,
      src: "/images/room3.jpg",
      alt: "Family Villa",
      category: "rooms",
      placeholder: {
        text: "Family Villa",
        bgColor: "#e8f5e8",
        textColor: "#388e3c"
      }
    },
    {
      id: 16,
      src: "/images/hero.jpg",
      alt: "Mountain Views",
      category: "exterior",
      placeholder: {
        text: "Mountain Views",
        bgColor: "#fff3e0",
        textColor: "#f57c00"
      }
    },
    {
      id: 17,
      src: "/images/login.jpg",
      alt: "Resort Lobby",
      category: "interior",
      placeholder: {
        text: "Resort Lobby",
        bgColor: "#fce4ec",
        textColor: "#c2185b"
      }
    },
    {
      id: 18,
      src: "/images/register.jpg",
      alt: "Garden Area",
      category: "exterior",
      placeholder: {
        text: "Garden Area",
        bgColor: "#e0f2f1",
        textColor: "#00695c"
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'exterior', name: 'Exterior' },
    { id: 'rooms', name: 'Rooms' },
    { id: 'amenities', name: 'Amenities' },
    { id: 'dining', name: 'Dining' },
    { id: 'wellness', name: 'Wellness' },
    { id: 'nature', name: 'Nature' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'interior', name: 'Interior' },
    { id: 'terrace', name: 'Terrace' },
    { id: 'business', name: 'Business' },
    { id: 'events', name: 'Events' },
    { id: 'entertainment', name: 'Entertainment' }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-page">
      <div className="gallery-hero">
        <div className="gallery-hero-content">
          <h1>Photo Gallery</h1>
          <p>Explore the beauty and luxury of Nature Nest Tiger through our photo collection</p>
        </div>
      </div>

      <div className="gallery-content">
        <div className="container">
          <div className="gallery-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="gallery-item"
                onClick={() => openModal(image)}
              >
                <GalleryImage image={image} />
                <div className="gallery-overlay">
                  <span>{image.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-image-container">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="modal-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}
              />
              <div 
                className="modal-placeholder"
                style={{
                  display: 'none',
                  width: '100%',
                  height: '400px',
                  backgroundColor: selectedImage.placeholder.bgColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  color: selectedImage.placeholder.textColor,
                  fontSize: '1.5rem',
                  fontWeight: '500',
                  marginBottom: '20px'
                }}
              >
                {selectedImage.placeholder.text}
              </div>
            </div>
            <h3>{selectedImage.alt}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 