export const predefinedCategories = [
  {
    id: 'Technology & Electronics',
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    icon: ''
  },
  {
    id: 'Clothing & Fashion',
    name: 'Fashion & Clothing',
    description: 'Clothing, shoes, and accessories',
    icon: ''
  },
  {
    id: 'Home & Garden',
    name: 'Home & Garden',
    description: 'Home decor, furniture, and garden supplies',
    icon: ''
  },
  {
    id: 'Cosmetics & Beauty',
    name: 'Beauty & Health',
    description: 'Cosmetics, skincare, and health products',
    icon: ''
  },
  {
    id: 'Health & Wellness',
    name: 'Health & Wellness',
    description: 'Health products and wellness items',
    icon: ''
  },
  {
    id: 'Sports & Outdoors',
    name: 'Sports & Outdoors',
    description: 'Sports equipment and outdoor gear',
    icon: ''
  },
  {
    id: 'Books & Media',
    name: 'Books & Media',
    description: 'Books, movies, music, and educational materials',
    icon: ''
  },
  {
    id: 'Toys & Games',
    name: 'Toys & Games',
    description: 'Children\'s toys and games',
    icon: ''
  },
  {
    id: 'Automotive',
    name: 'Automotive',
    description: 'Car parts, accessories, and automotive supplies',
    icon: ''
  },
  {
    id: 'Jewelry & Accessories',
    name: 'Jewelry & Accessories',
    description: 'Jewelry, watches, and fashion accessories',
    icon: ''
  },
  {
    id: 'Food & Beverages',
    name: 'Food & Beverages',
    description: 'Food items, drinks, and culinary products',
    icon: ''
  },
  {
    id: 'Art & Collectibles',
    name: 'Art & Crafts',
    description: 'Art supplies, crafts, and handmade items',
    icon: ''
  }
];

export const getCategoryById = (id: string) => {
  return predefinedCategories.find(category => category.id === id);
};

export const getCategoryName = (id: string) => {
  const category = getCategoryById(id);
  return category ? category.name : 'Unknown Category';
};