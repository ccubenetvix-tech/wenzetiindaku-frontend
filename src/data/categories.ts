export const predefinedCategories = [
  {
    id: 'technology_electronics',
    name: 'electronics',
    description: 'descElectronics',
    icon: ''
  },
  {
    id: 'clothing_fashion',
    name: 'fashionClothing',
    description: 'descFashionClothing',
    icon: ''
  },
  {
    id: 'home_garden',
    name: 'homeGarden',
    description: 'descHomeGarden',
    icon: ''
  },
  {
    id: 'cosmetics_beauty',
    name: 'beautyHealth',
    description: 'descBeautyHealth',
    icon: ''
  },
  {
    id: 'health_wellness',
    name: 'healthWellness',
    description: 'descHealthWellness',
    icon: ''
  },
  {
    id: 'sports_outdoors',
    name: 'sportsOutdoors',
    description: 'descSportsOutdoors',
    icon: ''
  },
  {
    id: 'books_media',
    name: 'booksMedia',
    description: 'descBooksMedia',
    icon: ''
  },
  {
    id: 'toys_games',
    name: 'toysGames',
    description: 'descToysGames',
    icon: ''
  },
  {
    id: 'automotive',
    name: 'automotive',
    description: 'descAutomotive',
    icon: ''
  },
  {
    id: 'jewelry_accessories',
    name: 'jewelryAccessories',
    description: 'descJewelryAccessories',
    icon: ''
  },
  {
    id: 'food_beverages',
    name: 'foodBeverages',
    description: 'descFoodBeverages',
    icon: ''
  },
  {
    id: 'art_collectibles',
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