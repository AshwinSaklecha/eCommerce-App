import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CoolHome</h3>
            <p className="text-gray-300">
              Quality fans and air conditioners for your home and office.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products?category=fan" className="text-gray-300 hover:text-white">
                  Fans
                </Link>
              </li>
              <li>
                <Link to="/products?category=ac" className="text-gray-300 hover:text-white">
                  Air Conditioners
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Electronic City</li>
              <li>Bengaluru, Karnataka</li>
              <li>Email: ashwinsaklecha2004@gmail.com</li>
              <li>Phone: 7014472677</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} CoolHome. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 