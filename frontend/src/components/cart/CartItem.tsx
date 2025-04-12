import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../context/CartContext';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, variant, quantity, price } = item;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(product._id, variant.size, variant.color, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(product._id, variant.size, variant.color);
  };

  return (
    <div className="flex items-center py-6 border-b border-gray-200">
      {/* Product image */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={product.images[0] || 'https://via.placeholder.com/150'}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Product details */}
      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <h3>
            <Link to={`/products/${product._id}`}>{product.name}</Link>
          </h3>
          <p className="ml-4">${(price * quantity).toFixed(2)}</p>
        </div>

        <div className="flex items-end justify-between text-sm mt-2">
          <div>
            <p className="text-gray-500">
              Size: <span className="font-medium">{variant.size}</span>
            </p>
            <p className="text-gray-500">
              Color: <span className="font-medium">{variant.color}</span>
            </p>
            <p className="text-gray-500 mt-1">
              <span className="font-medium">${price.toFixed(2)}</span> each
            </p>
          </div>

          <div className="flex items-center">
            <label htmlFor={`quantity-${product._id}-${variant.size}-${variant.color}`} className="sr-only">
              Quantity
            </label>
            <select
              id={`quantity-${product._id}-${variant.size}-${variant.color}`}
              name="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className="rounded-md border border-gray-300 text-base"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="ml-4 text-gray-400 hover:text-gray-500"
              onClick={handleRemove}
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 