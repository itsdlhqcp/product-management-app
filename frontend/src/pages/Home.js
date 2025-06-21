import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FilterButtons from "../components/FilterButton";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import productsData from '../data/product';
import "../assets/styles/pages/Home.css";

function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);

  const [products] = useState(productsData);

  const itemsPerPage = 6;

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);


  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    navigate('/signin');
  };

  const handleAddToCart = (product) => {
    setCartCount(prevCount => prevCount + 1);
    console.log('Added to cart:', product);
    alert(`${product.name} added to cart!`);
  };

  const handleProductClick = (product) => {
    navigate(`/product-details/${product.id}`);
  };

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  return (
    <div className="home-container">
      <Header 
        onLogout={handleLogout} 
        cartCount={cartCount}
        onSearch={handleSearch}
      />
      
      <div className="main-content">
        <Sidebar 
          onCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
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
              <h2>
                {selectedCategory === 'all' ? 'All Products' : 
                 selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + ' Products'}
              </h2>
              <span className="products-count">
                {filteredProducts.length} products found
              </span>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found for the selected category.</p>
              </div>
            ) : (
              <>
              <div className="products-scrollable-container">
                    <div className="products-grid">
                        {currentProducts.map(product => (
                        <div key={product.id} className="product-card-wrapper">
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
}

export default Home;