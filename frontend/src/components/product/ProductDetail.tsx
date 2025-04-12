import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

// Local fallback images
const FALLBACK_IMAGES = {
  fan: '/images/fan.svg',
  ac: '/images/ac.svg',
  default: '/images/product-placeholder.svg'
};

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [imageError, setImageError] = useState(false);

  // Get unique sizes and colors
  const sizes = [...new Set(product.variants.map(variant => variant.size))];
  const colors = selectedSize
    ? [...new Set(product.variants.filter(variant => variant.size === selectedSize).map(variant => variant.color))]
    : [];

  // Get selected variant
  const selectedVariant = product.variants.find(
    variant => variant.size === selectedSize && variant.color === selectedColor
  );

  // Determine appropriate image source
  const getImageSrc = () => {
    // If there was an error loading the primary image, or if no images exist
    if (imageError || !product.images || product.images.length === 0) {
      return FALLBACK_IMAGES[product.category] || FALLBACK_IMAGES.default;
    }
    
    // Try to use the product's first image
    return product.images[0];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(
        product,
        { size: selectedSize, color: selectedColor },
        quantity
      );
      // Reset selection
      setQuantity(1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <img
            src={getImageSrc()}
            alt={product.name}
            className="h-full w-full object-cover object-center"
            onError={handleImageError}
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <h2 className="text-lg text-gray-500">{product.brand}</h2>
          
          {/* Price */}
          <p className="mt-4 text-xl font-semibold text-gray-900">
            ${selectedVariant ? selectedVariant.price.toFixed(2) : 'Select options'}
          </p>

          {/* Description */}
          <div className="mt-4">
            <p className="text-gray-700">
              {product.description}
            </p>
          </div>

          {/* Features */}
          {product.features.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Features</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`px-4 py-2 border rounded-md ${
                    selectedSize === size
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedSize(size);
                    setSelectedColor('');
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          {selectedSize && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`px-4 py-2 border rounded-md ${
                      selectedColor === color
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          {selectedVariant && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
              <div className="mt-2 flex items-center">
                <button
                  type="button"
                  className="p-2 border border-gray-300 rounded-l-md"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-16 p-2 text-center border-t border-b border-gray-300"
                  value={quantity}
                  min="1"
                  max={selectedVariant.stock}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
                <button
                  type="button"
                  className="p-2 border border-gray-300 rounded-r-md"
                  onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                >
                  +
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {selectedVariant.stock} items in stock
              </p>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="mt-8">
            <button
              type="button"
              className="btn btn-primary w-full"
              disabled={!selectedVariant}
              onClick={handleAddToCart}
            >
              {selectedVariant ? 'Add to Cart' : 'Select options'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 