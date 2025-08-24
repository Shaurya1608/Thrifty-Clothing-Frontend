import React, { useState } from 'react';

const CategoryModal = ({ isOpen, onClose, onCategorySelect, selectedCategory }) => {
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedCategoryType, setSelectedCategoryType] = useState('');

  // Gender options
  const genders = [
    { id: 'men', name: 'Men', icon: '👨' },
    { id: 'women', name: 'Women', icon: '👩' },
    { id: 'kids', name: 'Kids', icon: '👶' },
    { id: 'unisex', name: 'Unisex', icon: '🔄' }
  ];

  // Category types for each gender
  const categoryTypes = {
    men: [
      { id: 'shirts', name: 'Shirts', icon: '👕' },
      { id: 't-shirts', name: 'T-Shirts', icon: '👕' },
      { id: 'jeans', name: 'Jeans', icon: '👖' },
      { id: 'pants', name: 'Pants', icon: '👖' },
      { id: 'jackets', name: 'Jackets', icon: '🧥' },
      { id: 'hoodies', name: 'Hoodies', icon: '🧥' },
      { id: 'shoes', name: 'Shoes', icon: '👟' },
      { id: 'accessories', name: 'Accessories', icon: '👜' }
    ],
    women: [
      { id: 'dresses', name: 'Dresses', icon: '👗' },
      { id: 'tops', name: 'Tops', icon: '👚' },
      { id: 'skirts', name: 'Skirts', icon: '👗' },
      { id: 'jeans', name: 'Jeans', icon: '👖' },
      { id: 'pants', name: 'Pants', icon: '👖' },
      { id: 'jackets', name: 'Jackets', icon: '🧥' },
      { id: 'shoes', name: 'Shoes', icon: '👠' },
      { id: 'accessories', name: 'Accessories', icon: '👜' }
    ],
    kids: [
      { id: 'boys-clothing', name: "Boys' Clothing", icon: '👦' },
      { id: 'girls-clothing', name: "Girls' Clothing", icon: '👧' },
      { id: 'shoes', name: 'Shoes', icon: '👟' },
      { id: 'accessories', name: 'Accessories', icon: '🎒' }
    ],
    unisex: [
      { id: 'accessories', name: 'Accessories', icon: '👜' },
      { id: 'bags', name: 'Bags', icon: '👜' },
      { id: 'footwear', name: 'Footwear', icon: '👟' },
      { id: 'jewelry', name: 'Jewelry', icon: '💍' }
    ]
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setSelectedCategoryType('');
  };

  const handleCategoryTypeSelect = (categoryType) => {
    setSelectedCategoryType(categoryType);
  };

  const handleConfirm = () => {
    if (selectedGender && selectedCategoryType) {
      const fullCategory = {
        id: `${selectedGender}-${selectedCategoryType}`,
        name: `${genders.find(g => g.id === selectedGender)?.name} ${categoryTypes[selectedGender].find(c => c.id === selectedCategoryType)?.name}`,
        gender: selectedGender,
        categoryType: selectedCategoryType
      };
      onCategorySelect(fullCategory);
      onClose();
    }
  };

  const handleAutoCategorization = () => {
    onCategorySelect({ id: 'auto', name: 'Auto-Categorization', type: 'auto' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Select Category</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Auto-Categorization Option */}
          <div className="mb-6">
            <button
              onClick={handleAutoCategorization}
              className="w-full p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">🤖</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Auto-Categorization</h3>
                  <p className="text-sm text-gray-600">Let AI automatically detect the best category</p>
                </div>
              </div>
            </button>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Selection</h3>
            
            {/* Step 1: Gender Selection */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">Step 1: Select Gender</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {genders.map((gender) => (
                  <button
                    key={gender.id}
                    onClick={() => handleGenderSelect(gender.id)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      selectedGender === gender.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{gender.icon}</div>
                      <div className="font-medium">{gender.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Category Type Selection */}
            {selectedGender && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  Step 2: Select Category Type
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categoryTypes[selectedGender].map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryTypeSelect(category.id)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedCategoryType === category.id
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <div className="font-medium text-sm">{category.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Category Display */}
            {selectedGender && selectedCategoryType && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Selected Category:</h4>
                <p className="text-green-700">
                  {genders.find(g => g.id === selectedGender)?.name} - {categoryTypes[selectedGender].find(c => c.id === selectedCategoryType)?.name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedGender || !selectedCategoryType}
            className={`px-6 py-2 rounded-lg transition-colors ${
              selectedGender && selectedCategoryType
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;

