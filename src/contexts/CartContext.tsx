// Import React hooks and types for context management
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../utils/api';
import { useAuth } from './AuthContext';

/**
 * Cart Item Interface
 * Defines the structure of items in the shopping cart
 */
export interface CartItem {
  id: string;        // Unique cart item ID (from database)
  productId: string; // Product ID
  name: string;      // Product name
  price: number;     // Product price
  image: string;     // Product image URL
  vendor: string;    // Vendor/seller name
  quantity: number;  // Quantity in cart
}

interface CartItemFromDB {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    vendor_id: string;
    vendor: {
      business_name: string;
    };
  };
}

/**
 * Cart Context Type Interface
 * Defines the shape of the cart context and its methods
 */
interface CartContextType {
  items: CartItem[];                                                    // Array of cart items
  isLoading: boolean;                                                   // Loading state
  addToCart: (product: Omit<CartItem, 'quantity' | 'id'>) => Promise<void>;  // Add product to cart
  removeFromCart: (cartItemId: string) => Promise<void>;              // Remove product from cart
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;  // Update product quantity
  clearCart: () => Promise<void>;                                      // Clear entire cart
  getTotalItems: () => number;                                          // Get total number of items
  getTotalPrice: () => number;                                          // Get total cart value
  refreshCart: () => Promise<void>;                                     // Refresh cart from database
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
 * Includes database persistence for cart data
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  /**
   * Transform cart items from database format to app format
   */
  const transformCartItems = (cartItems: CartItemFromDB[]): CartItem[] => {
    if (!cartItems || !Array.isArray(cartItems)) {
      console.log('No cart items to transform');
      return [];
    }

    const transformed = cartItems
      .filter(item => item.product) // Filter out items with missing products
      .map(item => ({
        id: item.id, // cart item ID
        productId: item.product.id,
        name: item.product.name,
        price: parseFloat(item.product.price.toString()),
        image: item.product.images?.[0] || '',
        vendor: item.product.vendor?.business_name || 'Unknown Vendor',
        quantity: item.quantity,
      }));
    
    console.log('Transformed items:', transformed);
    return transformed;
  };

  /**
   * Fetch cart from database
   */
  const refreshCart = async () => {
    if (!isAuthenticated || user?.role !== 'customer') {
      console.log('Cart fetch skipped - not authenticated or not customer');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching cart from database...');
      const response = await apiClient.getCart();
      console.log('Cart API response:', response);
      
      if (response.success && response.data?.cartItems) {
        console.log('Cart items from DB:', response.data.cartItems);
        const transformedItems = transformCartItems(response.data.cartItems);
        console.log('Transformed cart items:', transformedItems);
        setItems(transformedItems);
      } else {
        console.log('No cart items found or response format issue:', response);
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer') {
      refreshCart();
    } else {
      setItems([]);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.role]);

  /**
   * Add a product to the cart
   * Syncs with database
   */
  const addToCart = async (product: { productId: string; name: string; price: number; image: string; vendor: string }) => {
    if (!isAuthenticated || user?.role !== 'customer') {
      throw new Error('Must be logged in as a customer to add to cart');
    }

    try {
      // First, check if item already exists in database
      const existingItem = items.find(item => item.productId === product.productId);
      
      if (existingItem) {
        // Update quantity in database
        await apiClient.updateCartItem(existingItem.id, existingItem.quantity + 1);
        // Optimistically update local state
        setItems(prevItems =>
          prevItems.map(item =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        // Add new item to database
        await apiClient.addToCart(product.productId, 1);
        // Refresh cart from database to get the new item with proper ID
        await refreshCart();
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  /**
   * Remove a product from the cart by cart item ID
   * Syncs with database
   */
  const removeFromCart = async (cartItemId: string) => {
    if (!isAuthenticated || user?.role !== 'customer') {
      return;
    }

    try {
      await apiClient.removeFromCart(cartItemId);
      // Optimistically update local state
      setItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      // Refresh cart on error to get accurate state
      await refreshCart();
      throw error;
    }
  };

  /**
   * Update the quantity of a product in the cart
   * Syncs with database
   */
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!isAuthenticated || user?.role !== 'customer') {
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      await apiClient.updateCartItem(cartItemId, quantity);
      // Optimistically update local state
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === cartItemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
      // Refresh cart on error
      await refreshCart();
      throw error;
    }
  };

  /**
   * Clear all items from the cart
   * Syncs with database
   */
  const clearCart = async () => {
    if (!isAuthenticated || user?.role !== 'customer') {
      return;
    }

    try {
      await apiClient.clearCart();
      setItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
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
    isLoading,          // Loading state
    addToCart,          // Add product to cart
    removeFromCart,     // Remove product from cart
    updateQuantity,     // Update product quantity
    clearCart,          // Clear entire cart
    getTotalItems,      // Get total item count
    getTotalPrice,      // Get total cart value
    refreshCart,        // Refresh cart from database
  };

  // Provide the cart context to all child components
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
