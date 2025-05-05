import api from './api';

/**
 * Cart API utility functions for interacting with the backend
 */
const cartApi = {
  /**
   * Add a product to the user's cart
   * @param {string} userId - User ID
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise<Object>} Updated cart
   */
  async addToCart(userId, productId, quantity) {
    try {
      const response = await api.post('/api/cart/add', {
        userId,
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  /**
   * Get the user's cart
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User's cart with items
   */
  async getCart(userId) {
    try {
      const response = await api.get(`/api/cart/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  /**
   * Update item quantity in the cart
   * @param {string} userId - User ID
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Updated cart
   */
  async updateCartItem(userId, productId, quantity) {
    try {
      const response = await api.put('/api/cart/update', {
        userId,
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  /**
   * Remove an item from the cart
   * @param {string} userId - User ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Updated cart
   */
  async removeFromCart(userId, productId) {
    try {
      const response = await api.delete('/api/cart/remove', {
        data: { userId, productId }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  /**
   * Clear the user's cart
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Empty cart
   */
  async clearCart(userId) {
    try {
      const response = await api.delete(`/api/cart/clear/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

export default cartApi;
