import React, { createContext, useState, useEffect, useContext } from 'react';
import { CartItem, Product, Variant } from '../types';

interface CartContextType {
  items: CartItem[];
  cartItems: CartItem[];
  addToCart: (product: Product, variant: { size: string; color: string }, quantity: number) => void;
  removeFromCart: (productId: string, variantSize: string, variantColor: string) => void;
  updateQuantity: (productId: string, variantSize: string, variantColor: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
  itemCount: 0,
});

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cartTotal, setCartTotal] = useState<number>(0);
  const [itemCount, setItemCount] = useState<number>(0);

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    
    // Calculate totals
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setCartTotal(total);
    
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setItemCount(count);
  }, [items]);

  const findVariantPrice = (product: Product, size: string, color: string): number => {
    const variant = product.variants.find(v => v.size === size && v.color === color);
    return variant ? variant.price : 0;
  };

  const addToCart = (product: Product, variant: { size: string; color: string }, quantity: number) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        item => 
          item.productId === product._id && 
          item.variant.size === variant.size && 
          item.variant.color === variant.color
      );

      const price = findVariantPrice(product, variant.size, variant.color);

      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new item
        return [...prevItems, {
          productId: product._id,
          product,
          variant,
          quantity,
          price
        }];
      }
    });
  };

  const removeFromCart = (productId: string, variantSize: string, variantColor: string) => {
    setItems(prevItems => 
      prevItems.filter(
        item => 
          !(item.productId === productId && 
            item.variant.size === variantSize && 
            item.variant.color === variantColor)
      )
    );
  };

  const updateQuantity = (productId: string, variantSize: string, variantColor: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantSize, variantColor);
      return;
    }

    setItems(prevItems => 
      prevItems.map(item => 
        item.productId === productId && 
        item.variant.size === variantSize && 
        item.variant.color === variantColor
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartItems: items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext; 