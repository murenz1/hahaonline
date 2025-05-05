import { db } from '../firebase.js';
import { collection, addDoc, getDocs, query, where, getDoc, doc, updateDoc } from 'firebase/firestore';

export const ordersService = {
  // Create new order
  async createOrder(userId, items, shippingAddress, totalPrice) {
    try {
      const orderRef = collection(db, 'orders');
      const order = await addDoc(orderRef, {
        userId,
        items,
        shippingAddress,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Clear cart after successful order
      // Note: You should implement cart clearing in the frontend after successful order

      return order.id;
    } catch (error) {
      throw error;
    }
  },

  // Get user's orders
  async getUserOrders(userId) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
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

  // Get order by ID
  async getOrder(orderId) {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Get all orders (for admin)
  async getAllOrders() {
    try {
      const q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }
};
