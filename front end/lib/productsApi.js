import api from './api';

/**
 * Products API utility functions for interacting with the backend
 */
const productsApi = {
  /**
   * Get all products
   * @returns {Promise<Array>} Array of products
   */
  async getAllProducts() {
    try {
      const response = await api.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Get products by category
   * @param {string} categoryId - Category ID
   * @returns {Promise<Array>} Array of products in the category
   */
  async getProductsByCategory(categoryId) {
    try {
      const response = await api.get(`/api/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Search products by name
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching products
   */
  async searchProducts(query) {
    try {
      const response = await api.get(`/api/products/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching products for "${query}":`, error);
      throw error;
    }
  },

  /**
   * Get featured products
   * @returns {Promise<Array>} Array of featured products
   */
  async getFeaturedProducts() {
    try {
      const response = await api.get('/api/products/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  /**
   * Filter products by multiple criteria
   * @param {Object} filters - Filter criteria
   * @param {number} [filters.minPrice] - Minimum price
   * @param {number} [filters.maxPrice] - Maximum price
   * @param {number} [filters.rating] - Minimum rating
   * @param {boolean} [filters.inStock] - In stock status
   * @param {string} [filters.sortBy] - Field to sort by (e.g., 'price', 'rating')
   * @param {string} [filters.sortOrder] - Sort order ('asc' or 'desc')
   * @returns {Promise<Array>} Array of filtered products
   */
  async filterProducts(filters) {
    try {
      const response = await api.post('/api/products/filter', filters);
      return response.data;
    } catch (error) {
      console.error('Error filtering products:', error);
      throw error;
    }
  },

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Product details
   */
  async getProductById(productId) {
    try {
      const response = await api.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  }
};

export default productsApi;
