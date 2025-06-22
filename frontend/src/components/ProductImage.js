import React from 'react';
import apiService from '../services/api';

const ProductImage = ({ 
  filename, 
  alt = 'Product Image', 
  className = '',
  style = {},
  fallbackSrc = '/default-product.png' 
}) => {
  const [imageSrc, setImageSrc] = React.useState(null);
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    if (filename) {
      setImageSrc(apiService.getImageUrl(filename));
    }
  }, [filename]);

  const handleImageError = () => {
    setImageError(true);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  if (!filename || imageError) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        style={style}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleImageError}
    />
  );
};

export default ProductImage;