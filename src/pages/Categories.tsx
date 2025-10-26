import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryCard } from "@/components/CategoryCard";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/utils/api";
import { predefinedCategories } from "@/data/categories";

const Categories = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categoryProducts, setCategoryProducts] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load products for each category
  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setIsLoading(true);
        const productsByCategory: Record<string, any[]> = {};
        
        // Load products for each category
        for (const category of predefinedCategories) {
          try {
            const response = await apiClient.getAllProducts({
              category: category.id,
              limit: 2 // Show 2 products per category
            });
            
            if (response.success) {
              productsByCategory[category.id] = response.data.products || [];
            } else {
              productsByCategory[category.id] = [];
            }
          } catch (error) {
            console.error(`Error loading products for category ${category.id}:`, error);
            productsByCategory[category.id] = [];
          }
        }
        
        setCategoryProducts(productsByCategory);
      } catch (error) {
        console.error('Error loading category products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryProducts();
  }, []);

  // All categories with their dynamic data
  const allCategories = predefinedCategories.map(category => ({
    name: category.name,
    href: `/category/${encodeURIComponent(category.id)}`,
    description: category.description,
    productCount: categoryProducts[category.id]?.length || 0,
    products: (categoryProducts[category.id] || []).map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      image: product.images?.[0] || product.image || "/marketplace.jpeg",
      vendor: product.vendor?.business_name || "Unknown Vendor",
      isNew: product.is_new || false,
      isFeatured: product.is_featured || false,
    }))
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-950">
      <Header />
      
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back')}
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('allCategories')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('exploreAllCategories')}
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading categories...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCategories.map((category, index) => (
                <CategoryCard
                  key={category.name}
                  category={category}
                  index={index}
                />
              ))}
            </div>
          )}
          
          {!isLoading && allCategories.every(cat => cat.productCount === 0) && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Products Available</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No vendors have added products to any categories yet.
              </p>
              <Button onClick={() => navigate('/vendor/signup')}>
                Become a Vendor
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;