import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth';

export const authService = {
  // Sign up with email and password
  async signUp(email, password, fullName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: fullName
      });
      
      const token = await user.getIdToken();
      return { uid: user.uid, token };
    } catch (error) {
      throw error;
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      return { uid: user.uid, token };
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  async signOut() {
    try {
      await auth.signOut();
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      await auth.sendPasswordResetEmail(email);
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }
};
