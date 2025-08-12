import React from 'react';

const ImagePlaceholder = ({ 
  alt, 
  className = '', 
  width = '100%', 
  height = '200px',
  text = 'Image Placeholder',
  bgColor = '#f8f9fa',
  textColor = '#6c757d'
}) => {
  const style = {
    width,
    height,
    backgroundColor: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: textColor,
    fontSize: '1rem',
    fontWeight: '500',
    borderRadius: '8px',
    border: '2px dashed #dee2e6',
    textAlign: 'center',
    padding: '1rem'
  };

  return (
    <div 
      className={`image-placeholder ${className}`}
      style={style}
      role="img"
      aria-label={alt}
    >
      <div>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
        <div>{text}</div>
        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
          Add actual image
        </div>
      </div>
    </div>
  );
};

export default ImagePlaceholder; 