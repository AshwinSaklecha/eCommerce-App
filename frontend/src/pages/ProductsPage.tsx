import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../types';
import ProductService from '../services/product.service';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/solid';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Get category from URL params
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await ProductService.getProducts(category || undefined, brand || undefined);
        setProducts(data);
        setFilteredProducts(data);

        // Extract unique brands
        const uniqueBrands = [...new Set(data.map((product: Product) => product.brand))];
        setBrands(uniqueBrands);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, brand]);

  const handleCategoryFilter = (newCategory: string | null) => {
    if (newCategory) {
      searchParams.set('category', newCategory);
    } else {
      searchParams.delete('category');
    }
    
    if (brand) {
      searchParams.set('brand', brand);
    }
    
    setSearchParams(searchParams);
  };

  const handleBrandFilter = (newBrand: string | null) => {
    if (newBrand) {
      searchParams.set('brand', newBrand);
    } else {
      searchParams.delete('brand');
    }
    
    if (category) {
      searchParams.set('category', category);
    }
    
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Get page title based on filters
  const getPageTitle = () => {
    if (category === 'fan') return 'Fans';
    if (category === 'ac') return 'Air Conditioners';
    if (brand) return `${brand} Products`;
    return 'All Products';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          <p className="text-gray-500 mt-1">
            {filteredProducts.length} products available
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Mobile filter dialog */}
          <div className="lg:hidden mb-6">
            <button
              onClick={toggleFilters}
              className="flex items-center text-gray-700 hover:text-primary-600"
            >
              <FunnelIcon className="h-5 w-5 mr-1" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h2 className="text-lg font-medium">Filters</h2>
                <button onClick={toggleFilters}>
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Category filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Category</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="category-all"
                        name="category"
                        type="radio"
                        checked={!category}
                        onChange={() => handleCategoryFilter(null)}
                        className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="category-all" className="ml-3 text-sm text-gray-700">
                        All
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="category-fans"
                        name="category"
                        type="radio"
                        checked={category === 'fan'}
                        onChange={() => handleCategoryFilter('fan')}
                        className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="category-fans" className="ml-3 text-sm text-gray-700">
                        Fans
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="category-acs"
                        name="category"
                        type="radio"
                        checked={category === 'ac'}
                        onChange={() => handleCategoryFilter('ac')}
                        className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="category-acs" className="ml-3 text-sm text-gray-700">
                        Air Conditioners
                      </label>
                    </div>
                  </div>
                </div>

                {/* Brand filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Brand</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="brand-all"
                        name="brand"
                        type="radio"
                        checked={!brand}
                        onChange={() => handleBrandFilter(null)}
                        className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="brand-all" className="ml-3 text-sm text-gray-700">
                        All
                      </label>
                    </div>
                    {brands.map((brandName) => (
                      <div key={brandName} className="flex items-center">
                        <input
                          id={`brand-${brandName}`}
                          name="brand"
                          type="radio"
                          checked={brand === brandName}
                          onChange={() => handleBrandFilter(brandName)}
                          className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={`brand-${brandName}`} className="ml-3 text-sm text-gray-700">
                          {brandName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear filters */}
                {(category || brand) && (
                  <div className="mt-4">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex justify-center py-12">
                <p>No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage; 