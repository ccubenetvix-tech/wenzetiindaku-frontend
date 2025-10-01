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
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

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
}

export const ProductCard = memo(function ProductCard({
  id,
  name,
  price,
  originalPrice,
  rating,
  reviewCount = 0,
  image,
  vendor,
  isNew = false,
  isFeatured = false,
}: ProductCardProps) {
  
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
      {/* Premium product card with fixed height */}
      <div className="relative bg-white dark:bg-navy-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-navy-100 dark:border-navy-800/50 overflow-hidden group-hover:scale-105 h-full flex flex-col gpu-accelerated">
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10"></div>
        
        {/* Premium Product Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-navy-50 to-orange-50 dark:from-navy-800 dark:to-orange-800">
          {/* Product Image */}
          {!imageError ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
               onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-100 to-orange-100 dark:from-navy-900/20 dark:to-orange-900/20">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">{name}</p>
              </div>
            </div>
          )}

          {/* Enhanced Badges Container */}
          <div className="absolute top-3 left-3 z-20">
            <div className="flex flex-col gap-2">
              {isNew && (
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg border border-white/30 backdrop-blur-sm">
                  NEW
                </span>
              )}
              {isFeatured && (
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg border border-white/30 backdrop-blur-sm">
                  FEATURED
                </span>
              )}
            </div>
          </div>

          {/* Enhanced Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/95 hover:bg-white w-10 h-10 shadow-lg hover:shadow-xl z-20 rounded-full backdrop-blur-sm border border-white/30"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-5 w-5 transition-all duration-300 ${
                isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 hover:text-red-500'
              }`}
            />
          </Button>

          {/* Quick Add to Cart - Appears on hover */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-20">
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-navy-600 to-orange-500 hover:from-navy-700 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full py-2.5"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Enhanced Product Information */}
        <div className="relative p-6 flex flex-col flex-grow">
          {/* Vendor Name with enhanced styling */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">{vendor}</p>

          {/* Product Name with better typography */}
          <h3 className="font-bold text-base mb-3 line-clamp-2 group-hover:text-navy-700 dark:group-hover:text-navy-400 transition-colors duration-300 leading-tight">
            {name}
          </h3>

          {/* Enhanced Rating Section */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 transition-colors duration-200 ${
                    i < Math.floor(rating)
                      ? 'fill-orange-400 text-orange-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-semibold">{rating}</span>
            {reviewCount > 0 && (
              <span className="text-sm text-gray-500">({reviewCount})</span>
            )}
          </div>

          {/* Enhanced Price Section */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-bold text-navy-700 dark:text-navy-400 text-lg">${price.toFixed(2)}</span>
            {originalPrice && originalPrice > price && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
                <span className="text-xs text-green-600 font-semibold">
                  Save ${(originalPrice - price).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Add to Cart Button - pushed to bottom */}
          <Button
            size="sm"
            className="w-full py-3 text-base font-semibold bg-gradient-to-r from-navy-600 to-orange-500 hover:from-navy-700 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl mt-auto"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-navy-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </div>
  );
});