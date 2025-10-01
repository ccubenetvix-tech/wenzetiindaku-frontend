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
import { ArrowRight, Star, TrendingUp, Users, ShoppingBag, Shield, Truck } from "lucide-react";

// Import UI components
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { MinimalProductCard } from "@/components/MinimalProductCard";
import { Footer } from "@/components/Footer";

// Import data sources
import { categories } from "@/data/categories";
import { getFeaturedStores } from "@/data/stores";
// Import API client and location context
import { apiClient } from "@/utils/api";
import { useLocation } from "@/contexts/LocationContext";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedLocation } = useLocation();
  const [featuredStores, setFeaturedStores] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Load featured stores
  useEffect(() => {
    const loadStores = async () => {
      try {
        const stores = await getFeaturedStores();
        setFeaturedStores(stores);
      } catch (error) {
        console.error('Error loading featured stores:', error);
      }
    };
    loadStores();
  }, []);

  // Load featured products based on selected location
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const locationString = selectedLocation ? `${selectedLocation.city}, ${selectedLocation.state}` : undefined;
        const response = await apiClient.getFeaturedProducts(locationString, 12);
        
        if (response.success) {
          setFeaturedProducts(response.data.products);
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
  }, [selectedLocation]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-950">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Amazon/Flipkart Style */}
        <section className="relative bg-white dark:bg-navy-900">
          <div className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-navy-600 to-orange-500 bg-clip-text text-transparent">
                    WENZE TII NDAKU
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                  Africa's premier marketplace connecting buyers and sellers across the continent
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                    size="lg" 
                    className="text-lg px-8 py-4 bg-gradient-to-r from-navy-600 to-orange-500 hover:from-navy-700 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate('/categories')}
                >
                    Start Shopping
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                    className="text-lg px-8 py-4 border-2 border-navy-500 text-navy-600 hover:bg-navy-500 hover:text-white transition-all duration-300 rounded-xl"
                    onClick={() => navigate('/vendor/register')}
                >
                    Become a Seller
                </Button>
                </div>
              </div>
              
              {/* Right Content - Hero Image */}
              <div className="relative hidden lg:block">
                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/hero-marketplace.jpg" 
                    alt="WENZE TII NDAKU Marketplace" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent"></div>
                </div>
                {/* Floating stats cards */}
                <div className="absolute -top-4 -left-4 bg-white dark:bg-navy-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-navy-700">
                  <div className="text-xl font-bold text-navy-600 dark:text-navy-300">10K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Sellers</div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-navy-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-navy-700">
                  <div className="text-xl font-bold text-orange-600 dark:text-orange-400">50K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="bg-white dark:bg-navy-900 border-y border-gray-200 dark:border-navy-800">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-navy-100 dark:bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-6 w-6 text-navy-600 dark:text-navy-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Free Shipping</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">On orders over $50</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Secure Payment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">100% secure checkout</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">24/7 Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Always here to help</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Best Prices</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Competitive rates</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16 bg-gray-50 dark:bg-navy-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Shop by Category
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover amazing products across our diverse categories
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category, index) => (
                <div key={index} className={`group animate-slide-up ${index < 8 ? `stagger-${index + 1}` : 'stagger-8'}`}>
                  <CategoryCard
                    name={category.name}
                    href={category.href}
                    description={category.description}
                  />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button 
                onClick={() => navigate('/categories')}
                className="px-8 py-3 bg-navy-600 hover:bg-navy-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white dark:bg-navy-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Featured Products
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {selectedLocation 
                    ? `Handpicked products from ${selectedLocation.name}` 
                    : 'Handpicked products just for you'
                  }
                </p>
              </div>
              <Button 
                onClick={() => navigate('/search')}
                className="hidden md:flex px-6 py-3 bg-navy-600 hover:bg-navy-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {isLoadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 w-full mb-3"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4 mb-2"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {featuredProducts.map((product, index) => (
                  <div key={product.id} className={`group animate-scale-in ${index < 12 ? `stagger-${(index % 8) + 1}` : 'stagger-8'}`}>
                    <MinimalProductCard
                      product={product}
                      onWishlistToggle={() => {}}
                      onAddToCart={() => {}}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No featured products found</h3>
                  <p className="text-sm">
                    {selectedLocation 
                      ? `No featured products available in ${selectedLocation.name} at the moment.`
                      : 'No featured products available at the moment.'
                    }
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/search')}
                  className="px-6 py-3 bg-navy-600 hover:bg-navy-700 text-white rounded-xl"
                >
                  Browse All Products
                </Button>
              </div>
            )}
            
            <div className="text-center mt-12 md:hidden">
              <Button 
                onClick={() => navigate('/search')}
                className="px-8 py-3 bg-navy-600 hover:bg-navy-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Platform Statistics */}
        <section className="py-16 bg-gradient-to-r from-navy-600 to-orange-500">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Trusted by Millions
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Join our growing community of satisfied customers and successful sellers
              </p>
          </div>
          
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/80">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">10K+</div>
                <div className="text-white/80">Active Sellers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">1M+</div>
                <div className="text-white/80">Products Sold</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">4.8★</div>
                <div className="text-white/80">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Promoted Stores */}
        <section className="py-16 bg-gray-50 dark:bg-navy-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Top Stores
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover amazing stores and their featured products
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStores.slice(0, 6).map((store, index) => (
                <div key={store.id} className="bg-white dark:bg-navy-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-navy-500 to-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-lg font-bold text-white">{store.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{store.name}</h3>
                        <div className="flex items-center">
                        <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
                        <span className="text-sm ml-1 font-medium text-gray-600 dark:text-gray-300">{store.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{store.productCount} products</p>
                  <Button 
                    onClick={() => navigate(`/store/${store.id}`)}
                    className="w-full bg-navy-600 hover:bg-navy-700 text-white rounded-xl transition-all duration-300"
                  >
                    Visit Store
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;