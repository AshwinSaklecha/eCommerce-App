import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../types';
import ProductService from '../services/product.service';

// Local category images
const CATEGORY_IMAGES = {
  fan: '/images/fan.svg',
  ac: '/images/ac.svg'
};

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await ProductService.getProducts();
        // Just show the first 4 products for featured section
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gray-900 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Stay Cool & Comfortable With Our Premium Cooling Solutions
              </h1>
              <p className="text-lg mb-8">
                Discover our range of high-quality fans and air conditioners designed for optimal comfort and energy efficiency.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products?category=fan" className="btn btn-primary">
                  Shop Fans
                </Link>
                <Link to="/products?category=ac" className="btn btn-outline bg-transparent text-white border-white hover:bg-white hover:text-gray-900">
                  Shop ACs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/products?category=fan" className="relative overflow-hidden rounded-lg">
              <div className="aspect-h-2 aspect-w-3">
                <img 
                  src={CATEGORY_IMAGES.fan}
                  alt="Fans" 
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white">Fans</h3>
                  <p className="text-white/80 mb-4">Stay cool with our range of high-quality fans</p>
                  <span className="inline-block px-4 py-2 bg-white rounded-md text-gray-900 font-medium">Shop Now</span>
                </div>
              </div>
            </Link>
            <Link to="/products?category=ac" className="relative overflow-hidden rounded-lg">
              <div className="aspect-h-2 aspect-w-3">
                <img 
                  src={CATEGORY_IMAGES.ac}
                  alt="Air Conditioners" 
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white">Air Conditioners</h3>
                  <p className="text-white/80 mb-4">Experience superior cooling with our AC units</p>
                  <span className="inline-block px-4 py-2 bg-white rounded-md text-gray-900 font-medium">Shop Now</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Quality Products</h3>
              <p className="text-gray-600">We offer only the highest quality fans and ACs from trusted brands.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your cooling solutions delivered quickly and reliably.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.5 9.5l5 5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Customer Support</h3>
              <p className="text-gray-600">Our team is always ready to assist you with any questions.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home; 