import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import apiService from '../services/api.js';
import "../assets/styles/pages/Wishlist.css";

const Wishlist = () => {
  const navigate = useNavigate();
  
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Fetch wishlist data
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserWishlist();
      setWishlist(response.wishlist || []);
      setWishlistCount(response.count || 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    fetchWishlist();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/signin');
  };

  const handleSearch = (searchTerm) => {
    navigate('/', { state: { searchTerm } });
  };

  const handleWishlistClick = () => {
    // Already on wishlist page, do nothing or refresh
    fetchWishlist();
  };

  const handleRemoveFromWishlist = async (productId, productTitle) => {
    try {
      await apiService.removeFromWishlist(productId);
      
      // Update local state
      setWishlist(prev => prev.filter(item => item.productId._id !== productId));
      setWishlistCount(prev => Math.max(0, prev - 1));
      
      alert(`${productTitle} removed from wishlist!`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Error removing from wishlist: ' + error.message);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product) => {
    setCartCount(prev => prev + 1);
    alert(`${product.title} added to cart!`);
  };

  const getProductImage = (imageName) => {
    return imageName ? apiService.getImageUrl(imageName) : '/placeholder-image.jpg';
  };

  if (loading) {
    return (
      <div className="wishlist-container">
        <Header 
          onLogout={handleLogout} 
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          onSearch={handleSearch}
          onWishlistClick={handleWishlistClick}
        />
        <div className="loading">Loading wishlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-container">
        <Header 
          onLogout={handleLogout} 
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          onSearch={handleSearch}
          onWishlistClick={handleWishlistClick}
        />
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchWishlist}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <Header 
        onLogout={handleLogout} 
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onSearch={handleSearch}
        onWishlistClick={handleWishlistClick}
      />
      
      <div className="breadcrumb">
        <span onClick={() => navigate('/home')} className="breadcrumb-link">Home</span>
        <span className="breadcrumb-separator">›</span>
        <span>Wishlist</span>
      </div>

      <div className="wishlist-content">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <span className="wishlist-count">
            {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">💔</div>
            <h2>Your wishlist is empty</h2>
            <p>Save items you like to view them later</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/home')}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => {
              const product = item.productId;
              const firstVariant = product.variants?.[0];
              const productImage = product.images?.[0];
              
              return (
                <div key={item._id} className="wishlist-item">
                  <div className="wishlist-item-image">
                    <img 
                      src={getProductImage(productImage)} 
                      alt={product.title}
                      onClick={() => handleProductClick(product._id)}
                      onError={(e) => e.target.src = '/placeholder-image.jpg'}
                    />
                    <button 
                      className="remove-wishlist-btn"
                      onClick={() => handleRemoveFromWishlist(product._id, product.title)}
                      title="Remove from wishlist"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="wishlist-item-info">
                    <h3 
                      className="wishlist-item-title"
                      onClick={() => handleProductClick(product._id)}
                    >
                      {product.title}
                    </h3>
                    
                    <p className="wishlist-item-description">
                      {product.description}
                    </p>
                    
                    {firstVariant && (
                      <div className="wishlist-item-details">
                        <div className="wishlist-item-price">
                          ${firstVariant.price?.toFixed(2)}
                        </div>
                        
                        <div className="wishlist-item-stock">
                          {firstVariant.quantity > 0 ? (
                            <span className="in-stock">✓ In Stock</span>
                          ) : (
                            <span className="out-of-stock">✗ Out of Stock</span>
                          )}
                        </div>
                        
                        {product.variants?.length > 1 && (
                          <div className="wishlist-item-variants">
                            <span>RAM: {firstVariant.ram}GB</span>
                            {product.variants.length > 1 && (
                              <span className="more-variants">
                                +{product.variants.length - 1} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="wishlist-item-actions">
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                        disabled={!firstVariant || firstVariant.quantity === 0}
                      >
                        Add to Cart
                      </button>
                      
                      <button 
                        className="view-product-btn"
                        onClick={() => handleProductClick(product._id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;