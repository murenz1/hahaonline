import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth';

export const authService = {
  // Sign up with email and password
  async signUp(email, password, fullName, phoneNumber) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: fullName,
        // Store phoneNumber in the user profile metadata
        // Note: Firebase Auth doesn't have a built-in field for phone number in the profile
        // so we're using the photoURL field to store it temporarily
        photoURL: `tel:${phoneNumber}`
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
      // Import the sendPasswordResetEmail function from firebase/auth
      const { sendPasswordResetEmail } = await import('firebase/auth');
      
      // Use the imported function with the auth instance
      await sendPasswordResetEmail(auth, email);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }
};
