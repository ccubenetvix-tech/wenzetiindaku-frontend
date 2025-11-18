import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/utils/api';
import { useAuth } from './AuthContext';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  vendor: string;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  addedAt: string;
}

interface WishlistProductFromDB {
  id: string;
  name: string;
  price: number | string;
  images?: string[] | null;
  original_price?: number | string | null;
  rating?: number | string | null;
  review_count?: number | null;
  is_new?: boolean | null;
  is_featured?: boolean | null;
  vendor?: {
    business_name?: string | null;
  } | null;
}

interface WishlistItemFromDB {
  id: string;
  product_id: string;
  created_at: string;
  product: WishlistProductFromDB | null;
}

interface WishlistProductInput {
  productId: string;
  name: string;
  price: number;
  image: string;
  vendor: string;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  isProcessing: boolean;
  isWishlisted: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
  addToWishlist: (product: WishlistProductInput) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (product: WishlistProductInput) => Promise<boolean>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const transformWishlistItems = useCallback((wishlistItems: WishlistItemFromDB[] | null | undefined): WishlistItem[] => {
    if (!wishlistItems || !Array.isArray(wishlistItems)) {
      return [];
    }

    return wishlistItems
      .filter(item => item.product)
      .map(item => {
        const product = item.product as WishlistProductFromDB;
        const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
        const originalPrice = product.original_price !== null && product.original_price !== undefined
          ? typeof product.original_price === 'string'
            ? parseFloat(product.original_price)
            : product.original_price
          : undefined;
        const rating = product.rating !== null && product.rating !== undefined
          ? typeof product.rating === 'string'
            ? parseFloat(product.rating)
            : product.rating
          : undefined;

        return {
          id: item.id,
          productId: item.product_id,
          name: product.name,
          price: price ?? 0,
          image: product.images?.[0] || '',
          vendor: product.vendor?.business_name || 'Unknown Vendor',
          originalPrice,
          rating,
          reviewCount: product.review_count ?? undefined,
          isNew: product.is_new ?? undefined,
          isFeatured: product.is_featured ?? undefined,
          addedAt: item.created_at,
        } satisfies WishlistItem;
      });
  }, []);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'customer') {
      setItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.getWishlist() as {
        success?: boolean;
        data?: { wishlist?: WishlistItemFromDB[] };
      };

      if (response?.success && response.data?.wishlist) {
        setItems(transformWishlistItems(response.data.wishlist));
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, transformWishlistItems, user?.role]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer') {
      void refreshWishlist();
    } else {
      setItems([]);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.role]);

  const isWishlisted = useCallback((productId: string) =>
    items.some(item => item.productId === productId), [items]);

  const addToWishlist = useCallback(async (product: WishlistProductInput) => {
    if (!isAuthenticated || user?.role !== 'customer') {
      throw new Error('Must be logged in as a customer to manage wishlist');
    }

    if (isWishlisted(product.productId)) {
      return;
    }

    try {
      setIsProcessing(true);
      const response = await apiClient.addToWishlist(product.productId) as {
        success?: boolean;
        data?: { wishlistItem?: { id: string; product_id: string; created_at?: string } };
        message?: string;
        error?: { message?: string };
      };

      if (!response?.success) {
        throw new Error(response?.error?.message || 'Failed to add to wishlist');
      }

      const newItem: WishlistItem = {
        id: response.data?.wishlistItem?.id || `${product.productId}-wishlist`,
        productId: product.productId,
        name: product.name,
        price: product.price,
        image: product.image,
        vendor: product.vendor,
        originalPrice: product.originalPrice,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isNew: product.isNew,
        isFeatured: product.isFeatured,
        addedAt: response.data?.wishlistItem?.created_at || new Date().toISOString(),
      };
      setItems(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [isAuthenticated, isWishlisted, user?.role]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!isAuthenticated || user?.role !== 'customer') {
      return;
    }

    try {
      setIsProcessing(true);
      const response = await apiClient.removeFromWishlist(productId) as {
        success?: boolean;
        error?: { message?: string };
      };

      if (!response?.success) {
        throw new Error(response?.error?.message || 'Failed to remove from wishlist');
      }
      setItems(prev => prev.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [isAuthenticated, user?.role]);

  const toggleWishlist = useCallback(async (product: WishlistProductInput) => {
    if (isWishlisted(product.productId)) {
      await removeFromWishlist(product.productId);
      return false;
    }

    await addToWishlist(product);
    return true;
  }, [addToWishlist, isWishlisted, removeFromWishlist]);

  const value = useMemo<WishlistContextType>(() => ({
    items,
    isLoading,
    isProcessing,
    isWishlisted,
    refreshWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  }), [addToWishlist, isLoading, isProcessing, isWishlisted, items, refreshWishlist, removeFromWishlist, toggleWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

