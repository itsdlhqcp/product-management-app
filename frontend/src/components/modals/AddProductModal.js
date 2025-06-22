import React, { useState } from 'react';
import '../../assets/styles/components/Modal.css';

const AddProductModal = ({ isOpen, onClose, onAdd, subCategories }) => {
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    subCategoryId: '',
    variants: [{ ram: '', price: '', quantity: '' }]
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
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
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      alert('Please select only image files (JPEG, JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file sizes (5MB max)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Please select files smaller than 5MB');
      return;
    }

    // Store actual file objects
    setSelectedFiles(prev => [...prev, ...files]);

    // Create preview URLs
    const newPreviews = files.map(file => ({
      file: file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    setFilePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    // Revoke the object URL to free memory
    if (filePreviews[index]) {
      URL.revokeObjectURL(filePreviews[index].url);
    }
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
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
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add product data
      formData.append('title', productData.title);
      formData.append('description', productData.description);
      formData.append('subCategoryId', productData.subCategoryId);
      
      // Add variants as JSON string
      const processedVariants = validVariants.map(v => ({
        ...v,
        price: parseFloat(v.price),
        quantity: parseInt(v.quantity)
      }));
      formData.append('variants', JSON.stringify(processedVariants));
      
      // Add image files
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      await onAdd(formData);
      
      // Reset form
      setProductData({
        title: '',
        description: '',
        subCategoryId: '',
        variants: [{ ram: '', price: '', quantity: '' }]
      });
      
      // Clean up file previews
      filePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
      setSelectedFiles([]);
      setFilePreviews([]);
      
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Clean up file previews when closing
    filePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    setSelectedFiles([]);
    setFilePreviews([]);
    onClose();
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
              className="file-input"
            />
            <div className="file-info">
              <small>Accepted formats: JPEG, JPG, PNG, GIF, WebP (Max 5MB each)</small>
            </div>
            
            {filePreviews.length > 0 && (
              <div className="image-previews">
                {filePreviews.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img 
                      src={preview.url} 
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                    <div className="preview-info">
                      <span className="preview-name">{preview.name}</span>
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-buttons">
            <button 
              type="button" 
              className="btn-discard" 
              onClick={handleClose}
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