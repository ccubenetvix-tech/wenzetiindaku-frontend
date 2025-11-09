import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

interface CategoryCardProps {
  category: {
    name: string;
    href: string;
    description?: string;
    productCount?: number;
  };
  index?: number;
  isLoading?: boolean;
}

// Function to get the appropriate image for each category
const getCategoryImage = (categoryName: string): string => {
  const imageMap: Record<string, string> = {
    'Beverages & Drinks': '/bev.png',
    'Beverages': '/bev.png',
    'Fashion & Clothing': '/clothing.png',
    'Clothes': '/clothing.png',
    'Beauty & Cosmetics': '/cos.jpg',
    'Cosmetics': '/cos.jpg',
    'Electronics & Tech': '/elec.jpg',
    'Tech Products': '/elec.jpg',
    'Food & Groceries': '/groc.jpeg',
    'Food': '/groc.jpeg',
    'Home Decor': '/home.jpg',
    'Home Deco': '/home.jpg',
    'Health & Wellness': '/med.jpg',
    'Para-Pharmacy': '/med.jpg',
    'Toys & Games': '/toys.jpg',
    'Toys': '/toys.jpg',
  };
  
  return imageMap[categoryName] || '/bev.png'; // Default fallback
};

// Vibrant and dynamic color mapping for premium e-commerce experience
const getCategoryColors = (categoryName: string) => {
  const colors = {
    'Beauty & Cosmetics': {
      bg: 'from-pink-100 via-rose-100 to-fuchsia-100 dark:from-pink-900/30 dark:via-rose-900/30 dark:to-fuchsia-900/30',
      bgHover: 'from-pink-200 via-rose-200 to-fuchsia-200 dark:from-pink-800/40 dark:via-rose-800/40 dark:to-fuchsia-800/40',
      icon: 'text-pink-600 dark:text-pink-400',
      iconHover: 'text-pink-700 dark:text-pink-300',
      textHover: 'text-pink-700 dark:text-pink-300',
      shadow: 'hover:shadow-pink-200/60 dark:hover:shadow-pink-900/40',
      cardHover: 'hover:bg-pink-50 dark:hover:bg-pink-950/20',
      cardBg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 dark:from-pink-900/20 dark:via-rose-900/20 dark:to-fuchsia-900/20',
      border: 'border-pink-200 dark:border-pink-700',
      glow: 'hover:shadow-pink-400/30'
    },
    'Cosmetics': {
      bg: 'from-pink-100 via-rose-100 to-fuchsia-100 dark:from-pink-900/30 dark:via-rose-900/30 dark:to-fuchsia-900/30',
      bgHover: 'from-pink-200 via-rose-200 to-fuchsia-200 dark:from-pink-800/40 dark:via-rose-800/40 dark:to-fuchsia-800/40',
      icon: 'text-pink-600 dark:text-pink-400',
      iconHover: 'text-pink-700 dark:text-pink-300',
      textHover: 'text-pink-700 dark:text-pink-300',
      shadow: 'hover:shadow-pink-200/60 dark:hover:shadow-pink-900/40',
      cardHover: 'hover:bg-pink-50 dark:hover:bg-pink-950/20',
      cardBg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 dark:from-pink-900/20 dark:via-rose-900/20 dark:to-fuchsia-900/20',
      border: 'border-pink-200 dark:border-pink-700',
      glow: 'hover:shadow-pink-400/30'
    },
    'Electronics & Tech': {
      bg: 'from-navy-100 via-blue-100 to-indigo-100 dark:from-navy-900/30 dark:via-blue-900/30 dark:to-indigo-900/30',
      bgHover: 'from-navy-200 via-blue-200 to-indigo-200 dark:from-navy-800/40 dark:via-blue-800/40 dark:to-indigo-800/40',
      icon: 'text-navy-600 dark:text-navy-400',
      iconHover: 'text-navy-700 dark:text-navy-300',
      textHover: 'text-navy-700 dark:text-navy-300',
      shadow: 'hover:shadow-navy-200/60 dark:hover:shadow-navy-900/40',
      cardHover: 'hover:bg-navy-50 dark:hover:bg-navy-950/20',
      cardBg: 'bg-gradient-to-br from-navy-50 via-blue-50 to-indigo-50 dark:from-navy-900/20 dark:via-blue-900/20 dark:to-indigo-900/20',
      border: 'border-navy-200 dark:border-navy-700',
      glow: 'hover:shadow-navy-400/30'
    },
    'Tech Products': {
      bg: 'from-navy-100 via-blue-100 to-indigo-100 dark:from-navy-900/30 dark:via-blue-900/30 dark:to-indigo-900/30',
      bgHover: 'from-navy-200 via-blue-200 to-indigo-200 dark:from-navy-800/40 dark:via-blue-800/40 dark:to-indigo-800/40',
      icon: 'text-navy-600 dark:text-navy-400',
      iconHover: 'text-navy-700 dark:text-navy-300',
      textHover: 'text-navy-700 dark:text-navy-300',
      shadow: 'hover:shadow-navy-200/60 dark:hover:shadow-navy-900/40',
      cardHover: 'hover:bg-navy-50 dark:hover:bg-navy-950/20',
      cardBg: 'bg-gradient-to-br from-navy-50 via-blue-50 to-indigo-50 dark:from-navy-900/20 dark:via-blue-900/20 dark:to-indigo-900/20',
      border: 'border-navy-200 dark:border-navy-700',
      glow: 'hover:shadow-navy-400/30'
    },
    'Fashion & Clothing': {
      bg: 'from-purple-100 via-violet-100 to-indigo-100 dark:from-purple-900/30 dark:via-violet-900/30 dark:to-indigo-900/30',
      bgHover: 'from-purple-200 via-violet-200 to-indigo-200 dark:from-purple-800/40 dark:via-violet-800/40 dark:to-indigo-800/40',
      icon: 'text-purple-600 dark:text-purple-400',
      iconHover: 'text-purple-700 dark:text-purple-300',
      textHover: 'text-purple-700 dark:text-purple-300',
      shadow: 'hover:shadow-purple-200/60 dark:hover:shadow-purple-900/40',
      cardHover: 'hover:bg-purple-50 dark:hover:bg-purple-950/20',
      cardBg: 'bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-indigo-900/20',
      border: 'border-purple-200 dark:border-purple-700',
      glow: 'hover:shadow-purple-400/30'
    },
    'Clothes': {
      bg: 'from-purple-100 via-violet-100 to-indigo-100 dark:from-purple-900/30 dark:via-violet-900/30 dark:to-indigo-900/30',
      bgHover: 'from-purple-200 via-violet-200 to-indigo-200 dark:from-purple-800/40 dark:via-violet-800/40 dark:to-indigo-800/40',
      icon: 'text-purple-600 dark:text-purple-400',
      iconHover: 'text-purple-700 dark:text-purple-300',
      textHover: 'text-purple-700 dark:text-purple-300',
      shadow: 'hover:shadow-purple-200/60 dark:hover:shadow-purple-900/40',
      cardHover: 'hover:bg-purple-50 dark:hover:bg-purple-950/20',
      cardBg: 'bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-indigo-900/20',
      border: 'border-purple-200 dark:border-purple-700',
      glow: 'hover:shadow-purple-400/30'
    },
    'Toys & Games': {
      bg: 'from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-900/30 dark:via-amber-900/30 dark:to-yellow-900/30',
      bgHover: 'from-orange-200 via-amber-200 to-yellow-200 dark:from-orange-800/40 dark:via-amber-800/40 dark:to-yellow-800/40',
      icon: 'text-orange-600 dark:text-orange-400',
      iconHover: 'text-orange-700 dark:text-orange-300',
      textHover: 'text-orange-700 dark:text-orange-300',
      shadow: 'hover:shadow-orange-200/60 dark:hover:shadow-orange-900/40',
      cardHover: 'hover:bg-orange-50 dark:hover:bg-orange-950/20',
      cardBg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20',
      border: 'border-orange-200 dark:border-orange-700',
      glow: 'hover:shadow-orange-400/30'
    },
    'Toys': {
      bg: 'from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-900/30 dark:via-amber-900/30 dark:to-yellow-900/30',
      bgHover: 'from-orange-200 via-amber-200 to-yellow-200 dark:from-orange-800/40 dark:via-amber-800/40 dark:to-yellow-800/40',
      icon: 'text-orange-600 dark:text-orange-400',
      iconHover: 'text-orange-700 dark:text-orange-300',
      textHover: 'text-orange-700 dark:text-orange-300',
      shadow: 'hover:shadow-orange-200/60 dark:hover:shadow-orange-900/40',
      cardHover: 'hover:bg-orange-50 dark:hover:bg-orange-950/20',
      cardBg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20',
      border: 'border-orange-200 dark:border-orange-700',
      glow: 'hover:shadow-orange-400/30'
    },
    'Food & Groceries': {
      bg: 'from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30',
      bgHover: 'from-green-200 via-emerald-200 to-teal-200 dark:from-green-800/40 dark:via-emerald-800/40 dark:to-teal-800/40',
      icon: 'text-green-600 dark:text-green-400',
      iconHover: 'text-green-700 dark:text-green-300',
      textHover: 'text-green-700 dark:text-green-300',
      shadow: 'hover:shadow-green-200/60 dark:hover:shadow-green-900/40',
      cardHover: 'hover:bg-green-50 dark:hover:bg-green-950/20',
      cardBg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20',
      border: 'border-green-200 dark:border-green-700',
      glow: 'hover:shadow-green-400/30'
    },
    'Food': {
      bg: 'from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30',
      bgHover: 'from-green-200 via-emerald-200 to-teal-200 dark:from-green-800/40 dark:via-emerald-800/40 dark:to-teal-800/40',
      icon: 'text-green-600 dark:text-green-400',
      iconHover: 'text-green-700 dark:text-green-300',
      textHover: 'text-green-700 dark:text-green-300',
      shadow: 'hover:shadow-green-200/60 dark:hover:shadow-green-900/40',
      cardHover: 'hover:bg-green-50 dark:hover:bg-green-950/20',
      cardBg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20',
      border: 'border-green-200 dark:border-green-700',
      glow: 'hover:shadow-green-400/30'
    },
    'Beverages & Drinks': {
      bg: 'from-orange-100 via-red-100 to-rose-100 dark:from-orange-900/30 dark:via-red-900/30 dark:to-rose-900/30',
      bgHover: 'from-orange-200 via-red-200 to-rose-200 dark:from-orange-800/40 dark:via-red-800/40 dark:to-rose-800/40',
      icon: 'text-orange-600 dark:text-orange-400',
      iconHover: 'text-orange-700 dark:text-orange-300',
      textHover: 'text-orange-700 dark:text-orange-300',
      shadow: 'hover:shadow-orange-200/60 dark:hover:shadow-orange-900/40',
      cardHover: 'hover:bg-orange-50 dark:hover:bg-orange-950/20',
      cardBg: 'bg-gradient-to-br from-orange-50 via-red-50 to-rose-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-rose-900/20',
      border: 'border-orange-200 dark:border-orange-700',
      glow: 'hover:shadow-orange-400/30'
    },
    'Beverages': {
      bg: 'from-orange-100 via-red-100 to-rose-100 dark:from-orange-900/30 dark:via-red-900/30 dark:to-rose-900/30',
      bgHover: 'from-orange-200 via-red-200 to-rose-200 dark:from-orange-800/40 dark:via-red-800/40 dark:to-rose-800/40',
      icon: 'text-orange-600 dark:text-orange-400',
      iconHover: 'text-orange-700 dark:text-orange-300',
      textHover: 'text-orange-700 dark:text-orange-300',
      shadow: 'hover:shadow-orange-200/60 dark:hover:shadow-orange-900/40',
      cardHover: 'hover:bg-orange-50 dark:hover:bg-orange-950/20',
      cardBg: 'bg-gradient-to-br from-orange-50 via-red-50 to-rose-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-rose-900/20',
      border: 'border-orange-200 dark:border-orange-700',
      glow: 'hover:shadow-orange-400/30'
    },
    'Health & Wellness': {
      bg: 'from-teal-100 via-cyan-100 to-blue-100 dark:from-teal-900/30 dark:via-cyan-900/30 dark:to-blue-900/30',
      bgHover: 'from-teal-200 via-cyan-200 to-blue-200 dark:from-teal-800/40 dark:via-cyan-800/40 dark:to-blue-800/40',
      icon: 'text-teal-600 dark:text-teal-400',
      iconHover: 'text-teal-700 dark:text-teal-300',
      textHover: 'text-teal-700 dark:text-teal-300',
      shadow: 'hover:shadow-teal-200/60 dark:hover:shadow-teal-900/40',
      cardHover: 'hover:bg-teal-50 dark:hover:bg-teal-950/20',
      cardBg: 'bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-900/20 dark:via-cyan-900/20 dark:to-blue-900/20',
      border: 'border-teal-200 dark:border-teal-700',
      glow: 'hover:shadow-teal-400/30'
    },
    'Para-Pharmacy': {
      bg: 'from-teal-100 via-cyan-100 to-blue-100 dark:from-teal-900/30 dark:via-cyan-900/30 dark:to-blue-900/30',
      bgHover: 'from-teal-200 via-cyan-200 to-blue-200 dark:from-teal-800/40 dark:via-cyan-800/40 dark:to-blue-800/40',
      icon: 'text-teal-600 dark:text-teal-400',
      iconHover: 'text-teal-700 dark:text-teal-300',
      textHover: 'text-teal-700 dark:text-teal-300',
      shadow: 'hover:shadow-teal-200/60 dark:hover:shadow-teal-900/40',
      cardHover: 'hover:bg-teal-50 dark:hover:bg-teal-950/20',
      cardBg: 'bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-900/20 dark:via-cyan-900/20 dark:to-blue-900/20',
      border: 'border-teal-200 dark:border-teal-700',
      glow: 'hover:shadow-teal-400/30'
    },
    'Home Decor': {
      bg: 'from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30',
      bgHover: 'from-amber-200 via-yellow-200 to-orange-200 dark:from-amber-800/40 dark:via-yellow-800/40 dark:to-orange-800/40',
      icon: 'text-amber-600 dark:text-amber-400',
      iconHover: 'text-amber-700 dark:text-amber-300',
      textHover: 'text-amber-700 dark:text-amber-300',
      shadow: 'hover:shadow-amber-200/60 dark:hover:shadow-amber-900/40',
      cardHover: 'hover:bg-amber-50 dark:hover:bg-amber-950/20',
      cardBg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20',
      border: 'border-amber-200 dark:border-amber-700',
      glow: 'hover:shadow-amber-400/30'
    },
    'Home Deco': {
      bg: 'from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30',
      bgHover: 'from-amber-200 via-yellow-200 to-orange-200 dark:from-amber-800/40 dark:via-yellow-800/40 dark:to-orange-800/40',
      icon: 'text-amber-600 dark:text-amber-400',
      iconHover: 'text-amber-700 dark:text-amber-300',
      textHover: 'text-amber-700 dark:text-amber-300',
      shadow: 'hover:shadow-amber-200/60 dark:hover:shadow-amber-900/40',
      cardHover: 'hover:bg-amber-50 dark:hover:bg-amber-950/20',
      cardBg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20',
      border: 'border-amber-200 dark:border-amber-700',
      glow: 'hover:shadow-amber-400/30'
    }
  };

  // Default to premium navy-orange theme if category not found
  return colors[categoryName as keyof typeof colors] || {
    bg: 'from-navy-100 to-orange-100 dark:from-navy-900/30 dark:to-orange-900/30',
    bgHover: 'from-navy-200 to-orange-200 dark:from-navy-800/40 dark:to-orange-800/40',
    icon: 'text-navy-600 dark:text-navy-400',
    iconHover: 'text-orange-600 dark:text-orange-400',
    textHover: 'text-navy-600 dark:text-navy-400',
    shadow: 'hover:shadow-navy-200/50 dark:hover:shadow-navy-900/30',
    cardHover: 'hover:bg-navy-50 dark:hover:bg-navy-950/20',
    cardBg: 'bg-gradient-to-br from-navy-50 to-orange-50 dark:from-navy-900/20 dark:to-orange-900/20',
    border: 'border-navy-200 dark:border-navy-800'
  };
};

