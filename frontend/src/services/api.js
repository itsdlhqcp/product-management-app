const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication API methods
  async signup(data) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signin(data) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Category API methods
  async getCategories() {
    return this.request('/categories');
  }

  async createCategory(name) {
    return this.request('/category', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  // SubCategory API methods
  async getSubCategories() {
    return this.request('/subcategories');
  }

  async createSubCategory(name, categoryId) {
    return this.request('/subcategory', {
      method: 'POST',
      body: JSON.stringify({ name, categoryId }),
    });
  }

  // Product API methods
  async getProducts() {
    return this.request('/products');
  }

  async createProduct(productData) {
    return this.request('/product', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }
}

// Create a single instance
const apiService = new ApiService();

export default apiService;

// For backward compatibility, you can also export individual functions
export const signup = (data) => apiService.signup(data);
export const signin = (data) => apiService.signin(data);