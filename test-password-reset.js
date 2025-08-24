// Test Password Reset
// Run this in browser console at http://localhost:3000

import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './src/firebase';

console.log('Testing password reset...');
console.log('Auth object:', auth);

// Test the password reset
sendPasswordResetEmail(auth, 'shaurya098n@gmail.com')
  .then(() => {
    console.log('✅ Password reset email sent successfully!');
    console.log('Check your email inbox and spam folder');
  })
  .catch((error) => {
    console.error('❌ Password reset failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Common error codes and solutions
    switch(error.code) {
      case 'auth/user-not-found':
        console.log('Solution: User does not exist in Firebase');
        break;
      case 'auth/invalid-email':
        console.log('Solution: Invalid email format');
        break;
      case 'auth/too-many-requests':
        console.log('Solution: Too many requests, try again later');
        break;
      case 'auth/network-request-failed':
        console.log('Solution: Network error, check internet connection');
        break;
      default:
        console.log('Unknown error, check Firebase configuration');
    }
  });

