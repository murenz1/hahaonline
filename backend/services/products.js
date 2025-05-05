import { db, storage } from '../firebase.js';
import { collection, addDoc, getDocs, query, where, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const productsService = {
  // Add a new product
  async addProduct(productData, imageFile) {
    try {
      // Upload product image
      const storageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      // Add product to Firestore
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Get all products
  async getProducts() {
    try {
      const q = query(collection(db, 'products'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  // Get product by ID
  async getProduct(id) {
    try {
      const docRef = doc(db, 'products', id);
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

  // Update product
  async updateProduct(id, productData) {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(categoryId) {
    try {
      const q = query(collection(db, 'products'), where('categoryId', '==', categoryId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  // Search products by n