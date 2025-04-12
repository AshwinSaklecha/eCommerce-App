import axios from 'axios';
import { Product } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ProductService {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Alias for getAllProducts with optional filtering
  async getProducts(category?: string, brand?: string): Promise<Product[]> {
    try {
      let url = `${API_URL}/products`;
      const params = [];
      
      if (category) params.push(`category=${category}`);
      if (brand) params.push(`brand=${brand}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/products?category=${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      throw error;
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/products/search?query=${query}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching products with query ${query}:`, error);
      throw error;
    }
  }

  // Create product (admin only)
  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const response = await axios.post(`${API_URL}/products`, productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product (admin only)
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete product (admin only)
  async deleteProduct(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  }

  // Update stock (admin only)
  async updateStock(productId: string, variantId: string, stock: number): Promise<Product> {
    try {
      const response = await axios.patch(`${API_URL}/products/${productId}/stock`, { variantId, stock });
      return response.data;
    } catch (error) {
      console.error(`Error updating stock for product with ID ${productId}:`, error);
      throw error;
    }
  }
}

const productService = new ProductService();
export default productService; 