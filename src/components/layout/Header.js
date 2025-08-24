import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';

const Header = () => {
  const { user, logout } = useFirebaseAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);



  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isAuthenticated = !!user;

  return (
    <>
      <header className="bg-black text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/home" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-black font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">THRIFTY</h1>
                <p className="text-xs text-gray-300 -mt-1">CLOTHINGS</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                to="/home" 
                className="text-white hover:text-gray-300 font-medium transition-colors duration-200 relative group"
              >
                HOME
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/products" 
                className="text-white hover:text-gray-300 font-medium transition-colors duration-200 relative group"
              >
                SHOP
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/products" 
                className="text-white hover:text-gray-300 font-medium transition-colors duration-200 relative group"
              >
                COLLECTION
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-gray-300 font-medium transition-colors duration-200 relative group"
              >
                PAGES
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Cart Icon */}
                  <Link
                    to="/cart"
                    className="relative p-2 text-white hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </Link>
                  
                  {/* User Icon */}
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-black text-sm font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* Admin/Seller Navigation */}
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="bg-red-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Admin
                      </Link>
                    )}
                    {user?.role === 'seller' && (
                      <Link
                        to="/seller"
                        className="bg-green-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Seller
                      </Link>
                    )}
                    {user?.role === 'user' && (
                      <Link
                        to="/seller/apply"
                        className="bg-green-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Become Seller
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="btn-secondary text-sm py-2 px-4"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/change-password"
                      className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="btn-danger text-sm py-2 px-4"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:text-gray-300 font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-black text-sm py-2 px-6 font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu lg:hidden" onClick={closeMobileMenu}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Mobile Logo */}
              <div className="flex items-center space-x-2 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold gradient-text">THRIFTY</h1>
                  <p className="text-xs text-gray-500 -mt-1">CLOTHINGS</p>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-4 mb-8">
                <Link 
                  to="/home" 
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                  onClick={closeMobileMenu}
                >
                  Products
                </Link>
                <Link 
                  to="/about" 
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
              </nav>

              {/* Mobile User Actions */}
              <div className="space-y-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Welcome back!</p>
                        <p className="text-sm text-gray-600">{user?.name}</p>
                      </div>
                    </div>
                    {/* Admin/Seller Navigation */}
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block w-full bg-red-600 text-white text-center py-3 px-4 rounded-lg hover:bg-red-700 transition-colors mb-3"
                        onClick={closeMobileMenu}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {user?.role === 'seller' && (
                      <Link
                        to="/seller"
                        className="block w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors mb-3"
                        onClick={closeMobileMenu}
                      >
                        Seller Dashboard
                      </Link>
                    )}
                    {user?.role === 'user' && (
                      <Link
                        to="/seller/apply"
                        className="block w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors mb-3"
                        onClick={closeMobileMenu}
                      >
                        Become Seller
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="block w-full btn-secondary text-center"
                      onClick={closeMobileMenu}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/change-password"
                      className="block w-full text-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-3"
                      onClick={closeMobileMenu}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="block w-full btn-danger"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full btn-secondary text-center"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full btn-primary text-center"
                      onClick={closeMobileMenu}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
