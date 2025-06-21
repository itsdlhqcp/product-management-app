import React from 'react';
import '../assets/styles/components/Header.css';

const Header = ({ onLogout, cartCount = 0 }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="search-section">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search any things..." 
              className="search-input"
            />
            <button className="search-btn">Search</button>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="user-section">
            <span className="user-icon">👤</span>
            <span className="sign-in-text">Sign in</span>
          </div>
          
          <div className="cart-section">
            <span className="cart-icon">🛒</span>
            <span className="cart-text">Cart</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
          
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;