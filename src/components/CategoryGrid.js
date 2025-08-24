import React from 'react';
import { Link } from 'react-router-dom';

const CategoryGrid = ({ categories = [] }) => {
  // Use provided categories or fallback to default categories
  const displayCategories = categories.length > 0 ? categories.map((cat, index) => ({
    id: cat.id || index + 1,
    name: cat.name || `Category ${index + 1}`,
    description: cat.description || '',
    image: cat.image || `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80`,
    link: `/products?category=${cat.name?.toLowerCase() || 'category'}`
  })) : [
    {
      id: 1,
      name: "Men",
      description: "Trendy styles for men",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      link: "/products?category=mens"
    },
    {
      id: 2,
      name: "Women",
      description: "Elegant fashion for women",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      link: "/products?category=womens"
    },
    {
      id: 3,
      name: "Kids",
      description: "Adorable clothing for children",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      link: "/products?category=kids"
    },
    {
      id: 4,
      name: "Accessories",
      description: "Complete your look",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      link: "/products?category=accessories"
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            SHOP BY CATEGORIES
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our curated collections designed for every style and occasion
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative aspect-square overflow-hidden bg-gray-800 hover:scale-105 transition-transform duration-500"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 tracking-wide">
                  {category.name}
                </h3>
                <p className="text-sm md:text-base text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.description}
                </p>
                
                {/* Arrow indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
