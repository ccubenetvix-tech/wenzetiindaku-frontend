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
  const { id, name, price, originalPrice, rating, reviewCount = 0, image, vendor, isNew = false, isFeatured = false } = product;
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleWishlistToggle = useCallback(() => {
    setIsWishlisted(prev => !prev);
  }, []);

  const handleAddToCart = useCallback(() => {
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
    <div className="group cursor-pointer relative h-full gpu-accelerated">
      {/* Minimal product card with fixed height */}
      <div className="relative bg-white dark:bg-navy-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-navy-100 dark:border-navy-800/50 overflow-hidden h-full flex flex-col gpu-accelerated">
        {/* Product Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-navy-50 to-orange-50 dark:from-navy-800 dark:to-orange-800">
          {/* Product Image */}
          {!imageError ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
               onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-100 to-orange-100 dark:from-navy-900/20 dark:to-orange-900/20">
              <ShoppingCart className="h-8 w-8 text-navy-400" />
            </div>
          )}

          {/* Minimal Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md">
                NEW
              </span>
            )}
            {isFeatured && (
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md">
                FEATURED
              </span>
            )}
          </div>
          
          {/* Minimal Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-navy-800/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={`h-3.5 w-3.5 transition-colors duration-200 ${
                isWishlisted 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-navy-600 dark:text-navy-400 hover:text-red-500'
              }`} 
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Product Name */}
          <h3 className="font-semibold text-sm text-navy-600 dark:text-navy-300 mb-1 line-clamp-2 leading-tight">
            {name}
          </h3>
          
          {/* Vendor */}
          <p className="text-xs text-navy-500 dark:text-navy-400 mb-2 truncate">
            by {vendor}
          </p>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating)
                      ? 'text-orange-400 fill-orange-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-navy-500 dark:text-navy-400">
              ({reviewCount})
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-3 flex-grow">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-navy-600 dark:text-navy-300">
                ${price ? price.toFixed(2) : '0.00'}
              </span>
              {originalPrice && originalPrice > (price || 0) && (
                <span className="text-sm text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          {/* Add to Cart Button - pushed to bottom */}
          <Button
            onClick={handleAddToCart}
            className="w-full h-8 text-xs bg-gradient-to-r from-navy-500 to-navy-600 hover:from-navy-600 hover:to-navy-700 text-white shadow-md hover:shadow-lg transition-all duration-200 mt-auto"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add to Cart
          </Button>
         </div>
       </div>
     </div>
   );
 });
