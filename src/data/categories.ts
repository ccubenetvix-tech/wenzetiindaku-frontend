export const predefinedCategories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    icon: '📱'
  },
  {
    id: 'fashion',
    name: 'Fashion & Clothing',
    description: 'Clothing, shoes, and accessories',
    icon: '👕'
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    description: 'Home decor, furniture, and garden supplies',
    icon: '🏠'
  },
  {
    id: 'beauty-health',
    name: 'Beauty & Health',
    description: 'Cosmetics, skincare, and health products',
    icon: '💄'
  },
  {
    id: 'sports-outdoors',
    name: 'Sports & Outdoors',
    description: 'Sports equipment and outdoor gear',
    icon: '⚽'
  },
  {
    id: 'books-media',
    name: 'Books & Media',
    description: 'Books, movies, music, and educational materials',
    icon: '📚'
  },
  {
    id: 'toys-games',
    name: 'Toys & Games',
    description: 'Children\'s toys and games',
    icon: '🎮'
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Car parts, accessories, and automotive supplies',
    icon: '🚗'
  },
  {
    id: 'jewelry-accessories',
    name: 'Jewelry & Accessories',
    description: 'Jewelry, watches, and fashion accessories',
    icon: '💍'
  },
  {
    id: 'food-beverages',
    name: 'Food & Beverages',
    description: 'Food items, drinks, and culinary products',
    icon: '🍎'
  },
  {
    id: 'art-crafts',
    name: 'Art & Crafts',
    description: 'Art supplies, crafts, and handmade items',
    icon: '🎨'
  },
  {
    id: 'pets',
    name: 'Pet Supplies',
    description: 'Pet food, toys, and accessories',
    icon: '🐕'
  }
];

export const getCategoryById = (id: string) => {
  return predefinedCategories.find(category => category.id === id);
};

export const getCategoryName = (id: string) => {
  const category = getCategoryById(id);
  return category ? category.name : 'Unknown Category';
};