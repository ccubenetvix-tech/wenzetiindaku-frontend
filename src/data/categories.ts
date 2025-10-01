/**
 * Categories Data - Product Categories Configuration
 * 
 * This file defines the product categories available in the marketplace.
 * Each category includes an icon, description, and product count for display.
 * 
 * @author WENZE TII NDAKU Team
 * @version 1.0.0
 */

// Import Lucide React icons for category representations
import { 
  Sparkles,        // Beauty & Cosmetics
  Laptop,          // Electronics
  Shirt,           // Clothing & Fashion
  Gamepad2,        // Toys & Games
  UtensilsCrossed, // Food & Groceries
  Wine,            // Beverages
  Pill,            // Health & Medicine
  Sofa             // Home & Furniture
} from "lucide-react";

/**
 * Category Interface
 * Defines the structure of a product category
 */
export interface Category {
  id: string;                                          // Unique category identifier
  name: string;                                        // Display name of the category
  icon: React.ComponentType<{ className?: string }>;   // Lucide React icon component
  href: string;                                        // URL path for the category page
  description: string;                                 // Category description for SEO and display
  productCount: number;                                // Number of products in this category
}

export const categories: Category[] = [
  { 
    id: 'cosmetics',
    name: 'Beauty & Cosmetics', 
    icon: Sparkles, 
    href: '/category/cosmetics',
    description: 'Premium beauty products, skincare, makeup & personal care essentials',
    productCount: 1247
  },
  { 
    id: 'tech',
    name: 'Electronics & Tech', 
    icon: Laptop, 
    href: '/category/tech',
    description: 'Latest smartphones, laptops, gadgets & cutting-edge technology',
    productCount: 2156
  },
  { 
    id: 'clothes',
    name: 'Fashion & Clothing', 
    icon: Shirt, 
    href: '/category/clothes',
    description: 'Trendy fashion, designer wear, shoes & stylish accessories',
    productCount: 3421
  },
  { 
    id: 'toys',
    name: 'Toys & Games', 
    icon: Gamepad2, 
    href: '/category/toys',
    description: 'Educational toys, video games, puzzles & fun entertainment',
    productCount: 987
  },
  { 
    id: 'food',
    name: 'Food & Groceries', 
    icon: UtensilsCrossed, 
    href: '/category/food',
    description: 'Fresh produce, gourmet foods, organic & specialty ingredients',
    productCount: 1876
  },
  { 
    id: 'beverages',
    name: 'Beverages & Drinks', 
    icon: Wine, 
    href: '/category/beverages',
    description: 'Premium wines, craft beers, juices & refreshing beverages',
    productCount: 654
  },
  { 
    id: 'para-pharmacy',
    name: 'Health & Wellness', 
    icon: Pill, 
    href: '/category/para-pharmacy',
    description: 'Vitamins, supplements, health products & wellness essentials',
    productCount: 432
  },
  { 
    id: 'home-deco',
    name: 'Home Decor', 
    icon: Sofa, 
    href: '/category/home-deco',
    description: 'Furniture, home decor, lighting & interior design solutions',
    productCount: 765
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getCategoryByHref = (href: string): Category | undefined => {
  return categories.find(category => category.href === href);
};
