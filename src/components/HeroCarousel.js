import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroCarousel = ({ images = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use provided images or fallback to default slides
  const slides = images.length > 0 ? images.map((img, index) => ({
    id: img.id || index + 1,
    title: img.title || 'New Collection 2024',
    subtitle: img.description || 'Discover your potential with our latest collection',
    description: img.description || 'Premium fashion for the modern lifestyle',
    image: img.url || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`,
    buttonText: "Shop Now",
    buttonLink: "/products"
  })) : [
    {
      id: 1,
      title: "FOCUS FORWARD",
      subtitle: "New Collection 2024",
      description: "Discover your potential with our latest collection",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Shop Collection",
      buttonLink: "/products"
    },
    {
      id: 2,
      title: "GROW STEADY",
      subtitle: "Sustainable Fashion",
      description: "Quality clothing that grows with you",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Explore Now",
      buttonLink: "/products"
    },
    {
      id: 3,
      title: "PEACE WITHIN",
      subtitle: "Comfort & Style",
      description: "Find your inner peace through fashion",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Shop Now",
      buttonLink: "/products"
    }
  ];

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {/* Background Image with Enhanced Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-1000"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.8) 100%), url(${slide.image})`
            }}
          />
          
          {/* Content Overlay with Enhanced Styling */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-6 max-w-5xl mx-auto">
              {/* Animated Subtitle */}
              <div className="overflow-hidden mb-6">
                <p className="text-lg md:text-xl font-light tracking-widest uppercase text-blue-300 transform transition-all duration-1000 delay-300">
                  {slide.subtitle}
                </p>
              </div>
              
              {/* Main Title with Enhanced Typography */}
              <div className="overflow-hidden mb-8">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight transform transition-all duration-1000 delay-500 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  {slide.title}
                </h1>
              </div>
              
              {/* Description with Better Spacing */}
              <div className="overflow-hidden mb-10">
                <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed text-gray-200 transform transition-all duration-1000 delay-700">
                  {slide.description}
                </p>
              </div>
              
              {/* Enhanced CTA Button */}
              <div className="transform transition-all duration-1000 delay-1000">
                <Link
                  to={slide.buttonLink}
                  className="group inline-flex items-center bg-white text-black px-10 py-4 text-lg font-bold tracking-wider hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-sm"
                >
                  <span>{slide.buttonText}</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-60 text-white p-4 hover:bg-opacity-80 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-60 text-white p-4 hover:bg-opacity-80 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Enhanced Dots Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex space-x-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
              index === currentSlide 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Enhanced Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-50 z-20">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-linear"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white border-opacity-20 rounded-full"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 border border-white border-opacity-15 rounded-full"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-white border-opacity-10 rounded-full"></div>
      </div>
    </div>
  );
};

export default HeroCarousel;
