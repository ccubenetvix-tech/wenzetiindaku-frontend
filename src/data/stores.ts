export interface Store {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  location: string;
  image: string;
  categories: string[];
  featured: boolean;
  verified: boolean;
  followers: number;
  shipping: string;
  returnPolicy: string;
  specialties: string[];
}

export const stores: Store[] = [
  {
    id: "store1",
    name: "AfriBeauty Store",
    description: "Premium African beauty products and natural skincare solutions",
    rating: 4.9,
    reviewCount: 156,
    productCount: 234,
    location: "Lagos, Nigeria",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center",
    categories: ["Cosmetics", "Skincare", "Hair Care"],
    featured: true,
    verified: true,
    followers: 12450,
    shipping: "Free shipping over $50",
    returnPolicy: "30-day returns",
    specialties: ["Natural ingredients", "African beauty traditions", "Organic products"]
  },
  {
    id: "store2",
    name: "TechHub Africa",
    description: "Leading technology gadgets and electronics from Africa and beyond",
    rating: 4.8,
    reviewCount: 289,
    productCount: 567,
    location: "Nairobi, Kenya",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center",
    categories: ["Technology", "Electronics", "Gadgets"],
    featured: true,
    verified: true,
    followers: 18920,
    shipping: "Express shipping available",
    returnPolicy: "14-day returns",
    specialties: ["Latest tech", "African innovation", "Quality electronics"]
  },
  {
    id: "store3",
    name: "Heritage Fashion",
    description: "Traditional and modern African fashion for all occasions",
    rating: 4.9,
    reviewCount: 124,
    productCount: 189,
    location: "Accra, Ghana",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&crop=center",
    categories: ["Clothing", "Fashion", "Accessories"],
    featured: true,
    verified: true,
    followers: 8760,
    shipping: "Free shipping over $75",
    returnPolicy: "45-day returns",
    specialties: ["African prints", "Traditional designs", "Modern fashion"]
  },
  {
    id: "store4",
    name: "Mountain Coffee Co",
    description: "Premium Ethiopian and African coffee beans and accessories",
    rating: 4.7,
    reviewCount: 203,
    productCount: 89,
    location: "Addis Ababa, Ethiopia",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center",
    categories: ["Beverages", "Coffee", "Food"],
    featured: false,
    verified: true,
    followers: 15430,
    shipping: "Free shipping over $30",
    returnPolicy: "15-day returns",
    specialties: ["Ethiopian coffee", "Single origin", "Fresh roasted"]
  },
  {
    id: "store5",
    name: "Natural Foods Co",
    description: "Organic and natural food products from local African farms",
    rating: 4.6,
    reviewCount: 178,
    productCount: 145,
    location: "Cape Town, South Africa",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop&crop=center",
    categories: ["Food", "Organic", "Health"],
    featured: false,
    verified: true,
    followers: 9870,
    shipping: "Free shipping over $40",
    returnPolicy: "20-day returns",
    specialties: ["Organic produce", "Local sourcing", "Healthy options"]
  },
  {
    id: "store6",
    name: "Educational Toys Co",
    description: "Educational toys and learning materials for children",
    rating: 4.5,
    reviewCount: 234,
    productCount: 98,
    location: "Kigali, Rwanda",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&crop=center",
    categories: ["Toys", "Education", "Children"],
    featured: false,
    verified: true,
    followers: 6540,
    shipping: "Standard shipping",
    returnPolicy: "25-day returns",
    specialties: ["Learning toys", "STEM education", "Child development"]
  },
  {
    id: "store7",
    name: "Health Plus",
    description: "Natural health supplements and wellness products",
    rating: 4.8,
    reviewCount: 189,
    productCount: 76,
    location: "Dar es Salaam, Tanzania",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center",
    categories: ["Para Pharmacy", "Health", "Wellness"],
    featured: false,
    verified: true,
    followers: 11230,
    shipping: "Free shipping over $60",
    returnPolicy: "30-day returns",
    specialties: ["Natural supplements", "Wellness products", "Health solutions"]
  },
  {
    id: "store8",
    name: "Home Decor Plus",
    description: "Beautiful home decoration and interior design items",
    rating: 4.7,
    reviewCount: 156,
    productCount: 123,
    location: "Cairo, Egypt",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center",
    categories: ["Home Deco", "Interior Design", "Decoration"],
    featured: false,
    verified: true,
    followers: 7890,
    shipping: "Free shipping over $55",
    returnPolicy: "21-day returns",
    specialties: ["Modern decor", "African art", "Interior design"]
  }
];

export const getStoreById = (id: string): Store | undefined => {
  return stores.find(store => store.id === id);
};

export const getFeaturedStores = (): Store[] => {
  return stores.filter(store => store.featured);
};

export const getStoresByCategory = (category: string): Store[] => {
  return stores.filter(store => 
    store.categories.some(cat => 
      cat.toLowerCase().includes(category.toLowerCase())
    )
  );
};
