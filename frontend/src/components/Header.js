import React, { useState } from 'react';
import '../assets/styles/components/Header.css';

const Header = ({ onLogout, cartCount = 0, wishlistCount = 0, onSearch, onWishlistClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      onSearch(value.trim());
    } else {
      onSearch('');
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false);
    onLogout();
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  const handleUserClick = () => {
    setShowUserPopup(!showUserPopup);
  };

  const getUserData = () => {
    const userData = localStorage.getItem('userData');
    const token = localStorage.getItem('token');
    
    let userInfo = {};
    if (userData) {
      try {
        userInfo = JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    return {
      userId: userInfo.id || userInfo._id || 'N/A',
      email: userInfo.email || 'N/A',
      token: token ? `${token.substring(0, 20)}...` : 'N/A'
    };
  };

  const userInfo = getUserData();

  return (
    <header className="header">
      <div className="header-container">
        <div className="search-section">
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search any things..." 
              className="search-input"
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            <button type="submit" className="search-btn">Search</button>
          </form>
        </div>
        
        <div className="header-actions">
          <div className="user-section" onClick={handleUserClick} style={{ cursor: 'pointer' }}>
            <span className="user-icon">👤</span>
            <span className="sign-in-text">SignedIn</span>
            
            {showUserPopup && (
              <div className="user-popup">
                <div className="user-popup-content">
                  {/* <div className="user-info-item">
                    <strong>User ID:</strong> {userInfo.userId}
                  </div>
                  <div className="user-info-item">
                    <strong>Email:</strong> {userInfo.email}
                  </div> */}
                  <div className="user-info-item">
                    <strong>Token:</strong> {userInfo.token}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="cart-section" onClick={onWishlistClick} style={{ cursor: 'pointer' }}>
            <span className="cart-icon">💖</span>
            <span className="cart-text">Wishlist</span>
            {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
          </div>
          
          <button className="logout-btn" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="popup-overlay">
          <div className="popup-content logout-popup">
            <h3>Confirm Logout</h3>
            <p>Are you sure you need to logout?</p>
            <div className="popup-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button className="cancel-btn" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;