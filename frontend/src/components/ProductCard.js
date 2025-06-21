import React from 'react';
import '../assets/styles/components/ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
        />
        <div className="product-badge">
          <span className="heart-icon">♡</span>
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">${product.price}</div>
      </div>
    </div>
  );
};

export default ProductCard;