export const CategoryCard = memo(function CategoryCard({ category, index, isLoading = false }: CategoryCardProps) {
  const navigate = useNavigate();
  const categoryImage = getCategoryImage(category.name);

  const handleClick = () => {
    navigate(category.href);
  };

  return (
    <Card 
      className="group cursor-pointer relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 hover:border-gray-300 dark:hover:border-navy-600 rounded-lg"
      onClick={handleClick}
    >
      <CardContent className="p-4 text-center">
        {/* Category Image */}
        <div className="mb-3 flex justify-center">
          <div className="relative h-12 w-12 rounded-lg bg-gray-100 dark:bg-navy-800 overflow-hidden">
               <img 
                 src={categoryImage} 
                 alt={category.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                 onError={(e) => {
                   const target = e.target as HTMLImageElement;
                   target.style.display = 'none';
                target.parentElement!.innerHTML = `<div class="h-full w-full bg-navy-600 flex items-center justify-center"><span class="text-sm font-bold text-white">${category.name[0]}</span></div>`;
              }}
            />
             </div>
           </div>
           
        {/* Category name */}
        <h3 className="font-medium text-sm text-gray-900 dark:text-white leading-tight mb-1">
             {category.name}
           </h3>
           
        {/* Category description */}
        {category.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {category.description}
          </p>
        )}
        
        {/* Product count */}
        <div className="h-5 flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            category.productCount !== undefined && (
              <p className="text-xs text-primary font-medium">
                {category.productCount} products
              </p>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
});