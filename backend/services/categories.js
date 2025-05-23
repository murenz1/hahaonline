import { db } from '../firebase.js';
import { collection, addDoc, getDocs, query, where, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const categoriesService = {
  // Get all categories
  async getCategories() {
    try {
      const q = query(collection(db, 'categories'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  // Add a new category
  async addCategory(categoryData) {
    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...categoryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Update category
  async updateCategory(id, categoryData) {
    try {
      const docRef = doc(db, 'categories', id);
      await updateDoc(docRef, {
        ...categoryData,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Delete category
  async deleteCategory(id) {
    try {
      const docRef = doc(db, 'categories', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw error;
    }
  }
};
