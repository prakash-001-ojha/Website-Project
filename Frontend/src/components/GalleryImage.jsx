import React, { useState } from 'react';
import ImagePlaceholder from './ImagePlaceholder';

const GalleryImage = ({ image, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // If image failed to load, show placeholder
  if (imageError) {
    return (
      <ImagePlaceholder 
        alt={image.alt}
        text={image.placeholder.text}
        height="250px"
        bgColor={image.placeholder.bgColor}
        textColor={image.placeholder.textColor}
        className={`gallery-placeholder ${className}`}
      />
    );
  }

  return (
    <div className={`gallery-image-container ${className}`}>
      <img
        src={image.src}
        alt={image.alt}
        className={`gallery-image ${imageLoaded ? 'loaded' : 'loading'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          width: '100%',
          height: '250px',
          objectFit: 'cover',
          borderRadius: '8px',
          transition: 'opacity 0.3s ease',
          opacity: imageLoaded ? 1 : 0
        }}
      />
      {!imageLoaded && !imageError && (
        <div 
          className="image-loading"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '250px',
            backgroundColor: image.placeholder.bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: image.placeholder.textColor,
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
};

export default GalleryImage; 