import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, reload } from 'firebase/auth';
import { auth } from '../firebase';

const EmailVerification = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Reload user to get latest email verification status
        await reload(currentUser);
        
        if (currentUser.emailVerified) {
          setMessage('Email verified successfully! You can now log in.');
          
          // Update backend to mark user as verified
          try {
            const response = await fetch('/api/auth/verify-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                firebaseUid: currentUser.uid,
                email: currentUser.email
              }),
            });

            if (response.ok) {
              setMessage('Email verified successfully! You can now log in.');
              // Redirect to login after 3 seconds
              setTimeout(() => {
                navigate('/login');
              }, 3000);
            } else {
              setError('Failed to update verification status. Please try logging in.');
            }
          } catch (error) {
            console.error('Verification update error:', error);
            setError('Failed to update verification status. Please try logging in.');
          }
        } else {
          setMessage('Please check your email and click the verification link.');
        }
      } else {
        setError('No user found. Please register first.');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleResendVerification = async () => {
    if (!user) {
      setError('No user found. Please register first.');
      return;
    }

    try {
      setLoading(true);
      await user.sendEmailVerification();
      setMessage('Verification email sent again! Check your inbox and spam folder.');
    } catch (error) {
      console.error('Resend verification error:', error);
      if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else {
        setError('Failed to send verification email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) {
      setError('No user found. Please register first.');
      return;
    }

    try {
      setLoading(true);
      await reload(user);
      
      if (user.emailVerified) {
        setMessage('Email verified successfully! You can now log in.');
        
        // Update backend
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebaseUid: user.uid,
            email: user.email
          }),
        });

        if (response.ok) {
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } else {
        setMessage('Email not verified yet. Please check your email and click the verification link.');
      }
    } catch (error) {
      console.error('Check verification error:', error);
      setError('Failed to check verification status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {location.state?.message || 'Please verify your email address to continue'}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {user ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Verification email sent to:
                </p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>

              {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {message}
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleCheckVerification}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Checking...' : 'I have verified my email'}
                </button>

                <button
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Resend verification email'}
                </button>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>💡 Check your spam/junk folder if you don't see the email</p>
                <p>💡 Click the verification link in the email to activate your account</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">No user found. Please register first.</p>
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Go to Registration
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
