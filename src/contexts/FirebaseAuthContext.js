import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import api from '../utils/api';

const FirebaseAuthContext = createContext();

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};

export const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Register user with Firebase
  const register = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Create user in your backend
      const response = await api.post('/auth/firebase-register', {
        firebaseUid: userCredential.user.uid,
        email: userCredential.user.email,
        name: name
      });

      const data = response.data;

      // Store JWT token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Update user state
      setUser(data.user);

      return { success: true, user: data.user };
    } catch (error) {
      throw error;
    }
  };

  // Login user with Firebase
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data from your backend
      const response = await api.post('/auth/firebase-login', {
        firebaseUid: userCredential.user.uid,
        email: userCredential.user.email
      });

      const data = response.data;

      // Store JWT token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Update user state
      setUser(data.user);

      // Track login in user profile
      try {
        await api.post('/user-profile/track-login');
      } catch (error) {
        console.error('Failed to track login:', error);
        // Don't fail the login if tracking fails
      }

      return { success: true, user: data.user };
    } catch (error) {
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      // Clear any backend session if needed
      try {
        await api.post('/auth/logout');
      } catch (logoutError) {
        console.log('Backend logout failed (this is normal):', logoutError.response?.status);
        // Don't throw error, just log it
      }
      // Clear user state and token
      setUser(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if there's an error
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  // Note: Password reset is now handled directly in ForgotPassword component
  // using Firebase's sendPasswordResetEmail

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from your backend
        try {
          const response = await api.post('/auth/firebase-user', {
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email
          });

          const data = response.data;
          setUser(data.user);
          // Also store token if available
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // If there's a network error, try to restore from localStorage
          const token = localStorage.getItem('token');
          if (token) {
            try {
              // Try to validate the token
              const validateResponse = await api.get('/auth/validate-token');
              setUser(validateResponse.data.user);
            } catch (validateError) {
              console.error('Token validation failed:', validateError);
              setUser(null);
              localStorage.removeItem('token');
            }
          } else {
            setUser(null);
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
      setInitialized(true);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    initialized,
    register,
    login,
    logout
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

