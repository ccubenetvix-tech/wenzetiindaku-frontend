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
import { SEO } from "@/components/SEO";

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
  const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({});
  const [isLoadingCategoryCounts, setIsLoadingCategoryCounts] = useState(true);

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
          // Get the first 3 vendors
          const rawVendors = response.data.vendors.slice(0, 3);

          // Enhanced vendor data with real stats
          const enhancedVendors = await Promise.all(rawVendors.map(async (vendor: any) => {
            let productCount = 0;
            let averageRating = 0;
            let totalReviews = 0;

            try {
              // Fetch products to get count and calculate rating
              // We fetch up to 50 products to calculate a reasonable average rating
              const productsResponse = await apiClient.getAllProducts({
                vendor_id: vendor.id, // Note: check precise param name (vendor_id or vendor)
                limit: 50
              }) as any;

              if (productsResponse.success && productsResponse.data) {
                // Get total count from pagination if available
                productCount = productsResponse.data.pagination?.totalItems || productsResponse.data.pagination?.total || 0;

                // Calculate rating from products
                const products = productsResponse.data.products || [];
                // If pagination total is 0 but we have products array (edge case), use array length
                if (productCount === 0 && products.length > 0) productCount = products.length;

                // Calculate weighted average rating or simple average
                // Filtering out products with no ratings to be fair, or treat as 0? 
                // Usually we only count rated products.
                // IMPORTANT: Filter out products with 0 reviews to avoid backend defaults (often 4.5)
                const ratedProducts = products.filter((p: any) => p.rating > 0 && (p.review_count > 0 || p.reviewCount > 0));
                if (ratedProducts.length > 0) {
                  const sumRatings = ratedProducts.reduce((sum: number, p: any) => sum + (p.rating || 0), 0);
                  averageRating = sumRatings / ratedProducts.length;
                  // Make it 1 decimal place
                  averageRating = Math.round(averageRating * 10) / 10;

                  // Sum up review counts
                  totalReviews = ratedProducts.reduce((sum: number, p: any) => sum + (p.review_count || p.reviewCount || 0), 0);
                }
              }
            } catch (err) {
              console.error(`Error loading stats for vendor ${vendor.id}`, err);
            }

            return {
              id: vendor.id,
              name: vendor.business_name || vendor.businessName || t('unknownStore'),
              description: vendor.description || t('noDescriptionAvailable'),
              rating: averageRating, // Real rating
              reviewCount: totalReviews, // Real review count
              productCount: productCount, // Real product count
              location: `${vendor.city || 'Unknown'}, ${vendor.country || 'Unknown'}`,
              image: vendor.profile_photo || vendor.profilePhoto || "/marketplace.jpeg",
              categories: vendor.categories || [],
              featured: vendor.featured || false,
              verified: vendor.verified || false,
              followers: 0, // No follower data yet, keep 0
              shipping: t('standardShipping'),
              returnPolicy: t('returnPolicy30Days'),
              specialties: vendor.categories || []
            };
          }));

          setFeaturedStores(enhancedVendors);
        }
      } catch (error) {
        console.error('Error loading featured stores:', error);
        setFeaturedStores([]);
      }
    };
    loadStores();
  }, [t]);

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

  // Load product counts for each category
  useEffect(() => {
    const loadCategoryCounts = async () => {
      setIsLoadingCategoryCounts(true);
      const counts: { [key: string]: number } = {};

      try {
        for (const category of predefinedCategories) {
          try {
            const response = await apiClient.getAllProducts({
              category: category.id,
              limit: 1
            }) as any;

            if (response.success && response.data) {
              counts[category.id] = response.data.pagination?.total || 0;
            } else {
              counts[category.id] = 0;
            }
          } catch (error) {
            console.error(`Error loading count for category ${category.id}:`, error);
            counts[category.id] = 0;
          }
        }
      } finally {
        setCategoryCounts(counts);
        setIsLoadingCategoryCounts(false);
      }
    };

    loadCategoryCounts();
  }, []);


  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-950">
      <Header />

      <SEO
        title="Wenze Tii Ndaku | African Multi-Vendor Marketplace"
        description="Discover Wenze Tii Ndaku, the premier African multi-vendor marketplace. Shop electronics, fashion, beauty, food, and more from trusted vendors."
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Wenze Tii Ndaku",
          "url": "https://www.wenzetiindaku.com",
          "logo": "https://www.wenzetiindaku.com/marketplace.jpeg",
          "sameAs": [
            "https://www.facebook.com/wenzetiindaku",
            "https://twitter.com/wenzetiindaku",
            "https://www.instagram.com/wenzetiindaku"
          ]
        }}
      />

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
                      href: `/category/${encodeURIComponent(category.id)}`,
                      description: category.description,
                      productCount: isLoadingCategoryCounts ? undefined : (categoryCounts[category.id] || 0)
                    }}
                    index={index}
                    isLoading={isLoadingCategoryCounts}
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
                {t('viewAllCategories')}
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
                <span className="ml-2 text-gray-600 dark:text-gray-300">{t('loadingProducts')}</span>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {featuredProducts.slice(0, 6).map((product) => (
                  <div key={product.id} className="group hidden md:block">
                    <MinimalProductCard
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.original_price,
                        rating: product.rating || 0,
                        reviewCount: product.review_count || 0,
                        image: product.images?.[0] || product.image || "/marketplace.jpeg",
                        vendor: product.vendor?.business_name || t('unknownVendor'),
                        isNew: product.is_new || false,
                        isFeatured: product.is_featured || false
                      }}
                      onWishlistToggle={() => { }}
                      onAddToCart={() => { }}
                    />
                  </div>
                ))}
                {featuredProducts.slice(0, 4).map((product) => (
                  <div key={`mobile-${product.id}`} className="group md:hidden">
                    <MinimalProductCard
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.original_price,
                        rating: product.rating || 0,
                        reviewCount: product.review_count || 0,
                        image: product.images?.[0] || product.image || "/marketplace.jpeg",
                        vendor: product.vendor?.business_name || t('unknownVendor'),
                        isNew: product.is_new || false,
                        isFeatured: product.is_featured || false
                      }}
                      onWishlistToggle={() => { }}
                      onAddToCart={() => { }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('noProductsAvailable')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('noVendorsMessage')}
                </p>
              </div>
            )}

            <div className="text-center mt-8 md:hidden">
              <Button
                variant="outline"
                onClick={() => navigate('/search')}
                className="w-full"
              >
                {t('viewAllProducts')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Top Stores - Professional Premium Section */}
            <div className="mt-20">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('topStores')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-base">
                    {t('discoverAmazingStores')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/stores')}
                  className="hidden md:flex items-center gap-2 border-2 hover:bg-gradient-to-r hover:from-navy-600 hover:to-orange-500 hover:text-white hover:border-transparent transition-all duration-300"
                >
                  {t('viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Desktop View - Professional Cards (reduced further for balance) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 hidden md:grid">
                {featuredStores.map((store, index) => (
                  <div
                    key={store.id}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/store/${store.id}`)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative bg-white dark:bg-navy-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-200 dark:border-navy-700 hover:border-orange-500/50 transform hover:-translate-y-1.5">
                      {/* Header with store banner image - fixed height, clean fill */}
                      <div className="relative h-32 overflow-visible bg-navy-800">
                        {/* Store banner image (fills header, may crop slightly for perfect edge-to-edge look) */}
                        {store.image && (
                          <img
                            src={store.image}
                            alt={store.name}
                            className="absolute inset-0 w-full h-full object-contain object-center"
                            loading="lazy"
                          />
                        )}
                        {/* Subtle dark overlay for text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                        {/* Store Avatar with Badge - keep initial letter in circle */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                          <div className="relative">
                            <div className="w-16 h-16 bg-white dark:bg-navy-900 rounded-full p-1.5 shadow-xl ring-2 ring-white/30">
                              <div className="w-full h-full bg-gradient-to-r from-navy-600 to-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-white">
                                  {store.name[0]}
                                </span>
                              </div>
                            </div>

                            {/* Verified Badge */}
                            {store.verified && (
                              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-navy-900 shadow-lg">
                                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Store Content */}
                      <div className="pt-12 pb-4 px-4">
                        {/* Store Name and Location */}
                        <div className="text-center mb-4">
                          <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-1 group-hover:text-orange-500 transition-colors duration-300">
                            {store.name}
                          </h4>
                          <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{store.location}</span>
                          </div>
                        </div>

                        {/* Rating and Stats */}
                        <div className="flex items-center justify-center gap-4 mb-2.5">
                          {/* Rating */}
                          <div className="flex items-center gap-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${i < Math.floor(store.rating)
                                    ? 'text-orange-400 fill-orange-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                />
                              ))}
                            </div>
                            <span className="ml-1 text-[11px] font-semibold text-gray-900 dark:text-white">
                              {store.rating}
                            </span>
                          </div>

                          {/* Products Count */}
                          <div className="flex items-center gap-1 text-[11px]">
                            <ShoppingBag className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                              {store.productCount || 0} {t('products')}
                            </span>
                          </div>

                          {/* Followers Count - Only show if > 0 */}
                          {store.followers > 0 && (
                            <div className="flex items-center gap-1 text-[11px]">
                              <Users className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-400 font-medium">
                                {store.followers}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Categories Tags */}
                        {store.categories && store.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 justify-center">
                            {store.categories.slice(0, 2).map((category, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 bg-gradient-to-r from-navy-50 to-orange-50 dark:from-navy-800 dark:to-orange-900 text-[11px] font-medium text-gray-700 dark:text-gray-300 rounded-full"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Hover Effect Indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-navy-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile View - Compact Cards (slightly reduced) */}
              <div className="grid grid-cols-2 gap-3 mb-6 md:hidden">
                {featuredStores.slice(0, 4).map((store, index) => (
                  <div
                    key={`mobile-store-${store.id}`}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/store/${store.id}`)}
                  >
                    <div className="relative bg-white dark:bg-navy-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-navy-700 hover:border-orange-500/50">
                      {/* Compact header with store banner image - fixed height, edge-to-edge */}
                      <div className="relative h-20 overflow-visible bg-navy-800">
                        {store.image && (
                          <img
                            src={store.image}
                            alt={store.name}
                            className="absolute inset-0 w-full h-full object-contain object-center"
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                        {/* Store Avatar */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                          <div className="relative">
                            <div className="w-12 h-12 bg-white dark:bg-navy-900 rounded-full p-1 shadow-lg ring-2 ring-white/30">
                              <div className="w-full h-full bg-gradient-to-r from-navy-600 to-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                  {store.name[0]}
                                </span>
                              </div>
                            </div>
                            {store.verified && (
                              <div className="absolute -bottom-0 -right-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-navy-900 shadow-md">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Store Content */}
                      <div className="pt-8 pb-3 px-3 text-center">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">
                          {store.name}
                        </h4>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <Star className="h-3 w-3 text-orange-400 fill-orange-400" />
                          <span className="text-[11px] font-semibold text-gray-900 dark:text-white">{store.rating}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {store.productCount || 0} {t('products')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button - Mobile Only */}
              <div className="text-center md:hidden">
                <Button
                  variant="outline"
                  onClick={() => navigate('/stores')}
                  className="w-full max-w-sm border-2 hover:bg-gradient-to-r hover:from-navy-600 hover:to-orange-500 hover:text-white hover:border-transparent transition-all duration-300"
                >
                  {t('viewAllStores')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Statistics - Professional Design */}
        <section className="py-16 bg-gradient-to-br from-navy-950 via-navy-900 to-orange-950 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[size:60px_60px]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text text-sm font-semibold uppercase tracking-wider">
                  {t('platformExcellence')}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {t('trustedByMillions')}
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto text-lg">
                {t('joinGrowingCommunity')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {/* Happy Customers */}
              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/50 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent mb-2">50K+</div>
                <div className="text-white/70 text-sm font-medium">{t('happyCustomers')}</div>
              </div>

              {/* Active Sellers */}
              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-navy-400 to-navy-600 rounded-xl flex items-center justify-center shadow-lg shadow-navy-500/50 group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBag className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent mb-2">10K+</div>
                <div className="text-white/70 text-sm font-medium">{t('activeSellers')}</div>
              </div>

              {/* Products Sold */}
              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent mb-2">1M+</div>
                <div className="text-white/70 text-sm font-medium">{t('productsSold')}</div>
              </div>

              {/* Average Rating */}
              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/50 group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-7 w-7 text-white fill-white" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent mb-2">4.8<span className="text-2xl">★</span></div>
                <div className="text-white/70 text-sm font-medium">{t('averageRating')}</div>
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