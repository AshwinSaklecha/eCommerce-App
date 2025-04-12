import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const CheckoutSuccessPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been placed and is being processed.
          </p>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-lg font-medium mb-4">What's Next?</h2>
            <ul className="text-left text-gray-600 space-y-2">
              <li>You will receive an email confirmation shortly.</li>
              <li>Our team will prepare your order for shipment.</li>
              <li>You can track your order status in your order history.</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link to="/orders" className="btn btn-primary">
              View Your Orders
            </Link>
            <Link to="/products" className="btn btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccessPage; 