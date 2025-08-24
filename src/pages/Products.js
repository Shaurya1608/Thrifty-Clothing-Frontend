import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import api from '../utils/api';
import { formatINR } from '../utils/currency';

// Mock products data - Essential Tees like UGMONK (Prices in INR)
const mockProducts = [
  {
    id: 1,
    name: "Men's Essential Tee (Port)",
    price: 2490,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Men",
    color: "Port"
  },
  {
    id: 2,
    name: "Men's Essential Tee (Deep Forest)",
    price: 2490,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Men",
    color: "Deep Forest"
  },
  {
    id: 3,
    name: "Men's Essential Tee (Bone)",
    price: 2490,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Men",
    color: "Bone"
  },
  {
    id: 4,
    name: "Men's Essential Tee (Charcoal)",
    price: 2490,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Men",
    color: "Charcoal"
  },
  {
    id: 5,
    name: "Men's Essential Tee (Washed Indigo)",
    price: 2490,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Men",
    color: "Washed Indigo"
  },
  {
    id: 6,
    name: "Men's Essential Tee (Black)",
    price: 2490,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Men",
    color: "Black"
  },
  {
    id: 7,
    name: "Men's Essential Tee (Olive)",
    price: 2490,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Men",
    color: "Olive"
  },
  {
    id: 8,
    name: "Men's Essential Tee (Grey)",
    price: 2490,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Men",
    color: "Grey"
  },
  {
    id: 9,
    name: "Women's Essential Tee (Port)",
    price: 2490,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Women",
    color: "Port"
  }
];

const Products = () => {
  const { user } = useFirebaseAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter products based on selected category
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [products, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products...');
      const response = await api.get('/products');
      console.log('Products response:', response.data);
      
      // Check if we have products in the response
      if (response.data.products && response.data.products.length > 0) {
        setProducts(response.data.products);
        console.log(`Loaded ${response.data.products.length} products from API`);
      } else {
        console.log('No products found in API response, using mock data');
        setProducts(mockProducts);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      console.log('API failed, using mock products');
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Set default categories if API fails
      setCategories([
        { id: 'men', name: 'Men', slug: 'men' },
        { id: 'women', name: 'Women', slug: 'women' },
        { id: 'kids', name: 'Kids', slug: 'kids' },
        { id: 'accessories', name: 'Accessories', slug: 'accessories' },
        { id: 'footwear', name: 'Footwear', slug: 'footwear' },
        { id: 'bags', name: 'Bags', slug: 'bags' }
      ]);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user-profile/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          productId: productId.toString(),
          quantity: 1
        })
      });

      if (response.ok) {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
        successMessage.textContent = 'Item added to cart!';
        document.body.appendChild(successMessage);
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 3000);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
      errorMessage.textContent = error.message || 'Failed to add to cart';
      document.body.appendChild(errorMessage);
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user-profile/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          productId: productId.toString()
        })
      });

      if (response.ok) {
        setWishlistItems(prev => new Set([...prev, productId]));
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
        successMessage.textContent = 'Item added to wishlist!';
        document.body.appendChild(successMessage);
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 3000);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
      errorMessage.textContent = error.message || 'Failed to add to wishlist';
      document.body.appendChild(errorMessage);
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Category navigation component
  const CategoryNav = () => (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8 py-4 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id || category._id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.name
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Category Navigation */}
      <CategoryNav />
      
      {/* Hero Banner Section */}
      <section className="relative bg-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              THRIFTY CLOTHINGS
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Essential fashion for everyone, every day
            </p>
          </div>
          
          {/* T-Shirts on Hangers Banner */}
          <div className="relative bg-amber-100 rounded-2xl p-8 md:p-12 overflow-hidden">
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
              {/* T-Shirt Hangers */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div key={index} className="relative group">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-lg shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md"></div>
                  </div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-800 rounded-full"></div>
                </div>
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="absolute bottom-6 left-6">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">New Essential Tees</h3>
                <Link 
                  to="#products" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 md:space-x-16 py-6">
            {['All', 'Men', 'Women', 'Objects'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-lg font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                {/* Product Image */}
                <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={product.image || 'https://via.placeholder.com/400x500?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                    }}
                  />
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex space-x-2">
                      <button 
                        onClick={() => handleAddToCart(product.id)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
                        title="Add to Cart"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleAddToWishlist(product.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg ${
                          wishlistItems.has(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                        title="Add to Wishlist"
                      >
                        <svg className="w-5 h-5" fill={wishlistItems.has(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold text-gray-900">
                    {formatINR(product.price * 83)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👕</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
