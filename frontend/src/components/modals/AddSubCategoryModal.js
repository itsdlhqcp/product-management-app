import React, { useState, useEffect } from 'react';
import '../../assets/styles/components/Modal.css';

const AddSubCategoryModal = ({ isOpen, onClose, onAdd, categories }) => {
  const [subCategoryName, setSubCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subCategoryName.trim() || !selectedCategory) return;
    
    setLoading(true);
    try {
      await onAdd(subCategoryName.trim(), selectedCategory);
      setSubCategoryName('');
      setSelectedCategory('');
      onClose();
    } catch (error) {
      console.error('Error adding sub-category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Sub Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Sub Category Name</label>
            <input
              type="text"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              placeholder="Enter sub category name"
              required
            />
          </div>
          <div className="modal-buttons">
            <button 
              type="button" 
              className="btn-discard" 
              onClick={onClose}
              disabled={loading}
            >
              DISCARD
            </button>
            <button 
              type="submit" 
              className="btn-add"
              disabled={loading || !subCategoryName.trim() || !selectedCategory}
            >
              {loading ? 'ADDING...' : 'ADD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategoryModal;