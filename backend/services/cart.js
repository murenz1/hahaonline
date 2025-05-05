import { db } from '../firebase.js';
import { collection, addDoc, getDocs, query, where, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const cartService = {
  // Add item to cart
  async addToCart(userId, productId, quantity) {
    try {
      const cartRef = collection(db, 'carts');
      const cartItemRef = doc(cartRef, `${userId}_${productId}`);

      // Check if item already exists in cart
      const cartItemSnap = await getDoc(cartItemRef);
      if (cartItemSnap.exists()) {
        // Update existing item
        await updateDoc(cartItemRef, {
          quantity: cartItemSnap.data().quantity + quantity,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Add new item
        await addDoc(cartRef, {
          userId,
          productId,
          quantity,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { id: `${userId}_${productId}` });
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  // Get cart items
  async getCart(userId) {
    try {
      const q = query(
        collection(db, 'carts'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  // Update cart item quantity
  async updateCartItem(userId, productId, quantity) {
    try {
      const cartItemRef = doc(db, 'carts', `${userId}_${productId}`);
      await updateDoc(cartItemRef, {
        quantity,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Remove item from cart
  async removeCartItem(userId, productId) {
    try {
      const cartItemRef = doc(db, 'carts', `${userId}_${productId}`);
      await deleteDoc(cartItemRef);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Clear cart
  async clearCart(userId) {
    try {
      const q = query(
        collection(db, 'carts'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      const batch = db.batch();
      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      return true;
    } catch (error) {
      throw error;
    }
  }
};
