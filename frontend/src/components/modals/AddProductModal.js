import React, { useState } from 'react';
import '../../assets/styles/components/Modal.css';

const AddProductModal = ({ isOpen, onClose, onAdd, subCategories }) => {
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    subCategoryId: '',
    variants: [{ ram: '', price: '', quantity: '' }],
    images: []
  });
  const [loading, setLoading] = useState(false);

  const addVariant = () => {
    setProductData(prev => ({
      ...prev,
      variants: [...prev.variants, { ram: '', price: '', quantity: '' }]
    }));
  };

  const removeVariant = (index) => {
    if (productData.variants.length > 1) {
      setProductData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }));
    }
  };

  const updateVariant = (index, field, value) => {
    setProductData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload these to a server or cloud storage
    // For now, we'll just store the file names
    setProductData(prev => ({
      ...prev,
      images: [...prev.images, ...files.map(file => file.name)]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.title.trim() || !productData.subCategoryId) return;
    
    // Validate variants
    const validVariants = productData.variants.filter(v => 
      v.ram.trim() && v.price && v.quantity
    );
    
    if (validVariants.length === 0) {
      alert('Please add at least one complete variant');
      return;
    }
    
    setLoading(true);
    try {
      await onAdd({
        ...productData,
        variants: validVariants.map(v => ({
          ...v,
          price: parseFloat(v.price),
          quantity: parseInt(v.quantity)
        }))
      });
      
      // Reset form
      setProductData({
        title: '',
        description: '',
        subCategoryId: '',
        variants: [{ ram: '', price: '', quantity: '' }],
        images: []
      });
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-large">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={productData.title}
              onChange={(e) => setProductData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter product title"
              required
            />
          </div>

          <div className="form-group">
            <label>Sub-category</label>
            <select
              value={productData.subCategoryId}
              onChange={(e) => setProductData(prev => ({ ...prev, subCategoryId: e.target.value }))}
              required
            >
              <option value="">Choose a sub-category</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.name} ({subCategory.categoryId?.name})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Variants</label>
            <div className="variants-container">
              <div className="variants-header">
                <span>RAM</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Action</span>
              </div>
              {productData.variants.map((variant, index) => (
                <div key={index} className="variant-row">
                  <input
                    type="text"
                    placeholder="8GB"
                    value={variant.ram}
                    onChange={(e) => updateVariant(index, 'ram', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="999.99"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="10"
                    value={variant.quantity}
                    onChange={(e) => updateVariant(index, 'quantity', e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeVariant(index)}
                    disabled={productData.variants.length === 1}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-add-variant"
                onClick={addVariant}
              >
                Add extra set of variants
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={productData.description}
              onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter product description"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            {productData.images.length > 0 && (
              <div className="uploaded-images">
                {productData.images.map((image, index) => (
                  <span key={index} className="image-tag">{image}</span>
                ))}
              </div>
            )}
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
              disabled={loading || !productData.title.trim() || !productData.subCategoryId}
            >
              {loading ? 'ADDING...' : 'ADD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;