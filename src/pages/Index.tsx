/**
 * Index.tsx - Modern Amazon/Flipkart-style Home Page
 * 
 * A premium e-commerce homepage with clean design, proper spacing, and modern UI
 * following the design patterns of top e-commerce platforms like Amazon and Flipkart.
 * 
 * @author WENZE TII NDAKU Team
 * @version 2.0.0
 */

import { useState, useEffect, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, Users, ShoppingBag, Shield, Truck, Loader2 } from "lucide-react";

// Import UI components
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { MinimalProductCard } from "@/components/MinimalProductCard";
import { Footer } from "@/components/Footer";
import ImageSlider from "@/components/ImageSlider";

// Import data sources
import { predefinedCategories } from "@/data/categories";
import { apiClient } from "@/utils/api";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [featuredStores, setFeaturedStores] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Hero slider images
  const heroImages = [
    "/one.svg",
    "/two.svg", 
    "/three.svg",
    "/four.svg",
    "/five.svg"
  ];

  // Load featured stores
  useEffect(() => {
    const loadStores = async () => {
      try {
        const response = await apiClient.getAllVendors() as any;
        if (response.success) {
          // Transform vendor data to store format and take first 3 as featured
          const transformedStores = response.data.vendors.slice(0, 3).map((vendor: any) => ({
            id: vendor.id,
            name: vendor.business_name || vendor.businessName || 'Unknown Store',
            description: vendor.description || 'No description available',
            rating: 4.5, // Default rating
            reviewCount: 0, // Default review count
            productCount: 0, // Will be updated when products are loaded
            location: `${vendor.city || 'Unknown'}, ${vendor.country || 'Unknown'}`,
            image: "/marketplace.jpeg", // Default image
            categories: vendor.categories || [],
            featured: vendor.featured || false,
            verified: vendor.verified || false,
            followers: 0, // Default followers
            shipping: "Standard shipping",
            returnPolicy: "30-day returns",
            specialties: vendor.categories || []
          }));
          setFeaturedStores(transformedStores);
        }
      } catch (error) {
        console.error('Error loading featured stores:', error);
        setFeaturedStores([]);
      }
    };
    loadStores();
  }, []);

  // Load featured products from API
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await apiClient.getFeaturedProducts(undefined, 12) as any;
        if (response.success) {
          setFeaturedProducts(response.data.products || []);
        } else {
          console.error('Error loading featured products:', response.error);
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error('Error loading featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadFeaturedProducts();
  }, []);


  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-950">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Professional E-commerce Style */}
        <section className="relative bg-white dark:bg-navy-900 overflow-hidden">
          <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {t('yourPremierMarketplace')}{" "}
                  <span className="bg-gradient-to-r from-navy-600 to-orange-500 bg-clip-text text-transparent">
                    {t('marketplace')}
                  </span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto lg:mx-0">
                  {t('discoverMillions')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button 
                    size="lg" 
                    className="px-8 py-3 bg-gradient-to-r from-navy-600 to-orange-500 hover:from-navy-700 hover:to-orange-600 text-white font-medium rounded-md"
                  onClick={() => navigate('/categories')}
                >
                    {t('startShopping')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                    className="px-8 py-3 border-2 border-orange-500 text-orange-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-navy-600 hover:text-white transition-all rounded-md"
                    onClick={() => navigate('/vendor/register')}
                >
                    {t('sellOnPlatform')}
                </Button>
                </div>
              </div>
              
              {/* Right Content - Hero Image Slider */}
              <div className="relative">
                <div className="relative w-full h-[300px] lg:h-[400px] shadow-lg">
                  <ImageSlider 
                    images={heroImages}
                    interval={2000}
                    className="w-full h-full"
                    showArrows={false}
                    showDots={false}
                    showCounter={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators - Professional */}
        <section className="bg-gray-50 dark:bg-navy-950 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-navy-600 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{t('freeShipping')}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('onOrdersOver')}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-navy-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{t('securePayment')}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('secureCheckout')}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-navy-600 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{t('support247')}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('alwaysHereToHelp')}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-navy-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{t('bestPrices')}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('competitiveRates')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories - Professional */}
        <section className="py-12 bg-white dark:bg-navy-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('shopByCategory')}
              </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('exploreWideRange')}
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/categories')}
                className="hidden md:flex"
              >
                {t('viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {predefinedCategories.slice(0, 6).map((category, index) => (
                <div key={index} className="group">
                  <CategoryCard
                    category={{
                      name: category.name,
                      href: `/category/${category.id}`,
                      description: category.description,
                      productCount: 0
                    }}
                    index={index}
                  />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8 md:hidden">
              <Button 
                variant="outline"
                onClick={() => navigate('/categories')}
                className="w-full"
              >
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products - Professional */}
        <section className="py-12 bg-gray-50 dark:bg-navy-950">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('featuredProducts')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('handpickedProducts')}
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/search')}
                className="hidden md:flex"
              >
                {t('viewAllProducts')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {isLoadingProducts ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">Loading products...</span>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="group">
                    <MinimalProductCard
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.original_price,
                        rating: product.rating || 0,
                        reviewCount: product.review_count || 0,
                        image: product.images?.[0] || product.image || "/marketplace.jpeg",
                        vendor: product.vendor?.business_name || "Unknown Vendor",
                        isNew: product.is_new || false,
                        isFeatured: product.is_featured || false
                      }}
                      onWishlistToggle={() => {}}
                      onAddToCart={() => {}}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Products Available</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  No vendors have added products yet. Check back later for amazing products!
                </p>
              </div>
            )}
            
            <div className="text-center mt-8 md:hidden">
              <Button 
                variant="outline"
                onClick={() => navigate('/search')}
                className="w-full"
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Top Stores - Minimal Section */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {t('topStores')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('discoverAmazingStores')}
                  </p>
                </div>
                <Button 
                  variant="ghost"
                  onClick={() => navigate('/stores')}
                  className="text-sm"
                >
                  {t('viewAll')}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {featuredStores.slice(0, 10).map((store) => (
                  <div key={store.id} className="group cursor-pointer" onClick={() => navigate(`/store/${store.id}`)}>
                    <div className="bg-white dark:bg-navy-900 rounded-lg p-4 hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-navy-800 hover:border-gray-300 dark:hover:border-navy-600">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-navy-600 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-white">{store.name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-orange-400 fill-orange-400" />
                            <span className="text-xs ml-1 text-gray-600 dark:text-gray-300">{store.rating}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{store.productCount} products</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Platform Statistics - Navy & Orange Balance */}
        <section className="py-12 bg-gradient-to-r from-navy-600 to-orange-500">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {t('trustedByMillions')}
              </h2>
              <p className="text-white/80">
                {t('joinGrowingCommunity')}
              </p>
          </div>
          
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-white/80 text-sm">{t('happyCustomers')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-white/80 text-sm">{t('activeSellers')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">1M+</div>
                <div className="text-white/80 text-sm">{t('productsSold')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">4.8★</div>
                <div className="text-white/80 text-sm">{t('averageRating')}</div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Index;