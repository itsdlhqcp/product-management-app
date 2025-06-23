import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FilterButtons from "../components/FilterButton";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import apiService from '../services/api.js';
import "../assets/styles/pages/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  
  // NEW: Wishlist state
  const [wishlistCount, setWishlistCount] = useState(0);

  // Search-related state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // State for dynamic data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 6;

  // Fetch wishlist count
  const fetchWishlistCount = async () => {
    try {
      const response = await apiService.getWishlistCount();
      setWishlistCount(response.count);
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, subCategoriesRes] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories(),
          apiService.getSubCategories()
        ]);

        setProducts(productsRes.products || []);
        setCategories(categoriesRes.categories || []);
        setSubCategories(subCategoriesRes.subCategories || []);
        setError(null);
        
        // Fetch wishlist count
        await fetchWishlistCount();
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search function with API integration
  const handleSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      // Clear search
      setSearchTerm('');
      setSearchResults([]);
      setIsSearchActive(false);
      return;
    }

    try {
      setLoading(true);
      setSearchTerm(searchTerm);
      setIsSearchActive(true);
      
      const response = await apiService.searchProducts(searchTerm);
      setSearchResults(response.products || []);
      setCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search products. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter products to handle search results
  const filteredProducts = isSearchActive ? searchResults : products.filter(product => {
    if (selectedCategory === 'all') return true;
    
    const productCategoryId = product.subCategoryId?.categoryId?._id;
    const productSubCategoryId = product.subCategoryId?._id;
    
    if (selectedSubCategory === 'all') {
      // Filter by category only
      return productCategoryId === selectedCategory;
    } else {
      // Filter by specific subcategory
      return productSubCategoryId === selectedSubCategory;
    }
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Handle category change and clear search
  const handleCategoryChange = (categoryId, subCategoryId = 'all') => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(subCategoryId);
    setCurrentPage(1);
    
    // Clear search when category changes
    setSearchTerm('');
    setSearchResults([]);
    setIsSearchActive(false);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Updated logout handler - now just clears data without confirmation
  // (confirmation is handled in Header component)
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/signin');
  };

  const handleAddToCart = (product) => {
    setCartCount(prevCount => prevCount + 1);
    console.log('Added to cart:', product);
    alert(`${product.title} added to cart!`);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  // NEW: Handle wishlist navigation
  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  // Get display name to handle search results
  const getDisplayName = () => {
    if (isSearchActive) {
      return `Search Results for "${searchTerm}"`;
    }
    
    if (selectedCategory === 'all') return 'All Products';
    
    if (selectedSubCategory !== 'all') {
      const subCategory = subCategories.find(sub => sub._id === selectedSubCategory);
      return subCategory ? `${subCategory.name} Products` : 'Products';
    }
    
    const category = categories.find(cat => cat._id === selectedCategory);
    return category ? `${category.name} Products` : 'Products';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubCategory]);

  if (loading) {
    return (
      <div className="home-container">
        <Header 
          onLogout={handleLogout} 
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          onSearch={handleSearch}
          onWishlistClick={handleWishlistClick}
        />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <Header 
          onLogout={handleLogout} 
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          onSearch={handleSearch}
          onWishlistClick={handleWishlistClick}
        />
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Header 
        onLogout={handleLogout} 
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onSearch={handleSearch}
        onWishlistClick={handleWishlistClick}
      />
      
      <div className="main-content">
        <Sidebar 
          categories={categories}
          subCategories={subCategories}
          onCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
        />
        
        <div className="content-area">
          <div className="filter-buttons-wrapper">
            <FilterButtons 
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="products-section">
            <div className="products-header">
              <h2>{getDisplayName()}</h2>
              <span className="products-count">
                {filteredProducts.length} products found
              </span>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>
                  {isSearchActive 
                    ? `No products found for "${searchTerm}"`
                    : "No products found for the selected category."
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="products-scrollable-container">
                  <div className="products-grid">
                    {currentProducts.map(product => (
                      <div key={product._id} className="product-card-wrapper">
                        <ProductCard 
                          product={product}
                          onAddToCart={() => handleAddToCart(product)}
                          onProductClick={() => handleProductClick(product)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className="pagination-wrapper">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalItems={filteredProducts.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;