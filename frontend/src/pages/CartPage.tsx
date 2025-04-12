import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import CartItem from '../components/cart/CartItem';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShippingAddress } from '../types';
import OrderService from '../services/order.service';

const CartPage: React.FC = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // Redirect to login
      navigate('/login');
      return;
    }

    try {
      await OrderService.createOrder(items, shippingAddress);
      
      // Clear cart and show success
      clearCart();
      navigate('/checkout-success');
    } catch (error) {
      console.error('Checkout error:', error);
      // You could add error handling/display here
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Add some products to your cart and they will appear here.</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Cart items */}
          <div className="lg:col-span-7">
            <div className="border-t border-gray-200">
              {items.map(item => (
                <CartItem 
                  key={`${item.productId}-${item.variant.size}-${item.variant.color}`}
                  item={item}
                />
              ))}
            </div>

            <div className="mt-6">
              <Link to="/products" className="text-primary-600 hover:text-primary-700">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-8 lg:mt-0 lg:col-span-5">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">${cartTotal.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">Free</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">${cartTotal.toFixed(2)}</p>
                </div>
              </div>

              {!isCheckingOut ? (
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="mt-6 w-full btn btn-primary"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <form onSubmit={handleCheckout} className="mt-6">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Shipping Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={shippingAddress.street}
                        onChange={handleInputChange}
                        required
                        className="input mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleInputChange}
                          required
                          className="input mt-1"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={shippingAddress.state}
                          onChange={handleInputChange}
                          required
                          className="input mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={handleInputChange}
                          required
                          className="input mt-1"
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={shippingAddress.country}
                          onChange={handleInputChange}
                          required
                          className="input mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="w-1/2 btn btn-outline"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 btn btn-primary"
                    >
                      {isAuthenticated ? 'Place Order' : 'Login to Checkout'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage; 