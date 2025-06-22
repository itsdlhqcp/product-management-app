import React, { useState, useEffect } from 'react';
import '../assets/styles/components/Sidebar.css';

const Sidebar = ({ 
  categories, 
  subCategories, 
  onCategoryChange, 
  selectedCategory, 
  selectedSubCategory 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true
  });

  // Initialize expanded sections for each category
  useEffect(() => {
    const initialExpanded = { categories: true };
    categories.forEach(category => {
      initialExpanded[category._id] = false;
    });
    setExpandedSections(initialExpanded);
  }, [categories]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Group subcategories by category
  const getSubCategoriesForCategory = (categoryId) => {
    return subCategories.filter(subCat => subCat.categoryId._id === categoryId);
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
            {/* All categories option */}
            <div 
              className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => onCategoryChange('all', 'all')}
            >
              All categories
            </div>
            
            {/* Dynamic categories */}
            {categories.map(category => {
              const categorySubCategories = getSubCategoriesForCategory(category._id);
              const hasSubCategories = categorySubCategories.length > 0;
              
              return (
                <div key={category._id} className="category-group">
                  <div 
                    className={`category-parent ${!hasSubCategories ? 'category-item' : ''} ${
                      selectedCategory === category._id && selectedSubCategory === 'all' ? 'active' : ''
                    }`}
                    onClick={() => {
                      if (hasSubCategories) {
                        toggleSection(category._id);
                      } else {
                        onCategoryChange(category._id, 'all');
                      }
                    }}
                  >
                    <span 
                      onClick={(e) => {
                        if (hasSubCategories) {
                          e.stopPropagation();
                          onCategoryChange(category._id, 'all');
                        }
                      }}
                      className={hasSubCategories ? 'clickable-category' : ''}
                    >
                      {category.name}
                    </span>
                    {hasSubCategories && (
                      <span className={`arrow ${expandedSections[category._id] ? 'expanded' : ''}`}>
                        ▼
                      </span>
                    )}
                  </div>
                  
                  {hasSubCategories && expandedSections[category._id] && (
                    <div className="subcategory-list">
                      {categorySubCategories.map(subCategory => (
                        <div 
                          key={subCategory._id}
                          className={`subcategory-item ${
                            selectedSubCategory === subCategory._id ? 'active' : ''
                          }`}
                          onClick={() => onCategoryChange(category._id, subCategory._id)}
                        >
                          {subCategory.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;