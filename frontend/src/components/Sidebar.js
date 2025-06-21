import React, { useState } from 'react';
import '../assets/styles/components/Sidebar.css';

const Sidebar = ({ onCategoryChange, selectedCategory }) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    laptop: false,
    tablet: false,
    headphones: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="sidebar">
      <nav className="breadcrumb">
        <span className="breadcrumb-item">Home</span>
        <span className="breadcrumb-separator">›</span>
      </nav>

      <div className="sidebar-section">
        <div 
          className="section-header" 
          onClick={() => toggleSection('categories')}
        >
          <h3>Categories</h3>
          <span className={`arrow ${expandedSections.categories ? 'expanded' : ''}`}>
            ▼
          </span>
        </div>
        
        {expandedSections.categories && (
          <div className="category-list">
            <div 
              className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => onCategoryChange('all')}
            >
              All categories
            </div>
            
            <div className="category-group">
              <div 
                className="category-parent"
                onClick={() => toggleSection('laptop')}
              >
                <span>Laptop</span>
                <span className={`arrow ${expandedSections.laptop ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
              {expandedSections.laptop && (
                <div className="subcategory-list">
                  <div 
                    className={`subcategory-item ${selectedCategory === 'gaming' ? 'active' : ''}`}
                    onClick={() => onCategoryChange('gaming')}
                  >
                    Gaming
                  </div>
                  <div 
                    className={`subcategory-item ${selectedCategory === 'business' ? 'active' : ''}`}
                    onClick={() => onCategoryChange('business')}
                  >
                    Business
                  </div>
                </div>
              )}
            </div>

            <div className="category-group">
              <div 
                className="category-parent"
                onClick={() => toggleSection('tablet')}
              >
                <span>Tablet</span>
                <span className={`arrow ${expandedSections.tablet ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
              {expandedSections.tablet && (
                <div className="subcategory-list">
                  <div 
                    className={`subcategory-item ${selectedCategory === 'ipad' ? 'active' : ''}`}
                    onClick={() => onCategoryChange('ipad')}
                  >
                    iPad
                  </div>
                  <div 
                    className={`subcategory-item ${selectedCategory === 'android' ? 'active' : ''}`}
                    onClick={() => onCategoryChange('android')}
                  >
                    Android
                  </div>
                </div>
              )}
            </div>

            <div className="category-group">
              <div 
                className="category-parent"
                onClick={() => toggleSection('headphones')}
              >
                <span>Headphones</span>
                <span className={`arrow ${expandedSections.headphones ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
              {expandedSections.headphones && (
                <div className="subcategory-list">
                  <div 
                    className={`subcategory-item ${selectedCategory === 'wireless' ? 'active' : ''}`}
                    onClick={() => onCategoryChange('wireless')}
                  >
                    Wireless
                  </div>
                  <div 
                    className={`subcategory-item ${selectedCategory === 'wired' ? 'active' : ''}`}
                    onClick={() => onCategoryChange('wired')}
                  >
                    Wired
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;