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

  // Get product availability
  const getProductQuantity = () => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((total, variant) => total + variant.quantity, 0);
    }
    return 0;
  };

  const isOutOfStock = getProductQuantity() === 0;

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
        <div className="product-badge">
          <span className="heart-icon">♡</span>
        </div>
        {isOutOfStock && (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        
        {/* Category and Subcategory info */}
        <div className="product-category">
          <span className="category-name">
            {product.subCategoryId?.categoryId?.name}
          </span>
          {product.subCategoryId?.name && (
            <>
              <span className="category-separator"> • </span>
              <span className="subcategory-name">
                {product.subCategoryId.name}
              </span>
            </>
          )}
        </div>
        
        <div className="product-price-section">
          <div className="product-price">${getProductPrice()}</div>
          <div className="product-stock">
            {getProductQuantity()} in stock
          </div>
        </div>
        
        {/* Product variants info */}
        {product.variants && product.variants.length > 0 && (
          <div className="product-variants">
            {product.variants.map((variant, index) => (
              <div key={variant._id || index} className="variant-info">
                {variant.ram && <span className="variant-ram">RAM: {variant.ram}GB</span>}
                {variant.storage && <span className="variant-storage">Storage: {variant.storage}GB</span>}
                {variant.color && <span className="variant-color">Color: {variant.color}</span>}
              </div>
            ))}
          </div>
        )}
        
        {onAddToCart && (
          <button 
            className={`add-to-cart-btn ${isOutOfStock ? 'disabled' : ''}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when button is clicked
              if (!isOutOfStock) {
                onAddToCart(product);
              }
            }}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;