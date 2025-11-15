/**
 * Stores.tsx - Stores Listing Page Component
 * 
 * This page displays a comprehensive list of all stores/vendors in the marketplace.
 * It includes search functionality and detailed store information cards.
 * 
 * Features:
 * - Page header with navigation back to home
 * - Search functionality
 * - Grid layout of store cards
 * - Store information including ratings, location, categories
 * - Action buttons for visiting store and messaging
 * 
 * @author WENZE TII NDAKU Team
 * @version 1.0.0
 */

// Import React hooks and utilities
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next"; // For internationalization support
import { useNavigate } from "react-router-dom"; // For programmatic navigation

// Import Lucide React icons for UI elements
import { 
  Store,           // Store icon for store avatars
  Star,            // Star icon for ratings
  MapPin,          // Map pin icon for location
  Search           // Search icon for search input
} from "lucide-react";

// Import UI components
import { Button } from "@/components/ui/button"; // Reusable button component
import { Input } from "@/components/ui/input";   // Input field component
import { Header } from "@/components/Header";    // Site header with navigation
import { Footer } from "@/components/Footer";    // Site footer

// Import data sources
import { apiClient } from "@/utils/api"; // API client for dynamic data
import { useState as useStateHook, useEffect } from "react"; // React hooks
import { PageLoader } from "@/components/PageLoader";
import { useLoaderTransition } from "@/hooks/useLoaderTransition";
import { cn } from "@/lib/utils";

/**
 * Stores Component - Stores Listing Page
 * 
 * Renders a comprehensive stores listing page with:
 * - Page header with back navigation
 * - Search controls
 * - Grid of store cards with detailed information
 * - Action buttons for visiting store and messaging
 * 
 * @returns {JSX.Element} Complete stores listing page layout
 */
export default function Stores() {
  // Initialize translation hook for internationalization
  const { t } = useTranslation();
  
  // Initialize navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dynamic stores state
  const [dynamicStores, setDynamicStores] = useStateHook<any[]>([]);
  const [isLoading, setIsLoading] = useStateHook(true);
  const { isMounted: showLoader, isFadingOut } = useLoaderTransition(isLoading, {
    minimumVisibleMs: 1600,
    fadeDurationMs: 400,
  });
  const contentVisibilityClass =
    showLoader && !isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100";

  // Load vendors from API
  useEffect(() => {
    const loadVendors = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getAllVendors() as any;
        
        if (response.success) {
          // Transform vendor data to store format
          const transformedStores = response.data.vendors.map((vendor: any) => ({
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
            specialties: vendor.categories || []
          }));
          
          setDynamicStores(transformedStores);
        }
      } catch (error) {
        console.error('Error loading vendors:', error);
        setDynamicStores([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVendors();
  }, []);

  // Filter stores based on search query
  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) {
      return dynamicStores;
    }
    
    const query = searchQuery.toLowerCase();
    return dynamicStores.filter(store => 
      store.name.toLowerCase().includes(query) ||
      store.description.toLowerCase().includes(query) ||
      store.location.toLowerCase().includes(query)
    );
  }, [searchQuery, dynamicStores]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="relative flex-1">
        {showLoader && (
          <PageLoader
            variant="store"
            title="Exploring stores"
            subtitle="Discovering places near you"
            fadingOut={isFadingOut}
          />
        )}

        <div
          className={cn(
            "min-h-full flex flex-col transition-opacity duration-500",
            contentVisibilityClass
          )}
        >
          {/* Page Header Section - Hero area with title and navigation */}
          <section className="bg-gradient-to-r from-navy-50 to-orange-50 dark:from-navy-950/10 dark:to-orange-950/10 py-8">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  Our Stores
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Discover amazing vendors and stores from across Africa and beyond
                </p>
              </div>
            </div>
          </section>

          {/* Search Section */}
          <section className="py-6 border-b border-muted">
            <div className="container mx-auto px-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
                <div className="relative w-full sm:w-80">
                  <Input
                    type="text"
                    placeholder="Search stores..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </section>

          {/* Stores Grid Section - Main content area */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredStores.map((store) => (
                  <div key={store.id} className="card card-hover p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-navy-100 to-orange-100 dark:from-navy-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Store className="h-10 w-10 text-navy-600 dark:text-navy-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-foreground truncate">
                            {store.name}
                          </h3>
                          {store.featured && (
                            <span className="status-featured text-xs px-2 py-1 rounded-full whitespace-nowrap">
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {store.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 star-filled" />
                            <span>{store.rating}</span>
                            <span>({store.reviewCount})</span>
                          </div>

                          <span className="hidden sm:inline">•</span>

                          <span>{store.productCount} products</span>

                          <span className="hidden sm:inline">•</span>

                          <span>{store.followers.toLocaleString()} followers</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 text-sm mb-4">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{store.location}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-foreground mb-2">Categories</h4>
                        <div className="flex flex-wrap gap-2">
                          {store.categories.map((category, index) => (
                            <span
                              key={index}
                              className="bg-navy-100 dark:bg-navy-900/20 text-navy-800 dark:text-navy-300 text-xs px-2 py-1 rounded-full whitespace-nowrap border border-navy-200 dark:border-navy-800"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Specialties</h4>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {store.specialties.join(", ")}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => navigate(`/store/${store.id}`)}
                        className="flex-1 bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 text-white shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        Visit Store
                      </Button>
                    </div>
                  </div>
                ))}

                {!isLoading && filteredStores.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No stores found{searchQuery ? ` for "${searchQuery}"` : ""}
                    </p>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {!isLoading && <Footer />}
    </div>
  );
}