import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

         const handleSubmit = async (e) => {
         e.preventDefault();
         setError('');
         setIsLoading(true);
         
         try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Get user data from your backend
      const response = await fetch('/api/auth/firebase-login', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
        body: JSON.stringify({
          firebaseUid: userCredential.user.uid,
          email: formData.email
        }),
           });

      if (response.ok) {
           const data = await response.json();
        // Store the JWT token
        localStorage.setItem('token', data.token);
             navigate('/');
           } else {
        const data = await response.json();
        // Handle specific error cases
        if (data.code === 'USER_NOT_FOUND') {
          setError('No account found with this email. Please register first.');
        } else if (data.code === 'NEEDS_REGISTRATION') {
          setError('This email is registered with the old system. Please register again.');
        } else if (data.code === 'ACCOUNT_DEACTIVATED') {
          setError('Account is deactivated. Please contact support.');
        } else if (data.code === 'EMAIL_NOT_VERIFIED') {
          setError('Email not verified. Please check your email and verify your account before logging in.');
               // Redirect to email verification page
          setTimeout(() => {
            navigate('/email-verification', { 
              state: { 
                email: formData.email,
                message: 'Please verify your email before logging in.'
              }
            });
          }, 2000);
             } else {
               setError(data.message || 'Login failed');
             }
           }
         } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/user-disabled') {
        setError('This account has been disabled');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
           setError(err.message || 'Login failed');
      }
         } finally {
           setIsLoading(false);
         }
       };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8">
              <span className="text-black font-bold text-3xl">T</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              THRIFTY CLOTHINGS
            </h1>
            <p className="text-xl text-gray-200 max-w-md">
              Essential fashion for everyone, every day
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 bg-black text-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Navigation */}
          <div className="flex items-center mb-8">
            <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-gray-400">Don't have an account?</span>
            <Link to="/register" className="ml-2 text-white hover:text-gray-300 transition-colors">
              Register
            </Link>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Welcome Back! Sign In to Continue
          </h2>

          <div className="bg-gray-900 rounded-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email address"
                />
              </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Password"
                />
                <button
                  type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21m-4.5-4.5A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 015.457-5.878l.586.586" />
                    </svg>
                  ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-3 text-right">
                <Link
                  to="/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                  className="w-full bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex justify-center items-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                        <span>Login</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>

              {/* Legal Text */}
              <p className="text-xs text-gray-500 text-center">
                By signing in, you agree to Thrifty Clothings' Terms of Service, Privacy Policy and Data Usage Properties.
              </p>
            </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
