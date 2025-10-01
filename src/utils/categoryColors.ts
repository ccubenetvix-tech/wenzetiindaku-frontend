/**
 * Category Colors Utility
 * 
 * Provides consistent color mapping for different categories based on the website's
 * blue-orange color palette. Each category gets its own unique color scheme while
 * maintaining visual harmony with the overall design system.
 * 
 * @author WENZE TII NDAKU Team
 * @version 1.0.0
 */

export interface CategoryColorScheme {
  bg: string;
  bgHover: string;
  icon: string;
  iconHover: string;
  textHover: string;
  shadow: string;
  cardHover: string;
}

/**
 * Color mapping for different categories based on website's blue-orange palette
 * Each category has a unique color scheme that complements the overall design
 */
export const getCategoryColors = (categoryName: string): CategoryColorScheme => {
  const colors: Record<string, CategoryColorScheme> = {
    'Cosmetics': {
      bg: 'from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20',
      bgHover: 'from-pink-200 to-rose-200 dark:from-pink-800/30 dark:to-rose-800/30',
      icon: 'text-pink-600 dark:text-pink-400',
      iconHover: 'text-rose-600 dark:text-rose-400',
      textHover: 'text-pink-600 dark:text-pink-400',
      shadow: 'hover:shadow-pink-200/50 dark:hover:shadow-pink-900/30',
      cardHover: 'hover:bg-pink-50 dark:hover:bg-pink-950/20'
    },
    'Technology': {
      bg: 'from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20',
      bgHover: 'from-blue-200 to-indigo-200 dark:from-blue-800/30 dark:to-indigo-800/30',
      icon: 'text-blue-600 dark:text-blue-400',
      iconHover: 'text-indigo-600 dark:text-indigo-400',
      textHover: 'text-blue-600 dark:text-blue-400',
      shadow: 'hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30',
      cardHover: 'hover:bg-blue-50 dark:hover:bg-blue-950/20'
    },
    'Clothing': {
      bg: 'from-purple-100 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20',
      bgHover: 'from-purple-200 to-violet-200 dark:from-purple-800/30 dark:to-violet-800/30',
      icon: 'text-purple-600 dark:text-purple-400',
      iconHover: 'text-violet-600 dark:text-violet-400',
      textHover: 'text-purple-600 dark:text-purple-400',
      shadow: 'hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30',
      cardHover: 'hover:bg-purple-50 dark:hover:bg-purple-950/20'
    },
    'Toys': {
      bg: 'from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20',
      bgHover: 'from-yellow-200 to-amber-200 dark:from-yellow-800/30 dark:to-amber-800/30',
      icon: 'text-yellow-600 dark:text-yellow-400',
      iconHover: 'text-amber-600 dark:text-amber-400',
      textHover: 'text-yellow-600 dark:text-yellow-400',
      shadow: 'hover:shadow-yellow-200/50 dark:hover:shadow-yellow-900/30',
      cardHover: 'hover:bg-yellow-50 dark:hover:bg-yellow-950/20'
    },
    'Food': {
      bg: 'from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20',
      bgHover: 'from-green-200 to-emerald-200 dark:from-green-800/30 dark:to-emerald-800/30',
      icon: 'text-green-600 dark:text-green-400',
      iconHover: 'text-emerald-600 dark:text-emerald-400',
      textHover: 'text-green-600 dark:text-green-400',
      shadow: 'hover:shadow-green-200/50 dark:hover:shadow-green-900/30',
      cardHover: 'hover:bg-green-50 dark:hover:bg-green-950/20'
    },
    'Beverages': {
      bg: 'from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20',
      bgHover: 'from-orange-200 to-red-200 dark:from-orange-800/30 dark:to-red-800/30',
      icon: 'text-orange-600 dark:text-orange-400',
      iconHover: 'text-red-600 dark:text-red-400',
      textHover: 'text-orange-600 dark:text-orange-400',
      shadow: 'hover:shadow-orange-200/50 dark:hover:shadow-orange-900/30',
      cardHover: 'hover:bg-orange-50 dark:hover:bg-orange-950/20'
    },
    'Para Pharmacy': {
      bg: 'from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20',
      bgHover: 'from-teal-200 to-cyan-200 dark:from-teal-800/30 dark:to-cyan-800/30',
      icon: 'text-teal-600 dark:text-teal-400',
      iconHover: 'text-cyan-600 dark:text-cyan-400',
      textHover: 'text-teal-600 dark:text-teal-400',
      shadow: 'hover:shadow-teal-200/50 dark:hover:shadow-teal-900/30',
      cardHover: 'hover:bg-teal-50 dark:hover:bg-teal-950/20'
    },
    'Home Deco': {
      bg: 'from-slate-100 to-gray-100 dark:from-slate-900/20 dark:to-gray-900/20',
      bgHover: 'from-slate-200 to-gray-200 dark:from-slate-800/30 dark:to-gray-800/30',
      icon: 'text-slate-600 dark:text-slate-400',
      iconHover: 'text-gray-600 dark:text-gray-400',
      textHover: 'text-slate-600 dark:text-slate-400',
      shadow: 'hover:shadow-slate-200/50 dark:hover:shadow-slate-900/30',
      cardHover: 'hover:bg-slate-50 dark:hover:bg-slate-950/20'
    }
  };

  // Default to blue-orange theme if category not found
  return colors[categoryName] || {
    bg: 'from-blue-100 to-orange-100 dark:from-blue-900/20 dark:to-orange-900/20',
    bgHover: 'from-blue-200 to-orange-200 dark:from-blue-800/30 dark:to-orange-800/30',
    icon: 'text-blue-600 dark:text-blue-400',
    iconHover: 'text-orange-600 dark:text-orange-400',
    textHover: 'text-blue-600 dark:text-blue-400',
    shadow: 'hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30',
    cardHover: 'hover:bg-blue-50 dark:hover:bg-blue-950/20'
  };
};

/**
 * Get all available category color schemes
 * Useful for debugging or generating color palettes
 */
export const getAllCategoryColors = (): Record<string, CategoryColorScheme> => {
  const categories = [
    'Cosmetics', 'Technology', 'Clothing', 'Toys', 
    'Food', 'Beverages', 'Para Pharmacy', 'Home Deco'
  ];
  
  return categories.reduce((acc, category) => {
    acc[category] = getCategoryColors(category);
    return acc;
  }, {} as Record<string, CategoryColorScheme>);
};
