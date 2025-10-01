// Import React hooks and types for context management
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Cart Item Interface
 * Defines the structure of items in the shopping cart
 */
interface CartItem {
  id: string;        // Unique product identifier
  name: string;      // Product name
  price: number;     // Product price
  image: string;     // Product image URL
  vendor: string;    // Vendor/seller name
  quantity: number;  // Quantity in cart
}

/**
 * Cart Context Type Interface
 * Defines the shape of the cart context and its methods
 */
interface CartContextType {
  items: CartItem[];                                                    // Array of cart items
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;             // Add product to cart
  removeFromCart: (productId: string) => void;                          // Remove product from cart
  updateQuantity: (productId: string, quantity: number) => void;        // Update product quantity
  clearCart: () => void;                                                // Clear entire cart
  getTotalItems: () => number;                                          // Get total number of items
  getTotalPrice: () => number;                                          // Get total cart value
}

// Create the cart context with undefined as default value
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Custom hook to use the cart context
 * Throws an error if used outside of CartProvider
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/**
 * Cart Provider Props Interface
 */
interface CartProviderProps {
  children: ReactNode;  // Child components that will have access to cart context
}

/**
 * Cart Provider Component
 * Provides cart state and methods to all child components
 * Includes localStorage persistence for cart data
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Initialize cart state from localStorage or empty array
  const [items, setItems] = useState<CartItem[]>(() => {
    // Check if we're in browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  /**
   * Add a product to the cart
   * If product already exists, increment quantity
   * If new product, add with quantity 1
   */
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Increment quantity if item already exists
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  /**
   * Remove a product from the cart by ID
   */
  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  /**
   * Update the quantity of a product in the cart
   * If quantity is 0 or negative, remove the item
   */
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Clear all items from the cart
   */
  const clearCart = () => {
    setItems([]);
  };

  /**
   * Get the total number of items in the cart
   * Sums up all quantities
   */
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Get the total price of all items in the cart
   * Calculates price * quantity for each item
   */
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Create the context value object with all cart methods and state
  const value: CartContextType = {
    items,              // Current cart items
    addToCart,          // Add product to cart
    removeFromCart,     // Remove product from cart
    updateQuantity,     // Update product quantity
    clearCart,          // Clear entire cart
    getTotalItems,      // Get total item count
    getTotalPrice,      // Get total cart value
  };

  // Provide the cart context to all child components
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
