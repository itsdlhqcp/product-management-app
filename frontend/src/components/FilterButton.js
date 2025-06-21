import React from 'react';
import '../assets/styles/components/FilterButton.css';

const FilterButtons = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: 'categories', label: 'Add categories', icon: '' },
    { key: 'subcategories', label: 'Add sub categories', icon: '' },
    { key: 'products', label: 'Add products', icon: '' }
  ];

  return (
    <div className="filter-buttons">
      {filters.map((filter) => (
        <button
          key={filter.key}
          className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.key)}
        >
          <span className="filter-icon">{filter.icon}</span>
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;