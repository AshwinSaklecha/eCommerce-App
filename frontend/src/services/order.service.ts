import api from './api';
import { Order, CartItem, ShippingAddress } from '../types';

export const OrderService = {
  // Create a new order
  createOrder: async (items: CartItem[], shippingAddress: ShippingAddress): Promise<Order> => {
    const response = await api.post('/orders', { items, shippingAddress });
    return response.data;
  },

  // Get all orders (admin only)
  getAdminOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders/admin');
    return response.data;
  },

  // Get user orders
  getUserOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  // Get rider orders
  getRiderOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders/rider-orders');
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status (admin/rider)
  updateOrderStatus: async (id: string, status: Order['status'], riderId?: string): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/status`, { status, riderId });
    return response.data;
  },

  // Mark order as paid (admin only)
  markOrderAsPaid: async (id: string): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/pay`);
    return response.data;
  },
};

export default OrderService; 