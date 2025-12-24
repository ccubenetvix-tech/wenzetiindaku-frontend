import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";
import { useTranslation } from "react-i18next";

// Import category images from assets folder
import clothingImg from "../assets/WhatsApp Image 2025-11-17 at 22.23.37_65d9fcba.jpg";
import homeImg from "../assets/WhatsApp Image 2025-11-17 at 22.24.42_fa9058dd.jpg";
import beautyImg from "../assets/WhatsApp Image 2025-11-17 at 22.26.33_54c39fad.jpg";
import sportsImg from "../assets/WhatsApp Image 2025-11-17 at 22.28.12_79a263bb.jpg";
import booksImg from "../assets/WhatsApp Image 2025-11-17 at 22.29.32_8f36c12e.jpg";
import toysImg from "../assets/WhatsApp Image 2025-11-17 at 22.31.05_806aa9c5.jpg";
import automotiveImg from "../assets/WhatsApp Image 2025-11-17 at 22.32.44_9c0d721c.jpg";
import artsImg from "../assets/WhatsApp Image 2025-11-17 at 22.33.57_e22827aa.jpg";
import jewelryImg from "../assets/WhatsApp Image 2025-11-17 at 22.35.57_c735d354.jpg";
import electronicsImg from "../assets/WhatsApp Image 2025-11-17 at 22.43.50_57c28f13.jpg";

interface CategoryCardProps {
  category: {
    name: string; // This is now a translation key
    href: string;
    description?: string; // This is now a translation key
    productCount?: number;
  };
  index?: number;
  isLoading?: boolean;
}

// Function to get the appropriate image for each category key
const getCategoryImage = (categoryKey: string): string => {
  const imageMap: Record<string, string> = {
    'electronics': electronicsImg,
    'fashionClothing': clothingImg,
    'homeGarden': homeImg,
    'beautyHealth': beautyImg,
    'healthWellness': beautyImg,
    'sportsOutdoors': sportsImg,
    'booksMedia': booksImg,
    'toysGames': toysImg,
    'automotive': automotiveImg,
    'jewelryAccessories': jewelryImg,
    'foodBeverages': '/groc.jpeg',
    'artCrafts': artsImg,
  };

  return imageMap[categoryKey] || clothingImg;
};

export const CategoryCard = memo(function CategoryCard({ category, index, isLoading = false }: CategoryCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
              alt={t(category.name)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const firstChar = t(category.name)[0] || '';
                target.parentElement!.innerHTML = `<div class="h-full w-full bg-navy-600 flex items-center justify-center"><span class="text-sm font-bold text-white">${firstChar}</span></div>`;
              }}
            />
          </div>
        </div>

        {/* Category name */}
        <h3 className="font-medium text-sm text-gray-900 dark:text-white leading-tight mb-1">
          {t(category.name)}
        </h3>

        {/* Category description */}
        {category.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {t(category.description)}
          </p>
        )}

        {/* Product count */}
        <div className="h-5 flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            category.productCount !== undefined && (
              <p className="text-xs text-primary font-medium">
                {category.productCount} {t('products')}
              </p>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
});