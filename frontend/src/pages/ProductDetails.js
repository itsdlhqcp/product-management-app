import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import apiService from '../services/api.js';
import AddProductModal from '../components/modals/AddProductModal';
import "../assets/styles/pages/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  
  // NEW: Wishlist state
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Fetch wishlist count
  const fetchWishlistCount = async () => {
    try {
      const response = await apiService.getWishlistCount();
      setWishlistCount(response.count);
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
    }
  };

  // Check if product is in wishlist
  const checkWishlistStatus = async () => {
    try {
      const response = await apiService.isInWishlist(id);
      setIsInWishlist(response.isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    try {
      setWishlistLoading(true);
      
      if (isInWishlist) {
        await apiService.removeFromWishlist(id);
        setIsInWishlist(false);
        setWishlistCount(prev => Math.max(0, prev - 1));
        alert('Product removed from wishlist!');
      } else {
        await apiService.addToWishlist(id);
        setIsInWishlist(true);
        setWishlistCount(prev => prev + 1);
        alert('Product added to wishlist!');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Error updating wishlist: ' + error.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Handle wishlist navigation
  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  // Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      const result = await apiService.getSubCategories();
      setSubCategories(result.subCategories);
    } catch (error) {
      console.error('Error fetching sub-categories:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await apiService.getProductById(id);
        setProduct(response.product);
        
        // Fetch additional data
        await Promise.all([
          fetchSubCategories(),
          fetchWishlistCount(),
          checkWishlistStatus()
        ]);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/signin');
  };

  const handleSearch = (searchTerm) => {
    navigate('/', { state: { searchTerm } });
  };

  const handleQuantityChange = (newQuantity) => {
    const maxQuantity = product?.variants?.[selectedVariant]?.quantity || 1;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const variant = product?.variants?.[selectedVariant];
    if (variant && quantity <= variant.quantity) {
      setCartCount(prev => prev + quantity);
      alert(`${quantity} x ${product.title} added to cart!`);
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      const response = await apiService.updateProduct(id, formData);
      setProduct(response.product);
      setIsEditModalOpen(false);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product: ' + error.message);
    }
  };

  const getProductImage = (imageName) => {
    return imageName ? apiService.getImageUrl(imageName) : '/placeholder-image.jpg';
  };

  const navigateHome = () => {
    const token = localStorage.getItem('token');
    navigate(token ? '/home' : '/signin');
  };

  if (loading) {
    return (
      <div className="product-details-container">
        <Header 
          onLogout={handleLogout} 
          cartCount={cartCount} 
          wishlistCount={wishlistCount}
          onSearch={handleSearch}
          onWishlistClick={handleWishlistClick}
        />
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-container">
        <Header 
          onLogout={handleLogout} 
          cartCount={cartCount} 
          wishlistCount={wishlistCount}
          onSearch={handleSearch}
          onWishlistClick={handleWishlistClick}
        />
        <div className="error">
          <p>{error || 'Product not found'}</p>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants?.[selectedVariant];
  const isInStock = currentVariant?.quantity > 0;

  return (
    <div className="product-details-container">
      <Header 
        onLogout={handleLogout} 
        cartCount={cartCount} 
        wishlistCount={wishlistCount}
        onSearch={handleSearch}
        onWishlistClick={handleWishlistClick}
      />
      
      <div className="breadcrumb">
        <span onClick={navigateHome} className="breadcrumb-link">Home</span>
        <span className="breadcrumb-separator">›</span>
        <span>Product details</span>
      </div>

      <div className="product-details-content">
        <div className="product-images-section">
          <div className="main-image">
            <img 
              src={getProductImage(product.images[selectedImageIndex])} 
              alt={product.title}
              onError={(e) => e.target.src = '/placeholder-image.jpg'}
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img 
                    src={getProductImage(image)} 
                    alt={`${product.title} ${index + 1}`}
                    onError={(e) => e.target.src = '/placeholder-image.jpg'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.title}</h1>
          
          <div className="product-price">
            ${currentVariant?.price?.toFixed(2) || '0.00'}
          </div>

          <div className="availability">
            <span className="availability-label">Availability:</span>
            <span className={`availability-status ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
              {isInStock ? '✓ In stock' : '✗ Out of stock'}
            </span>
          </div>

          {isInStock && (
            <div className="stock-info">
              Hurry up! only {currentVariant.quantity} product left in stock!
            </div>
          )}

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          {product.variants?.length > 0 && (
            <div className="variants-section">
              <div className="variant-group">
                <label>Ram:</label>
                <div className="variant-options">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      className={`variant-option ${index === selectedVariant ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(index)}
                    >
                      {variant.ram} GB
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="quantity-section">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                max={currentVariant?.quantity || 1}
                className="quantity-input"
              />
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= (currentVariant?.quantity || 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="edit-product-btn"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit product
            </button>
            <button 
              className="buy-now-btn"
              onClick={() => alert('Proceeding to checkout...')}
              disabled={!isInStock}
            >
              Buy it now
            </button>
            <button 
              className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
            >
              {wishlistLoading ? '...' : (isInWishlist ? '❤️' : '♡')}
            </button>
          </div>
        </div>
      </div>
      
      <AddProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onAdd={handleUpdateProduct}
        subCategories={subCategories}
        editMode={true}
        initialData={product}
      />
    </div>
  );
};

export default ProductDetails;