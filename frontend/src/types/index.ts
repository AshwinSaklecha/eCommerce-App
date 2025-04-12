export interface User {
  _id: string;
  googleId: string;
  email: string;
  name: string;
  role: 'admin' | 'customer' | 'rider';
  isApproved: boolean;
  createdAt: string;
}

export interface Variant {
  _id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: 'fan' | 'ac';
  brand: string;
  variants: Variant[];
  images: string[];
  features: string[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  variant: {
    size: string;
    color: string;
  };
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  product: Product;
  variant: {
    size: string;
    color: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'undelivered';
  shippingAddress: ShippingAddress;
  rider?: User;
  createdAt: string;
  updatedAt: string;
} 