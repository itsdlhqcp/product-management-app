import React, { useState } from 'react';
import '../../assets/styles/components/Modal.css';

const AddCategoryModal = ({ isOpen, onClose, onAdd }) => {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    
    setLoading(true);
    try {
      await onAdd(categoryName.trim());
      setCategoryName('');
      onClose();
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
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
              disabled={loading || !categoryName.trim()}
            >
              {loading ? 'ADDING...' : 'ADD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;