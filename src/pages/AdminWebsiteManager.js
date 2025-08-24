import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminWebsiteManager = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('homepage');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State for different sections
  const [heroImages, setHeroImages] = useState([
    { id: 1, url: '', title: '', description: '', order: 1, isActive: true },
    { id: 2, url: '', title: '', description: '', order: 2, isActive: true },
    { id: 3, url: '', title: '', description: '', order: 3, isActive: true }
  ]);

  const [featuredCategories, setFeaturedCategories] = useState([
    { id: 1, name: 'Men', icon: '👨', color: 'bg-blue-500', order: 1, isActive: true, image: '' },
    { id: 2, name: 'Women', icon: '👩', color: 'bg-pink-500', order: 2, isActive: true, image: '' },
    { id: 3, name: 'Kids', icon: '👶', color: 'bg-green-500', order: 3, isActive: true, image: '' },
    { id: 4, name: 'Accessories', icon: '👜', color: 'bg-purple-500', order: 4, isActive: true, image: '' }
  ]);

  const [websiteSettings, setWebsiteSettings] = useState({
    siteName: 'Thrifty Clothing',
    siteDescription: 'Your one-stop destination for trendy and affordable fashion',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    logo: '',
    favicon: '',
    contactEmail: 'support@thriftyclothing.com',
    contactPhone: '+91 98765 43210',
    address: '123 Fashion Street, Mumbai, India',
    socialMedia: {
      facebook: 'https://facebook.com/thriftyclothing',
      instagram: 'https://instagram.com/thriftyclothing',
      twitter: 'https://twitter.com/thriftyclothing',
      youtube: 'https://youtube.com/thriftyclothing'
    }
  });

  const [announcements, setAnnouncements] = useState([
    { id: 1, text: 'Free shipping on orders above ₹999!', isActive: true, order: 1 },
    { id: 2, text: 'New collection launching soon!', isActive: true, order: 2 },
    { id: 3, text: 'Get 20% off on your first order!', isActive: false, order: 3 }
  ]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await api.get('/admin/website-settings');
        const data = response.data;
        if (data.heroImages) setHeroImages(data.heroImages);
        if (data.featuredCategories) setFeaturedCategories(data.featuredCategories);
        if (data.websiteSettings) setWebsiteSettings(data.websiteSettings);
        if (data.announcements) setAnnouncements(data.announcements);
      } catch (error) {
        console.log('No saved settings found, using defaults');
      }
    };
    loadSettings();
  }, []);

  const handleImageUpload = async (file, imageId) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/admin/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = response.data.imageUrl;
      setHeroImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, url: imageUrl } : img
      ));
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error uploading image: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCategoryImageUpload = async (file, categoryId) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/admin/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = response.data.imageUrl;
      setFeaturedCategories(prev => prev.map(cat => 
        cat.id === categoryId ? { ...cat, image: imageUrl } : cat
      ));
      setMessage('Category image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error uploading category image: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleHeroImageChange = (id, field, value) => {
    setHeroImages(prev => prev.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    ));
  };

  const handleCategoryChange = (id, field, value) => {
    setFeaturedCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const handleWebsiteSettingChange = (field, value) => {
    setWebsiteSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setWebsiteSettings(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }));
  };

  const handleAnnouncementChange = (id, field, value) => {
    setAnnouncements(prev => prev.map(announcement => 
      announcement.id === id ? { ...announcement, [field]: value } : announcement
    ));
  };

  const saveAllChanges = async () => {
    setIsLoading(true);
    try {
      await api.post('/admin/website-settings', {
        heroImages,
        featuredCategories,
        websiteSettings,
        announcements
      });
      setMessage('All changes saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving changes: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'homepage', name: 'Homepage', icon: '🏠' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'content', name: 'Content', icon: '📝' },
    { id: 'social', name: 'Social Media', icon: '📱' },
    { id: 'announcements', name: 'Announcements', icon: '📢' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Manager</h1>
              <p className="text-gray-600">Customize your website appearance and content</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => window.open('/', '_blank')}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                👁️ Preview Website
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className={`p-4 rounded-lg ${
            message.includes('Error') 
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'homepage' && (
          <div className="space-y-8">
            {/* Hero Images Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Hero Images</h2>
                <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {heroImages.filter(img => img.isActive).length} Active
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {heroImages.map((image) => (
                  <div key={image.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Hero Image {image.id}</h3>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={image.isActive}
                          onChange={(e) => handleHeroImageChange(image.id, 'isActive', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Active</span>
                      </label>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (or upload below)</label>
                        <input
                          type="url"
                          placeholder="Image URL (or upload below)"
                          value={image.url}
                          onChange={(e) => handleHeroImageChange(image.id, 'url', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleImageUpload(file, image.id);
                            }
                          }}
                          className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
                        />
                        {image.url && (
                          <img 
                            src={image.url} 
                            alt="Preview" 
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          placeholder="Enter title (optional)"
                          value={image.title}
                          onChange={(e) => handleHeroImageChange(image.id, 'title', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          placeholder="Enter description (optional)"
                          value={image.description}
                          onChange={(e) => handleHeroImageChange(image.id, 'description', e.target.value)}
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                        <input
                          type="number"
                          min="1"
                          value={image.order}
                          onChange={(e) => handleHeroImageChange(image.id, 'order', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Categories Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Categories</h2>
                <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {featuredCategories.filter(cat => cat.isActive).length} Active
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredCategories.map((category) => (
                  <div key={category.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={category.isActive}
                          onChange={(e) => handleCategoryChange(category.id, 'isActive', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Active</span>
                      </label>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Category Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
                        <div className="space-y-2">
                          <input
                            type="url"
                            placeholder="Image URL (or upload below)"
                            value={category.image}
                            onChange={(e) => handleCategoryChange(category.id, 'image', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          />
                          <div className="flex items-center space-x-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  handleCategoryImageUpload(file, category.id);
                                }
                              }}
                              className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
                            />
                            {category.image && (
                              <div className="relative">
                                <img 
                                  src={category.image} 
                                  alt="Preview" 
                                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <select
                          value={category.color}
                          onChange={(e) => handleCategoryChange(category.id, 'color', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        >
                          <option value="bg-blue-500">Blue</option>
                          <option value="bg-pink-500">Pink</option>
                          <option value="bg-green-500">Green</option>
                          <option value="bg-purple-500">Purple</option>
                          <option value="bg-red-500">Red</option>
                          <option value="bg-yellow-500">Yellow</option>
                          <option value="bg-indigo-500">Indigo</option>
                          <option value="bg-teal-500">Teal</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                        <input
                          type="number"
                          min="1"
                          value={category.order}
                          onChange={(e) => handleCategoryChange(category.id, 'order', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Website Appearance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={websiteSettings.siteName}
                  onChange={(e) => handleWebsiteSettingChange('siteName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <input
                  type="text"
                  value={websiteSettings.siteDescription}
                  onChange={(e) => handleWebsiteSettingChange('siteDescription', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <input
                  type="color"
                  value={websiteSettings.primaryColor}
                  onChange={(e) => handleWebsiteSettingChange('primaryColor', e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <input
                  type="color"
                  value={websiteSettings.secondaryColor}
                  onChange={(e) => handleWebsiteSettingChange('secondaryColor', e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={websiteSettings.contactEmail}
                  onChange={(e) => handleWebsiteSettingChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={websiteSettings.contactPhone}
                  onChange={(e) => handleWebsiteSettingChange('contactPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={websiteSettings.address}
                  onChange={(e) => handleWebsiteSettingChange('address', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={websiteSettings.socialMedia.facebook}
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={websiteSettings.socialMedia.instagram}
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  value={websiteSettings.socialMedia.twitter}
                  onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                <input
                  type="url"
                  value={websiteSettings.socialMedia.youtube}
                  onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Announcements</h2>
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Announcement {announcement.id}</h3>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={announcement.isActive}
                        onChange={(e) => handleAnnouncementChange(announcement.id, 'isActive', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Active</span>
                    </label>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <input
                        type="text"
                        value={announcement.text}
                        onChange={(e) => handleAnnouncementChange(announcement.id, 'text', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                      <input
                        type="number"
                        min="1"
                        value={announcement.order}
                        onChange={(e) => handleAnnouncementChange(announcement.id, 'order', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end">
            <button
              onClick={saveAllChanges}
              disabled={isLoading}
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? 'Saving...' : '💾 Save All Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWebsiteManager;
