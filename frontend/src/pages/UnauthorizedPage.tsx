import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const UnauthorizedPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
        <p className="text-xl text-gray-600 mb-8">You don't have permission to access this page</p>
        <p className="text-gray-500 mb-8">
          Either your account doesn't have the required permissions, or your email hasn't been approved yet.
        </p>
        <Link to="/" className="btn btn-primary">
          Go back home
        </Link>
      </div>
    </Layout>
  );
};

export default UnauthorizedPage; 