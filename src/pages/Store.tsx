/**
 * Store.tsx - Individual Store Page Component
 * 
 * This page displays detailed information about a specific store/vendor,
 * including store information, statistics, and all products from that store.
 * 
 * Features:
 * - Store banner with overlay and basic info
 * - Store information sidebar with description and location
 * - Store statistics display
 * - Product search and sorting functionality
 * - Featured products section
 * - All products grid with pagination
 * - Message store functionality
 * 
 * @author WENZE TII NDAKU Team
 * @version 1.0.0
 */

// Import React hooks and utilities
import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom"; // For accessing URL parameters
import { useTranslation } from "react-i18next"; // For internationalization support

// Import Lucide React icons for UI elements
import { 
  Search,        // Search icon for search input
  Star,          // Star icon for ratings and featured products
  MapPin,        // Map pin icon for location
  MessageCircle, // Message icon for messaging functionality
  Store as StoreIcon // Store icon (renamed to avoid conflict)
} from "lucide-react";

// Import UI components
import { Header } from "@/components/Header";    // Site header with navigation
import { Footer } from "@/components/Footer";    // Site footer
import { Button } from "@/components/ui/button"; // Reusable button component
import { Input } from "@/components/ui/input";   // Input field component
import { Badge } from "@/components/ui/badge";   // Badge component
import { ProductCard } from "@/components/ProductCard"; // Product card component
import { apiClient } from "@/utils/api"; // API client for dynamic data

// Import Select components for sorting functionality
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Store Component - Individual Store Page
 * 
 * Renders a detailed store page with:
 * - Store banner and basic information
 * - Store information sidebar
 * - Store statistics
 * - Product search and sorting
 * - Featured and all products sections
 * 
 * @returns {JSX.Element} Complete individual store page layout
 */
const Store = () => {
  // Extract storeId from URL parameters
  const { storeId } = useParams();
  
  // Initialize translation hook for internationalization
  const { t } = useTranslation();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dynamic store and products state
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load store data
  useEffect(() => {
    const loadStoreData = async () => {
      if (!storeId) {
        setError("Store ID not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Load vendor data
        const vendorResponse = await apiClient.getVendorById(storeId);
        
        if (vendorResponse.success) {
          const vendor = vendorResponse.data.vendor;
          
          // Transform vendor data to store format
          const storeData = {
            id: vendor.id,
            name: vendor.business_name || vendor.businessName || 'Unknown Store',
            description: vendor.description || 'No description available',
            rating: 4.5, // Default rating
            reviewCount: 0, // Default review count
            totalProducts: 0, // Will be updated when products are loaded
            joinedDate: new Date(vendor.createdAt).getFullYear().toString(),
            location: `${vendor.city || 'Unknown'}, ${vendor.country || 'Unknown'}`,
            banner: "/marketplace.jpeg"
          };
          
          setStore(storeData);

          // Load products from this vendor
          const productsResponse = await apiClient.getAllProducts({
            vendor_id: storeId
          });
          
          if (productsResponse.success) {
            const vendorProducts = (productsResponse.data.products || []).map((product: any) => ({
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.original_price,
              rating: product.rating || 0,
              reviewCount: product.review_count || 0,
              image: product.images?.[0] || product.image || "/marketplace.jpeg",
              vendor: storeData.name,
              isNew: product.is_new || false,
              isFeatured: product.is_featured || false,
            }));
            
            setProducts(vendorProducts);
            setStore(prev => ({ ...prev, totalProducts: vendorProducts.length }));
          }
        } else {
          setError("Store not found");
        }
      } catch (error) {
        console.error('Error loading store data:', error);
        setError("Failed to load store data");
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreData();
  }, [storeId]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.vendor.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading store...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !store) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || "Store Not Found"}
            </h1>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    // Main page container with full height and flex layout
    <div className="min-h-screen flex flex-col bg-background">
      {/* Site header with navigation menu */}
      <Header />
      
      {/* Main content area that takes remaining space */}
      <main className="flex-1">

      {/* Main Content Container - minimal top spacing */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Store Info Sidebar - Left column */}
            <aside className="lg:w-1/4">
              {/* Store Information Card */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg mb-6 text-gray-900 dark:text-white">Store Information</h3>
                
                {/* Store description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                  {store.description}
                </p>
                
                {/* Store location */}
                <div className="mb-8">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white">{store.location}</span>
                  </div>
                </div>

                {/* Message store button */}
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white" 
                  onClick={() => {
                    // TODO: Implement message store functionality
                    console.log(`Message store: ${store.name}`);
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Store
                </Button>
              </div>

              {/* Store Stats Card */}
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Store Stats</h3>
                <div className="space-y-3">
                  {/* Total products stat */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Products</span>
                    <span className="font-medium">{store.totalProducts}</span>
                  </div>
                  
                  {/* Average rating stat */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Rating</span>
                    <span className="font-medium">{store.rating}/5</span>
                  </div>
                  
                  {/* Reviews count stat */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reviews</span>
                    <span className="font-medium">{store.reviewCount}</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Store Products - Right column (main content) */}
            <div className="lg:w-3/4">
              {/* Products and Controls Header - aligned side by side */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-3xl md:text-4xl font-bold">All Products</h2>
                  
                  {/* Right side - Search and Sort Controls */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="text"
                        placeholder={`${t('search')}...`}
                        className="pl-10 w-48"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="new">New Arrivals</SelectItem>
                        <SelectItem value="alpha">Alphabetical</SelectItem>
                        <SelectItem value="alpha-reverse">Reverse Alphabetical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Results count and Featured */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {filteredProducts.length} results
                  </span>
                  <Badge variant="secondary">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              </div>

              {/* Products and Controls - cards below */}
              <div className="flex gap-6 items-start">
                {/* Left side - Product sections */}
                <div className="flex-1">

              {/* Featured Products Section */}
              <div>
                {/* Section header with star icon */}
                <h2 className="text-2xl font-bold mb-3 flex items-center">
                  <Star className="h-6 w-6 text-secondary mr-2" />
                  Featured Products
                </h2>
                
                {/* Featured products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Filter and map through featured products only */}
                  {filteredProducts.filter(p => p.isFeatured).map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>

              {/* All Products Section */}
              <div>
                {/* All products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Map through all products */}
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
                
                {filteredProducts.length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-lg">
                      No products found for "{searchQuery}"
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}

                {/* Load More Button */}
                <div className="text-center mt-6">
                  <Button variant="outline" size="lg">
                    Load More Products
                  </Button>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Site footer */}
      <Footer />
    </div>
  );
};

// Export the Store component as default
export default Store;