import React, { useState, useEffect } from 'react';
import AddCategoryModal from './modals/AddCategoryModal';
import AddSubCategoryModal from './modals/AddSubCategoryModal';
import AddProductModal from './modals/AddProductModal';
import apiService from '../services/api'; 
import '../assets/styles/components/FilterButton.css';

const FilterButtons = ({ activeFilter, onFilterChange }) => {
  const [modals, setModals] = useState({
    category: false,
    subCategory: false,
    product: false
  });
  
  const [data, setData] = useState({
    categories: [],
    subCategories: [],
    products: []
  });

  const filters = [
    { key: 'categories', label: 'Add categories', icon: '📁' },
    { key: 'subcategories', label: 'Add sub categories', icon: '📂' },
    { key: 'products', label: 'Add products', icon: '📦' }
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await apiService.getCategories();
      setData(prev => ({ ...prev, categories: result.categories }));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const result = await apiService.getSubCategories();
      setData(prev => ({ ...prev, subCategories: result.subCategories }));
    } catch (error) {
      console.error('Error fetching sub-categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const result = await apiService.getProducts();
      setData(prev => ({ ...prev, products: result.products || [] }));
    } catch (error) {
      console.error('Error fetching products:', error);
      setData(prev => ({ ...prev, products: [] }));
    }
  };

  const openModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
  };

  const handleFilterClick = (filterKey) => {
    onFilterChange(filterKey);
    
    // Open appropriate modal based on filter
    switch (filterKey) {
      case 'categories':
        openModal('category');
        break;
      case 'subcategories':
        openModal('subCategory');
        break;
      case 'products':
        openModal('product');
        break;
      default:
        break;
    }
  };

  const handleAddCategory = async (name) => {
    try {
      const result = await apiService.createCategory(name);
      
      setData(prev => ({
        ...prev,
        categories: [result.category, ...prev.categories]
      }));
      alert('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category: ' + error.message);
    }
  };

  const handleAddSubCategory = async (name, categoryId) => {
    try {
      await apiService.createSubCategory(name, categoryId);
      
      // Refresh sub-categories to get populated data
      await fetchSubCategories();
      alert('Sub-category added successfully!');
    } catch (error) {
      console.error('Error adding sub-category:', error);
      alert('Error adding sub-category: ' + error.message);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      await apiService.createProduct(productData);
      
      // Refresh products to get populated data
      await fetchProducts();
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + error.message);
    }
  };

  return (
    <>
      <div className="filter-buttons">
        {filters.map((filter) => (
          <button
            key={filter.key}
            className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
            onClick={() => handleFilterClick(filter.key)}
          >
            <span className="filter-icon">{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={modals.category}
        onClose={() => closeModal('category')}
        onAdd={handleAddCategory}
      />

      <AddSubCategoryModal
        isOpen={modals.subCategory}
        onClose={() => closeModal('subCategory')}
        onAdd={handleAddSubCategory}
        categories={data.categories}
      />

      <AddProductModal
        isOpen={modals.product}
        onClose={() => closeModal('product')}
        onAdd={handleAddProduct}
        subCategories={data.subCategories}
      />
    </>
  );
};

export default FilterButtons;