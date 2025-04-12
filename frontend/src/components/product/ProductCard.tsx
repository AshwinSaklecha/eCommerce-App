import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

// Local fallback images
const FALLBACK_IMAGES = {
  fan: '/images/fan.svg',
  ac: '/images/ac.svg',
  default: '/images/product-placeholder.svg'
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  
  // Find the lowest price among all variants
  const lowestPrice = product.variants.reduce(
    (min, variant) => (variant.price < min ? variant.price : min),
    product.variants[0]?.price || 0
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

  return (
    <div className="group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <img
          src={getImageSrc()}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
          onError={handleImageError}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">${lowestPrice.toFixed(2)}</p>

      <Link 
        to={`/products/${product._id}`}
        className="mt-2 inline-block btn btn-primary"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard; 