/**
 * MinimalProductCard.tsx - Minimal Product Card Component
 * 
 * A compact, minimal product card designed for grid layouts with 6+ items per row.
 * Optimized for featured products section with clean, minimal design.
 * 
 * @author WENZE TII NDAKU Team
 * @version 1.0.0
 */

import { useState, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
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
}

interface MinimalProductCardProps {
  product: Product;
  onWishlistToggle: () => void;
  onAddToCart: () => void;
}

export const MinimalProductCard = memo(function MinimalProductCard({
  product,
  onWishlistToggle,
  onAddToCart
}: MinimalProductCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id, name, price, originalPrice, rating, reviewCount = 0, image, vendor, isNew = false, isFeatured = false } = product;
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking wishlist
    setIsWishlisted(prev => !prev);
  }, []);

  const handleProductClick = useCallback(() => {
    navigate(`/product/${id}`);
  }, [navigate, id]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking add to cart
    addToCart({
      id,
      name,
      price,
      image,
      vendor,
    });
    
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    });
  }, [addToCart, toast, id, name, price, image, vendor]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className="group cursor-pointer relative h-full" onClick={handleProductClick}>
      {/* Ultra Minimal Product Card */}
      <div className="relative bg-white dark:bg-navy-900 rounded-lg border border-gray-200 dark:border-navy-800 hover:border-gray-300 dark:hover:border-navy-600 hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Product Image Container - Minimal */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-navy-800">
          {!imageError ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-navy-800">
              <ShoppingCart className="h-6 w-6 text-gray-400 dark:text-navy-500" />
            </div>
          )}

          {/* Minimal Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/90 dark:bg-navy-800/90 shadow-sm hover:shadow-md transition-all duration-200"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={`h-3 w-3 transition-colors duration-200 ${
                isWishlisted 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
              }`} 
            />
          </button>

          {/* Minimal Badges - Only if needed */}
          {(isNew || isFeatured) && (
            <div className="absolute top-2 left-2">
              {isNew && (
                <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  {t('new')}
                </span>
              )}
              {isFeatured && (
                <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  {t('hot')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Minimal Product Info */}
        <div className="p-3 flex flex-col flex-grow space-y-2">
          {/* Product Name - Minimal */}
          <h3 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 leading-tight">
            {name}
          </h3>
          
          {/* Rating - Simplified */}
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-orange-400 fill-orange-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
          
          {/* Price - Clean */}
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-base font-bold text-gray-900 dark:text-white">
              ${price ? price.toFixed(2) : '0.00'}
            </span>
            {originalPrice && originalPrice > (price || 0) && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Minimal Add to Cart - Only on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="w-full h-7 text-xs bg-navy-600 hover:bg-navy-700 text-white"
            >
              {t('addToCart')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
 });
