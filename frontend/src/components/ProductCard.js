import React from 'react';
import apiService from '../services/api.js';
import '../assets/styles/components/ProductCard.css';

const ProductCard = ({ product, onAddToCart, onProductClick }) => {
  // Get the first image from the product images array
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return apiService.getImageUrl(product.images[0]);
    }
    // Fallback image if no image is available
    return '/placeholder-image.jpg';
  };

  // Get the first variant's price (or you can modify this logic)
  const getProductPrice = () => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].price;
    }
    return 0;
  };

  return (
    <div className="product-card" onClick={() => onProductClick && onProductClick(product)}>
      <div className="product-image-container">
        <img 
          src={getProductImage()} 
          alt={product.title}
          className="product-image"
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg'; // Fallback for broken images
          }}
        />
      </div>
      
      <div className="product-info">
        <div className="product-price" style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '4px' }}>
          ${getProductPrice()}
        </div>
        <h3 className="product-name" style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0', lineHeight: '1.2' }}>
          {product.title}
        </h3>
      </div>
    </div>
  );
};

export default ProductCard;