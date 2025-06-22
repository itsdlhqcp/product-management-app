const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    // Merge headers if additional headers are provided
    if (options.headers) {
      config.headers = { ...config.headers, ...options.headers };
    }

    // Remove Content-Type header for FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Request URL:', url);
      console.error('Request config:', config);
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
    const result = await this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store token if signin is successful
    if (result.token) {
      localStorage.setItem('token', result.token);
    }
    
    return result;
  }

  async signout() {
    localStorage.removeItem('token');
    // You can also call a logout endpoint if your backend has one
    // return this.request('/auth/signout', { method: 'POST' });
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
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

  async getProduct(id) {
    return this.request(`/product/${id}`);
  }

  // Alias for getProduct to match your new naming convention
  async getProductById(productId) {
    return this.getProduct(productId);
  }

  async createProduct(productData) {
    // If productData is FormData, use it directly
    if (productData instanceof FormData) {
      return this.request('/product', {
        method: 'POST',
        body: productData,
      });
    }
    
    // Otherwise, use JSON
    return this.request('/product', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    // If productData is FormData, use it directly
    if (productData instanceof FormData) {
      return this.request(`/product/${id}`, {
        method: 'PUT',
        body: productData,
      });
    }
    
    // Otherwise, use JSON
    return this.request(`/product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/product/${id}`, {
      method: 'DELETE',
    });
  }

  // Search products method
  async searchProducts(query) {
    return this.request(`/products/search/${encodeURIComponent(query)}`);
  }

  // Helper method to get image URL
  getImageUrl(filename) {
    if (!filename) return null;
    return `${API_BASE_URL.replace('/api', '')}/uploads/products/${filename}`;
  }
}

const apiService = new ApiService();

export default apiService;

// Named exports for convenience
export const signup = (data) => apiService.signup(data);
export const signin = (data) => apiService.signin(data);
export const signout = () => apiService.signout();
export const isAuthenticated = () => apiService.isAuthenticated();

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// class ApiService {
//   async request(endpoint, options = {}) {
//     const url = `${API_BASE_URL}${endpoint}`;
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       ...options,
//     };

//     // Remove Content-Type header for FormData
//     if (options.body instanceof FormData) {
//       delete config.headers['Content-Type'];
//     }

//     try {
//       const response = await fetch(url, config);
      
//       // Check if response is actually JSON
//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await response.text();
//         console.error('Non-JSON response received:', text);
//         throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.msg || `HTTP error! status: ${response.status}`);
//       }
      
//       return data;
//     } catch (error) {
//       console.error('API request failed:', error);
//       console.error('Request URL:', url);
//       console.error('Request config:', config);
//       throw error;
//     }
//   }

//   // Authentication API methods
//   async signup(data) {
//     return this.request('/auth/signup', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   async signin(data) {
//     return this.request('/auth/signin', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   // Category API methods
//   async getCategories() {
//     return this.request('/categories');
//   }

//   async createCategory(name) {
//     return this.request('/category', {
//       method: 'POST',
//       body: JSON.stringify({ name }),
//     });
//   }

//   // SubCategory API methods
//   async getSubCategories() {
//     return this.request('/subcategories');
//   }

//   async createSubCategory(name, categoryId) {
//     return this.request('/subcategory', {
//       method: 'POST',
//       body: JSON.stringify({ name, categoryId }),
//     });
//   }

//   // Product API methods
//   async getProducts() {
//     return this.request('/products');
//   }

//   async getProduct(id) {
//     return this.request(`/product/${id}`);
//   }

//   async createProduct(productData) {
//     // If productData is FormData, use it directly
//     if (productData instanceof FormData) {
//       return this.request('/product', {
//         method: 'POST',
//         body: productData,
//       });
//     }
    
//     // Otherwise, use JSON
//     return this.request('/product', {
//       method: 'POST',
//       body: JSON.stringify(productData),
//     });
//   }

//   async deleteProduct(id) {
//     return this.request(`/product/${id}`, {
//       method: 'DELETE',
//     });
//   }

//   // Search products method
//   async searchProducts(query) {
//     return this.request(`/products/search/${encodeURIComponent(query)}`);
//   }
  

//   // Helper method to get image URL
//   getImageUrl(filename) {
//     if (!filename) return null;
//     return `${API_BASE_URL.replace('/api', '')}/uploads/products/${filename}`;
//   }
// }

// const apiService = new ApiService();

// export default apiService;

// export const signup = (data) => apiService.signup(data);
// export const signin = (data) => apiService.signin(data);
