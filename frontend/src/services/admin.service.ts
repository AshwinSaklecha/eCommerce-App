import api from './api';
import { User } from '../types';

export const AdminService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Get all approved emails
  getApprovedEmails: async (): Promise<{email: string, _id: string}[]> => {
    const response = await api.get('/admin/approved-emails');
    return response.data;
  },

  // Add approved email
  addApprovedEmail: async (email: string): Promise<{message: string}> => {
    const response = await api.post('/admin/approved-emails', { email });
    return response.data;
  },

  // Remove approved email
  removeApprovedEmail: async (id: string): Promise<{message: string}> => {
    const response = await api.delete(`/admin/approved-emails/${id}`);
    return response.data;
  },

  // Update user role
  updateUserRole: async (id: string, role: User['role']): Promise<User> => {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  // Get all riders
  getRiders: async (): Promise<User[]> => {
    const response = await api.get('/admin/riders');
    return response.data;
  },
};

export default AdminService; 