/**
 * ProductCard.tsx - Product Card Component
 * 
 * A reusable component for displaying product information in a card format.
 * Includes product image, badges, rating, price, and add to cart functionality.
 * 
 * @author WENZE TII NDAKU Team
 * @version 1.0.0
 */

import { useState, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount?: number;
  image: string;
  vendor: string;
  isNew?: boolean;
  isFeatured?: boolean;
  compact?: boolean;
}

export const ProductCard = memo(function ProductCard({
  id,
  name,
  price = 0,
  originalPrice,
  rating = 0,
  reviewCount = 0,
  image,
  vendor,
  isNew = false,
  isFeatured = false,
  compact = false,
}: ProductCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { toggleWishlist, isWishlisted: isProductWishlisted, isProcessing: isWishlistProcessing } = useWishlist();
  const wishlisted = isProductWishlisted(id);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);

  const handleWishlistToggle = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking wishlist

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to manage your wishlist.",
        variant: "destructive"
      });
      navigate('/customer/login');
      return;
    }

    if (user?.role !== 'customer') {
      toast({
        title: "Action not allowed",
        description: "Only customers can manage wishlists.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsWishlistLoading(true);
      const added = await toggleWishlist({
        productId: id,
        name,
        price,
        image,
        vendor,
        originalPrice,
        rating,
        reviewCount,
        isNew,
        isFeatured,
      });

      toast({
        title: added ? "Added to Wishlist" : "Removed from Wishlist",
        description: added
          ? `${name} has been added to your wishlist.`
          : `${name} has been removed from your wishlist.`,
      });
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      toast({
        title: "Error",
        description: "Unable to update wishlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsWishlistLoading(false);
    }
  }, [id, image, isAuthenticated, isFeatured, isNew, name, navigate, originalPrice, price, rating, reviewCount, toast, toggleWishlist, user?.role, vendor]);

  const handleProductClick = useCallback(() => {
    navigate(`/product/${id}`);
  }, [navigate, id]);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking add to cart
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive"
      });
      navigate('/customer/login');
      return;
    }
    
    // Check if user is a vendor (vendors cannot add to cart)
    if (user?.role === 'vendor') {
      toast({
        title: "Not Available",
        description: "Vendors cannot add products to cart.",
        variant: "destructive"
      });
      return;
    }
    
    // Only customers can add to cart
    if (user?.role !== 'customer') {
      toast({
        title: "Access Denied",
        description: "Only customers can add products to cart.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsCartLoading(true);
      await addToCart({
        productId: id,
        name,
        price,
        image,
        vendor,
      });
      
      toast({
        title: "Added to cart",
        description: `${name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCartLoading(false);
    }
  }, [addToCart, id, image, isAuthenticated, name, navigate, price, toast, user, vendor]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Card 
      className={`group relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 hover:border-gray-300 dark:hover:border-navy-600 rounded-lg h-full flex flex-col cursor-pointer ${compact ? 'text-[0.95rem]' : ''}`}
      onClick={handleProductClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Professional Image Container */}
        <div className={`relative ${compact ? 'aspect-video' : 'aspect-[4/3]'} overflow-hidden bg-gray-50 dark:bg-navy-800`}>
          {!imageError ? (
            <img
              src={image}
              alt={name}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${compact ? '' : ''}`}
               onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-navy-800">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 dark:bg-navy-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShoppingCart className="w-6 h-6 text-gray-400 dark:text-navy-500" />
                </div>
                <p className="text-xs text-gray-400 dark:text-navy-500">No Image</p>
              </div>
            </div>
          )}

          {/* Professional Badges */}
          <div className="absolute top-2 left-2 z-10">
            <div className="flex flex-col gap-1">
              {discountPercentage > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                  -{discountPercentage}%
                </span>
              )}
              {isNew && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                  {t('new')}
                </span>
              )}
              {isFeatured && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium">
                  {t('hot')}
                </span>
              )}
            </div>
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-white/90 hover:bg-white ${compact ? 'w-7 h-7' : 'w-8 h-8'} shadow-sm hover:shadow-md z-10 rounded-full`}
            onClick={handleWishlistToggle}
            disabled={isWishlistProcessing || isWishlistLoading}
          >
            {isWishlistProcessing || isWishlistLoading ? (
              <Loader2 className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} animate-spin`} />
            ) : (
              <Heart
                className={`transition-colors duration-200 ${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${
                  wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
                }`}
              />
            )}
          </Button>

          {/* Add to Cart Button - Professional overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className={`${compact ? 'p-2' : 'p-3'}`}> 
            <Button
              size={compact ? 'sm' : 'sm'}
              className={`w-full rounded-md ${
                !isAuthenticated 
                  ? 'bg-gray-400 hover:bg-gray-500 text-white' 
                  : user?.role === 'vendor'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-navy-600 hover:bg-navy-700 text-white'
              }`}
              onClick={handleAddToCart}
              disabled={user?.role === 'vendor' || isCartLoading}
            >
              {isCartLoading ? (
                <>
                  <Loader2 className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} mr-2 animate-spin`} />
                  {t('addingToCart', 'Adding...')}
                </>
              ) : (
                <>
                  <ShoppingCart className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} mr-2`} />
                  {!isAuthenticated 
                    ? 'Login to Add' 
                    : user?.role === 'vendor'
                    ? '.'
                    : t('addToCart')
                  }
                </>
              )}
            </Button>
            </div>
          </div>
        </div>

        {/* Professional Product Information */}
        <div className={`${compact ? 'p-2 space-y-1.5' : 'p-3 space-y-2'} flex-1 flex flex-col`}>
          {/* Vendor Name */}
          <p className={`${compact ? 'text-[10px]' : 'text-xs'} text-gray-500 dark:text-gray-400 font-medium`}>
            {vendor}
          </p>

          {/* Product Name */}
          <h3 className={`font-medium text-gray-900 dark:text-white ${compact ? 'text-xs' : 'text-sm'} leading-tight line-clamp-2 flex-1`}>
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`${compact ? 'h-2.5 w-2.5' : 'h-3 w-3'} ${
                    i < Math.floor(rating)
                      ? 'text-orange-400 fill-orange-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className={`${compact ? 'text-[10px]' : 'text-xs'} text-gray-500 dark:text-gray-400`}>
              ({reviewCount})
            </span>
          </div>

          {/* Price Section - Professional layout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`${compact ? 'text-base' : 'text-lg'} font-bold text-gray-900 dark:text-white`}>
                ${price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 line-through`}>
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Free Shipping Badge */}
          {price > 50 && (
            <div className={`flex items-center ${compact ? 'text-[10px]' : 'text-xs'} text-green-6 00 dark:text-green-400`}>
              <span className={`bg-green-100 dark:bg-green-900/30 ${compact ? 'px-1.5 py-0.5' : 'px-2 py-1'} rounded ${compact ? 'text-[10px]' : 'text-xs'} font-medium`}>
                Free Shipping
                </span>
              </div>
            )}
          </div>
      </CardContent>
    </Card>
  );
});