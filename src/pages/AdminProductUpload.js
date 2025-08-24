import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CategoryModal from '../components/CategoryModal';

const AdminProductUpload = () => {
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: 'Thrifty Clothing',
    stock: '',
    images: [],
    isActive: true,
    tags: []
  });
  const [autoCategory, setAutoCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ensure categories is always an array
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Set default categories if API fails
      setCategories([
        { _id: '1', name: 'T-Shirts' },
        { _id: '2', name: 'Jeans' },
        { _id: '3', name: 'Hoodies' },
        { _id: '4', name: 'Dresses' },
        { _id: '5', name: 'Shoes' },
        { _id: '6', name: 'Jackets' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Auto-categorize when name or description changes
    if (name === 'name' || name === 'description' || name === 'brand') {
      previewAutoCategorization();
    }
  };

  const previewAutoCategorization = async () => {
    if (!formData.name && !formData.description && !formData.brand) {
      setAutoCategory(null);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/admin/preview-categorization', {
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        tags: formData.tags
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAutoCategory(response.data);
    } catch (err) {
      console.error('Error previewing categorization:', err);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(false);
    
    // If auto-categorization is selected, trigger the preview
    if (category.type === 'auto') {
      previewAutoCategorization();
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      setError('Please fill in name and price');
      return;
    }

    // Check if category is selected
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      
      // Add category information
      if (selectedCategory.type === 'auto') {
        formDataToSend.append('useAutoCategory', 'true');
      } else {
        formDataToSend.append('useAutoCategory', 'false');
        formDataToSend.append('selectedCategory', selectedCategory.id);
        formDataToSend.append('selectedGender', selectedCategory.gender);
        formDataToSend.append('selectedCategoryType', selectedCategory.categoryType);
      }

      // Add image files
      if (formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          if (image instanceof File) {
            formDataToSend.append('images', image);
          }
        });
      }

      await axios.post('/api/admin/products', formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
      successMessage.textContent = 'Product uploaded successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);

             // Reset form
       setFormData({
         name: '',
         description: '',
         price: '',
         category: '',
         brand: 'Thrifty Clothing',
         stock: '',
         images: [],
         isActive: true
       });

      // Navigate back to products list
      navigate('/admin/products');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Error uploading product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload Product</h1>
              <p className="text-gray-600">Add a new product to the system</p>
            </div>
            <button
              onClick={() => navigate('/admin/products')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Selection *
                  </label>
                  
                  {/* Category Selection Button */}
                  <button
                    type="button"
                    onClick={handleOpenModal}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-left"
                  >
                    {selectedCategory ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Selected Category:</span>
                          <p className="text-lg font-semibold text-blue-600">{selectedCategory.name}</p>
                        </div>
                        <span className="text-blue-600">Change</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">📂</span>
                        <div>
                          <p className="font-medium text-gray-900">Click to select category</p>
                          <p className="text-sm text-gray-600">Choose from gender and category type</p>
                        </div>
                      </div>
                    )}
                  </button>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                                 <div>
                   <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                     Brand
                   </label>
                   <input
                     type="text"
                     id="brand"
                     name="brand"
                     value={formData.brand}
                     onChange={handleInputChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                 </div>

                 <div>
                   <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                     Stock Quantity
                   </label>
                   <input
                     type="number"
                     id="stock"
                     name="stock"
                     value={formData.stock}
                     onChange={handleInputChange}
                     min="0"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                 </div>
              </div>
            </div>

            {/* Category Selection Summary */}
            {selectedCategory && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  📋 Category Selection Summary
                </h4>
                
                {selectedCategory.type === 'auto' ? (
                  <div>
                    {autoCategory ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-800">Primary Category:</span>
                          <span className="ml-2 text-blue-700">
                            {autoCategory.detectedKeywords?.primary || 'Not detected'}
                          </span>
                          <span className="ml-2 text-xs text-blue-600">
                            ({autoCategory.confidence?.primary || 'low'} confidence)
                          </span>
                        </div>
                        {autoCategory.detectedKeywords?.secondary && (
                          <div>
                            <span className="font-medium text-gray-800">Secondary Category:</span>
                            <span className="ml-2 text-blue-700">
                              {autoCategory.detectedKeywords.secondary}
                            </span>
                            <span className="ml-2 text-xs text-blue-600">
                              ({autoCategory.confidence?.secondary || 'low'} confidence)
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        🤖 Auto-categorization will analyze your product details to determine the best category.
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-2">
                      💡 The product will be automatically categorized based on its name, description, and brand.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-green-700">
                      ✅ Manual category selected: <span className="font-medium">{selectedCategory.name}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      🎯 You have manually selected the category for this product.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product description..."
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="mt-4">
                    <label htmlFor="images" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Upload Images
                    </label>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image instanceof File ? URL.createObjectURL(image) : image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active (visible to customers)</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload Product'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Category Selection Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default AdminProductUpload;
