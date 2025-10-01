export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  vendor: string;
  isNew?: boolean;
  isFeatured?: boolean;
  category: string;
}

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Premium African Shea Butter Face Cream",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.8,
    reviewCount: 127,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center",
    vendor: "AfriBeauty Store",
    isNew: true,
    isFeatured: true,
    category: "cosmetics"
  },
  {
    id: "2",
    name: "Organic Coconut Oil Hair Treatment",
    price: 18.50,
    rating: 4.6,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center",
    vendor: "Natural Beauty Co",
    isFeatured: true,
    category: "cosmetics"
  },
  {
    id: "3",
    name: "Traditional African Print Dress",
    price: 45.00,
    originalPrice: 60.00,
    rating: 4.9,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&crop=center",
    vendor: "Heritage Fashion",
    isNew: true,
    category: "clothes"
  },
  {
    id: "4",
    name: "Wireless Bluetooth Headphones",
    price: 45.00,
    originalPrice: 65.00,
    rating: 4.8,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center",
    vendor: "AudioTech Pro",
    isFeatured: true,
    category: "tech"
  },
  {
    id: "5",
    name: "Organic Ethiopian Coffee Beans",
    price: 18.50,
    rating: 4.7,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center",
    vendor: "Mountain Coffee Co",
    isNew: true,
    category: "beverages"
  },
  {
    id: "6",
    name: "Educational Wooden Building Blocks",
    price: 35.99,
    originalPrice: 45.00,
    rating: 4.8,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&crop=center",
    vendor: "Educational Toys Co",
    isFeatured: true,
    category: "toys"
  },
  {
    id: "7",
    name: "Natural Vitamin C Supplements",
    price: 22.99,
    originalPrice: 28.99,
    rating: 4.8,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center",
    vendor: "Health Plus",
    isNew: true,
    category: "para-pharmacy"
  },
  {
    id: "8",
    name: "Modern Wall Art Canvas",
    price: 45.99,
    originalPrice: 65.00,
    rating: 4.8,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center",
    vendor: "Art Gallery",
    isFeatured: true,
    category: "home-deco"
  },
];

export const getProductsByCategory = (categoryId: string): Product[] => {
  return featuredProducts.filter(product => product.category === categoryId);
};

export const getFeaturedProducts = (): Product[] => {
  return featuredProducts.filter(product => product.isFeatured);
};

export const getNewProducts = (): Product[] => {
  return featuredProducts.filter(product => product.isNew);
};
