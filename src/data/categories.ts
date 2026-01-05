export const predefinedCategories = [
  {
    id: 'Technology & Electronics',
    name: 'Technology & Electronics',
    description: 'descElectronics',
    icon: ''
  },
  {
    id: 'Clothing & Fashion',
    name: 'Clothing & Fashion',
    description: 'descFashionClothing',
    icon: ''
  },
  {
    id: 'Home & Garden',
    name: 'Home & Garden',
    description: 'descHomeGarden',
    icon: ''
  },
  {
    id: 'Cosmetics & Beauty',
    name: 'beautyHealth',
    description: 'descBeautyHealth',
    icon: ''
  },
  {
    id: 'Health & Wellness',
    name: 'healthWellness',
    description: 'descHealthWellness',
    icon: ''
  },
  {
    id: 'Sports & Outdoors',
    name: 'sportsOutdoors',
    description: 'descSportsOutdoors',
    icon: ''
  },
  {
    id: 'Books & Media',
    name: 'booksMedia',
    description: 'descBooksMedia',
    icon: ''
  },
  {
    id: 'Toys & Games',
    name: 'toysGames',
    description: 'descToysGames',
    icon: ''
  },
  {
    id: 'Automotive',
    name: 'automotive',
    description: 'descAutomotive',
    icon: ''
  },
  {
    id: 'Jewelry & Accessories',
    name: 'jewelryAccessories',
    description: 'descJewelryAccessories',
    icon: ''
  },
  {
    id: 'Food & Beverages',
    name: 'foodBeverages',
    description: 'descFoodBeverages',
    icon: ''
  },
  {
    id: 'Art & Collectibles',
    name: 'artCrafts',
    description: 'descArtCrafts',
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