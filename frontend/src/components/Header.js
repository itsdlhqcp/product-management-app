import React, { useState } from 'react';
import '../assets/styles/components/Header.css';

const Header = ({ onLogout, cartCount = 0, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Optional: Real-time search as user types (with debounce)
    if (value.trim()) {
      onSearch(value.trim());
    } else {
      // Clear search when input is empty
      onSearch('');
    }
  };

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