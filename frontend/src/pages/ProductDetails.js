import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import apiService from '../services/api.js';
import AddProductModal from '../components/modals/AddProductModal';
import "../assets/styles/pages/ProductDetails.css";


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [subCategories, setSubCategories] = useState([]);

  // Add this function after your existing functions
const fetchSubCategories = async () => {
  try {
    const result = await apiService.getSubCategories();
    setSubCategories(result.subCategories);
  } catch (error) {
    console.error('Error fetching sub-categories:', error);
  }
};

// Update your useEffect to also fetch subcategories
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/signin');
    return;
  }

  const fetchProduct = async () => {
    try {
      const response = await apiService.getProductById(id);
      setProduct(response.product);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchProduct();
    fetchSubCategories(); // Add this line
  }
}, [id, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await apiService.getProductById(id);
        setProduct(response.product);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/signin');
  };

  const handleSearch = (searchTerm) => {
    navigate('/', { state: { searchTerm } });
  };

  const handleQuantityChange = (newQuantity) => {
    const maxQuantity = product?.variants?.[selectedVariant]?.quantity || 1;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const variant = product?.variants?.[selectedVariant];
    if (variant && quantity <= variant.quantity) {
      setCartCount(prev => prev + quantity);
      alert(`${quantity} x ${product.title} added to cart!`);
    }
  };

  // Add this function after your existing handlers
  const handleUpdateProduct = async (formData) => {
    try {
      const response = await apiService.updateProduct(id, formData);
      setProduct(response.product);
      setIsEditModalOpen(false);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product: ' + error.message);
    }
  };

  const getProductImage = (imageName) => {
    return imageName ? apiService.getImageUrl(imageName) : '/placeholder-image.jpg';
  };

  const navigateHome = () => {
    const token = localStorage.getItem('token');
    navigate(token ? '/home' : '/signin');
  };

  if (loading) {
    return (
      <div className="product-details-container">
        <Header onLogout={handleLogout} cartCount={cartCount} onSearch={handleSearch} />
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-container">
        <Header onLogout={handleLogout} cartCount={cartCount} onSearch={handleSearch} />
        <div className="error">
          <p>{error || 'Product not found'}</p>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants?.[selectedVariant];
  const isInStock = currentVariant?.quantity > 0;

  return (
    <div className="product-details-container">
      <Header onLogout={handleLogout} cartCount={cartCount} onSearch={handleSearch} />
      
      <div className="breadcrumb">
        <span onClick={navigateHome} className="breadcrumb-link">Home</span>
        <span className="breadcrumb-separator">›</span>
        <span>Product details</span>
      </div>

      <div className="product-details-content">
        <div className="product-images-section">
          <div className="main-image">
            <img 
              src={getProductImage(product.images[selectedImageIndex])} 
              alt={product.title}
              onError={(e) => e.target.src = '/placeholder-image.jpg'}
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img 
                    src={getProductImage(image)} 
                    alt={`${product.title} ${index + 1}`}
                    onError={(e) => e.target.src = '/placeholder-image.jpg'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.title}</h1>
          
          <div className="product-price">
            ${currentVariant?.price?.toFixed(2) || '0.00'}
          </div>

          <div className="availability">
            <span className="availability-label">Availability:</span>
            <span className={`availability-status ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
              {isInStock ? '✓ In stock' : '✗ Out of stock'}
            </span>
          </div>

          {isInStock && (
            <div className="stock-info">
              Hurry up! only {currentVariant.quantity} product left in stock!
            </div>
          )}

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          {product.variants?.length > 0 && (
            <div className="variants-section">
              <div className="variant-group">
                <label>Ram:</label>
                <div className="variant-options">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      className={`variant-option ${index === selectedVariant ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(index)}
                    >
                      {variant.ram} GB
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="quantity-section">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                max={currentVariant?.quantity || 1}
                className="quantity-input"
              />
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= (currentVariant?.quantity || 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="action-buttons">
          <button 
            className="edit-product-btn"
            onClick={() => setIsEditModalOpen(true)} // Change this line
          >
            Edit product
          </button>
            <button 
              className="buy-now-btn"
              onClick={() => alert('Proceeding to checkout...')}
              disabled={!isInStock}
            >
              Buy it now
            </button>
            <button 
              className="wishlist-btn"
              onClick={() => alert('Added to wishlist!')}
            >
              ♡
            </button>
          </div>

          {/* <div className="category-info">
            <p><strong>Category:</strong> {product.subCategoryId?.categoryId?.name}</p>
            <p><strong>Sub Category:</strong> {product.subCategoryId?.name}</p>
          </div> */}
        </div>
      </div>
      <AddProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onAdd={handleUpdateProduct}
        subCategories={subCategories}
        editMode={true}
        initialData={product}
      />
    </div>
  );
};

export default ProductDetails;