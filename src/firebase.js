import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHBLri-FtsGYDihHklYeI0IxhVCs5G5oU",
  authDomain: "thrifty-clothings.firebaseapp.com",
  projectId: "thrifty-clothings",
  storageBucket: "thrifty-clothings.firebasestorage.app",
  messagingSenderId: "262432674441",
  appId: "1:262432674441:web:6c099d73c8cb9628c8ec58",
  measurementId: "G-22GQRW2QFT"
};

// Add error handling for Firebase initialization
console.log('🔥 Initializing Firebase with config:', {
  apiKey: firebaseConfig.apiKey ? '***configured***' : '❌ missing',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;

