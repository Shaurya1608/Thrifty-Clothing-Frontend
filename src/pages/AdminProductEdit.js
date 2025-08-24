import React, { useState, useEffect, useCallback } from 'react';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import CategoryModal from '../components/CategoryModal';

const AdminProductEdit = () => {
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
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
    existingImageObjects: [], // Store original image objects
    isActive: true
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [autoCategory, setAutoCategory] = useState(null);

  const fetchProduct = useCallback(async () => {
    try {
      console.log('Fetching product with ID:', productId);
      const response = await api.get(`/admin/products/${productId}`);
      console.log('Product response:', response.data);
      
      const product = response.data.product;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.basePrice || product.price || '',
        category: product.category?._id || product.category || '',
        brand: product.brand || 'Thrifty Clothing',
        stock: product.variants?.[0]?.stock || product.stock || '',
        images: product.images?.map(img => img.url) || [],
        existingImageObjects: product.images || [], // Store original image objects
        isActive: product.isActive !== undefined ? product.isActive : true
      });
      
      // Initialize selectedCategory based on existing product category
      if (product.category) {
        const categoryName = product.category.name || product.category;
        setSelectedCategory({
          id: product.category._id || product.category,
          name: categoryName,
          type: 'manual'
        });
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Error fetching product');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
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

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [productId, fetchProduct]);

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
      const response = await api.post('/admin/preview-categorization', {
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        tags: []
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


      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('isActive', formData.isActive);
      
      // Add category information
      if (selectedCategory.type === 'auto') {
        formDataToSend.append('useAutoCategory', 'true');
      } else {
        formDataToSend.append('useAutoCategory', 'false');
        formDataToSend.append('selectedCategory', selectedCategory.id);
        formDataToSend.append('selectedGender', selectedCategory.gender);
        formDataToSend.append('selectedCategoryType', selectedCategory.categoryType);
      }

      // Add existing images - use the original image objects
      const existingImages = formData.images.filter(img => !(img instanceof File));
      if (existingImages.length > 0) {
        // Find the corresponding original image objects
        const existingImageObjects = formData.existingImageObjects.filter(img => 
          existingImages.includes(img.url)
        );
        if (existingImageObjects.length > 0) {
          formDataToSend.append('existingImages', JSON.stringify(existingImageObjects));
        }
      }

      // Add new image files
      const newImages = formData.images.filter(img => img instanceof File);
      newImages.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      console.log('Sending update request with data:', {
        productId,
        name: formData.name,
        price: formData.price,
        category: formData.category,
        stock: formData.stock,
        existingImages: formData.existingImageObjects.length
      });

      const response = await api.put(`/admin/products/${productId}`, formDataToSend);
      
      console.log('Product update response:', response.data);

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
      successMessage.textContent = 'Product updated successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);

      // Don't navigate immediately - let user stay on the page
      // navigate('/admin/products');
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Error updating product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600">Update product information</p>
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

            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Product Images</label>
              
              {/* Current Images */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image instanceof File ? URL.createObjectURL(image) : image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload New Images */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-sm text-gray-600">Click to upload images</p>
                  </div>
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active (visible to customers)
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Updating...' : 'Update Product'}
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

export default AdminProductEdit;
